import express from "express";
import { useRequestId } from "../middlewares/use-request-id.middleware.js";
import { useRole } from "../middlewares/use-role.middleware.js";
import { useValidation } from "../middlewares/use-validation.middleware.js";
import {
    DeleteUserByIdSchema,
    GetUserByIdSchema,
    UpdateUserRolesSchema,
} from "../schema/user.schema.js";

export function createUsersRouter({ usersController, authMiddlewares }) {
    const router = express.Router();

    router.use(useRequestId);

    router.get("/", authMiddlewares.useAnyAuth, useRole(["admin", "superadmin"]), usersController.listUsers);
    router.get("/:id", authMiddlewares.useAnyAuth, useValidation(GetUserByIdSchema), usersController.getUserById);
    router.delete(
        "/:id",
        authMiddlewares.useAnyAuth,
        useRole(["admin", "superadmin"]),
        useValidation(DeleteUserByIdSchema),
        usersController.deleteUser,
    );
    router.patch(
        "/:id/roles",
        authMiddlewares.useJwtAuth,
        useRole(["superadmin"]),
        useValidation(UpdateUserRolesSchema),
        usersController.updateUserRoles,
    );

    return router;
}
