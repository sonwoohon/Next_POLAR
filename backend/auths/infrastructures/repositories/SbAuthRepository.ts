import { supabase } from '@/backend/common/utils/supabaseClient';
import { CommonUserEntity as UserEntity } from '@/backend/common/entities/UserEntity';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';

export class SbAuthRepository implements IUserRepository {
  // 모든 사용자 조회
  async getAllUsers(): Promise<UserEntity[]> {
    console.log('SbAuthRepository.getAllUsers() 호출됨');

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('id', { ascending: true });

    console.log('Supabase 쿼리 결과:', { data: data?.length, error });

    if (error) {
      console.error('Supabase 오류:', error);
      return [];
    }

    const entities = (data || []).map(
      (user: {
        id: number;
        phone_number: string;
        password: string;
        email: string;
        age: number;
        profile_img_url: string;
        address: string;
        name: string;
        created_at: string;
      }) =>
        new UserEntity(
          user.id,
          user.phone_number || '',
          user.password || '',
          user.email || '',
          user.age || 0,
          user.profile_img_url || '',
          user.address || '',
          user.name,
          new Date(user.created_at)
        )
    );

    console.log('Entity 변환 완료:', entities.length, '개');
    return entities;
  }

  // 특정 사용자 조회
  async getUserById(id: number): Promise<UserEntity | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return new UserEntity(
      data.id,
      data.phone_number || '',
      data.password || '',
      data.email,
      data.age || 0,
      data.profile_img_url || '',
      data.address || '',
      data.name,
      new Date(data.created_at)
    );
  }

  // 사용자 정보 수정
  async updateUser(id: number, user: UserEntity): Promise<UserEntity | null> {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: user.name,
        email: user.email,
        phone_number: user.phoneNumber,
        age: user.age,
        profile_img_url: user.profileImgUrl,
        address: user.address,
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;

    return new UserEntity(
      data.id,
      data.phone_number || '',
      data.password || '',
      data.email,
      data.age || 0,
      data.profile_img_url || '',
      data.address || '',
      data.name,
      new Date(data.created_at)
    );
  }

  // 비밀번호 변경
  async updatePassword(id: number, newPassword: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('id', id);

    return !error;
  }
}
