import { CommonUserEntity } from '@/backend/users/domains/entities/UserEntity';
import { UserProfileResponseDto } from '@/backend/common/dtos/UserDto';

// Entity를 UserResponseDto로 변환
export function entityToUserResponseDto(
  entity: CommonUserEntity
): UserProfileResponseDto {
  return {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    phoneNumber: entity.phoneNumber,
    age: entity.age,
    profileImgUrl: entity.profileImgUrl,
    address: entity.address,
    createdAt: entity.createdAt.toISOString(),
  };
}

// Entity 배열을 UserResponseDto 배열로 변환
export function entitiesToUserResponseDtos(
  entities: CommonUserEntity[]
): UserProfileResponseDto[] {
  return entities.map(entityToUserResponseDto);
}
