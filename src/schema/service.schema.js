import z from "zod";

export const LoggerServiceSchema = z.object({
    log: z.function(),
});

export const CookieServiceDependenciesSchema = z.object({
    logger: LoggerServiceSchema,
});
