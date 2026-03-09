import z from "zod";

import { LoggerServiceSchema } from "./logger.service.js";

export const CookieServiceDependenciesSchema = z.object({
    logger: LoggerServiceSchema,
})

export class CookieService {
    #logger;

    constructor(dependencies) {
        CookieServiceDependenciesSchema.parse(dependencies);
        this.#logger = dependencies.logger;
    }

    createSignedCookie(name, value, options = {}) {
        this.#logger.log("Test cookie being sent!");

        return {
            name,
            value,
            options: { ...options, signed: true, httpOnly: true },
        };
    }
}
