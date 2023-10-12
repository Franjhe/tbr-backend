import Therapist from '../db/Therapist.js';

const verifyIfTherapistBelongsToBranch = async (req, res, next) => {
    if (req.body.cterapeuta) {
        const verifiedTherapist = await Therapist.verifyIfTherapistBelongsToBranch(req.body.cterapeuta, req.body.csucursal);
        if (verifiedTherapist.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifiedTherapist.error
                })
        }
        if (!verifiedTherapist) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: 'El Terapeuta no pertenece a la sucursal suministrada'
                })
        }
    }
    next();
}

export default verifyIfTherapistBelongsToBranch;