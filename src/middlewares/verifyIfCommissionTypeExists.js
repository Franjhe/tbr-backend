import CommissionType from '../db/CommissionType.js';

const verifyIfCommissionTypeExists = async (req, res, next) => {
    const verifiedCommissionType = await CommissionType.verifyIfCommissionTypeExists(req.body.ctipocom);
    if (verifiedCommissionType.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: verifiedCommissionType.error
            })
    }
    if (!verifiedCommissionType) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'No se encontró un tipo de comisión con el Id suministrado'
            })
    }
    if (verifiedCommissionType === 1 && (req.body.cterapeuta || req.body.crrss)) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'No puede tener un terapeuta o un vendedor de rrss asignado a un contrato con una comisión de tipo vendedor'
            })
    }
    if (verifiedCommissionType === 2 && req.body.cterapeuta) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'No puede tener un terapeuta asignado a un contrato con una comisión de tipo vendedor & rrss'
            })
    }
    if (verifiedCommissionType === 3 && req.body.crrss) {
        return res
            .status(404)
            .send({
                status: false,
                message: 'No puede tener un vendedor de rrss asignado a un contrato con una comisión de tipo vendedor & terapeuta'
            })
    }
    next();
}

export default verifyIfCommissionTypeExists;