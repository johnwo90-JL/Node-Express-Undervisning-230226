import z from "zod";
import { UserRoles } from "../constants/roles.constants.js";

const UserRoleSchema = z.enum(UserRoles);
const NameSchema = z.string().trim().min(3).max(64);

export const CreateUserSchema = z.object({
    body: z.object({
        username: NameSchema.optional(),
        name: NameSchema.optional(),
        email: z.email().transform((value) => value.trim().toLowerCase()),
        password: z.string().min(8),
    }).superRefine((body, context) => {
        if (!body.username && !body.name) {
            context.addIssue({
                code: "custom",
                path: ["name"],
                message: "Either name or username is required.",
            });
        }
    }).transform((body) => ({
        name: body.name ?? body.username,
        email: body.email,
        password: body.password,
    })),
});


export const GetUserByIdSchema = z.object({
    params: z.object({
        id: z.uuidv4(),
    }),
});
export const DeleteUserByIdSchema = GetUserByIdSchema;

export const UpdateUserRolesSchema = z.object({
    params: z.object({
        id: z.uuidv4(),
    }),
    body: z.object({
        roles: z.array(UserRoleSchema).min(1),
    }),
});

// Eksempel - Validering, transformering
// const ValidateString = z.string().min(5).max(64).toUpperCase();

// console.log(ValidateString.parse("hello!"));
