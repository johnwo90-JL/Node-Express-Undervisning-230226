import express from "express";

import { getAllUsers } from "../controllers/user-controller/getAllUsers.js";
import { createUser } from "../controllers/user-controller/createUser.js";
import { getUserByID } from "../controllers/user-controller/getUserByID.js";
import { deleteUser } from "../controllers/user-controller/deleteUserByID.js";

const router = express.Router()

/* ENDEPUNKTER:
getAllUsers: localhost:8000/users/
createUser: localhost:8000/users/
getUserByID: localhost:8000/users/1
*/
router.get('/', getAllUsers)
router.get('/:id', getUserByID)
router.post('/', createUser)

// DELETE ENDEPUNKT
router.delete('/:id', deleteUser)
export default router;
