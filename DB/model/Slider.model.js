import mongoose, { Schema, model, Types } from 'mongoose'

const sliderSchema = new Schema({
    image: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Not_Active'],
    },
    link: {
        type: String,
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
});

const sliderModel = mongoose.models.Slider || model('Slider', sliderSchema);//cat table

export default sliderModel;