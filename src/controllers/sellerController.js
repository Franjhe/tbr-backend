import sellerService from '../services/sellerService.js';

const getAllSellers = async (req, res) => {
    const sellers = await sellerService.getAllSellers(res.locals.decodedJWT, req.body.csucursal);
    if (sellers.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: sellers.permissionError
            });
    }
    if (sellers.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: sellers.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                sellers: sellers
            }
        });
}

export default {
    getAllSellers
}