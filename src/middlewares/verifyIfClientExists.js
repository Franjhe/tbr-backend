import Client from '../db/Client.js';

const verifyIfClientExists = async (req, res, next) => {
    let ncliente = '';
    if (req.body.ncliente) {
        ncliente = req.body.ncliente;
    }
    if (req.params['clientId']){
        ncliente = req.params['clientId'];
    }
    if (ncliente) {
        const verifiedClient = await Client.verifyIfClientExists(ncliente);
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
                    .status(404)
                    .send({
                        status: false,
                        message: 'No se encontró un cliente con el Id suministrado'
                    })   
            }
            res.locals.ncont_ant = verifiedClient.ncont_ant;
    }
    next();
}

export default verifyIfClientExists;