export declare const registerService: (data: {
    email: string;
    password: string;
    username: string;
}) => Promise<{
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
export declare const loginService: (email: string, password: string) => Promise<{
    token: string;
    user: {
        id: number;
        email: string;
        username: string;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map