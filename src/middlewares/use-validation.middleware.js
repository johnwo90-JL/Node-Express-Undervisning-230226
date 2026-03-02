import z from "zod";

// (req, res, next) = { 
//      req => request
//      res => response
//      next => next();
// }

/**
 * @param {z.ZodObject} schema 
 */
export function useValidation(schema) {
    return async function (req, res, next) {
        const result = await schema.parseAsync(req); // Valider data
        console.log("ParseResult:",result);
    
        // client -> request -> middleware -> handler
                                        // -> 400
                                        // -> 500
                                        // -> ...
        req.validated = result;

        next();
    }
}


 // router -> /users -> router.get('/', useValidation(schema), getAllUsers)

 // useValidation(schema) -> function (req, res, next)