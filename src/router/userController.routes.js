import { Router } from "express";
import { postClient, login, logoutClient } from '../controllers/clienteController.js'
import { postEmpleado, loginEmpleado } from '../controllers/empleadoController.js'
import authenticateJWT from '../middlewares/authenticateJWT.js'
const router = Router();


router.post('/createClient', postClient);
router.post('/auth', login);
router.post('/logout', authenticateJWT, logoutClient);
router.post('/createEmploye', postEmpleado)
router.post('/loginEmpleado', loginEmpleado)

export default router;