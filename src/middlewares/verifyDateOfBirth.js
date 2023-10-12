import GeneralParams from '../db/GeneralParams.js';
import moment from 'moment';

const verifyDateOfBirth = async (req, res, next) => {
    const generalParams = await GeneralParams.getAllGeneralParams();
        if (generalParams.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: generalParams.error
                })
        }
        let dateOfBirth = moment(req.body.fnac);
        let currentDate = moment();
        let age = currentDate.diff(dateOfBirth, 'years', true);
        if (age < generalParams.edad_min) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `No se puede registrar un cliente que sea menor a ${generalParams.edad_min} años`
                })
        }
        if (age > generalParams.edad_max) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `No se puede registrar un cliente que sea mayor a ${generalParams.edad_max} años`
                })
        }
    next();
}

export default verifyDateOfBirth;