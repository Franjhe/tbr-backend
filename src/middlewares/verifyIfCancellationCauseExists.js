import CancellationCause from '../db/CancellationCause.js';

const verifyIfCancellationCauseExists = async (req, res, next) => {
    const verifiedCancellationCause = await CancellationCause.verifyIfCancellationCauseExists(req.params.cancellationCauseId);
    if (verifiedCancellationCause.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: verifiedCancellationCause.error
            })
    }
    if (!verifiedCancellationCause) {
        return res
            .status(404)
            .send({
                status: false,
                message: 'No se encontró una causa de anulación con el Id suministrado'
            })   
    }
    next();
}

export default verifyIfCancellationCauseExists;