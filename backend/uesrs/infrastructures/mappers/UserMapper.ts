import { CommonUserEntity } from '@/backend/uesrs/domains/entities/CommonUserEntity';
import { UserProfileResponseDto } from '@/backend/uesrs/applications/dtos/UserDtos';

// 기본 프로필 이미지 URL
const DEFAULT_PROFILE_IMAGE_URL = '/images/default-profile.png'; // 또는 실제 기본 이미지 URL

// Entity를 UserProfileResponseDto로 변환
export function entityToUserProfileResponseDto(entity: CommonUserEntity): UserProfileResponseDto {
  console.log(`[Mapper] Entity를 DTO로 변환 시작 - ID: ${entity.id}`);
  
  // createdAt을 안전하게 처리
  let createdAtString: string;
  try {
    if (entity.createdAt instanceof Date && !isNaN(entity.createdAt.getTime())) {
      createdAtString = entity.createdAt.toISOString();
      console.log(`[Mapper] Date 객체에서 ISO 문자열 생성: ${createdAtString}`);
    } else if (typeof entity.createdAt === 'string') {
      // 문자열이 유효한 날짜인지 확인
      const date = new Date(entity.createdAt);
      if (!isNaN(date.getTime())) {
        createdAtString = date.toISOString();
        console.log(`[Mapper] 문자열에서 Date 객체 생성 후 ISO 문자열 변환: ${createdAtString}`);
      } else {
        createdAtString = new Date().toISOString();
        console.log(`[Mapper] 유효하지 않은 날짜 문자열, 현재 시간 사용: ${createdAtString}`);
      }
    } else {
      createdAtString = new Date().toISOString(); // 기본값으로 현재 시간 사용
      console.log(`[Mapper] 알 수 없는 날짜 형식, 현재 시간 사용: ${createdAtString}`);
    }
  } catch (error) {
    console.error('[Mapper] createdAt 처리 중 오류:', error);
    createdAtString = new Date().toISOString(); // 오류 시 현재 시간 사용
    console.log(`[Mapper] 오류 발생으로 현재 시간 사용: ${createdAtString}`);
  }

  const dto = {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    phoneNumber: entity.phoneNumber,
    age: entity.age,
    profileImgUrl: entity.profileImgUrl && entity.profileImgUrl.trim() !== '' 
      ? entity.profileImgUrl 
      : DEFAULT_PROFILE_IMAGE_URL,
    address: entity.address,
    createdAt: createdAtString
  };

  console.log(`[Mapper] DTO 변환 완료 - ID: ${entity.id}`, dto);
  return dto;
} 