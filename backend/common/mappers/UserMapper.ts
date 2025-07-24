import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
import { UserProfileResponseDto } from '@/backend/common/dtos/UserDto';

// Entity -> DB object (snake_case)
export function toDbObject(entity: CommonUserEntity): {
  id: string;
  phone_number: string;
  password: string;
  email: string;
  age: number;
  profile_img_url: string;
  address: string;
  name: string;
  nickname: string;
  created_at: string;
} {
  return {
    id: entity.id,
    phone_number: entity.phoneNumber,
    password: entity.password,
    email: entity.email,
    age: entity.age,
    profile_img_url: entity.profileImgUrl,
    address: entity.address,
    name: entity.name,
    nickname: entity.nickname,
    created_at:
      entity.createdAt instanceof Date
        ? entity.createdAt.toISOString()
        : entity.createdAt,
  };
}

// DB object (snake_case) -> Entity
export function fromDbObject(dbObj: {
  id: string;
  phone_number: string;
  password: string;
  email: string;
  age: number;
  profile_img_url: string;
  address: string;
  name: string;
  nickname: string;
  created_at: string;
}): CommonUserEntity {
  return new CommonUserEntity(
    dbObj.id,
    dbObj.phone_number,
    dbObj.password,
    dbObj.email,
    dbObj.age,
    dbObj.profile_img_url,
    dbObj.address,
    dbObj.name,
    dbObj.nickname,
    new Date(dbObj.created_at)
  );
}

// Entity를 UserProfileResponseDto로 변환
export function entityToUserProfileResponseDto(
  entity: CommonUserEntity
): UserProfileResponseDto {
  const userRole = entity.age >= 60 ? 'senior' : 'junior';

  const dto: UserProfileResponseDto = {
    //id: entity.id,
    name: entity.name,
    nickname: entity.nickname,
    //email: entity.email,
    //phoneNumber: entity.phoneNumber,
    age: entity.age,
    profileImgUrl: entity.profileImgUrl || '',
    address: entity.address,
    userRole: userRole,
  };

  return dto;
}
