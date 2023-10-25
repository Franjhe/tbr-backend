import reportsService from '../services/reportsService.js';

const reportsCollection = async (req, res) => {
    const collection = await reportsService.reportsCollection(req.body);
    if (collection.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: collection.permissionError
            });
    }
    if (collection.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: collection.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                collection: collection
            }
        });
}

const reportsSales = async (req, res) => {
    const sales = await reportsService.reportsSales(req.body);
    if (sales.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: sales.permissionError
            });
    }
    if (sales.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: sales.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                sales: sales
            }
        });
}

export default {
    reportsCollection,
    reportsSales
}