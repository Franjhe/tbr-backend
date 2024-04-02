import reportsService from '../services/reportsService.js';

function formatDate() {
    // Obtener la fecha actual
    const currentDate = new Date();

    // Obtener el día, mes y año de la fecha actual
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const year = currentDate.getFullYear();

    // Formatear la fecha como 'dd-MM-yyyy'
    const formattedString = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

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
    const unifiedCollection = [].concat(...collection);

    console.log(unifiedCollection)

    return res
        .status(200)
        .send({
            status: true,
            data: {
                collection: unifiedCollection
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

    const unifiedSales = [].concat(...sales);

    const formattedList = unifiedSales.map((item) => ({
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

function formatDateCustom(dateString) {
    // Verificar si la cadena de fecha no está vacía, nula o no es una cadena válida
    if (typeof dateString !== 'string' || !dateString.trim()) {
        return null;
    }

    // Dividir la cadena de fecha en partes
    const parts = dateString.split('/');

    // Verificar si hay suficientes partes (día, mes, año)
    if (parts.length !== 3) {
        return null;
    }

    // Convertir las partes a números enteros
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Crear un objeto de fecha
    const date = new Date(year, month - 1, day);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
        return null;
    }

    // Formatear la fecha como desees
    const formattedDate = date.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });

    return formattedDate;
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