import Seller from '../db/Seller.js';

const verifyIfSellerBelongsToBranch = async (req, res, next) => {
    const verifiedSeller = await Seller.verifyIfSellerBelongsToBranch(req.body.cvendedor, req.body.csucursal);
    if (verifiedSeller.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: verifiedSeller.error
            })
    }
    if (!verifiedSeller) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'El vendedor no pertenece a la sucursal suministrada'
            })
    }
    next();
}

export default verifyIfSellerBelongsToBranch;