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
    console.log(`[Repository] 프로필 업데이트 시작 - ID: ${userId}`, profileData);

    try {
      // 업데이트할 데이터 준비 (snake_case로 변환)
      const updateData: {
        name?: string;
        address?: string;
        profile_img_url?: string;
      } = {};

      if (profileData.name !== undefined) updateData.name = profileData.name;
      if (profileData.address !== undefined) updateData.address = profileData.address;
      if (profileData.profileImgUrl !== undefined) updateData.profile_img_url = profileData.profileImgUrl;

      console.log(`[Repository] 프로필 업데이트 데이터 준비 완료:`, updateData);

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
        console.log(`[Repository] 업데이트된 사용자 데이터가 없음 - ID: ${userId}`);
        return null;
      }

      console.log(`[Repository] 프로필 업데이트 성공 - ID: ${userId}`, data);

      // 업데이트된 데이터를 Entity로 변환하여 반환
      const updatedEntity = fromDbObject(data);

      console.log(
        `[Repository] 업데이트된 Entity 변환 완료 - ID: ${userId}`,
        updatedEntity.toJSON()
      );
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
    console.log(`[Repository] 프로필 이미지 업데이트 시작 - ID: ${userId}`);

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

      console.log(`[Repository] 프로필 이미지 업데이트 성공 - ID: ${userId}`, { profileImgUrl });

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
    console.log(`[Repository] 비밀번호 변경 시작 - ID: ${userId}`);

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
        console.log(`[Repository] 비밀번호 변경된 사용자 데이터가 없음 - ID: ${userId}`);
        return null;
      }

      console.log(`[Repository] 비밀번호 변경 성공 - ID: ${userId}`);

      // 업데이트된 데이터를 Entity로 변환하여 반환
      const updatedEntity = fromDbObject(data);

      console.log(
        `[Repository] 비밀번호 변경 Entity 변환 완료 - ID: ${userId}`,
        updatedEntity.toJSON()
      );
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
    console.log(`[Repository] 현재 비밀번호 확인 시작 - ID: ${userId}`);

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
        console.log(`[Repository] 사용자를 찾을 수 없음 - ID: ${userId}`);
        return false;
      }

      // 비밀번호 비교 (실제 구현에서는 해시 비교)
      const isMatch = data.password === currentPassword;

      console.log(`[Repository] 비밀번호 확인 결과 - ID: ${userId}, 일치: ${isMatch}`);
      return isMatch;
    } catch (error) {
      console.error('[Repository] 비밀번호 확인 중 예외 발생:', error);
      return false;
    }
  }

  async getUserById(userId: string): Promise<CommonUserEntity | null> {
    console.log(`[Repository] 사용자 조회 시작 - ID: ${userId}`);

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
        console.log(`[Repository] 사용자를 찾을 수 없음 - ID: ${userId}`);
        return null;
      }

      console.log(`[Repository] 사용자 데이터 조회 성공 - ID: ${userId}`, data);

      // 데이터를 Entity로 변환
      const userEntity = fromDbObject(data);

      console.log(
        `[Repository] Entity 변환 완료 - ID: ${userId}`,
        userEntity.toJSON()
      );
      return userEntity;
    } catch (error) {
      console.error('[Repository] 사용자 조회 중 예외 발생:', error);
      return null;
    }
  }
} 