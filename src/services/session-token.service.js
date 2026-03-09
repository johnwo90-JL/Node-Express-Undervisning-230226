import { createHash } from "node:crypto";
import { SessionToken } from "../models/session-token.model.js";
import { createHttpError } from "../utils/http-error.js";

export class SessionTokenService {
    async storeRefreshToken({ userId, token, expiresAt }) {
        return SessionToken.create({
            userId,
            tokenHash: this.#hashToken(token),
            expiresAt,
        });
    }

    async validateRefreshToken({ userId, token }) {
        const sessionToken = await SessionToken.findOne({
            where: {
                userId,
                tokenHash: this.#hashToken(token),
                revokedAt: null,
            },
        });

        if (!sessionToken) {
            throw createHttpError(401, "Invalid refresh token.");
        }

        if (new Date(sessionToken.expiresAt).getTime() <= Date.now()) {
            await sessionToken.update({ revokedAt: new Date() });
            throw createHttpError(401, "Refresh token has expired.");
        }

        return sessionToken;
    }

    async revokeRefreshToken(token) {
        if (!token) {
            return false;
        }

        const [updatedRows] = await SessionToken.update({
            revokedAt: new Date(),
        }, {
            where: {
                tokenHash: this.#hashToken(token),
                revokedAt: null,
            },
        });

        return updatedRows > 0;
    }

    #hashToken(token) {
        return createHash("sha256").update(token).digest("hex");
    }
}
