import { supabase } from '@/backend/common/utils/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { getUuidByNickname } from '@/lib/getUserData';
import { getNicknameFromCookie } from '@/lib/jwt';

// 타입 정의
interface HelpParticipantData {
  helpId: number;
  helpTitle: string;
  seniorNickname: string;
  juniorIds: string[];
  isSenior: boolean;
  isJunior: boolean;
}

interface HelpInfo {
  id: number;
  title: string;
  senior_id: string;
}

// 유틸리티 함수들
const validateHelpId = (helpIdParam: string): number => {
  const helpId = parseInt(helpIdParam);
  if (isNaN(helpId)) {
    throw new Error('유효하지 않은 Help ID입니다.');
  }
  return helpId;
};

const getUserFromCookie = (request: NextRequest): string => {
  const userData = getNicknameFromCookie(request);
  const { nickname } = userData || {};

  if (!nickname) {
    throw new Error('인증이 필요합니다.');
  }

  return nickname;
};

const fetchHelpParticipants = async (helpId: number) => {
  const { data: helpData, error: helpError } = await supabase
    .from('help_applicants')
    .select('junior_id, helps(id, title, senior_id)')
    .eq('help_id', helpId);

  if (helpError) {
    console.error('Help 데이터 조회 오류:', helpError);
    throw new Error('Help 데이터 조회에 실패했습니다.');
  }

  if (!helpData || helpData.length === 0) {
    throw new Error('해당 Help를 찾을 수 없습니다.');
  }

  return helpData;
};

const fetchSeniorNickname = async (seniorId: string): Promise<string> => {
  const { data: seniorData, error: seniorError } = await supabase
    .from('users')
    .select('nickname')
    .eq('id', seniorId)
    .single();

  if (seniorError || !seniorData) {
    console.error('시니어 닉네임 조회 오류:', seniorError);
    throw new Error('시니어 정보 조회에 실패했습니다.');
  }

  return seniorData.nickname;
};

const determineUserRole = (
  userUuid: string,
  seniorId: string,
  juniorIds: string[]
): { isSenior: boolean; isJunior: boolean } => {
  const isSenior = seniorId === userUuid;
  const isJunior = juniorIds.includes(userUuid);

  return { isSenior, isJunior };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: string }> }
) {
  try {
    // 1. 파라미터 검증
    const { helpId: helpIdParam } = await params;
    const helpId = validateHelpId(helpIdParam);

    // 2. 사용자 인증
    const nickname = getUserFromCookie(request);
    const userUuid = await getUuidByNickname(nickname);

    if (!userUuid) {
      return NextResponse.json(
        { error: '사용자 UUID를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 3. Help 참여자 정보 조회
    const helpData = await fetchHelpParticipants(helpId);
    const helpInfo = helpData[0].helps as unknown as HelpInfo;

    // 4. 시니어 닉네임 조회
    const seniorNickname = await fetchSeniorNickname(helpInfo.senior_id);

    // 5. 주니어 ID 목록 추출
    const juniorIds = helpData.map(
      (applicant: { junior_id: string }) => applicant.junior_id
    );

    // 6. 사용자 역할 판별
    const { isSenior, isJunior } = determineUserRole(
      userUuid,
      helpInfo.senior_id,
      juniorIds
    );

    // 7. 응답 데이터 구성
    const responseData: HelpParticipantData = {
      helpId: helpInfo.id,
      helpTitle: helpInfo.title,
      seniorNickname,
      juniorIds,
      isSenior,
      isJunior,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API 오류:', error);

    const errorMessage =
      error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    const statusCode = errorMessage.includes('인증')
      ? 401
      : errorMessage.includes('찾을 수 없습니다')
      ? 404
      : errorMessage.includes('Help ID')
      ? 400
      : 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
