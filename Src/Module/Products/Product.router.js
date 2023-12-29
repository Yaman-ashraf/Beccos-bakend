import { Router } from "express";
import * as productsController from './Product.controller.js'
import { auth } from "../../Midleware/Auth.js";
import endPoint from "./Product.endpoint.js";
import fileUpload, { fileValidation } from "../../Services/multer.js";
import reviewRouter from '../Review/Review.router.js';

const router = Router();

router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 3 },
]), productsController.createProduct);

router.get('/', productsController.getProducts);
router.get('/active', productsController.getActiveProducts);
router.get('/:id', productsController.getProduct);
router.delete('/:id', auth(endPoint.delete), productsController.deleteProduct);

//merge paramse; 
router.use('/:productId/review', reviewRouter);

export default router;
