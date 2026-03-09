import express from "express";
import { useRequestId } from "../middlewares/use-request-id.middleware.js";
import { useValidation } from "../middlewares/use-validation.middleware.js";
import { JwtLoginSchema, RefreshTokenSchema } from "../schema/auth.schema.js";
import { CreateUserSchema } from "../schema/user.schema.js";

export function createAuthRouter({ authController, authMiddlewares }) {
    const router = express.Router();

    router.use(useRequestId);

    router.post("/register", useValidation(CreateUserSchema), authController.register);
    router.post("/login/jwt", useValidation(JwtLoginSchema), authController.loginJwt);
    router.post("/refresh", useValidation(RefreshTokenSchema), authController.refreshJwt);
    router.post("/logout", authController.logoutJwt);

    router.get("/me", authMiddlewares.useJwtAuth, authController.me);
    router.get("/basic/me", authMiddlewares.useBasicAuth, authController.me);

    return router;
}
