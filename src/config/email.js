import nodemailer from 'nodemailer';
import { pool } from '../db.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'widgethubsocial@gmail.com', // Tu correo almacenado en .env
        pass: 'yvlh cuvg tfhn ujtv' // Tu contraseña o token de aplicación almacenado en .env (recuerda usar una contraseña de aplicación si es necesario)
    }
});

export const sendEmail = async () => {
    try {

        const [result] = await pool.query("SELECT Name,Email FROM Clients");


        if (result.length === 0) {
            console.log('No se encontraron correos para enviar.');
            return;
        }


        for (const client of result) {
            const mailOptions = {
                from:'widgethubsocial@gmail.com',
                to: client.Email,
                subject: `hi ${client.Name}, this is an Automatic Sending Test`,
                text: `News and Exclusive Offers Just for You!

Hello ${client.Name},

We hope you're having a great day! In this edition of our newsletter, we bring you some exciting news and offers you won’t want to miss:

New Releases
We’ve added new products/services to our offerings.

Special Promotion
Limited time only! Enjoy a 99.9999% discount on everything. Use the code (ñ) when making your purchase.

Remember: If you have any questions or concerns, don’t hesitate to contact us. We’re here to help.

Thank you for being part of our community!

Let me know if you'd like any further adjustments!`
            };

            // Envía el correo
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`Correo enviado a ${client.Email}:`, info.response);
            } catch (error) {
                console.error(`Error al enviar el correo a ${client.Email}:`, error);
            }
        }
    } catch (error) {
        console.error('Error al consultar correos:', error);
    }
};
