import slugify from "slugify";
import categoryModel from "../../../DB/model/Category.model.js";

export const createCategory = async (req, res) => {
    const name = req.body.name.toLowerCase();

    const slug = slugify(name);

    const category = await categoryModel.create({ name, slug });
    return res.status(201).json({ message: "SUCCESS", category });
}
export const getCategories = (req, res) => {
    return res.json({ message: "cat" });
}
