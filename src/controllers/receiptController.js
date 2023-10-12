import receiptService from '../services/receiptService.js';

const getOneReceipt = async (req, res) => {
    const receipt = await receiptService.getOneReceipt(res.locals.decodedJWT, req.params.receiptId);
    if (receipt.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: receipt.errorNotFound
            });
    }
    if (receipt.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: receipt.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                receipt: receipt
            }
        });
}

const getReceiptPaymentDistributionDetail = async (req, res) => {
    const paymentDistribution = await receiptService.getReceiptPaymentDistributionDetail(res.locals.decodedJWT, req.params.receiptId);
    if (paymentDistribution.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: paymentDistribution.errorNotFound
            });
    }
    if (paymentDistribution.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: paymentDistribution.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                paymentDistribution: paymentDistribution
            }
        });
}

export default {
    getOneReceipt,
    getReceiptPaymentDistributionDetail
}