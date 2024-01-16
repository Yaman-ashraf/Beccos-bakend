import { Router } from "express";
import * as productsController from './Product.controller.js'
import { auth } from "../../Midleware/Auth.js";
import endPoint from "./Product.endpoint.js";
import fileUpload, { fileValidation } from "../../Services/multer.js";
import reviewRouter from '../Review/Review.router.js';

const router = Router();

//merge paramse; 
router.use('/:productId/review', reviewRouter);
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 3 },
]), productsController.createProduct);

router.get('/active', productsController.getActiveProducts);
router.get('/:id', productsController.getProduct);
router.get('/', auth(endPoint.getAll), productsController.getProducts);
router.put('/:productId', auth(endPoint.update), fileUpload(fileValidation.image).fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 3 },
]), productsController.updateProducts);
router.delete('/:productId', auth(endPoint.delete), productsController.deleteProduct);


export default router;