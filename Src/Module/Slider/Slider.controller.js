import sliderModel from "../../../DB/model/Slider.model.js";
import cloudinary from "../../Services/cloudinary.js";

export const createSlider = async (req, res) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/Slider` });
    req.body.image = { secure_url, public_id };
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    const slider = await sliderModel.create(req.body);
    return res.status(201).json({ message: "Success", slider });
}

export const getAllSlider = async (req, res) => {
    const sliders = await sliderModel.find({});
    return res.json({ message: "Success", count: sliders.length ,sliders });
}
export const getActiveSlider = async (req, res) => {
    const sliders = await sliderModel.find({ status: 'Active' });
    return res.json({ message: "Success", count: sliders.length ,sliders });
}