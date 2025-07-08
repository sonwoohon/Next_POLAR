'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [user, setUser] = useState<any>(null);
  const [updateData, setUpdateData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    age: '',
    address: '',
    password: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  // 로그인된 사용자 정보 조회
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '사용자 정보를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('사용자 조회 오류:', error);
      showErrors([error instanceof Error ? error.message : '사용자 정보를 불러오는데 실패했습니다.']);
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 파일 업로드
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('storage', 'users');
    formData.append('bucket', 'profile');

    const response = await fetch('/api/images', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '이미지 업로드에 실패했습니다.');
    }

    const data = await response.json();
    return data.url;
  };

  // 사용자 정보 수정
  const updateUser = async () => {
    try {
      clearErrors();
      setIsLoading(true);

      // 업데이트할 데이터 준비 (빈 값은 제외)
      const updates: any = {};
      if (updateData.name !== '') updates.name = updateData.name;
      if (updateData.email !== '') updates.email = updateData.email;
      if (updateData.phoneNumber !== '') updates.phoneNumber = updateData.phoneNumber;
      if (updateData.age !== '') updates.age = parseInt(updateData.age);
      if (updateData.address !== '') updates.address = updateData.address;
      if (updateData.password !== '') updates.password = updateData.password;

      // 이미지 파일이 선택된 경우 업로드
      if (selectedFile) {
        try {
          const imageUrl = await uploadImage(selectedFile);
          updates.profileImgUrl = imageUrl;
        } catch (error) {
          throw new Error('이미지 업로드에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
        }
      }

      // API 호출
      const response = await fetch('/api/users', {
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
      fetchUser(); // 정보 새로고침
      setUpdateData({ name: '', email: '', phoneNumber: '', age: '', address: '', password: '' });
      setSelectedFile(null);
      setIsEditing(false);
    } catch (error) {
      console.error('사용자 수정 오류:', error);
      showErrors([error instanceof Error ? error.message : '사용자 정보 수정에 실패했습니다.']);
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 이미지 삭제
  const deleteProfileImage = async () => {
    try {
      clearErrors();
      setIsLoading(true);

      const response = await fetch('/api/users', {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '프로필 이미지 삭제에 실패했습니다.');
      }

      showErrors(['프로필 이미지가 성공적으로 삭제되었습니다!']);
      fetchUser(); // 정보 새로고침
    } catch (error) {
      console.error('프로필 이미지 삭제 오류:', error);
      showErrors([error instanceof Error ? error.message : '프로필 이미지 삭제에 실패했습니다.']);
    } finally {
      setIsLoading(false);
    }
  };

  // 입력 필드 변경 시 에러 초기화
  const handleInputChange = (field: string, value: string) => {
    setUpdateData({...updateData, [field]: value});
    clearErrors(); // 입력 시 에러 메시지 제거
  };

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검사 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        showErrors(['파일 크기는 5MB를 초과할 수 없습니다.']);
        return;
      }

      // 파일 타입 검사
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showErrors(['지원하지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 지원)']);
        return;
      }

      setSelectedFile(file);
      clearErrors();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">내 프로필 관리</h1>
      
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
      
      {/* 사용자 정보 조회 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">내 정보</h2>
          <button 
            onClick={fetchUser}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? '로딩 중...' : '새로고침'}
          </button>
        </div>
        
        {user ? (
          <div className="border p-6 rounded bg-white shadow-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">이름</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">이메일</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">전화번호</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">나이</p>
                <p className="font-medium">{user.age}세</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">주소</p>
                <p className="font-medium">{user.address || '미입력'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">가입일</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">프로필 이미지</p>
              <img 
                src={user.profileImgUrl} 
                alt="프로필 이미지" 
                className="w-24 h-24 rounded-full object-cover"
              />
              {user.profileImgUrl && !user.profileImgUrl.includes('default-profile') && (
                <button 
                  onClick={deleteProfileImage}
                  disabled={isLoading}
                  className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:bg-gray-400"
                >
                  삭제
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              정보 수정하기
            </button>
          </div>
        ) : (
          <div className="border p-6 rounded bg-gray-50 text-center">
            <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
          </div>
        )}
      </div>

      {/* 사용자 수정 폼 */}
      {isEditing && user && (
        <div className="border p-6 rounded bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">정보 수정</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">이름</label>
              <input
                type="text"
                value={updateData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={user.name}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">빈 값으로 두면 기존 값이 유지됩니다.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input
                type="email"
                value={updateData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={user.email}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">전화번호</label>
              <input
                type="text"
                value={updateData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder={user.phoneNumber}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">나이</label>
              <input
                type="number"
                value={updateData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder={user.age?.toString()}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">프로필 이미지</label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                JPEG, PNG, GIF, WebP 형식만 지원 (최대 5MB)
              </p>
              {selectedFile && (
                <p className="text-sm text-green-600 mt-1">
                  선택된 파일: {selectedFile.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">주소</label>
              <input
                type="text"
                value={updateData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={user.address || '서울시 강남구...'}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">새 비밀번호</label>
              <input
                type="password"
                value={updateData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="새 비밀번호 (최소 6자)"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">빈 값으로 두면 기존 비밀번호가 유지됩니다.</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={updateUser}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isLoading ? '수정 중...' : '수정 완료'}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setUpdateData({ name: '', email: '', phoneNumber: '', age: '', address: '', password: '' });
                  setSelectedFile(null);
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