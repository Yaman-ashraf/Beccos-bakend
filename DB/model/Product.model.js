import mongoose, { Schema, model, Types } from 'mongoose'

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    finalPrice: {
        type: Number,
    },
    image: {
        type: Object,
        required: true,
    },
    subImages: [
        {
            type: Object,
            required: true,
        },
    ],
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Not_Active'],
    },
    colores: [String],
    size: [{
        type: String,
        enum: ['S', 'M', 'L', 'XL'],
    },],
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    brandId: { type: Types.ObjectId, ref: 'Brand' },

    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true, //وينتا انضافت الصورة
    toJSON:
        { virtuals: true },
    toObject:
        { virtuals: true }
});

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
})

const productModel = mongoose.models.Product || model('Product', productSchema);//cat table

export default productModel;
