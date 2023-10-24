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

export default {
    reportsCollection
}