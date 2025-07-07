'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CommonAuthUseCase, ValidationError } from '@/app/(backend)/auths/applications/usecases/CommonAuthUseCase';
import { CommonAuthEntity } from '@/app/(backend)/auths/domains/entities/CommonAuthEntity';

export default function TestPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [updateData, setUpdateData] = useState({
    name: '',
    email: '',
    phone_number: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 에러 메시지 표시 함수
  const showErrors = (errorMessages: string[]) => {
    setErrors(errorMessages);
    // 5초 후 에러 메시지 자동 제거
    setTimeout(() => setErrors([]), 5000);
  };

  // 에러 메시지 초기화
  const clearErrors = () => {
    setErrors([]);
  };

  // 모든 사용자 조회
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auths');
      
      if (!response.ok) {
        throw new Error('사용자 목록을 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setUsers(data || []);
    } catch (error) {
      console.error('사용자 조회 오류:', error);
      showErrors(['사용자 목록을 불러오는데 실패했습니다.']);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 수정
  const updateUser = async (id: number) => {
    try {
      clearErrors();
      setIsLoading(true);

      // 업데이트할 데이터 준비 (빈 값도 포함)
      const updates: any = {};
      if (updateData.name !== '') updates.name = updateData.name;
      if (updateData.email !== '') updates.email = updateData.email;
      if (updateData.phone_number !== '') updates.phone_number = updateData.phone_number;

      // API 호출
      const response = await fetch(`/api/auths?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '사용자 정보 수정에 실패했습니다.');
      }
      
      showErrors(['사용자 정보가 성공적으로 수정되었습니다!']);
      fetchUsers(); // 목록 새로고침
      setUpdateData({ name: '', email: '', phone_number: '' });
      setSelectedUser(null);
    } catch (error) {
      console.error('사용자 수정 오류:', error);
      showErrors([error instanceof Error ? error.message : '사용자 정보 수정에 실패했습니다.']);
    } finally {
      setIsLoading(false);
    }
  };

  // 입력 필드 변경 시 에러 초기화
  const handleInputChange = (field: string, value: string) => {
    setUpdateData({...updateData, [field]: value});
    clearErrors(); // 입력 시 에러 메시지 제거
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">사용자 관리 테스트 페이지</h1>
      
      {/* 에러 메시지 표시 */}
      {errors.length > 0 && (
        <div className="mb-6">
          {errors.map((error, index) => (
            <div 
              key={index} 
              className={`p-4 mb-2 rounded border ${
                error.includes('성공') 
                  ? 'bg-green-100 border-green-400 text-green-700' 
                  : 'bg-red-100 border-red-400 text-red-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={() => clearErrors()}
                  className="text-sm font-bold hover:opacity-70"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 사용자 목록 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">사용자 목록</h2>
        <button 
          onClick={fetchUsers}
          disabled={isLoading}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '로딩 중...' : '새로고침'}
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
              <label className="block text-sm font-medium mb-1">이름 *</label>
              <input
                type="text"
                value={updateData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={selectedUser.name}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">빈 값으로 두면 기존 이름이 유지됩니다.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input
                type="email"
                value={updateData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={selectedUser.email}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">전화번호</label>
              <input
                type="text"
                value={updateData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                placeholder={selectedUser.phone_number?.toString()}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">예: 010-1234-5678 또는 01012345678</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => updateUser(selectedUser.id)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isLoading ? '수정 중...' : '수정 완료'}
              </button>
              <button 
                onClick={() => {
                  setSelectedUser(null);
                  setUpdateData({ name: '', email: '', phone_number: '' });
                  clearErrors();
                }}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
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