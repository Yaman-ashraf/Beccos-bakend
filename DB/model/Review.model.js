import mongoose, { Schema, Types, model } from "mongoose";
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productId: {
        type: Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    orderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'Order',
    },
    image: {
        type:Object,
    },
}, { timestamps: true })
const reviewModel = mongoose.model.Review || model('Review', reviewSchema);
export default reviewModel;