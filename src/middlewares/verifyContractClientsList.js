import Client from '../db/Client.js';

const verifyContractClientsList = async (req, res, next) => {
    for (let i = 0; i < req.body.clientes.length; i++){
        let verifyClient = await Client.verifyIfClientExists(req.body.clientes[i].ncliente);
        if (req.body.ipaquete_tipo == 'U' && req.body.clientes[i].ncliente != req.body.ncliente) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: 'Solo se pueden agregar clientes adicionales si el contrato es de tipo grupo'
                })
        }
        if (!verifyClient) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: `No existe el cliente ${req.body.clientes[i].ncliente}`
                })
        }
        if (verifyClient.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifyClient.error
                })
        }
    }
    next();
}

export default verifyContractClientsList;