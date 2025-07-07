
import { AuthRepository } from "../../domains/repositories/AuthRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { SignUpDto } from "@/app/api/auths/route";

export class SbAuthRepository implements AuthRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  // 회원가입
  async signUp(user: SignUpDto): Promise<SignUpDto | null> {
    const { data, error } = await this.supabase.from('users').insert(user).select().single();

    if (error) throw new Error(error.message);

    return data as SignUpDto;
  };

  // // 로그인
  // signIn(email: string, password: string): Promise<CommonAuthEntity | null>;

  // // 회원정보 수정
  // updateUser(id: bigint, update: Partial<Omit<CommonAuthEntity, 'id' | 'email'>>): Promise<CommonAuthEntity>;

  // // 회원탈퇴
  // deleteUser(id: bigint): Promise<void>;

  // // 회원 정보 조회
  // findUserById(id: bigint): Promise<CommonAuthEntity | null>;

  // // 회원 랭킹 조회 (예: 점수순, 활동순 등)
  // findUserRanking(limit: number): Promise<CommonAuthEntity[]>;
}
