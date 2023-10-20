import { Router } from "express";
import * as categoriesController from './Categories.controller.js';

const router = Router();

router.get('/', categoriesController.getCategories)

export default router;