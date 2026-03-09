import z from "zod";

export const LoggerServiceSchema = z.object({
    log: z.function(),
    info: z.function().optional(),
    warn: z.function().optional(),
    error: z.function().optional(),
});

export const LoggerFunctionsSchema = z.object({
    log: z.function(),
    info: z.function(),
    warn: z.function(),
    error: z.function(),
});

export class LoggerService {
    #fn = {};

    constructor(functions) {
        const parsedFunctions = LoggerFunctionsSchema.parse(functions);
        this.#fn = {
            log: parsedFunctions.log.bind(functions),
            info: parsedFunctions.info.bind(functions),
            warn: parsedFunctions.warn.bind(functions),
            error: parsedFunctions.error.bind(functions),
        };
    }

    log(...args) {
        this.#fn.log(...args);
    }

    info(...args) {
        this.#fn.info(...args);
    }

    warn(...args) {
        this.#fn.warn(...args);
    }

    error(...args) {
        this.#fn.error(...args);
    }
}
