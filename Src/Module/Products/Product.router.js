import { Router } from "express";
import * as productsController from './Product.controller.js'
import { auth } from "../../Midleware/Auth.js";
import endPoint from "./Product.endpoint.js";
import fileUpload, { fileValidation } from "../../Services/multer.js";

const router = Router();

router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 3 },
]), productsController.createProduct);

router.get('/', productsController.getProducts);
router.get('/active', productsController.getActiveProducts);
router.get('/:id', productsController.getProduct);
export default router;
