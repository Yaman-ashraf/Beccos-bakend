
import connectDB from '../../DB/connection.js';
import authRouter from './Auth/Auth.router.js';
import categoriesRouter from './Categories/Categories.router.js';
import productsRouter from './Products/Product.router.js';
import cors from 'cors';

export const appRouter = (app, express) => {
    app.use(express.json());
    connectDB();
    app.use(cors());

    app.get('/', (req, res) => {
        return res.json({ message: "WELCOME" });
    })

    app.use("/auth", authRouter);
    app.use("/categories", categoriesRouter);
    app.use("/products", productsRouter);

    app.get("*", (req, res) => {
        return res.status(404).json({ message: "Page Not Foundddd" });
    })
}