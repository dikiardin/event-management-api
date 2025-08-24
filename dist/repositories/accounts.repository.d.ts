export declare const createAccount: (data: any) => Promise<{
    id: number;
    role: import("../generated/prisma").$Enums.RoleType;
    username: string;
    email: string;
    password: string;
    referral_code: string | null;
    point_last_earned_at: Date | null;
    profile_pic: string | null;
    created_at: Date;
    is_verified: boolean;
}>;
export declare const findByEmail: (email: string) => Promise<{
    id: number;
    role: import("../generated/prisma").$Enums.RoleType;
    username: string;
    email: string;
    password: string;
    referral_code: string | null;
    point_last_earned_at: Date | null;
    profile_pic: string | null;
    created_at: Date;
    is_verified: boolean;
} | null>;
//# sourceMappingURL=accounts.repository.d.ts.map