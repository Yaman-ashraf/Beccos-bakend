import cartModel from '../../../DB/model/Cart.model.js';
import productModel from '../../../DB/model/Product.model.js';

export const addToCart = async (req, res) => {
    const { productId } = req.body;
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        //create a new Cart for the User and then push the Product into it
        const newCart = await cartModel.create({
            products: { productId },
            userId: req.user._id
        })
        return res.status(201).json({ message: "Success", cart: newCart });
    }

    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId == productId) {
            return res.status(409).json({ message: "Product Already Added" });
        }
    }
    cart.products.push({ productId });
    await cart.save();
    return res.status(201).json({ message: "Success", cart });
}

export const removeItem = async (req, res) => {
    const { productId } = req.body;
    const cart = await cartModel.findOneAndUpdate({ userId: req.user._id }, {
        $pull: {
            products: {
                productId
            }
        }
    }, { new: true });
    return res.status(200).json({ message: "Success", cart });
}

export const clearCart = async (req, res) => {
    const cart = await cartModel.updateOne({ userId: req.user._id }, {
        products: []
    });
    // return res.json("cart")
    return res.status(200).json({ message: "Success" });
}

export const updateQuantity = async (req, res) => {
    const { productId, options } = req.body;
    const inc = (options == '+') ? 1 : -1;
    const cart = await cartModel.findOneAndUpdate({ userId: req.user._id, "products.productId": productId },
        {
            $inc: {
                "products.$.quantity": inc
            }
        }, { new: true });
    if (!cart) {
        return res.status(400).json({ message: "Can't update quantity" });
    }
    return res.status(200).json({ message: "Success", cart });
}

export const getCart = async (req, res) => {
    const cart = await cartModel.findOne({ userId: req.user._id });

    const detailsProducts = await Promise.all(
        cart.products.map(async (cartProduct) => {
            const product = await productModel.findById(cartProduct.productId);
            return {
                ...cartProduct.toObject(),
                detailes: product.toObject(),
            }
        })
    );
    return res.status(200).json({ message: "Success", count: detailsProducts.length, products: detailsProducts });
}