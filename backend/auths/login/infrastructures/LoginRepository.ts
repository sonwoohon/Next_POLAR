<<<<<<< HEAD:backend/auths/login/infrastructures/LoginRepository.ts
import { supabase } from '@/lib/supabase';
import { LoginDBResponse } from '@/backend/auths/login/LoginModel';
import { LoginMapper } from '@/backend/auths/login/infrastructures/mappers/LoginMapper';
=======
import { supabase } from '@/backend/common/utils/supabaseClient';
import { LoginDBResponse } from '../LoginModel';
import { LoginMapper } from './mappers/LoginMapper';
>>>>>>> 714e74345bf047750ce28a37052b6141b2547621:backend/users/auths/login/infrastructures/LoginRepository.ts

// 로그인에 필요한 사용자 정보를 가져오는 Repository
export class LoginRepository {
  // loginId는 phoneNumber(숫자) 또는 email(문자열)로 들어올 수 있음
  async findUserByLoginId(loginId: string): Promise<LoginDBResponse | null> {
    // 골뱅이 여부
    const isPhone = !loginId.includes('@');
    const column = isPhone ? 'phone_number' : 'email';
    const { data, error } = await supabase
      .from('users')
      .select('id, password, phone_number, email')
      .eq(column, loginId)
      .single();
    if (error || !data) return null;

    return LoginMapper.toLoginUserEntity({
      id: data.id,
      loginId: isPhone ? data.phone_number : data.email,
      password: data.password,
    });
  }
}
