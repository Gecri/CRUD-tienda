import { pool } from '../db.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const SECRET_KEY = "4f3f5b36bc39a71c123456789abcdef123456789abcdef123456789abcdef12345678";


export const postClient = async (req, res) => {
    const { name, email, phone, address, password } = req.body;
    const saltRounds = 10;

    try {
        const [existingclient] = await pool.query('SELECT * FROM Clients WHERE Email = ?', [email]);
        if (existingclient.length > 0) {
            return res.status(409).send({ message: "El correo ya esta registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.query(
            'INSERT INTO Clients (Name, Email, Phone, Address, Password) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, address, hashedPassword]
        );

        return res.status(201).send({ message: "Cliente creado" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Error al crear el cliente", error });
    }
}



export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
       
        let [user] = await pool.query('SELECT * FROM Employees WHERE Email = ?', [email]);

        if (user.length === 0) {
            [user] = await pool.query('SELECT * FROM Clients WHERE Email = ?', [email]);

            if (user.length === 0) {
                return res.status(404).send({ message: "Usuario no encontrado" });
            }
            const hashedPassword = user[0].Password;

            const result = await bcrypt.compare(password, hashedPassword);
            if (result) {
                const payload = {
                    id: user[0].ClientID,
                    email: user[0].Email,
                    nombre: user[0].Name,
                    tipo: "cliente"
                };

                const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
                return res.json({ message: 'Inicio de sesión exitoso', token });
            }
            return res.status(401).send({ message: "Contraseña incorrecta" });
        }

        const hashedPassword = user[0].Password;

        const result = await bcrypt.compare(password, hashedPassword);
        if (result) {
            const payload = {
                id: user[0].EmployeeID,
                email: user[0].Email,
                nombre: user[0].Name,
                tipo: "empleado"
            };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
            return res.json({ message: 'Inicio de sesión exitoso', token });
        }
        return res.status(401).send({ message: "Contraseña incorrecta" });

    } catch (e) {
        res.status(500).send({ message: "Error en el inicio de sesión", error: e });
    }
};

export const logoutClient = (req, res) => {
    // Verificar si req.session existe antes de intentar destruirlo
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al cerrar sesión.' });
            }
            res.clearCookie('session_cookie_community');
            return res.status(200).json({ message: 'Sesión cerrada correctamente. Por favor, elimina el token del cliente.' });
        });
    } else {

        return res.status(400).json({ message: 'No hay sesión activa para cerrar.' });
    }
};