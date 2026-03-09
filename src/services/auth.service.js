import { createHttpError } from "../utils/http-error.js";

function parseBasicAuthorizationHeader(header) {
    if (!header || typeof header !== "string") {
        throw createHttpError(401, "Missing Authorization header.");
    }

    const [scheme, encodedCredentials] = header.split(" ");
    if (!scheme || scheme.toLowerCase() !== "basic" || !encodedCredentials) {
        throw createHttpError(401, "Invalid Basic Authorization header.");
    }

    let decodedCredentials = "";
    try {
        decodedCredentials = Buffer.from(encodedCredentials, "base64").toString("utf8");
    } catch {
        throw createHttpError(401, "Invalid Basic Authorization encoding.");
    }

    const separatorIndex = decodedCredentials.indexOf(":");
    if (separatorIndex < 1) {
        throw createHttpError(401, "Invalid Basic Authorization credentials.");
    }

    const identifier = decodedCredentials.slice(0, separatorIndex).trim();
    const password = decodedCredentials.slice(separatorIndex + 1);

    if (!identifier || !password) {
        throw createHttpError(401, "Invalid Basic Authorization credentials.");
    }

    return {
        identifier,
        password,
    };
}

export class AuthService {
    #userService;
    #jwtService;
    #sessionTokenService;

    constructor({ userService, jwtService, sessionTokenService }) {
        this.#userService = userService;
        this.#jwtService = jwtService;
        this.#sessionTokenService = sessionTokenService;
    }

    async register({ name, email, password }) {
        const user = await this.#userService.createUser({
            name,
            email,
            password,
            roles: ["user"],
        });

        return user.toJSON();
    }

    async loginWithJwt({ identifier, password }) {
        const user = await this.#authenticateCredentials(identifier, password);
        return this.#createJwtSession(user);
    }

    async refreshJwtSession(refreshToken) {
        const refreshPayload = this.#jwtService.verifyRefreshToken(refreshToken);
        const user = await this.#userService.findById(refreshPayload.sub);

        if (!user) {
            throw createHttpError(401, "Invalid refresh token.");
        }

        await this.#sessionTokenService.validateRefreshToken({
            userId: user.id,
            token: refreshToken,
        });

        await this.#sessionTokenService.revokeRefreshToken(refreshToken);
        return this.#createJwtSession(user);
    }

    async logoutJwtSession(refreshToken) {
        await this.#sessionTokenService.revokeRefreshToken(refreshToken);
    }

    async authenticateJwt(accessToken) {
        const payload = this.#jwtService.verifyAccessToken(accessToken);
        const user = await this.#userService.findById(payload.sub);

        if (!user) {
            throw createHttpError(401, "Invalid access token.");
        }

        return user;
    }

    async authenticateBasic(authorizationHeader) {
        const { identifier, password } = parseBasicAuthorizationHeader(authorizationHeader);
        return this.#authenticateCredentials(identifier, password);
    }

    async #authenticateCredentials(identifier, password) {
        const user = await this.#userService.findByIdentifier(identifier);
        if (!user) {
            throw createHttpError(401, "Invalid credentials.");
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw createHttpError(401, "Invalid credentials.");
        }

        return user;
    }

    async #createJwtSession(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.roles,
        };

        const accessToken = this.#jwtService.createAccessToken(payload);
        const refreshToken = this.#jwtService.createRefreshToken(payload);

        const accessPayload = this.#jwtService.verifyAccessToken(accessToken);
        const refreshPayload = this.#jwtService.verifyRefreshToken(refreshToken);

        await this.#sessionTokenService.storeRefreshToken({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(refreshPayload.exp * 1000),
        });

        return {
            user: user.toJSON(),
            accessToken,
            refreshToken,
            accessTokenExpiresAt: new Date(accessPayload.exp * 1000),
            refreshTokenExpiresAt: new Date(refreshPayload.exp * 1000),
        };
    }
}
