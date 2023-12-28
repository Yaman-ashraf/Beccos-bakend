import mongoose, { Schema, Types, model } from "mongoose";
const orderSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [{
        name: {
            type: String,
            required: true,
        },
        productId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        finalPrice: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
    finalPrice: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'cancelled', 'confirmed', 'onWay', 'delivered'],
    }, note: String,
    reasonReject: String,
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true })
const orderModel = mongoose.model.Order || model('Order', orderSchema);
export default orderModel;