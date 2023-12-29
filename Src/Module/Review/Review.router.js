import { Router } from "express";
import { auth } from "../../Midleware/Auth.js";
import endPoint from "./Review.endpoint.js";
import * as reviewController from './Review.controller.js';
const router = Router({ mergeParams: true });

router.post('/', auth(endPoint.create), reviewController.create);
export default router;