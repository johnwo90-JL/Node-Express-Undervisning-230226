import z from "zod";

export const CreateUserSchema = z.object({
    body: z.object({
        username: z.string().min(3),
        email: z.email(),
        password: z.string().min(8),
    }),
});


export const GetUserByIdSchema = z.object({
    params: z.object({
        id: z.uuidv4(),
    }),
});
export const DeleteUserByIdSchema = GetUserByIdSchema;

// Eksempel - Validering, transformering
// const ValidateString = z.string().min(5).max(64).toUpperCase();

// console.log(ValidateString.parse("hello!"));