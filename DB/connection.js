import mongoose from 'mongoose';

const connectDB = async () => {
    return await mongoose.connect(process.env.DB)
        .then(() => {
            console.log("Connection established");
        }).catch((error) => {
            console.log("Connection error: " + error);
        });
}
export default connectDB;