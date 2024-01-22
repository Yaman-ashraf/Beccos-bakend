import brandModel from "../../../DB/model/Brand.model.js";
import productModel from "../../../DB/model/Product.model.js";
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

export const updateBrand = async (req, res) => {
    const { brandId } = req.params;
    let brand = await brandModel.findById(brandId);
    if (!brand) {
        return res.status(404).json({ message: "Slider not found" });
    }

    //change name just
    if (req.body.name) {
        brand.name = req.body.name;
    }

    //update image
    if (req.file) {
        //create a file to a main image of the product:
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            { folder: `${process.env.APP_NAME}/brand` }
        );

        //create a file to a product:
        cloudinary.uploader.destroy(brand.image.public_id);
        brand.image = { secure_url, public_id };
    }

    //update updatedBy to user who sign in
    req.body.updatedBy = req.user._id;

    brand = await brand.save();
    return res.status(200).json({ message: "Success", brand });
}

export const getProducts = async (req, res) => {
    const { brandId } = req.params;
    const products = await productModel.find({ brandId });

    return res.status(200).json({ message: "Success", products });
}