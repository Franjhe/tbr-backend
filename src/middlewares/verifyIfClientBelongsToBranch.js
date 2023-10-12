import Client from '../db/Client.js';

const verifyIfClientBelongsToBranch = async (req, res, next) => {
    const verifiedClient = await Client.verifyIfClientBelongsToBranch(req.body.ncliente, req.body.csucursal);
    if (verifiedClient.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: verifiedClient.error
            })
    }
    if (!verifiedClient) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'El cliente no pertenece a la sucursal suministrada'
            })
    }
    next();
}

export default verifyIfClientBelongsToBranch;