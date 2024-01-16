import brandModel from "../../../DB/model/Brand.model.js";
import sliderModel from "../../../DB/model/Slider.model.js";
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

export const getBrand = async (req, res) => {
    const brand = await brandModel.findById(req.params.id);
    if (!brand)
        return res.status(404).json({ message: ' Brand not Found' });

    return res.status(200).json({ message: "Success", brand });
}