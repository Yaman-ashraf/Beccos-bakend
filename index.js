import express from 'express';
import 'dotenv/config'
import { appRouter } from './Src/Module/app.router.js';
const app = express();
const PORT  = process.env.PORT || 3000;
appRouter(app, express);
app.listen(PORT, () => {
    console.log(`app is running ... ${process.env.PORT}`)
})
