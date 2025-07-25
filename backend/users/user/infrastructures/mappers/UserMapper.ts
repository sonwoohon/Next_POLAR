import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
import { UserProfileResponseDto } from '@/backend/users/user/applications/dtos/UserDtos';

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

export function entityToUserProfileResponseDto(
  entity: CommonUserEntity
): UserProfileResponseDto {
  let createdAtString: string;
  try {
    if (
      entity.createdAt instanceof Date &&
      !isNaN(entity.createdAt.getTime())
    ) {
      createdAtString = entity.createdAt.toISOString();
    } else if (typeof entity.createdAt === 'string') {
      const date = new Date(entity.createdAt);
      if (!isNaN(date.getTime())) {
        createdAtString = date.toISOString();
      } else {
        createdAtString = new Date().toISOString();
      }
    } else {
      createdAtString = new Date().toISOString();
    }
  } catch {
    createdAtString = new Date().toISOString();
  }

  const dto: UserProfileResponseDto = {
    name: entity.name,
    userRole: entity.age >= 60 ? 'senior' : 'junior',
    profileImgUrl: entity.profileImgUrl || '',
    address: entity.address,
    nickname: entity.nickname,
  };

  return dto;
}
