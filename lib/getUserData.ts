import { supabase } from '@/backend/common/utils/supabaseClient';

export async function getUuidByNickname(
  nickname: string
): Promise<string | null> {
  try {
    if (!nickname || nickname.length === 0) {
      console.error('[getUuidByNickname] 닉네임이 비어있습니다.');
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[getUuidByNickname] Supabase 조회 오류:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('[getUuidByNickname] 예외 발생:', error);
    return null;
  }
}

export async function getNicknameByUuid(uuid: string): Promise<string | null> {
  try {
    if (!uuid || uuid.trim().length === 0) {
      console.error('[getNicknameByUuid] UUID가 비어있습니다.');
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', uuid.trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[getNicknameByUuid] Supabase 조회 오류:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return data.nickname;
  } catch (error) {
    console.error('[getNicknameByUuid] 예외 발생:', error);
    return null;
  }
}
