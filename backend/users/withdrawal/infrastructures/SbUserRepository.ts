import { supabase } from '@/backend/common/utils/supabaseClient';
import { User } from '@/backend/users/withdrawal/domains/entities/User';
import { UserRepository } from '@/backend/users/withdrawal/domains/repository/UserRepository';
import { SbUserMapper } from '@/backend/users/withdrawal/infrastructures/mappers/SbUserMapper';

// Supabase 회원탈퇴 Repository 구현체
export class SbWithdrawalUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
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

      // 매퍼를 사용하여 데이터를 User 엔티티로 변환
      const user = SbUserMapper.toUserEntity(data);

      return user;
    } catch (error) {
      console.error('[Repository] 사용자 조회 중 예외 발생:', error);
      return null;
    }
  }

  async makeNullById(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          phone_number: null,
          password: null,
          email: null,
          age: null,
          profile_img_url: null,
          address: null,
          name: null,
          created_at: null,
        })
        .eq('id', id);

      if (error) {
        console.error('[Repository] Supabase 사용자 삭제 오류:', error);
        throw new Error(`사용자 삭제 실패: ${error.message}`);
      }
    } catch (error) {
      console.error('[Repository] 사용자 삭제 중 예외 발생:', error);
      throw error;
    }
  }
}
/* API에서 type 파라미터를 전달해도 UseCase에서는 무시하고 항상 하드 삭제 */
