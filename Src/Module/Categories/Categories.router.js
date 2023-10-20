import { Router } from "express";
const router = Router();
import * as categoriesController from './Categories.controller.js';

router.get('/', categoriesController.getCategories)

export default router;