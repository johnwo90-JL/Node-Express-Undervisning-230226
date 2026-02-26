import { users } from "../../store/users.js";
import { CreateUserSchema } from "../../schema/user.schema.js";

export const createUser = (req, res) => {
    const result = CreateUserSchema.parse(req);

    console.log("[LOG] Data:", JSON.stringify(result, null, 4));

    // res.sendStatus(200);
    // return;

    // if (
    //     !req.body
    //     || !req.body.username
    //     || !req.body.email
    //     || !req.body.password
    // ) {
    //     return res.status(400).json({
    //         message: "Missing required fields."
    //     })
    // }

    const {
        username,
        email,
        password
    } = result.body;

    // Finne en bruker i users som matcher med email
    const existingUser = users.find(userObj => userObj.username === username);
    if (existingUser) {
        return res.status(409).json({
            message: "Username already in use!"
        })
    }

    const user = {
        id: users.length + 1, // IKKE BEST PRACTICE
        username,
        email,
        password
    }

    users.push(user);
    
    res.status(201).json({
        message: "User created successfully!",
        data: user
    })
}