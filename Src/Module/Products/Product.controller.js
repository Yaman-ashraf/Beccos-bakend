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
        queryObj = JSON.stringify(queryObj);//بحول اللي دخلته -عشان يكون البرايس اقل من- لسترينغ
        queryObj = queryObj.replace(
            /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
            match => `$${match}`
        );
        queryObj = JSON.parse(queryObj);//برجعهم 

        const mongooseQuery = productModel.find(queryObj);

        if (req.query.search) {
            mongooseQuery.find({
                name: { $regex: req.query.search, $options: 'i' }
            });
        }

        const products = await mongooseQuery.sort(req.query.sort?.replaceAll(',', ' ')).
            select(req.query.fields?.replaceAll(',', ' ')).populate(
                'reviews',
            );

        const counts = await productModel.estimatedDocumentCount();

        //rating avg
        for (let i = 0; i < products.length; i++) {
            let calcRating = 0;
            for (let j = 0; j < products[i].reviews.length; j++) {
                calcRating += products[i].reviews[j].rating;
            }
            let avgRating = calcRating / products[i].reviews.length;
            const product = products[i].toObject();
            product.avgRating = avgRating;
            products[i] = product;
        }

        return res.status(200).json({
            message: "Success",
            count: products.length, total: counts,
            products
        });

    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.stack })
    }
}

export const getProduct = async (req, res) => {
    try {
        let product = await productModel.findById(req.params.id).populate([{
            path: 'categoryId',
        }, {
            path: 'reviews'
        }]);

        //calc rating
        let calcRating = 0;
        product = product.toObject();
        for (let i = 0; i < product.reviews.length; i++) {
            calcRating += product.reviews[i].rating;
        }

        let avgRating = 0;
        if (product.reviews.length > 0) {
            avgRating = calcRating / product.reviews.length;
            product.avgRating = avgRating;
        }

        return res.status(200).json({ message: "Success", product });

    } catch (erroe) {
        return res.status(500).json({ message: "Error", erroe: erroe.stack })
    }
}

export const getActiveProducts = async (req, res) => {
    try {
        let queryObj = { ...req.query };
        let { skip, limit } = pagination(req.query.page, req.query.limit);
        const execQuery = ["page", "size", "limit", "sort", "search"];
        execQuery.map((ele) => {
            delete queryObj[ele];
        });
        queryObj = JSON.stringify(queryObj);
        queryObj = queryObj.replace(
            /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
            (match) => ` $${match}`
        );
        queryObj = JSON.parse(queryObj);

        const mongooseQuery = productModel.find(queryObj).limit(limit).skip(skip);

        if (req.query.search) {
            mongooseQuery.find({
                name: { $regex: req.query.search, $options: "i" },
            });
        }
        const products = await mongooseQuery.find({ status: 'Active' })
            .sort(req.query.sort?.replaceAll(",", " "))
            .select(req.query.fields?.replaceAll(",", " "))
            .populate({
                path: "reviews",
            });
        const counts = await productModel.estimatedDocumentCount();

        for (let i = 0; i < products.length; i++) {
            let calcRating = 0;
            for (let j = 0; j < products[i].reviews.length; j++) {
                calcRating += products[i].reviews[j].rating;
            }

            let avgRating = calcRating / products[i].reviews.length;
            const product = products[i].toObject();
            product.avgRating = avgRating;
            products[i] = product;
        }

        return res
            .status(200)
            .json({
                message: "success",
                count: products.length,
                total: counts,
                products,
            });
    } catch (error) {
        return res.status(500).json({ message: "error", error: error.stack });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        // Check if the product exists
        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Perform the deletion
        await productModel.findByIdAndDelete(productId);

        await cloudinary.uploader.destroy(existingProduct.image.public_id);
        for (const subImage of existingProduct.subImages) {
            await cloudinary.uploader.destroy(subImage.public_id);
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.stack });
    }
}