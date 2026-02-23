import express from "express";

import { getAllUsers } from "../controllers/getAllUsers.js";
import { createUser } from "../controllers/createUser.js";
import { getUserByID } from "../controllers/getUserByID.js";
import { deleteUser } from "../controllers/deleteUserByID.js";

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
