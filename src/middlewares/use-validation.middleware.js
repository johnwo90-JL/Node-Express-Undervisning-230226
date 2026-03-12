import z from "zod";

/**
 * @param {z.ZodObject} schema 
 */
export function useValidation(schema) {
    return async function (req, res, next) {
        try {
            const result = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
                headers: req.headers,
                cookies: req.cookies,
                signedCookies: req.signedCookies,
            });

            req.validated ??= result;
            req.validated = { ...req.validated, ...result };
            console.log(req.validated);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.statusCode = 400;
                error.message = JSON.stringify(error.issues, null, 2);
            }

            next(error);
        }
    }
}
