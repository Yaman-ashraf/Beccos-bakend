import orderModel from "../../../DB/model/Order.model.js";
import reviewModel from "../../../DB/model/Review.model.js";

export const create = async (req, res) => {
    const { productId } = req.params;
    const { comment, rating } = req.body;
    const order = await orderModel.findOne({
        userId: req.user._id,
        status: "delivered",
        "products.productId": productId
    });
    //delivered order?
    if (!order) {
        return res.status(400).send("can't review this order");
    }

    //commint just once
    const checkReview = await reviewModel.findOne({
        userId: req.user._id,
        productId: productId.toString(),
    });
    if (checkReview) {
        return res.status(409).json({ message: "Already exists" });
    }

    const review = await reviewModel.create({
        comment, rating,
        userId: req.user._id,
        orderId: order._id,
        productId: productId,
    })

    if (!review) {
        return res.status(500).json({ message: "Error while create review", });
    }
    return res.status(201).json({ message: "Success" });

}