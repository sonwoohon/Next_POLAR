import { NextRequest, NextResponse } from 'next/server';
import { GetSeniorHelpsUseCase } from '@/backend/seniors/helps/applications/usecases/GetSeniorHelpsUseCase';
import { SeniorHelpRepository } from '@/backend/seniors/helps/infrastructures/repositories/SeniorHelpRepositories';
import { getNicknameFromCookie } from '@/lib/jwt';
// import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { SbHelpImageRepository } from '@/backend/images/infrastructures/repositories/SbHelpImageRepository';
import { GetUserByIdUseCase } from '@/backend/users/user/applications/usecases/CommonUserUseCase';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { HelpResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import { SeniorHelpsResponseDto } from '@/backend/seniors/helps/applications/dtos/SeniorHelpsResponseDto';

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createGetSeniorHelpsUseCase = () => {
  const repository = new SeniorHelpRepository();
  return new GetSeniorHelpsUseCase(repository);
};

// 시니어가 작성한 헬프 리스트 조회 API
export async function GET(
  request: NextRequest
): Promise<NextResponse<SeniorHelpsResponseDto>> {
  try {
    // 쿠키에서 사용자 정보 가져오기
    const userData = getNicknameFromCookie(request);
    const { nickname } = userData || {};

    if (!nickname) {
      return NextResponse.json(
        { success: false, data: [], message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 시니어가 작성한 헬프 리스트 조회
    const helpEntities = await createGetSeniorHelpsUseCase().execute(nickname);

    if (!helpEntities) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          message: '헬프 리스트 조회에 실패했습니다.',
        },
        { status: 500 }
      );
    }

    // CommonHelpEntity를 HelpResponseDto로 변환
    // const helpRepository = new SbCommonHelpRepository();
    const imageRepository = new SbHelpImageRepository();
    const userRepository = new SbUserRepository();
    const getUserUseCase = new GetUserByIdUseCase(userRepository);

    const helpDtos: HelpResponseDto[] = [];

    for (const helpEntity of helpEntities) {
      try {
        // 시니어 정보 조회
        const seniorInfo = await getUserUseCase.execute(helpEntity.seniorId);

        // 이미지 URL 조회
        const images = await imageRepository.getHelpImageUrlsByHelpId(
          helpEntity.id
        );

        const helpDto: HelpResponseDto = {
          id: helpEntity.id,
          seniorInfo: {
            nickname: seniorInfo?.nickname || '',
            name: seniorInfo?.name || '',
            profileImgUrl: seniorInfo?.profileImgUrl || '',
            userRole: 'senior' as const,
            address: seniorInfo?.address || '',
          },
          title: helpEntity.title,
          startDate: helpEntity.startDate.toISOString().split('T')[0],
          endDate: helpEntity.endDate.toISOString().split('T')[0],
          category: helpEntity.category,
          content: helpEntity.content,
          status: helpEntity.status,
          createdAt: helpEntity.createdAt.toISOString(),
          images: images || [],
        };

        helpDtos.push(helpDto);
      } catch (error) {
        console.error(`헬프 ${helpEntity.id} 변환 중 오류:`, error);
        // 개별 헬프 변환 실패 시에도 계속 진행
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: helpDtos,
        message: '시니어 헬프 리스트 조회 성공',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('시니어 헬프 리스트 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: '서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
