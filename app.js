import express from "express";
import userControllerRoute from "./src/router/userController.routes.js";
import auththRoutes from "./src/router/auth.routes.js"
import cors from 'cors'

const PORT = process.env.PORT || 5500;
const app = express();



app.use(cors({
    origin: '*'
}));
app.use(express.json());


app.use('/user', userControllerRoute);
app.use('/user/auth', auththRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});