import { pool } from '../db.js';
import jwt from 'jsonwebtoken';
const SECRET_KEY = "4f3f5b36bc39a71c123456789abcdef123456789abcdef123456789abcdef12345678";


export const getDataUser = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
        console.log(decoded)
        if (decoded.tipo == "cliente") {
            const [client] = await pool.query('SELECT * FROM Clients WHERE ClientID = ?', [userId]);
            if (client.length === 0) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            return res.status(200).json(client[0]);
        }
        else {
            const [empeladoId] = await pool.query('SELECT * FROM Employees WHERE EmployeeID = ?', [userId]);
            if (empeladoId.length === 0) {
                return res.status(404).send({ message: "Empleado no encontrado" });
            }
            return res.status(200).json(empeladoId[0]);
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: "Error al obtener el cliente", error: e });
    }
};

export const deleteUser = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const userId = decoded.id;
        let result;

        if (decoded.tipo === 'cliente') {

            [result] = await pool.query('DELETE FROM Clients WHERE ClientID = ?', [userId]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            return res.status(200).json({ message: "Cliente eliminado correctamente" });
        } else if (decoded.tipo === 'empleado') {

            [result] = await pool.query('DELETE FROM Employees WHERE EmployeeID = ?', [userId]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Empleado no encontrado" });
            }
            return res.status(200).json({ message: "Empleado eliminado correctamente" });
        } else {
            return res.status(400).json({ message: "Tipo de usuario no reconocido" });
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({ message: 'Error interno del servidor', error });
    }
};

