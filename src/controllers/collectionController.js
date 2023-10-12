import collectionService from '../services/collectionService.js';

const getAllClientDebtCollections = async (req, res) => {
    const debtCollections = await collectionService.getAllClientDebtCollections(res.locals.decodedJWT, req.params.clientId);
    if (debtCollections.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: debtCollections.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                debtCollections: debtCollections
            }
        });
}

const getAllClientPaidBillings = async (req, res) => {
    const paidBillings = await collectionService.getAllClientPaidBillings(res.locals.decodedJWT, req.params.clientId);
    if (paidBillings.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: paidBillings.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                paidBillings: paidBillings
            }
        });
}

const payOneClientDebts = async (req, res) => {
    const paidDebts = await collectionService.payOneClientDebts(res.locals.decodedJWT, req.body);
    if (paidDebts.errorBadRequest) {
        return res
            .status(400)
            .send({
                status: false,
                message: paidDebts.errorBadRequest
            });
    }
    if (paidDebts.permissionError) {
        return res
            .status(404)
            .send({
                status: false,
                message: paidDebts.permissionError
            });
    }
    if (paidDebts.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: paidDebts.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            message: 'Pago registrado exitosamente.'
        });
}

const getAllDebtCollectionsPending = async (req, res) => {
    const pendingDebts = await collectionService.getAllDebtCollectionsPending(res.locals.decodedJWT, req.body);
    if (pendingDebts.errorBadRequest) {
        return res
            .status(400)
            .send({
                status: false,
                message: pendingDebts.errorBadRequest
            });
    }
    if (pendingDebts.permissionError) {
        return res
            .status(404)
            .send({
                status: false,
                message: pendingDebts.permissionError
            });
    }
    if (pendingDebts.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: pendingDebts.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                pendingDebts: pendingDebts
            }
        });
}


export default {
    getAllClientDebtCollections,
    getAllClientPaidBillings,
    payOneClientDebts,
    getAllDebtCollectionsPending
}