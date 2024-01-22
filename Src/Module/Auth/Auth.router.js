import { Router } from 'express';
import * as AuthController from './Auth.controller.js';
const router = Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.get('/:token', AuthController.confirmEmail);
router.patch('/sendCode', AuthController.sendCode);
router.patch('/forgetPassword', AuthController.forgetPassword);

export default router;