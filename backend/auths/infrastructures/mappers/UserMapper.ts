import { UserEntity } from '../../domains/entities/CommonAuthEntity';
import { UserResponseDto } from '../../applications/dtos/UserDtos';

// Entity를 UserResponseDto로 변환
export function entityToUserResponseDto(entity: UserEntity): UserResponseDto {
  return {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    phoneNumber: entity.phoneNumber,
    age: entity.age,
    profileImgUrl: entity.profileImgUrl,
    address: entity.address,
    createdAt: entity.createdAt.toISOString()
  };
}

// Entity 배열을 UserResponseDto 배열로 변환
export function entitiesToUserResponseDtos(entities: UserEntity[]): UserResponseDto[] {
  return entities.map(entityToUserResponseDto);
} 