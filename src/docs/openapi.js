import z from "zod";
import { createDocument } from "zod-openapi";
import { UserRoles } from "../constants/roles.constants.js";
import { JwtLoginSchema, RefreshTokenSchema } from "../schema/auth.schema.js";
import { GetLocationById } from "../schema/location.schema.js";
import {
    CreateUserSchema,
    DeleteUserByIdSchema,
    GetUserByIdSchema,
    UpdateUserRolesSchema,
} from "../schema/user.schema.js";

const UserRoleSchema = z.enum(UserRoles).meta({
    id: "UserRole",
    description: "Role assigned to a user.",
    example: "user",
});

const UserSchema = z.object({
    id: z.uuidv4().meta({
        description: "User ID",
        example: "5d0f4ee3-e0f5-4f32-b4d2-4ca245ca6d95",
    }),
    name: z.string().meta({
        description: "Display name",
        example: "Alice",
    }),
    email: z.email().meta({
        description: "User email",
        example: "alice@example.com",
    }),
    roles: z.array(UserRoleSchema),
    createdAt: z.string().datetime().meta({
        description: "Creation timestamp",
        example: "2026-01-01T12:00:00.000Z",
    }),
    updatedAt: z.string().datetime().meta({
        description: "Last update timestamp",
        example: "2026-01-01T12:00:00.000Z",
    }),
}).meta({
    id: "User",
    description: "User resource returned by the API.",
});

const LocationSchema = z.object({
    id: z.uuidv4().meta({
        description: "Location ID",
        example: "06b4af0f-e4e2-4a65-b2f3-f6f2f9372cc6",
    }),
    latitude: z.number().meta({
        example: 61.636862336301796,
    }),
    longitude: z.number().meta({
        example: 8.31241776902956,
    }),
    label: z.string().meta({
        example: "Galdhøpiggen",
    }),
    description: z.string().meta({
        example: "2465,53 m.o.h. (Jævlig høyt fjell!)",
    }),
    difficulty: z.number().meta({
        example: 5,
        description: "",
    }).min(1).max(5),
    createdAt: z.string().datetime().meta({
        example: "2026-01-01T12:00:00.000Z",
    }),
    updatedAt: z.string().datetime().meta({
        example: "2026-01-01T12:00:00.000Z",
    }),
}).meta({
    id: "Location",
});

const ErrorResponseSchema = z.object({
    success: z.literal(false),
    statusCode: z.int().meta({
        example: 400,
    }),
    message: z.string().meta({
        example: "Bad Request",
    }),
}).meta({
    id: "ErrorResponse",
});

const AuthMeResponseSchema = z.object({
    success: z.literal(true),
    data: z.object({
        strategy: z.enum(["jwt", "basic"]).meta({
            example: "jwt",
        }),
        user: UserSchema,
    }),
}).meta({
    id: "AuthMeResponse",
});

const JwtSessionResponseSchema = z.object({
    success: z.literal(true),
    data: z.object({
        strategy: z.literal("jwt"),
        user: UserSchema,
    }),
}).meta({
    id: "JwtSessionResponse",
});

const healthResponseSchema = z.object({
    success: z.literal(true),
    message: z.literal("OK"),
});

const wrapSuccessData = (schema) => z.object({
    success: z.literal(true),
    data: schema,
});

const jwtSecurity = [
    { bearerAuth: [] },
    { accessTokenCookie: [] },
];

const anyAuthSecurity = [
    ...jwtSecurity,
    { basicAuth: [] },
];

