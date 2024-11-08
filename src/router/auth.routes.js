import { Router } from "express";
import { getDataUser, deleteUser } from "../controllers/authController.js"
import authenticateJWT from '../middlewares/authenticateJWT.js'
const router = Router();

router.get('/profile', authenticateJWT, getDataUser);
router.delete('/deleteStudent', authenticateJWT, deleteUser);

export default router;