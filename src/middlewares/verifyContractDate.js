import moment from 'moment';

const verifyContractDate = async (req, res, next) => {
    const actualDate = moment().format('YYYY-MM-DD');
    if (!res.locals.decodedJWT.bmaster && actualDate !== req.body.fcontrato) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'Solo los usuarios master pueden colocar una fecha de contrato distinta a la actual.'
            })
    }
    if (actualDate < req.body.fcontrato) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'No se puede colocar una fecha de contrato superior a la fecha actual.'
            })
    }
    next();
}

export default verifyContractDate;