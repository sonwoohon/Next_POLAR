// User 엔티티 (withdrawal 전용)
export interface User {
    id: string;
    phone_number: string;
    password: string;
    email: string;
    age: number;
    profile_img_url: string;
    address: string;
    name: string;
    created_at: Date;
    // is_active?: boolean; // soft delete용(필요시)
} 