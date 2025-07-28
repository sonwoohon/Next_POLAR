import { supabase } from '@/backend/common/utils/supabaseClient';
import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';
import { fromDbObject } from '@/backend/common/mappers/UserMapper';

// Supabase 인증 Repository 구현체
export class SbUserRepository implements IUserRepository {
  async getUserById(id: string): Promise<CommonUserEntity | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
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

  async getUserByNickname(nickname: string): Promise<CommonUserEntity | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('nickname', nickname)
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

  async updateUser(
    id: string,
    user: CommonUserEntity
  ): Promise<CommonUserEntity | null> {
    try {
      // 업데이트할 데이터 준비
      const updateData = {
        phone_number: user.phoneNumber,
        password: user.password,
        email: user.email,
        age: user.age,
        profile_img_url: user.profileImgUrl,
        address: user.address,
        name: user.name,
        nickname: user.nickname,
      };

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Repository] Supabase 사용자 업데이트 오류:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // 업데이트된 데이터를 Entity로 변환하여 반환
      const updatedEntity = fromDbObject(data);
      return updatedEntity;
    } catch (error) {
      console.error('[Repository] 사용자 업데이트 중 예외 발생:', error);
      return null;
    }
  }

  // UserWithdrawalUseCase용 메서드들

  async deleteById(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);

      if (error) {
        console.error('[Repository] Supabase 사용자 삭제 오류:', error);
        throw new Error(`사용자 삭제 실패: ${error.message}`);
      }
    } catch (error) {
      console.error('[Repository] 사용자 삭제 중 예외 발생:', error);
      throw error;
    }
  }

  async updateUserPartial(
    id: string,
    updates: Partial<{
      phoneNumber: string;
      password: string;
      email: string;
      age: number;
      profileImgUrl: string | null;
      address: string;
      name: string;
      nickname: string;
    }>
  ): Promise<CommonUserEntity | null> {
    try {
      // 업데이트할 데이터 준비 (snake_case로 변환)
      const updateData: {
        phone_number?: string;
        password?: string;
        email?: string;
        age?: number;
        profile_img_url?: string | null;
        address?: string;
        name?: string;
        nickname?: string;
      } = {};

      if (updates.phoneNumber !== undefined)
        updateData.phone_number = updates.phoneNumber;
      if (updates.password !== undefined)
        updateData.password = updates.password;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.age !== undefined) updateData.age = updates.age;
      if (updates.profileImgUrl !== undefined)
        updateData.profile_img_url = updates.profileImgUrl;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.nickname !== undefined)
        updateData.nickname = updates.nickname;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(
          '[Repository] Supabase 사용자 부분 업데이트 오류:',
          error
        );
        return null;
      }

      if (!data) {
        return null;
      }

      // 업데이트된 데이터를 Entity로 변환하여 반환
      const updatedEntity = fromDbObject(data);
      return updatedEntity;
    } catch (error) {
      console.error('[Repository] 사용자 부분 업데이트 중 예외 발생:', error);
      return null;
    }
  }
}
