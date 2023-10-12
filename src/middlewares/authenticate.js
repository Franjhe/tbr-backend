import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        res
            .status(401)
            .send({ 
                status: false,
                message: "Token not found"
            })
        return;
    }
    const accesToken = token.split(' ');
    if (accesToken[0] != 'Bearer') {
        res
            .status(401)
            .send({
                status: false,
                message: "Not a Bearer Authentication"
            })
        return;
    }
    jwt.verify(accesToken[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res
                .status(401)
                .send({
                    status: false,
                    message: err.message
                })
            return;
        }
        else {
            res.locals.decodedJWT = decoded;
            next();
        }
    });
}

export default authenticate;