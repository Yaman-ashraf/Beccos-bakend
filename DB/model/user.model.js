import mongoose, { Schema, model, Types } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: Object,
        // required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        // required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin'],
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Not_Active'],
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Female', 'Male'],
    }
}, {
    timestamps: true,//وينتا انضافت الصورة
}
);
const userModel = mongoose.models.User || model('User', userSchema);//cat table
export default userModel;