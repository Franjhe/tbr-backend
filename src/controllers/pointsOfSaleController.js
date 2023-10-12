import pointsOfSaleService from '../services/pointsOfSaleService.js';

const getAllPointsOfSale = async (req, res) => {
    const pos = await pointsOfSaleService.getAllPointsOfSale();
    if (pos.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: pos.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                pos: pos
            }
        });
}

export default {
    getAllPointsOfSale
}