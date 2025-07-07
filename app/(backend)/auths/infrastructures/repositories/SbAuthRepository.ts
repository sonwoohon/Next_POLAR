import { supabase } from '../../../../../lib/supabase';

export class SbAuthRepository {
  // 모든 사용자 조회
  async getAllUsers(): Promise<any[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    return error ? [] : data || [];
  }

  // 특정 사용자 조회
  async getUserById(id: number): Promise<any | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    return error ? null : data;
  }

  // 사용자 정보 수정
  async updateUser(id: number, updateData: any): Promise<any | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    return error ? null : data;
  }
} 