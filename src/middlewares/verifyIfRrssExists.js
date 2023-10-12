import Rrss from '../db/Rrss.js';

const verifyIfRrssExists = async (req, res, next) => {
    if (req.body.crrss) {
        const verifiedRrss = await Rrss.verifyIfRrssExists(req.body.crrss);
        if (verifiedRrss.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifiedRrss.error
                })
        }
        if (!verifiedRrss) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: 'No se encontró un vendedor RRSS con el Id suministrado'
                })   
        }
    }
    next();
}

export default verifyIfRrssExists;