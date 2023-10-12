import Contract from '../db/Contract.js';

const verifyIfContractExists = async (req, res, next) => {
    let npaquete;
    if (req.params.packageId) {
        npaquete = req.params.packageId;
    }
    if (req.body.npaquete) {
        npaquete = req.body.npaquete;
    }
    const verifiedContract = await Contract.verifyIfContractExists(npaquete);
    if (verifiedContract.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: verifiedContract.error
            })
    }
    if (!verifiedContract) {
        return res
            .status(404)
            .send({
                status: false,
                message: 'No se encontró ningún contrato con el Id suministrado'
            })   
    }
    next();
}

export default verifyIfContractExists;