import Cabin from '../db/Cabin.js';

const verifyIfCabinBelongsToBranch = async (req, res, next) => {
    if (req.body.csucursal && req.body.ccabina) {
        const verifiedCabin = await Cabin.verifyIfCabinBelongsToBranch(req.body.csucursal, req.body.ccabina);
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
                .status(400)
                .send({
                    status: false,
                    message: 'La cabina no pertenece a la sucursal suministrada.'
                })
        }
    }
    next();
}

export default verifyIfCabinBelongsToBranch;