export const openApiDocument = createDocument({
    openapi: "3.1.0",
    info: {
        title: "Node Express Undervisning API",
        version: "1.0.0",
        description: "API documentation generated from Zod schemas with zod-openapi.",
    },
    tags: [
        { name: "System" },
        { name: "Auth" },
        { name: "Users" },
        { name: "Locations" },
    ],
    components: {
        securitySchemes: {
            basicAuth: {
                type: "http",
                scheme: "basic",
                description: "HTTP Basic authentication.",
            },
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "JWT bearer token in Authorization header.",
            },
            accessTokenCookie: {
                type: "apiKey",
                in: "cookie",
                name: "accessToken",
                description: "Signed access token cookie.",
            },
        },
    },
    paths: {
        "/": {
            get: {
                operationId: "health",
                tags: ["System"],
                responses: {
                    200: {
                        description: "API health check.",
                        content: {
                            "application/json": {
                                schema: healthResponseSchema,
                            },
                        },
                    },
                },
            },
        },
        "/auth/register": {
            post: {
                operationId: "register",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: CreateUserSchema.shape.body,
                        },
                    },
                },
                responses: {
                    201: {
                        description: "User registered.",
                        content: {
                            "application/json": {
                                schema: wrapSuccessData(UserSchema),
                            },
                        },
                    },
                    400: {
                        description: "Validation error.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                    409: {
                        description: "Email already exists.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                },
            },
        },
        "/auth/login/jwt": {
            post: {
                operationId: "loginJwt",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: JwtLoginSchema.shape.body,
                        },
                    },
                },
                responses: {
                    200: {
                        description: "JWT session created.",
                        content: {
                            "application/json": {
                                schema: JwtSessionResponseSchema,
                            },
                        },
                    },
                    401: {
                        description: "Invalid credentials.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                },
            },
        },
        "/auth/refresh": {
            post: {
                operationId: "refreshJwt",
                tags: ["Auth"],
                requestParams: {
                    cookie: RefreshTokenSchema.shape.signedCookies,
                },
                responses: {
                    200: {
                        description: "JWT session refreshed.",
                        content: {
                            "application/json": {
                                schema: JwtSessionResponseSchema,
                            },
                        },
                    },
                    401: {
                        description: "Invalid refresh token.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                },
            },
        },
        "/auth/logout": {
            post: {
                operationId: "logoutJwt",
                tags: ["Auth"],
                responses: {
                    204: {
                        description: "JWT session revoked.",
                    },
                },
            },
        },
        "/auth/me": {
            get: {
                operationId: "meJwt",
                tags: ["Auth"],
                security: jwtSecurity,
                responses: {
                    200: {
                        description: "Authenticated user context.",
                        content: {
                            "application/json": {
                                schema: AuthMeResponseSchema,
                            },
                        },
                    },
                    401: {
                        description: "Missing or invalid access token.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                },
            },
        },
        "/auth/basic/me": {
            get: {
                operationId: "meBasic",
                tags: ["Auth"],
                security: [{ basicAuth: [] }],
                responses: {
                    200: {
                        description: "Authenticated user context with Basic auth.",
                        content: {
                            "application/json": {
                                schema: AuthMeResponseSchema,
                            },
                        },
                    },
                    401: {
                        description: "Missing or invalid basic credentials.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                },
            },
        },
        "/users": {
            get: {
                operationId: "listUsers",
                tags: ["Users"],
                security: anyAuthSecurity,
                responses: {
                    200: {
                        description: "List users.",
                        content: {
                            "application/json": {
                                schema: wrapSuccessData(z.array(UserSchema)),
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                    403: {
                        description: "Forbidden.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                },
            },
        },
        "/users/{id}": {
            get: {
                operationId: "getUserById",
                tags: ["Users"],
                security: anyAuthSecurity,
                requestParams: {
                    path: GetUserByIdSchema.shape.params,
                },
                responses: {
                    200: {
                        description: "Get user by ID.",
                        content: {
                            "application/json": {
                                schema: wrapSuccessData(UserSchema),
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                    404: {
                        description: "User not found.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                },
            },
            delete: {
                operationId: "deleteUser",
                tags: ["Users"],
                security: anyAuthSecurity,
                requestParams: {
                    path: DeleteUserByIdSchema.shape.params,
                },
                responses: {
                    200: {
                        description: "User deleted.",
                        content: {
                            "application/json": {
                                schema: wrapSuccessData(UserSchema),
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                    403: {
                        description: "Forbidden.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                    404: {
                        description: "User not found.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                },
            },
        },
        "/users/{id}/roles": {
            patch: {
                operationId: "updateUserRoles",
                tags: ["Users"],
                security: jwtSecurity,
                requestParams: {
                    path: UpdateUserRolesSchema.shape.params,
                },
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: UpdateUserRolesSchema.shape.body,
                        },
                    },
                },
                responses: {
                    200: {
                        description: "User roles updated.",
                        content: {
                            "application/json": {
                                schema: wrapSuccessData(UserSchema),
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                    403: {
                        description: "Forbidden.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                    404: {
                        description: "User not found.",
                        content: {
                            "application/json": {
                                schema: ErrorResponseSchema,
                            },
                        },
                    },
                },
            },
        },
        "/locations/{id}": {
            get: {
                operationId: "getLocationById",
                tags: ["Locations"],
                requestParams: {
                    path: GetLocationById.shape.params,
                },
                responses: {
                    200: {
                        description: "Location found.",
                        content: {
                            "application/json": {
                                schema: LocationSchema,
                            },
                        },
                    },
                    404: {
                        description: "Location not found.",
                    },
                },
            },
        },
    },
});
