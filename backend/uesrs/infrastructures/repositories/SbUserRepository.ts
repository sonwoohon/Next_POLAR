import { supabase } from '@/lib/supabase';
import { CommonUserEntity } from '@/backend/uesrs/domains/entities/CommonUserEntity';
import { IUserRepository } from '@/backend/uesrs/domains/repositories/UserRepository';

// Supabase 인증 Repository 구현체
export class SbUserRepository implements IUserRepository {
  async getUserById(id: number): Promise<CommonUserEntity | null> {
    console.log(`[Repository] 사용자 조회 시작 - ID: ${id}`);
    
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
        console.log(`[Repository] 사용자를 찾을 수 없음 - ID: ${id}`);
        return null;
      }

      console.log(`[Repository] 사용자 데이터 조회 성공 - ID: ${id}`, data);

      // 데이터를 Entity로 변환
      const userEntity = new CommonUserEntity(
        data.id,
        data.phoneNumber,
        data.password,
        data.email,
        data.age,
        data.profileImgUrl,
        data.address,
        data.name,
        new Date(data.createdAt)
      );

      console.log(`[Repository] Entity 변환 완료 - ID: ${id}`, userEntity.toJSON());
      return userEntity;
    } catch (error) {
      console.error('[Repository] 사용자 조회 중 예외 발생:', error);
      return null;
    }
  }

  async updateUser(id: number, user: CommonUserEntity): Promise<CommonUserEntity | null> {
    console.log(`[Repository] 사용자 업데이트 시작 - ID: ${id}`, user.toJSON());
    
    try {
      // 업데이트할 데이터 준비
      const updateData = {
        phoneNumber: user.phoneNumber,
        password: user.password,
        email: user.email,
        age: user.age,
        profileImgUrl: user.profileImgUrl,
        address: user.address,
        name: user.name
      };

      console.log(`[Repository] 업데이트 데이터 준비 완료:`, updateData);

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
        console.log(`[Repository] 업데이트된 사용자 데이터가 없음 - ID: ${id}`);
        return null;
      }

      console.log(`[Repository] 사용자 업데이트 성공 - ID: ${id}`, data);

      // 업데이트된 데이터를 Entity로 변환하여 반환
      const updatedEntity = new CommonUserEntity(
        data.id,
        data.phoneNumber,
        data.password,
        data.email,
        data.age,
        data.profileImgUrl,
        data.address,
        data.name,
        new Date(data.createdAt)
      );

      console.log(`[Repository] 업데이트된 Entity 변환 완료 - ID: ${id}`, updatedEntity.toJSON());
      return updatedEntity;
    } catch (error) {
      console.error('[Repository] 사용자 업데이트 중 예외 발생:', error);
      return null;
    }
  }
} 