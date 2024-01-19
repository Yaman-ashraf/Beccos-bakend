import { Router } from "express";
import * as BrandController from './Brand.controller.js';
import { auth } from '../../Midleware/Auth.js';
import endPoint from './Brand.endpoint.js';
import fileUpload, { fileValidation } from "../../Services/multer.js";

const router = Router();

router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), BrandController.createBrand);
router.get('/', BrandController.getAllBrand);
router.get('/details/:id', BrandController.getBrand);
router.get('/:brandId', BrandController.getProducts);
router.put('/:brandId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'), BrandController.updateBrand);
router.delete('/:brandId', auth(endPoint.delete), BrandController.deleteBrand);


export default router;