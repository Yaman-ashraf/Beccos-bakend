
import connectDB from '../../DB/model/connection.js';
import categoriesRouter from './Categories/Categories.router.js';
import cors from 'cors';

export const appRouter = (app, express) => {
    app.use(express.json());
    connectDB();
    app.use(cors());

    app.get('/', (req, res) => {
        return res.json({ message: "WELCOME" });
    })

    app.use("/categories",categoriesRouter);

    app.get("*", (req, res) => {
        return res.status(404).json({ message: "Page Not Foundddd" });
    })
}