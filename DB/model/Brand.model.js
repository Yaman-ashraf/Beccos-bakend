import mongoose, { Schema, model, Types } from 'mongoose'

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: Object,
        required: true,
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
});

const brandModel = mongoose.models.Brand || model('Brand', brandSchema);//cat table

export default brandModel;