import userModel from "../../../DB/model/user.model.js";
import { pagination } from "../../Services/pagination.js";

export const getUsers = async (req, res) => {

    let queryObj = { ...req.query };
    const execQuery = ['page', 'limit', 'size', 'sort'];
    execQuery.map((ele) => {
        delete queryObj[ele];
    });

    //count of admin just or admin just
    const countQuery = await userModel.find(queryObj);

    queryObj = JSON.stringify(queryObj);//بحول اللي دخلته -عشان يككون البرايس اقل من- لسترينغ
    queryObj = queryObj.replace(/\b(in|nin|eq|neq)\b/g,
        match => `$${match}`)
    queryObj = JSON.parse(queryObj);//برجعهم 

    const users = await userModel.find(queryObj).skip(skip).limit(limit).sort(req.query.sort?.replaceAll(',', ' '));
    const counts = await userModel.estimatedDocumentCount();
    return res.status(200).json({ message: "Success", count: users.length, total: countQuery.length, users });
}

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        //if user exist?
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //change email, 
        if (await userModel.findOne({ email: req.body.email, _id: { $ne: userId } })) {
            return res.status(400).json({ message: "Email already is use" });
        }

        //change name, 
        if (await userModel.findOne({ name: req.body.name, _id: { $ne: userId } })) {
            return res.status(400).json({ message: "Name already is use" });
        }

        //change phone, 
        if (await userModel.findOne({ phone: req.body.phone, _id: { $ne: userId } })) {
            return res.status(400).json({ message: "Phone already is use" });
        }

        //update the user data
        const newUser = await userModel.findByIdAndUpdate(userId, req.body, { new: true });
        res.status(200).json({ message: "Success", user: newUser });
    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.stack });
    }
}

export const getUserData = async (req, res) => {
    const user = await userModel.findById(req.user._id);
    return res.status(200).json({ message: "Success", user });
}

export const getUser = async (req, res) => {
    const user = await userModel.findById(req.params.userId); //from url
    return res.status(200).json({ message: "Success", user });
}