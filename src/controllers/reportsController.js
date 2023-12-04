import reportsService from '../services/reportsService.js';

function formatDate(date) {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate() + 1;
    const month = formattedDate.getMonth() + 1;
    const year = formattedDate.getFullYear();

    // Formatear a 'dd/MM/yyyy'
    const formattedString = `${day}/${month}/${year}`;

    return formattedString;
}

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
        return res.status(403).send({
            status: false,
            message: sales.permissionError
        });
    }
    if (sales.error) {
        return res.status(500).send({
            status: false,
            message: sales.error
        });
    }
    const formattedList = sales.map((item) => ({
        ...item,
        fcontrato: item.fcontrato ? formatDate(item.fcontrato) : null,
    }));

    return res.status(200).send({
        status: true,
        data: {
            sales: formattedList
        }
    });
}

const reportsCancelledAppointments = async (req, res) => {
    const cancelled = await reportsService.reportsCancelledAppointments(req.body);
    if (cancelled.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: cancelled.permissionError
            });
    }
    if (cancelled.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: cancelled.error
            });
    }
    const formattedList = cancelled.map((item) => ({
        ...item,
        fentrada: item.fentrada ? new Date(item.fentrada).toLocaleDateString('es-ES') : null,
    }));
    return res
        .status(200)
        .send({
            status: true,
            data: {
                cancelled: formattedList
            }
        });
}

const reportsSearchReceipt = async (req, res) => {
    const receipt = await reportsService.reportsSearchReceipt(req.body);
    if (receipt.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: receipt.permissionError
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
    const formattedList = receipt.map((item) => ({
        ...item,
        fcobro: item.fcobro ? new Date(item.fcobro).toLocaleDateString('es-ES') : null,
        fanulacion: item.fanulacion ? new Date(item.fanulacion).toLocaleDateString('es-ES') : null,
    }));
    return res
        .status(200)
        .send({
            status: true,
            data: {
                receipt: formattedList
            }
        });
}

export default {
    reportsCollection,
    reportsSales,
    reportsCancelledAppointments,
    reportsSearchReceipt
}