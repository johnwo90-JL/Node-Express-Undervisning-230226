import z from "zod";

export const LoggerFunctionsSchema = z.object({
    log: z.function(),
    info: z.function(),
    warn: z.function(),
    error: z.function(),
});

export const LoggerServiceSchema = z.object({
    log: z.function(),
    info: z.function().optional(),
    warn: z.function().optional(),
    error: z.function().optional(),
});
;
