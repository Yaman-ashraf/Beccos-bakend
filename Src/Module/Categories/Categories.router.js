import { Router } from "express";
import * as categoriesController from './Categories.controller.js';
import fileUpload, { fileValidation } from "../../Services/multer.js";
import { auth } from "../../Midleware/Auth.js";
import endPoint from "./Categories.endpoint.js";

const router = Router();

router.post('/', auth(endPoint.create), categoriesController.createCategory)

router.get('/', categoriesController.getCategories)
router.get('/active', categoriesController.getActiveCategories)
router.get('/:id', categoriesController.getCategory);
router.delete('/:id', auth(endPoint.delete), categoriesController.deleteCategory);
router.patch('/:id', auth(endPoint.update), categoriesController.updateCategory);
router.get('/similarProduct/:categoryId/:productId', categoriesController.getSimilarProduct);


export default router;