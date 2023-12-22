import slugify from "slugify";
import categoryModel from "../../../DB/model/Category.model.js";
import productModel from "../../../DB/model/Product.model.js";
import cloudinary from "../../Services/cloudinary.js";
import { pagination } from "../../Services/pagination.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price, discount, finalPrice } = req.body;
        const checkCategory = await categoryModel.findById(req.body.categoryId);
        if (!checkCategory) {
            return res.status(404).json({ message: "Category not Found" });
        }
        //slugify for photo:
        req.body.slug = slugify(name);

        //count price:
        req.body.finalPrice = price - (price * (discount || 0) / 100);

        //create a file to a product:
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.files.image[0].path,
            { folder: `${process.env.APP_NAME}/product/${req.body.name}/image` }
        );

        //create a file to a product:
        req.body.image = { secure_url, public_id }
        req.body.subImages = [];//empty arr
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                file.path,
                { folder: `${process.env.APP_NAME}/product/${req.body.name}/subImages` }
            );
            req.body.subImages.push({ secure_url, public_id });
        }

        //who add&update the product -created&updatedBy-
        req.body.createdBy = req.user._id;
        req.body.updatedBy = req.user._id;
        const product = await productModel.create(req.body);
        return res.status(201).json({ message: "Success", product });

    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.stack });
    }
}

export const getProducts = async (req, res) => {
    try {
        let queryObj = { ...req.query };
        const execQuery = ['page', 'limit', 'size', 'sort', 'search', 'fields'];
        execQuery.map((ele) => {
            delete queryObj[ele];
        });
        queryObj = JSON.stringify(queryObj);//بحول اللي دخلته -عشان يككون البرايس اقل من- لسترينغ
        queryObj = queryObj.replace(/\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g, match => `$${match}`)
        queryObj = JSON.parse(queryObj);//برجعهم 
        const { skip, limit } = pagination(req.query.page, req.query.limit);
        const mongooseQuery = productModel.find(queryObj).skip(skip).limit(limit)
        .populate({
            path: 'categoryId',
        });
        if (req.query.search) {
            mongooseQuery.find({
                name: { $regex: req.query.search, $options: 'i' }
            });
        }

        const sortQuery = req.query.sort?.replaceAll(',', ' ');
        const fieldsQuery = req.query.fields?.replaceAll(',', ' ');
        const products = await mongooseQuery.sort(sortQuery).select(fieldsQuery);

        // const products = await mongooseQuery.sort(req.query.sort?.replaceAll(',', ' ')).select(req.query.fields.replaceAll(',', ' '));
        const counts = await productModel.estimatedDocumentCount();
        return res.status(200).json({
            message: "Success",
            count: products.length, total: counts,
            products
        });

    } catch (erroe) {
        return res.status(500).json({ message: "Error", erroe: erroe.stack })
    }
}

export const getActiveProducts = async (req, res) => {
    try {
        const products = await productModel.find({ status: 'Active' }).populate({
            path: 'categoryId',
        });
        return res.status(200).json({ message: "Success", products });

    } catch (erroe) {
        return res.status(500).json({ message: "Error", erroe: erroe.stack })
    }
}

export const getProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).populate({
            path: 'categoryId',
        });
        return res.status(200).json({ message: "Success", product });

    } catch (erroe) {
        return res.status(500).json({ message: "Error", erroe: erroe.stack })
    }
}