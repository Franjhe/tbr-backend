import PaymentInstallments from '../db/PaymentInstallments.js';
import Contract from '../db/Contract.js';
import Receipt from '../db/Receipt.js';

const createNewPaymentInstallments = async (userData, paymentInstallmentsData) => {
    const contractData = await Contract.getOneContract(paymentInstallmentsData.npaquete);
    if (contractData.error) {
        return {
            error: contractData.error
        }
    }
    if (paymentInstallmentsData.manticipo < (contractData.mtotal_cont * 0.1) ) {
        return {
            errorInAdvance: 'El monto del anticipo debe de ser mínimo del 10% del monto total del contrato.'
        }
    }
    if (paymentInstallmentsData.manticipo > contractData.mtotal_cont) {
        return {
            errorInAdvance: 'El monto del anticipo no puede ser mayor al monto total del contrato.'
        }
    }
    let xconceptopago = '';
    if (paymentInstallmentsData.manticipo === contractData.mpaquete_cont) {
        xconceptopago = 'Total de tratamiento';
    }
    if (paymentInstallmentsData.manticipo < contractData.mpaquete_cont) {
        xconceptopago = 'Anticipo de tratamiento';
    }
    paymentInstallmentsData.xconceptopago = xconceptopago;
    const createdReceipt = await Receipt.createNewReceipt(userData.cusuario, contractData.ncliente, contractData.npaquete, paymentInstallmentsData);
    if (createdReceipt.error) {
        return {
            error: createdReceipt.error
        }
    }
    const createdReceiptPaymentDistribution = await Receipt.createReceiptPaymentDistribution(createdReceipt, paymentInstallmentsData.anticipo);
    if (createdReceiptPaymentDistribution.error) {
        return {
            error: createdReceiptPaymentDistribution.error
        }
    }
    const createdPaymentInstallments = await PaymentInstallments.createNewPaymentInstallments(createdReceipt, paymentInstallmentsData);
    if (createdPaymentInstallments.error) {
        return {
            error: createdPaymentInstallments.error
        }
    }
    createdPaymentInstallments.crecibo = createdReceipt;
    return createdPaymentInstallments;
}

const getContractPaymentInstallments = async (userData, packageId) => {
    const contractPaymentInstallments = await PaymentInstallments.getContractPaymentInstallments(packageId);
    if (contractPaymentInstallments.error) {
        return {
            error: contractPaymentInstallments.error
        }
    }
    return contractPaymentInstallments;
}

const editNewPaymentInstallments = async (userData, paymentInstallmentsData) => {
    const editPaymentInstallments = await PaymentInstallments.updatePaymentInstallments(paymentInstallmentsData);
    if (editPaymentInstallments.error) {
        return {
            error: editPaymentInstallments.error
        }
    }
    return editPaymentInstallments;
}

export default {
    createNewPaymentInstallments,
    getContractPaymentInstallments,
    editNewPaymentInstallments
}