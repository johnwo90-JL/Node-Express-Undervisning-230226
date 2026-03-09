export function useRole(acceptedRoles) {
    return (req, res, next) => {
        const normalizedAcceptedRoles = Array.isArray(acceptedRoles) ? acceptedRoles : [];
        const currentRoles = req.auth?.roles;

        if (!Array.isArray(currentRoles)) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Authentication required.",
            });
        }

        const hasAnyAcceptedRole = normalizedAcceptedRoles.some((role) => currentRoles.includes(role));
        if (!hasAnyAcceptedRole) {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "Forbidden.",
            });
        }

        next();
    }
}
