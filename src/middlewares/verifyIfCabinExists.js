import Cabin from '../db/Cabin.js';

const verifyIfCabinExists = async (req, res, next) => {
    if (req.body.ccabina) {
        const verifiedCabin = await Cabin.verifyIfCabinExists(req.body.ccabina);
        if (verifiedCabin.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifiedCabin.error
                })
        }
        if (!verifiedCabin) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: 'No se encontró una cabina con el Id suministrado'
                })   
        }
    }
    next();
}

export default verifyIfCabinExists;