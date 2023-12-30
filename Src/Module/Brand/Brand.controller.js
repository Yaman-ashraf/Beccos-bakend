import brandModel from "../../../DB/model/Brand.model.js";
import cloudinary from "../../Services/cloudinary.js";

export const createBrand = async (req, res) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.APP_NAME}/brand` });

    req.body.image = { secure_url, public_id };
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    
    //create brand
    const brand = await brandModel.create(req.body);
    
    return res.status(201).json({ message: "Success", brand });
}

export const getAllBrand = async (req, res) => {
    const brands = await brandModel.find({});
    return res.json({ message: "Success", count: brands.length, brands });
}

export const deleteBrand = async (req, res) => {
    const brands = await brandModel.findByIdAndDelete(req.params.brandId);

    if (!brands) return res.status(404).json({ message: "Brand not found" });

    return res.json({ message: "Success" });
}