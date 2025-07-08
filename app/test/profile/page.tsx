'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: number;
  loginId: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // 수정할 사용자 정보 상태
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  // 사용자 정보 조회
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/test/login');
          return;
        }
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      const userData = await response.json();
      setUser(userData);
      setEditData({
        name: userData.name || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        password: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '사용자 정보 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 수정
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = { ...editData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '사용자 정보 수정에 실패했습니다.');
      }

      setSuccess('사용자 정보가 성공적으로 수정되었습니다.');
      setUser(data);
      setIsEditing(false);
      
      // 비밀번호 필드 초기화
      setEditData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '사용자 정보 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await fetch('/api/user/logout', { method: 'POST' });
      router.push('/test/login');
    } catch (err) {
      console.error('로그아웃 중 오류:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (isLoading && !user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        로딩 중...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>사용자 정보</h1>
        <button
          onClick={handleLogout}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#dc3545', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          로그아웃
        </button>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          color: '#2e7d32', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {success}
        </div>
      )}

      {!isEditing ? (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <strong>아이디:</strong> {user.loginId}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>이름:</strong> {user.name}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>이메일:</strong> {user.email}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>전화번호:</strong> {user.phoneNumber}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>가입일:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            정보 수정
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>이름:</strong>
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>이메일:</strong>
            </label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>전화번호:</strong>
            </label>
            <input
              type="tel"
              value={editData.phoneNumber}
              onChange={(e) => setEditData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>새 비밀번호 (변경하지 않으려면 비워두세요):</strong>
            </label>
            <input
              type="password"
              value={editData.password}
              onChange={(e) => setEditData(prev => ({ ...prev, password: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#28a745', 
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? '저장 중...' : '저장'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditData({
                  name: user.name || '',
                  email: user.email || '',
                  phoneNumber: user.phoneNumber || '',
                  password: ''
                });
              }}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#6c757d', 
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 