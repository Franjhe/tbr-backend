import Therapist from '../db/Therapist.js';

const verifyIfTherapistExists = async (req, res, next) => {
    if (req.body.cterapeuta) {
        const verifiedTherapist = await Therapist.verifyIfTherapistExists(req.body.cterapeuta);
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
                .status(404)
                .send({
                    status: false,
                    message: 'No se encontró un terapeuta con el Id suministrado'
                })   
        }
    }
    next();
}

export default verifyIfTherapistExists;