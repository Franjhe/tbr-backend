import paymentInstallmentsService from '../services/paymentInstallmentsService.js';

const createNewPaymentInstallments = async (req, res) => {
    const createdPaymentInstallments = await paymentInstallmentsService.createNewPaymentInstallments(res.locals.decodedJWT, req.body);
    if (createdPaymentInstallments.errorInAdvance) {
        return res
            .status(400)
            .send({
                status: false,
                message: createdPaymentInstallments.errorInAdvance
            });
    }
    if (createdPaymentInstallments.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createdPaymentInstallments.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: `Se han cargado las cuotas del paquete ${createdPaymentInstallments.npaquete} exitosamente`,
            crecibo: createdPaymentInstallments.crecibo
        });
}

const getContractPaymentInstallments = async (req, res) => {
    const contractPaymentInstallments = await paymentInstallmentsService.getContractPaymentInstallments(res.locals.decodedJWT, req.params.packageId);
    if (contractPaymentInstallments.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: contractPaymentInstallments.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            data: contractPaymentInstallments
        });
}

export default {
    createNewPaymentInstallments,
    getContractPaymentInstallments
}