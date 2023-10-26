import Reports from '../db/Reports.js';

const reportsCollection = async (reportsCollection) => {
    const collection = await Reports.reportsCollection(reportsCollection);
    if (collection.error) {
        return {
            error: collection.error
        }
    }
    return collection;
}

const reportsSales = async (reportsSales) => {
    const sales = await Reports.reportsSales(reportsSales);
    if (sales.error) {
        return {
            error: sales.error
        }
    }
    return sales;
}

const reportsCancelledAppointments = async (reportsCancelledAppointments) => {
    const cancelled = await Reports.reportsCancelledAppointments(reportsCancelledAppointments);
    if (cancelled.error) {
        return {
            error: cancelled.error
        }
    }
    return cancelled;
}

export default {
    reportsCollection,
    reportsSales,
    reportsCancelledAppointments
}