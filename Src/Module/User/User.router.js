import { Router } from "express";
import { auth } from "../../Midleware/Auth.js";
import endPoint from "./User.endpoint.js";
import * as userController from './User.controller.js';
const router = Router();

router.get('/', auth(endPoint.getUsers), userController.getUsers);
router.patch('/:userId',auth(endPoint.updateUser),userController.updateUser)

export default router;