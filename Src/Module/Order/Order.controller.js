import cartModel from "../../../DB/model/Cart.model.js";
import orderModel from "../../../DB/model/Order.model.js";
import productModel from "../../../DB/model/Product.model.js";
import userModel from "../../../DB/model/user.model.js";

export const create = async (req, res) => {
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart || cart.products.length == 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }
    req.body.products = cart.products;
    let subTotal = 0;
    let finalProductList = [];
    for (let product of req.body.products) {
        const checkProducts = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity }
        })
        if (!checkProducts) {
            return res.status(400).json({ message: "Product quantity not available" });
        }
        product = product.toObject();//bson to json
        product.name = checkProducts.name;
        product.unitPrice = checkProducts.finalPrice;
        product.finalPrice = checkProducts.finalPrice * product.quantity;
        subTotal += product.finalPrice;
        finalProductList.push(product);
    }

    if (!req.body.address || !req.body.phone) {
        const user = await userModel.findById(req.user._id);
        if (!req.body.address) {
            req.body.address = user.address;
        }
        if (!req.body.phone) {
            req.body.phone = user.phone;
        }
    }

    //Create cart
    const order = await orderModel.create({
        userId: req.user._id,
        products: finalProductList,
        finalPrice: subTotal,
        address: req.body.address,
        phone: req.body.phone,
        note: req.body.note
    });

    if (!order) {
        return res.status(400).json({ message: "Error while creating order" });
    }

    //edit stock, decrease quantity
    for (const product of req.body.products) {
        await productModel.findByIdAndUpdate({
            _id: product.productId
        }, {
            $inc: {
                stock: -product.quantity
            }
        });
    }

    //empty cart
    await cartModel.findOneAndUpdate({ userId: req.user._id }, {
        products: []
    })

    return res.status(201).json({ message: "Success", order });
}

export const getUserOrder = async (req, res) => {
    const orders = await orderModel.find({ userId: req.user._id });
    return res.status(200).json({ message: "Success", count: orders.length, orders });
}

export const cancelOrder = async (req, res) => {
    const order = await orderModel.findOneAndUpdate({
        _id: req.params.id, userId: req.user._id, status: 'pending'
    }, {
        status: 'cancelled', note: req.body.note
    }, {
        new: true
    });

    if (!order) {
        return res.status(400).json({ message: "Can't cancel this order" });
    }

    //edit stock, decrease quantity
    for (const product of order.products) {
        await productModel.findByIdAndUpdate({
            _id: product.productId
        }, {
            $inc: {
                stock: product.quantity
            }
        });
    }
    return res.status(200).json({ message: "Success" });
}

export const changeStatus = async (req, res) => {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
        return res.status(400).json({ message: "Order not found" });
    }
    //order status is cancelled
    if (order.status === 'cancelled') {
        return res.status(400).json({ message: "This Order has been Cancelled" });
    }
    //new order
    const newOrder = await orderModel.findByIdAndUpdate(orderId, { status: req.body.status }, { new: true });
    //if order cancelled, edet stock and +1
    if (newOrder.status == 'cancelled') {
        for (const product of order.products) {
            await productModel.findByIdAndUpdate({
                _id: product.productId
            }, {
                $inc: {
                    stock: product.quantity
                }
            });
        }
    }
    return res.status(200).json({ message: "Success", order })
}

export const allOrder = async (req, res) => {
    const orders = await orderModel.find({}).populate('userId');

    const counts = await orderModel.estimatedDocumentCount();

    return res.status(200).json({
        message: "Success",
        count: orders.length,
        total: counts, orders,
    });
}

export const getDetails = async (req, res) => {
    const order = await orderModel.findById(req.params.orderId).populate('userId');


    return res.status(200).json({ message: "Success", order });
}

