
import categoriesRouter from './Categories/Categories.router.js';

export const appRouter = (app, express) => {
    app.use(express.json());

    app.get('/', (req, res) => {
        return res.json({ message: "WELCOME" });
    })

    app.use("/categories",categoriesRouter)

    app.get("*", (req, res) => {
        return res.status(404).json({ message: "Page Not Foundddd" });
    })
    
}