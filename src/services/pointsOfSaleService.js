import PointsOfSale from '../db/PointsOfSale.js';

const getAllPointsOfSale = async () => {
    const pos = await PointsOfSale.getAllPointsOfSale();
    if (pos.error) {
        return {
            error: pos.error
        }
    }
    return pos;
}

export default {
    getAllPointsOfSale
}