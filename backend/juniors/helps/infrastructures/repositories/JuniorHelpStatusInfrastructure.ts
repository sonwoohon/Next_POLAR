import { supabase } from '@/backend/common/utils/supabaseClient';
import { IJuniorHelpStatusRepository } from '@/backend/juniors/helps/domains/repositories/IJuniorHelpStatusRepository';
import { StatusMapper } from '@/backend/juniors/helps/infrastructures/mappers/StatusMapper';
import { getUuidByNickname } from '@/lib/getUserData';
import { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

export class JuniorHelpStatusInfrastructure
  implements IJuniorHelpStatusRepository
{
  // 상태 관리 메서드
  async getVerificationCode(helpId: number) {
    const { data, error } = await supabase
      .from('help_verification_codes')
      .select('*')
      .eq('help_id', helpId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116는 데이터 없음
      console.error('인증 코드 조회 오류:', error);
      throw new Error('인증 코드 조회에 실패했습니다.');
    }

    return StatusMapper.toJuniorHelp(data);
  }

  async deleteVerificationCode(helpId: number) {
    const { error } = await supabase
      .from('help_verification_codes')
      .delete()
      .eq('help_id', helpId);

    if (error) {
      console.error('인증 코드 삭제 오류:', error);
      throw new Error('인증 코드 삭제에 실패했습니다.');
    }

    return true;
  }

  // 주니어가 수락된 Help 리스트 조회
  async getAcceptedHelpsByJuniorId(
    juniorNickname: string,
    page: number,
    limit: number
  ): Promise<{
    helps: HelpListResponseDto[];
    totalCount: number;
  }> {
    const offset = (page - 1) * limit;

    const juniorId = await getUuidByNickname(juniorNickname);

    // 2. 주니어가 수락된 Help 리스트 조회 (페이지네이션 포함)
    const { data: helps, error: helpsError } = await supabase
      .from('help_applicants')
      .select(
        `
        help_id,
        helps!help_applicants_help_id_fkey(
          id,
          title,
          content,
          status,
          start_date,
          end_date,
          created_at,
          senior_id,
          help_categories!help_categories_help_id_fkey(
            sub_category_id,
            sub_categories!help_categories_sub_category_id_fkey(
              name,
              point
            )
          )
        )
      `
      )
      .eq('junior_id', juniorId)
      .eq('is_accepted', true)
      .order('helps(created_at)', { ascending: false })
      .range(offset, offset + limit - 1);

    if (helpsError) {
      console.error('주니어 수락 Help 조회 오류:', helpsError);
      throw new Error('주니어 수락 Help 조회에 실패했습니다.');
    }

    // 3. 총 개수 조회
    const { count: totalCount, error: countError } = await supabase
      .from('help_applicants')
      .select('*', { count: 'exact', head: true })
      .eq('junior_id', juniorId)
      .eq('is_accepted', true);

    if (countError) {
      console.error('주니어 수락 Help 개수 조회 오류:', countError);
      throw new Error('주니어 수락 Help 개수 조회에 실패했습니다.');
    }

    // 데이터 변환
    const helpDtos = await Promise.all(
      (helps || []).map(async (item) => {
        const help = item.helps?.[0];
        if (!help) return null;

        const helpCategory = help.help_categories?.[0];
        const subCategory = helpCategory?.sub_categories?.[0];

        // 시니어 정보 조회 (helps.senior_id를 통해 users 테이블 조회)
        const { data: seniorData, error: seniorError } = await supabase
          .from('users')
          .select('nickname, name, profile_img_url, address')
          .eq('id', help.senior_id)
          .single();

        if (seniorError) {
          console.error('시니어 정보 조회 오류:', seniorError);
          return null;
        }

        // Help 이미지 조회
        const { data: imageData, error: imageError } = await supabase
          .from('help_images')
          .select('image_url')
          .eq('help_id', help.id);

        const images = imageError
          ? []
          : imageData?.map((img) => img.image_url) || [];

        // HelpListResponseDto 형식으로 변환
        const helpDto: HelpListResponseDto = {
          id: help.id,
          seniorInfo: {
            nickname: seniorData?.nickname || '',
            name: seniorData?.name || '',
            profileImgUrl: seniorData?.profile_img_url || '',
            userRole: 'senior' as const,
            address: seniorData?.address || '',
          },
          title: help.title,
          startDate: help.start_date,
          endDate: help.end_date,
          category: subCategory
            ? [
                {
                  id: helpCategory?.sub_category_id || 0,
                  point: subCategory.point || 0,
                },
              ]
            : [],
          content: help.content,
          status: help.status,
          createdAt: help.created_at,
          images: images,
        };

        return helpDto;
      })
    );

    // null 값 필터링
    const filteredHelpDtos = helpDtos.filter(
      (dto): dto is HelpListResponseDto => dto !== null
    );

    return {
      helps: filteredHelpDtos,
      totalCount: totalCount || 0,
    };
  }
}
