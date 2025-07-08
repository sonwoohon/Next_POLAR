import { CommonAuthEntity } from '@/(backend)/auths/domains/entities/CommonAuthEntity';
import { UserResponseDto } from '@/(backend)/auths/applications/dtos/UserDtos';

// Entity를 UserResponseDto로 변환
export function entityToUserResponseDto(entity: CommonAuthEntity): UserResponseDto {
  return {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    phone_number: entity.phone_number,
    age: entity.age,
    profile_img_url: entity.profile_img_url,
    address: entity.address,
    created_at: entity.created_at.toISOString()
  };
}

// Entity 배열을 UserResponseDto 배열로 변환
export function entitiesToUserResponseDtos(entities: CommonAuthEntity[]): UserResponseDto[] {
  return entities.map(entityToUserResponseDto);
} 