import Receipt from '../db/Receipt.js';

const getOneReceipt = async (userData, receiptId) => {
    const receipt = await Receipt.getOneReceipt(receiptId);
    if (!receipt) {
        return {
            errorNotFound: 'No existe un recibo con el Id suministrado'
        }
    }
    if (receipt.error) {
        return {
            error: receipt.error
        }
    }
    const contractOutstandingBalance = await Receipt.getContractOutstandingBalance(receipt.npaquete,receiptId);
    if (contractOutstandingBalance.error) {
        return {
            error: contractOutstandingBalance.error
        }
    }
    receipt.msaldorestante = contractOutstandingBalance;
    const receiptPaymentDistribution = await Receipt.getReceiptPaymentDistribution(receiptId);
    if (receiptPaymentDistribution.error) {
        return {
            error: receiptPaymentDistribution.error
        }
    }
    receipt.distribucionpago = receiptPaymentDistribution;
    return receipt;
}

const getReceiptPaymentDistributionDetail = async (userData, receiptId) => {
    const receipt = await Receipt.getOneReceipt(receiptId);
    if (!receipt) {
        return {
            errorNotFound: 'No existe un recibo con el Id suministrado'
        }
    }
    if (receipt.error) {
        return {
            error: receipt.error
        }
    }
    const receiptPaymentDistribution = await Receipt.getReceiptPaymentDistributionDetail(receiptId);
    if (receiptPaymentDistribution.error) {
        return {
            error: receiptPaymentDistribution.error
        }
    }
    return receiptPaymentDistribution;
}

export default {
    getOneReceipt,
    getReceiptPaymentDistributionDetail
}