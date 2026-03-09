import z from "zod";

export const JwtLoginSchema = z.object({
    body: z.object({
        identifier: z.string().trim().min(1),
        password: z.string().min(1),
    }),
});

export const RefreshTokenSchema = z.object({
    signedCookies: z.object({
        refreshToken: z.string().min(1),
    }),
});
