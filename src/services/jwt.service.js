import jwt from "jsonwebtoken";
import z from "zod";
import { createHttpError } from "../utils/http-error.js";

const JwtServiceConfigSchema = z.object({
    secret: z.string().min(16),
    accessTokenExpiry: z.string().min(1),
    refreshTokenExpiry: z.string().min(1),
});

export class JwtService {
    #secret;
    #accessTokenExpiry;
    #refreshTokenExpiry;

    constructor(config) {
        const parsedConfig = JwtServiceConfigSchema.parse(config);

        this.#secret = parsedConfig.secret;
        this.#accessTokenExpiry = parsedConfig.accessTokenExpiry;
        this.#refreshTokenExpiry = parsedConfig.refreshTokenExpiry;
    }

    createAccessToken(payload) {
        return jwt.sign({
            ...payload,
            tokenType: "access",
        }, this.#secret, {
            expiresIn: this.#accessTokenExpiry,
        });
    }

    createRefreshToken(payload) {
        return jwt.sign({
            ...payload,
            tokenType: "refresh",
        }, this.#secret, {
            expiresIn: this.#refreshTokenExpiry,
        });
    }

    verifyAccessToken(token) {
        return this.#verifyToken(token, "access");
    }

    verifyRefreshToken(token) {
        return this.#verifyToken(token, "refresh");
    }

    #verifyToken(token, expectedType) {
        try {
            const payload = jwt.verify(token, this.#secret);

            if (payload.tokenType !== expectedType) {
                throw createHttpError(401, `Invalid ${expectedType} token.`);
            }

            return payload;
        } catch (error) {
            if (error?.statusCode) {
                throw error;
            }

            throw createHttpError(401, "Invalid or expired token.");
        }
    }
}
