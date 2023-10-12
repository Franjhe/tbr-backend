import Seller from '../db/Seller.js';

const verifyIfSellerExists = async (req, res, next) => {
    if (res.locals.decodedJWT.bmaster && !req.body.cvendedor) {
        return res
                .status(400)
                .send({
                    status: false,
                    message: 'Debe seleccionar un vendedor'
                })
    }
    if (!res.locals.decodedJWT.bmaster && req.body.cvendedor) {
        return res
                .status(400)
                .send({
                    status: false,
                    message: 'Solo un usuario master puede seleccionar un vendedor'
                })
    }
    if (!res.locals.decodedJWT.bmaster) {
        const seller = await Seller.getSellerByUserId(res.locals.decodedJWT.cusuario);
        if (seller.error) {
            return {
                error: seller.error
            }
        }
        req.body.cvendedor = seller.cvendedor;
    }
    const verifiedSeller = await Seller.verifyIfSellerExists(req.body.cvendedor);
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
            .status(404)
            .send({
                status: false,
                message: 'No se encontró un vendedor con el Id suministrado'
            })
    }
    next();
}

export default verifyIfSellerExists;