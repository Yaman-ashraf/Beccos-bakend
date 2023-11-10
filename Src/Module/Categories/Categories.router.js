import { Router } from "express";
import * as categoriesController from './Categories.controller.js';
import fileUpload, { fileValidation } from "../../Services/multer.js";
const router = Router();

router.post('/', fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 }
]), categoriesController.createCategory)
router.get('/', categoriesController.getCategories)
router.get('/:id', categoriesController.getCategory);
router.delete('/:id', categoriesController.deleteCategory);

export default router;