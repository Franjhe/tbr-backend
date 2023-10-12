import Contract from '../db/Contract.js';

const verifyPaymentInstallmentsAmounts = async (req, res, next) => {
    const contract = await Contract.getOneContract(req.body.npaquete);
    if (contract.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: contract.error
            })
    }
    let paymentInstallmentsTotalAmount = 0;
    req.body.cuotas.forEach(paymentInstallment => {
        paymentInstallmentsTotalAmount += paymentInstallment.mcuota;
    })
    let totalContractAmount = req.body.manticipo + paymentInstallmentsTotalAmount;
    if (totalContractAmount !== contract.mpaquete_cont) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'El total del contrato no coincide con las sumas del anticipo y el total de las cuotas, verifique que los montos cubran el total del contrato.'
            })
    }
    next();
}

export default verifyPaymentInstallmentsAmounts;