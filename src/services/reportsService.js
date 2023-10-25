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

export default {
    reportsCollection,
    reportsSales
}