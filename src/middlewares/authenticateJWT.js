import jwt from 'jsonwebtoken';
const SECRET_KEY = "4f3f5b36bc39a71c123456789abcdef123456789abcdef123456789abcdef12345678";


const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {

        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        })
    } else
        res.sendStatus(401);

}
export default authenticateJWT;