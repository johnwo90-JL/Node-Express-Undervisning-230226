export function createAuthController({ authService, cookieService, env }) {
    const isProduction = env === "production";

    const makeCookieOptions = (expiresAt) => ({
        secure: isProduction,
        sameSite: "lax",
        maxAge: Math.max(0, expiresAt.getTime() - Date.now()),
    });

    const setAuthCookies = (response, session) => {
        const accessTokenCookie = cookieService.createSignedCookie(
            "accessToken",
            session.accessToken,
            makeCookieOptions(session.accessTokenExpiresAt),
        );

        const refreshTokenCookie = cookieService.createSignedCookie(
            "refreshToken",
            session.refreshToken,
            makeCookieOptions(session.refreshTokenExpiresAt),
        );

        response.cookie(accessTokenCookie.name, accessTokenCookie.value, accessTokenCookie.options);
        response.cookie(refreshTokenCookie.name, refreshTokenCookie.value, refreshTokenCookie.options);
    };

    const clearAuthCookies = (response) => {
        const clearOptions = {
            signed: true,
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
        };

        response.clearCookie("accessToken", clearOptions);
        response.clearCookie("refreshToken", clearOptions);
    };

    return {
        async register(req, res, next) {
            try {
                const user = await authService.register(req.validated.body);
                res.status(201).json({
                    success: true,
                    data: user,
                });
            } catch (error) {
                next(error);
            }
        },

        async loginJwt(req, res, next) {
            try {
                const session = await authService.loginWithJwt(req.validated.body);
                setAuthCookies(res, session);

                res.status(200).json({
                    success: true,
                    data: {
                        strategy: "jwt",
                        user: session.user,
                    },
                });
            } catch (error) {
                next(error);
            }
        },

        async refreshJwt(req, res, next) {
            try {
                const session = await authService.refreshJwtSession(req.validated.signedCookies.refreshToken);
                setAuthCookies(res, session);

                res.status(200).json({
                    success: true,
                    data: {
                        strategy: "jwt",
                        user: session.user,
                    },
                });
            } catch (error) {
                next(error);
            }
        },

        async logoutJwt(req, res, next) {
            try {
                await authService.logoutJwtSession(req.signedCookies?.refreshToken);
                clearAuthCookies(res);
                res.sendStatus(204);
            } catch (error) {
                next(error);
            }
        },

        me(req, res) {
            res.status(200).json({
                success: true,
                data: {
                    strategy: req.auth.strategy,
                    user: req.auth.user,
                },
            });
        },
    };
}
