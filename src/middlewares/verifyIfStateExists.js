import State from '../db/State.js';

const verifyIfStateExists = async (req, res, next) => {
    let stateId;
    if (req.params.stateId) {
        stateId = req.params.stateId;
    }
    if (req.body.cestado) {
        stateId = req.body.cestado
    }
    if (stateId) {
        const verifiedState = await State.verifyIfStateExists(stateId);
        if (verifiedState.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifiedState.error
                })
        }
        if (!verifiedState) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: 'No se encontró un estado con el Id suministrado'
                })   
        }
    }
    next();
}

export default verifyIfStateExists;