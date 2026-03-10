import { config } from "../config/env.config.js";
import { AuthService } from "./auth.service.js";
import { CookieService } from "./cookie.service.js";
import { JwtService } from "./jwt.service.js";
import { LocationsService } from "./locations.service.js";
import { LoggerService } from "./logger.service.js";
import { SessionTokenService } from "./session-token.service.js";
import { UserService } from "./user.service.js";

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
    const jwt = registerService("jwt", new JwtService({
        secret: config.auth.jwt.secret,
        accessTokenExpiry: config.auth.jwt.expiresIn.accessToken,
        refreshTokenExpiry: config.auth.jwt.expiresIn.refreshToken,
    }));
    const user = registerService("user", new UserService());
    const sessionToken = registerService("sessionToken", new SessionTokenService());
    const auth = registerService("auth", new AuthService({
        userService: user,
        jwtService: jwt,
        sessionTokenService: sessionToken,
    }));
    const location = registerService("location", new LocationsService({ logger }));

    return Object.freeze({
        logger,
        cookie,
        jwt,
        user,
        sessionToken,
        auth,
        location,
        
        getService,
    });
}
