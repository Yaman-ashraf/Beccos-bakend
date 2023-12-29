import slugify from "slugify";
import categoryModel from "../../../DB/model/Category.model.js";
import cloudinary from "../../Services/cloudinary.js";
import productModel from "../../../DB/model/Product.model.js";

export const createCategory = async (req, res) => {
    const name = req.body.name.toLowerCase();

    const slug = slugify(name);

    const category = await categoryModel.create({
        name, slug, createdBy: req.user._id, updatedBy: req.user._id
    });

    return res.status(201).json({ message: "SUCCESS", category });
}

export const getCategories = async (req, res) => {
    const categories = await categoryModel.find().populate('products'); return res.status(200).json({ message: "Success", categories });
}

export const getActiveCategories = async (req, res) => {
    const categories = await categoryModel.find({ status: 'Active' }).populate('products'); return res.status(200).json({ message: "Success", categories });
}

export const getCategory = async (req, res) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id).populate('products'); return res.status(200).json({ message: "Success", category });

}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
        return res.status(404).json({ message: "Not Found" });
    }
    // await cloudinary.uploader.destroy(category.image.public_id);
    await categoryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Success" });
}

export const getSimilarProduct = async (req, res) => {
    const { categoryId, productId } = req.params;
    const products = await productModel.find({ categoryId, _id: { $ne: productId } }).limit(10);
    return res.json({ message: "Success", products });
}