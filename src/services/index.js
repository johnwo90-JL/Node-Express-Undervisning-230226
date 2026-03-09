import { CookieService } from "./cookie.service.js";
import { LoggerService } from "./logger.service.js";

export function createServices() {
    const serviceRegistry = Object.create(null);

    const registerService = (name, serviceInstance) => {
        if (serviceRegistry[name]) {
            throw new Error(`Service "${name}" is already registered.`);
        }

        serviceRegistry[name] = serviceInstance;
        return serviceInstance;
    };

    const getService = (name) => {
        const service = serviceRegistry[name];

        if (!service) {
            throw new Error(`Service "${name}" is not registered.`);
        }

        return service;
    };

    const logger = registerService("logger", new LoggerService(console));
    const cookie = registerService("cookie", new CookieService({ logger }));

    return Object.freeze({
        logger,
        cookie,
        getService,
    });
}
