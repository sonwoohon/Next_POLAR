'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: number;
  loginId: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImgUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 이미지 파일 검증 (프론트엔드용)
function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // 파일 크기 검증 (5MB 제한)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: '이미지 파일 크기는 5MB를 초과할 수 없습니다.'
    };
  }

  // 파일 타입 검증
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: '지원하는 이미지 형식은 JPEG, PNG, GIF, WebP입니다.'
    };
  }

  return { isValid: true };
}

// 이미지 미리보기 URL 생성
function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('이미지 미리보기 생성에 실패했습니다.'));
      }
    };
    reader.onerror = () => reject(new Error('이미지 파일 읽기에 실패했습니다.'));
    reader.readAsDataURL(file);
  });
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

  // 프로필 이미지 관련 상태
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isImageUploading, setIsImageUploading] = useState(false);

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
      const finalData = updateData.password ? updateData : {
        name: updateData.name,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber
      };

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
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

  // 프로필 이미지 파일 선택
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 검증
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(`이미지 오류: ${validation.error}`);
      return;
    }

    setSelectedImageFile(file);
    setError('');

    // 미리보기 생성
    try {
      const preview = await createImagePreview(file);
      setImagePreviewUrl(preview);
    } catch (error) {
      setError('미리보기 생성에 실패했습니다.');
    }
  };

  // 프로필 이미지 업로드
  const handleImageUpload = async () => {
    if (!selectedImageFile || !user) {
      setError('업로드할 이미지를 선택해주세요.');
      return;
    }

    setIsImageUploading(true);
    setError('');

    try {
      // 이미지 업로드 API 호출
      const formData = new FormData();
      formData.append('file', selectedImageFile);

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 사용자 정보 업데이트 (프로필 이미지 URL 포함)
        const updateResponse = await fetch('/api/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileImgUrl: data.url
          }),
        });

        if (updateResponse.ok) {
          const updatedUser = await updateResponse.json();
          setUser(updatedUser);
          setSuccess('프로필 이미지가 성공적으로 업로드되었습니다.');
          setSelectedImageFile(null);
          setImagePreviewUrl('');
        } else {
          throw new Error('프로필 이미지 URL 업데이트에 실패했습니다.');
        }
      } else {
        throw new Error(data.error || '이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsImageUploading(false);
    }
  };

  // 프로필 이미지 삭제
  const handleImageDelete = async () => {
    if (!user) return;

    setIsImageUploading(true);
    setError('');

    try {
      const response = await fetch('/api/images', {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setSuccess('프로필 이미지가 삭제되었습니다.');
        } else {
          throw new Error(data.error || '이미지 삭제에 실패했습니다.');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 삭제에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsImageUploading(false);
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
      maxWidth: '800px', 
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* 왼쪽: 프로필 이미지 섹션 */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>프로필 이미지</h2>
          
          {/* 현재 프로필 이미지 */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            {user.profileImgUrl && user.profileImgUrl.trim() !== '' ? (
              <div>
                <img
                  src={user.profileImgUrl}
                  alt="프로필 이미지"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #ddd',
                    marginBottom: '10px'
                  }}
                />
                {isEditing && (
                  <div>
                    <button
                      onClick={handleImageDelete}
                      disabled={isImageUploading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isImageUploading ? 'not-allowed' : 'pointer',
                        opacity: isImageUploading ? 0.6 : 1
                      }}
                    >
                      {isImageUploading ? '삭제 중...' : '이미지 삭제'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                backgroundColor: '#f8f9fa',
                border: '3px dashed #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                color: '#6c757d'
              }}>
                이미지 없음
              </div>
            )}
          </div>

          {/* 이미지 업로드 섹션 - 수정 모드일 때만 표시 */}
          {isEditing && (
            <div>
              <h3 style={{ marginBottom: '15px' }}>이미지 업로드</h3>
              
              {/* 파일 선택 */}
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* 미리보기 */}
              {imagePreviewUrl && (
                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                  <img
                    src={imagePreviewUrl}
                    alt="미리보기"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #007bff'
                    }}
                  />
                </div>
              )}

              {/* 업로드 버튼 */}
              {selectedImageFile && (
                <button
                  onClick={handleImageUpload}
                  disabled={isImageUploading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isImageUploading ? 'not-allowed' : 'pointer',
                    opacity: isImageUploading ? 0.6 : 1
                  }}
                >
                  {isImageUploading ? '업로드 중...' : '이미지 업로드'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 오른쪽: 사용자 정보 섹션 */}
        <div>
          {!isEditing ? (
            <div>
              <h2 style={{ marginBottom: '20px' }}>사용자 정보</h2>
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
              <h2 style={{ marginBottom: '20px' }}>사용자 정보 수정</h2>
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
      </div>
    </div>
  );
} 