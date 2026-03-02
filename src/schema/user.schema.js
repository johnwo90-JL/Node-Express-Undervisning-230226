import z from "zod";

export const CreateUserSchema = z.object({
    body: z.object({
        username: z.string().min(3),
        email: z.email(),
        password: z.string().min(8),
    }),
});


// Eksempel - Validering, transformering
// const ValidateString = z.string().min(5).max(64).toUpperCase();

// console.log(ValidateString.parse("hello!"));