import mongoose, { Schema, model, Types } from 'mongoose'

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        // unique: true,
    },
    slug: {
        type: String,
        required: true,
    },
    image: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Not_Active'],
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,//وينتا انضافت الصورة
}
);
const categoryModel = mongoose.models.Category || model('Category', categorySchema);//cat table
export default categoryModel;