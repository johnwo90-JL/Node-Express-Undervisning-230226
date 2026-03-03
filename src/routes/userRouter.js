import express from "express";

import { getAllUsers } from "../controllers/user-controller/getAllUsers.js";
import { createUser } from "../controllers/user-controller/createUser.js";
import { getUserByID } from "../controllers/user-controller/getUserByID.js";
import { deleteUser } from "../controllers/user-controller/deleteUserByID.js";
import { useRequestId } from "../middlewares/use-request-id.middleware.js";
import { useValidation } from "../middlewares/use-validation.middleware.js";
import { CreateUserSchema, DeleteUserByIdSchema, GetUserByIdSchema } from "../schema/user.schema.js";

const router = express.Router()

router.use(useRequestId);

/* ENDEPUNKTER:
getAllUsers: localhost:8000/users/
createUser: localhost:8000/users/
getUserByID: localhost:8000/users/1
*/
router.get('/', getAllUsers);
router.get('/:id', useValidation(GetUserByIdSchema), getUserByID);
router.post('/', useValidation(CreateUserSchema), createUser);

// DELETE ENDEPUNKT
router.delete('/:id', useValidation(DeleteUserByIdSchema), deleteUser)
export default router;
