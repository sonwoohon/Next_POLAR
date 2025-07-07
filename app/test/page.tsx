'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function TestPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [updateData, setUpdateData] = useState({
    name: '',
    email: '',
    phone_number: ''
  });

  // 모든 사용자 조회
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('사용자 조회 오류:', error);
    }
  };

  // 사용자 정보 수정
  const updateUser = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: updateData.name || undefined,
          email: updateData.email || undefined,
          phone_number: updateData.phone_number ? parseInt(updateData.phone_number) : undefined
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      alert('사용자 정보가 수정되었습니다!');
      fetchUsers(); // 목록 새로고침
      setUpdateData({ name: '', email: '', phone_number: '' });
    } catch (error) {
      console.error('사용자 수정 오류:', error);
      alert('수정에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Supabase 테스트 페이지</h1>
      
      {/* 사용자 목록 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">사용자 목록</h2>
        <button 
          onClick={fetchUsers}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          새로고침
        </button>
        
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>이름:</strong> {user.name}</p>
              <p><strong>이메일:</strong> {user.email}</p>
              <p><strong>전화번호:</strong> {user.phone_number}</p>
              <button 
                onClick={() => setSelectedUser(user)}
                className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                수정하기
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 사용자 수정 폼 */}
      {selectedUser && (
        <div className="border p-6 rounded bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">
            사용자 수정: {selectedUser.name}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">이름</label>
              <input
                type="text"
                value={updateData.name}
                onChange={(e) => setUpdateData({...updateData, name: e.target.value})}
                placeholder={selectedUser.name}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input
                type="email"
                value={updateData.email}
                onChange={(e) => setUpdateData({...updateData, email: e.target.value})}
                placeholder={selectedUser.email}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">전화번호</label>
              <input
                type="text"
                value={updateData.phone_number}
                onChange={(e) => setUpdateData({...updateData, phone_number: e.target.value})}
                placeholder={selectedUser.phone_number?.toString()}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => updateUser(selectedUser.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                수정 완료
              </button>
              <button 
                onClick={() => {
                  setSelectedUser(null);
                  setUpdateData({ name: '', email: '', phone_number: '' });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 