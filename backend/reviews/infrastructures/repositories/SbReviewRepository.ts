import { supabase } from '@/backend/common/utils/supabaseClient';
import { ReviewMapper } from '@/backend/reviews/infrastructures/mappers/ReviewMapper';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';
import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

export class SbReviewRepository implements IReviewRepository {
  // receiverId로 받은 리뷰 리스트 조회
  async findByReceiverId(receiverId: number): Promise<ReviewEntity[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('receiver_id', receiverId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((review) => ReviewMapper.toEntity(review));
  }

  // writerId로 내가 쓴(작성한) 리뷰 리스트 조회
  async findByWriterId(writerId: number): Promise<ReviewEntity[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('writer_id', writerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((review) => ReviewMapper.toEntity(review));
  }

  // 리뷰 id로 단일 리뷰 상세 조회
  async findById(reviewId: number): Promise<ReviewEntity | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return ReviewMapper.toEntity(data);
  }

  // 리뷰 생성
  async create(
    review: Omit<ReviewEntity, 'id' | 'createdAt'>
  ): Promise<ReviewEntity> {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        help_id: review.helpId,
        writer_id: review.writerId,
        receiver_id: review.receiverId,
        rating: review.rating,
        text: review.text,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('리뷰 생성 실패');

    return ReviewMapper.toEntity(data);
  }

  // helpId와 writerId로 receiverId 계산
  async calculateReceiverId(helpId: number, writerId: number): Promise<number> {
    // 1. help 정보 조회하여 senior_id 확인
    const { data: helpData, error: helpError } = await supabase
      .from('helps')
      .select('senior_id')
      .eq('id', helpId)
      .single();

    if (helpError) {
      console.error(`[SbReviewRepository] Help 조회 실패: helpId=${helpId}, error=${helpError.message}`);
      throw new Error(`Help ID ${helpId} 조회 중 오류가 발생했습니다: ${helpError.message}`);
    }
    
    if (!helpData) {
      console.error(`[SbReviewRepository] Help 데이터 없음: helpId=${helpId}`);
      throw new Error(`Help ID ${helpId}에 해당하는 도움 요청을 찾을 수 없습니다.`);
    }

    const seniorId = helpData.senior_id;

    // 2. writerId가 수락된 주니어인지 시니어인지 확인
    if (writerId === seniorId) {
      // 작성자가 시니어인 경우: help_applicants에서 is_accepted=true인 주니어를 찾음
      const { data: applicantData, error: applicantError } = await supabase
        .from('help_applicants')
        .select('junior_id')
        .eq('help_id', helpId)
        .eq('is_accepted', true)
        .single();

      if (applicantError) {
        console.error(`[SbReviewRepository] 수락된 주니어 조회 실패: helpId=${helpId}, error=${applicantError.message}`);
        throw new Error(`Help ID ${helpId}에 대한 수락된 주니어 조회 중 오류가 발생했습니다: ${applicantError.message}`);
      }
      
      if (!applicantData) {
        console.error(`[SbReviewRepository] 수락된 주니어 없음: helpId=${helpId}`);
        throw new Error(`Help ID ${helpId}에 대한 수락된 주니어가 없습니다. 아직 주니어가 수락되지 않았거나, 수락된 주니어가 존재하지 않습니다.`);
      }

      return applicantData.junior_id;
    } else {
      // 작성자가 주니어인 경우: help_applicants에서 해당 주니어가 수락되었는지 확인
      const { data: applicantData, error: applicantError } = await supabase
        .from('help_applicants')
        .select('junior_id, is_accepted')
        .eq('help_id', helpId)
        .eq('junior_id', writerId)
        .single();

      if (applicantError) {
        console.error(`[SbReviewRepository] 주니어 신청 정보 조회 실패: helpId=${helpId}, writerId=${writerId}, error=${applicantError.message}`);
        throw new Error(`Help ID ${helpId}에 대한 주니어 신청 정보 조회 중 오류가 발생했습니다: ${applicantError.message}`);
      }
      
      if (!applicantData) {
        console.error(`[SbReviewRepository] 주니어 신청 정보 없음: helpId=${helpId}, writerId=${writerId}`);
        throw new Error(`Help ID ${helpId}에 대한 주니어 신청 정보가 없습니다. 해당 도움 요청에 신청하지 않았거나, 신청 정보가 삭제되었을 수 있습니다.`);
      }

      if (!applicantData.is_accepted) {
        console.error(`[SbReviewRepository] 주니어 신청이 수락되지 않음: helpId=${helpId}, writerId=${writerId}`);
        throw new Error(`Help ID ${helpId}에 대한 주니어 신청이 아직 수락되지 않았습니다. 시니어가 수락한 후에 리뷰를 작성할 수 있습니다.`);
      }

      // 수락된 주니어인 경우: helps 테이블의 senior_id를 반환
      return seniorId;
    }
  }
}
