import { Router } from "express";
import * as categoriesController from './Categories.controller.js';
const router = Router();

router.post('/', categoriesController.createCategory)
router.get('/', categoriesController.getCategories)

export default router;