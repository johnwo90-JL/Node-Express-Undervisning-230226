import { CookieServiceDependenciesSchema } from "../schema/service.schema.js";

export class CookieService {
    #logger;

    constructor(dependencies) {
        const { logger } = CookieServiceDependenciesSchema.parse(dependencies);
        this.#logger = logger;
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
