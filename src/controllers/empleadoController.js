import { pool } from '../db.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const SECRET_KEY = "4f3f5b36bc39a71c123456789abcdef123456789abcdef123456789abcdef12345678";

export const postEmpleado = async (req, res) => {
    const { name, email, posicion, password } = req.body;
    const saltRounds = 10;
    console.log(name, email, posicion, password)
    try {
        const [existingempleado] = await pool.query('SELECT * FROM Employees WHERE Email = ?', [email]);
        if (existingempleado.length > 0) {
            return res.status(409).send({ message: "El correo ya esta registrado" });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await pool.query(
            'INSERT INTO Employees (Name, Email,Position, Password) VALUES (?, ?, ?, ?)',
            [name, email, posicion, hashedPassword]
        );
        return res.status(201).send({ message: "Empleado creado" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Error al crear el empleado", error });
    }
}



export const loginEmpleado = async (req, res) => {

    const { email, password } = req.body;
    try {
        const [empleado] = await pool.query('SELECT * FROM Employees WHERE Email = ?', [email]);
        if (empleado.length === 0) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        const hashedPassword = empleado[0].Password;

        const result = await bcrypt.compare(password, hashedPassword);
        if (result) {
            const payload = {
                id: empleado[0].EmployeeID,
                email: empleado[0].Email,
                nombre: empleado[0].Name,
                tipo: "empleado"
            };

            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' })
            return res.json({ message: 'Inicio de sesión exitoso', token });
        }
        return res.status(401).send({ message: "Contraseña incorrecta" });
    } catch (e) {
        res.status(500).send({ message: "Error en el inicio de sesión", e });
    }
}

export const logoutempleado = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión.' });
        }
        res.clearCookie('session_cookie_community');
        return res.status(200).json({ message: 'Sesión cerrada correctamente.' });
    });
}