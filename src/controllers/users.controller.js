export function createUsersController({ userService, logger }) {
    return {
        async listUsers(req, res, next) {
            try {
                const users = await userService.listUsers();
                res.status(200).json({
                    success: true,
                    data: users,
                });
            } catch (error) {
                next(error);
            }
        },

        async getUserById(req, res, next) {
            try {
                const user = await userService.getByIdOrThrow(req.validated.params.id);
                res.status(200).json({
                    success: true,
                    data: user.toJSON(),
                });
            } catch (error) {
                next(error);
            }
        },

        async deleteUser(req, res, next) {
            try {
                const deletedUser = await userService.deleteById(req.validated.params.id);
                res.status(200).json({
                    success: true,
                    data: deletedUser,
                });
            } catch (error) {
                next(error);
            }
        },

        async updateUserRoles(req, res, next) {
            try {
                const updatedUser = await userService.assignRoles(
                    req.validated.params.id,
                    req.validated.body.roles,
                );

                logger.info("Updated user roles", {
                    requestId: req.requestId,
                    userId: updatedUser.id,
                    roles: updatedUser.roles,
                });

                res.status(200).json({
                    success: true,
                    data: updatedUser,
                });
            } catch (error) {
                next(error);
            }
        },
    };
}
