import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcrypt';
import { sendEmail } from '../../Services/email.js'
import jwt from 'jsonwebtoken';
import { customAlphabet } from "nanoid";

export const signup = async (req, res) => {
    try {
        const { name, email, password, role = 'User' } = req.body;

        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUND));

        const createUser = await userModel.create({ name, email, password: hashedPassword, role });

        if (!createUser) {
            return res.status(400).json({ message: "Error while creating user" });
        }

        const token = jwt.sign({ email }, process.env.SIGNUPTOKEN);
        const link = `${req.protocol}://${req.headers.host}/auth/${token}`
        await sendEmail(email, "Confirm Email", `<a href="${link}">Confirm</a>`);

        return res.status(201).json({ message: "Success", createUser });
    } catch (error) {
        return res.status(500).json({ message: "Catch an error", error: error.stack });
    }
}

export const confirmEmail = async (req, res) => {
    const { token } = req.params;
    //decode password
    const decoded = jwt.verify(token, process.env.SIGNUPTOKEN);

    if (!decoded) {
        return res.status(400).json({ message: "Invalid token" });
    }

    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmEmail: false }, { confirmEmail: true });
    if (!user) {
        return res.status(400).json({ message: "Invalid confirm email" });
    }
    return res.status(200).json({ message: "Success" });
}

export const signin = async (req, res) => {
    const { email, password } = req.body;

    //check email is exists?
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Invalid data" });
    }

    //check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(404).json({ message: "Invalid data" });
    }

    //check confirmEmail
    if (!user.confirmEmail) {
        return res.status(404).json({ message: "Please confirm your E-mail" });
    }

    const token = jwt.sign({ id: user._id, status: user.status, role: user.role }, process.env.LOGINSECRET)

    return res.status(200).json({ message: "Success", token });
}

export const sendCode = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const nanoid = customAlphabet('1234567890abcdef', 4);
    const code = nanoid();

    user.sendCode = code;
    await user.save();

    const html = `<h2>Code is ${code}</h2>`;
    await sendEmail(email, "Reset Password", html);
    return res.status(200).json({ message: 'Success', user });
}
export const forgetPassword = async (req, res) => {
    const { email, code, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.sendCode != code) {
        return res.status(400).json({ message: "Invalid Code" });
    }
    user.password = await bcrypt.hash(password, parseInt(process.env.LOGINSECRET));
    user.sendCode = null;
    await user.save();
    return res.status(200).json({ message: "Success" });
}