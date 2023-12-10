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
    // categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,//وينتا انضافت الصورة
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

categorySchema.virtual('products', {
    localField: 'categoryId',
    foreignField: '_id',
    ref: 'Product',
})

const categoryModel = mongoose.models.Category || model('Category', categorySchema);//cat table

export default categoryModel;