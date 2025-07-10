import { User } from '@/backend/uesrs/auths/withdrawal/domains/entities/User';

// Supabase 사용자 데이터를 User 엔티티로 변환하는 매퍼
export class SbUserMapper {
    /**
     * Supabase 사용자 데이터를 User 엔티티로 변환
     * @param data Supabase에서 조회한 사용자 데이터
     * @returns User 엔티티 또는 null
     */
    static toUserEntity(data: any): User | null {
        if (!data) {
            return null;
        }

        try {
            const user: User = {
                id: data.id,
                phone_number: data.phoneNumber,
                password: data.password,
                email: data.email,
                age: data.age,
                profile_img_url: data.profileImgUrl,
                address: data.address,
                name: data.name,
                created_at: new Date(data.createdAt)
            };

            return user;
        } catch (error) {
            console.error('[Mapper] User 엔티티 변환 중 오류:', error);
            return null;
        }
    }

    /**
     * Supabase 사용자 데이터 배열을 User 엔티티 배열로 변환
     * @param dataArray Supabase에서 조회한 사용자 데이터 배열
     * @returns User 엔티티 배열
     */
    static toUserEntityArray(dataArray: any[]): User[] {
        if (!Array.isArray(dataArray)) {
            return [];
        }

        return dataArray
            .map(data => this.toUserEntity(data))
            .filter((user): user is User => user !== null);
    }
} 