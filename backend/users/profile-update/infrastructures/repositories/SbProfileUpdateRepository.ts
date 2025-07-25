import { supabase } from '@/backend/common/utils/supabaseClient';
import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
import { IProfileUpdateRepository } from '@/backend/users/profile-update/domains/repositories/IProfileUpdateRepository';
import { fromDbObject } from '@/backend/common/mappers/UserMapper';

export class SbProfileUpdateRepository implements IProfileUpdateRepository {
  async updateProfile(
    userId: string,
    profileData: Partial<{
      name: string;
      address: string;
      profileImgUrl: string;
    }>
  ): Promise<CommonUserEntity | null> {
    try {
      // 업데이트할 데이터 준비 (snake_case로 변환)
      const updateData: {
        name?: string;
        address?: string;
        profile_img_url?: string;
      } = {};

      if (profileData.name !== undefined) updateData.name = profileData.name;
      if (profileData.address !== undefined)
        updateData.address = profileData.address;
      if (profileData.profileImgUrl !== undefined)
        updateData.profile_img_url = profileData.profileImgUrl;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('[Repository] Supabase 프로필 업데이트 오류:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // 업데이트된 데이터를 Entity로 변환하여 반환
      const updatedEntity = fromDbObject(data);

      return updatedEntity;
    } catch (error) {
      console.error('[Repository] 프로필 업데이트 중 예외 발생:', error);
      return null;
    }
  }

  async updateProfileImage(
    userId: string,
    imageFile: File
  ): Promise<{ profileImgUrl: string } | null> {
    try {
      // 파일 업로드
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('[Repository] 이미지 업로드 오류:', uploadError);
        return null;
      }

      // 업로드된 이미지의 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const profileImgUrl = urlData.publicUrl;

      // 사용자 프로필 이미지 URL 업데이트
      const { data, error } = await supabase
        .from('users')
        .update({ profile_img_url: profileImgUrl })
        .eq('id', userId)
        .select('profile_img_url')
        .single();

      if (error) {
        console.error('[Repository] 프로필 이미지 URL 업데이트 오류:', error);
        return null;
      }

      return { profileImgUrl };
    } catch (error) {
      console.error('[Repository] 프로필 이미지 업데이트 중 예외 발생:', error);
      return null;
    }
  }

  async updatePassword(
    userId: string,
    hashedNewPassword: string
  ): Promise<CommonUserEntity | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ password: hashedNewPassword })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('[Repository] Supabase 비밀번호 변경 오류:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // 업데이트된 데이터를 Entity로 변환하여 반환
      const updatedEntity = fromDbObject(data);

      return updatedEntity;
    } catch (error) {
      console.error('[Repository] 비밀번호 변경 중 예외 발생:', error);
      return null;
    }
  }

  async verifyCurrentPassword(
    userId: string,
    currentPassword: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('password')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[Repository] Supabase 비밀번호 조회 오류:', error);
        return false;
      }

      if (!data) {
        return false;
      }

      // 비밀번호 비교 (실제 구현에서는 해시 비교)
      const isMatch = data.password === currentPassword;

      return isMatch;
    } catch (error) {
      console.error('[Repository] 비밀번호 확인 중 예외 발생:', error);
      return false;
    }
  }

  async getUserById(userId: string): Promise<CommonUserEntity | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[Repository] Supabase 사용자 조회 오류:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // 데이터를 Entity로 변환
      const userEntity = fromDbObject(data);

      return userEntity;
    } catch (error) {
      console.error('[Repository] 사용자 조회 중 예외 발생:', error);
      return null;
    }
  }
}
