import sliderModel from "../../../DB/model/Slider.model.js";
import cloudinary from "../../Services/cloudinary.js";

export const createSlider = async (req, res) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path, {
        folder: `${process.env.APP_NAME}/Slider`
    });
    req.body.image = { secure_url, public_id };
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    const slider = await sliderModel.create(req.body);
    return res.status(201).json({ message: "Success", slider });
}

export const getAllSlider = async (req, res) => {
    const sliders = await sliderModel.find({});
    return res.json({ message: "Success", count: sliders.length, sliders });
}

export const getActiveSlider = async (req, res) => {
    const sliders = await sliderModel.find({ status: 'Active' });
    return res.json({ message: "Success", count: sliders.length, sliders });
}

export const deleteSlider = async (req, res) => {
    const slider = await sliderModel.findByIdAndDelete(req.params.imageId);
    if (!slider) {
        return res.status(404).send({ message: "Image not found" });
    }
    //delete image from cloud.
    cloudinary.uploader.destroy(slider.image.public_id);

    return res.status(200).json({ message: "Success" });
}

export const updateSlider = async (req, res) => {
    const { imageId } = req.params;
    let slider = await sliderModel.findById(imageId);
    if (!slider) {
        return res.status(404).json({ message: "Slider not found" });
    }
    //update
    if (req.file) {
        //create a file to a main image of the product:
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            { folder: `${process.env.APP_NAME}/slider` }
        );
        //create a file to a product:
        req.body.image = { secure_url, public_id };
        cloudinary.uploader.destroy(slider.image.public_id);
    }
    //update updatedBy to user who sign in
    req.body.updatedBy = req.user._id;

    slider = await sliderModel.findByIdAndUpdate(imageId, req.body, { new: true });
    return res.status(200).json({ message: "Success", slider });
}