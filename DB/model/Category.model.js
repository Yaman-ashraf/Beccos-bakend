import mongoose, { Schema, model, types } from 'mongoose'

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
    },
    image: {
        type: Object,
        required: true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,//وينتا انضافت الصورة
}
);
const categoryModel = mongoose.models.Category || model('Category', categorySchema);//cat table
export default categoryModel;