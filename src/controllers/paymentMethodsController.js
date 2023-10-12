import paymentMethodsService from '../services/paymentMethodsService.js';

const getAllPaymentMethods = async (req, res) => {
    const paymentMethods = await paymentMethodsService.getAllPaymentMethods();
    if (paymentMethods.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: paymentMethods.permissionError
            });
    }
    if (paymentMethods.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: paymentMethods.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                paymentMethods: paymentMethods
            }
        });
}

export default {
    getAllPaymentMethods
}