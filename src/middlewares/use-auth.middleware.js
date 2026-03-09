import { createHttpError } from "../utils/http-error.js";

function extractBearerToken(req) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || typeof authorizationHeader !== "string") {
        return null;
    }

    const [scheme, token] = authorizationHeader.split(" ");
    if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
        return null;
    }

    return token;
}

function attachAuthContext(req, user, strategy) {
    const userData = user.toJSON();

    req.auth = {
        strategy,
        userId: userData.id,
        email: userData.email,
        roles: Array.isArray(userData.roles) ? userData.roles : [],
        user: userData,
    };
}

export function createAuthMiddlewares({ authService }) {
    const useJwtAuth = async (req, res, next) => {
        try {
            const token = extractBearerToken(req)
                || req.signedCookies?.accessToken
                || req.cookies?.accessToken;

            if (!token) {
                throw createHttpError(401, "Missing access token.");
            }

            const user = await authService.authenticateJwt(token);
            attachAuthContext(req, user, "jwt");
            next();
        } catch (error) {
            next(error);
        }
    };

    const useBasicAuth = async (req, res, next) => {
        try {
            const user = await authService.authenticateBasic(req.headers.authorization);
            attachAuthContext(req, user, "basic");
            next();
        } catch (error) {
            res.set("WWW-Authenticate", 'Basic realm="api"');
            next(error);
        }
    };

    const useAnyAuth = async (req, res, next) => {
        const authorizationHeader = req.headers.authorization;

        if (
            authorizationHeader
            && typeof authorizationHeader === "string"
            && authorizationHeader.toLowerCase().startsWith("basic ")
        ) {
            return useBasicAuth(req, res, next);
        }

        return useJwtAuth(req, res, next);
    };

    return {
        useJwtAuth,
        useBasicAuth,
        useAnyAuth,
    };
}
