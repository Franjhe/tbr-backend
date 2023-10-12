import PaymentMethods from '../db/PaymentMethods.js';

const getAllPaymentMethods = async () => {
    const paymentMethods = await PaymentMethods.getAllPaymentMethods();
    if (paymentMethods.error) {
        return {
            error: paymentMethods.error
        }
    }
    return paymentMethods;
}

export default {
    getAllPaymentMethods
}