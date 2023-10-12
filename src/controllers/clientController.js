import clientService from '../services/clientService.js';

const getAllClients = async (req, res) => {
    const clients = await clientService.getAllClients(res.locals.decodedJWT, req.body);
    if (clients.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: clients.permissionError
            });
    }
    if (clients.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: clients.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                clients: clients
            }
        });
}

const getOneClient = async (req, res) => {
    const client = await clientService.getOneClient(res.locals.decodedJWT, req.params.clientId);
    if (client.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: client.permissionError
            });
    }
    if (client.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: client.errorNotFound
            });
    }
    if (client.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: client.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                client: client
            }
        });
}

const getClientTreatments = async (req, res) => {
    const clientTreatments = await clientService.getClientTreatments(res.locals.decodedJWT, req.params.clientId);
    if (clientTreatments.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: clientTreatments.permissionError
            });
    }
    if (clientTreatments.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: clientTreatments.errorNotFound
            });
    }
    if (clientTreatments.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: clientTreatments.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                clientTreatments: clientTreatments
            }
        });
}

const createNewClient = async (req, res) => {
    const createdClient = await clientService.createNewClient(res.locals.decodedJWT, req.body);
    if (createdClient.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createdClient.permissionError
            });
    }
    if (createdClient.errorCidFormat) {
        return res
            .status(400)
            .send({
                status: false,
                message: createdClient.errorCidFormat
            })
    }
    if (createdClient.errorCidAlreadyExists) {
        return res
            .status(400)
            .send({
                status: false,
                message: createdClient.errorCidAlreadyExists
            });
    }
    if (createdClient.errorEmailAlreadyExists) {
        return res
            .status(400)
            .send({
                status: false,
                message: createdClient.errorEmailAlreadyExists
            });
    }
    if (createdClient.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createdClient.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: `El Cliente ${createdClient.xcliente} N° ${createdClient.ncliente} ha sido creado exitosamente`,
            data: {
                client: createdClient
            }
        });
}

const updateOneClient = async (req, res) => {
    const updatedClient = await clientService.updateOneClient(res.locals.decodedJWT, req.body, req.params.clientId);
    if (updatedClient.error){
        return res
            .status(500)
            .send({
                status: false,
                message: updatedClient.error
            });
    }
    if (updatedClient.errorPhoneAlreadyExists) {
        return res
            .status(400)
            .send({
                status: false,
                message: updatedClient.errorPhoneAlreadyExists
            })
    }
    if (updatedClient.errorEmailAlreadyExists) {
        return res
            .status(400)
            .send({
                status: false,
                message: updatedClient.errorEmailAlreadyExists
            })
    }
    if (updatedClient.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: updatedClient.errorEmailAlreadyExists
            })
    }
    return res
        .status(201)
        .send({
            status: true,
            message: `El Cliente ${updatedClient.xcliente} ha sido actualizado exitosamente`
        });
}

const updateOneClientBranch = async (req, res) => {
    const updatedClient = await clientService.updateOneClientBranch(res.locals.decodedJWT, req.body.csucursal, req.params.clientId, req.body.bpago);
    if (updatedClient.error){
        return res
            .status(500)
            .send({
                status: false,
                message: updatedClient.error
            });
    }
    if (updatedClient.errorBadRequest) {
        return res
            .status(400)
            .send({
                status: false,
                message: updatedClient.errorBadRequest
            })
    }
    if (updatedClient.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: updatedClient.permissionError
            })
    }
    return res
        .status(201)
        .send({
            status: true,
            message: `Se ha cambiado la sucursal del Cliente ${updatedClient.xcliente} exitosamente`
        });
}

const deleteOneClient = async (req, res) => {
    const deletedClient = await clientService.deleteOneClient(res.locals.decodedJWT, req.params.clientId);
    if (deletedClient.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: deletedClient.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            message: `El Cliente ${deletedClient.xcliente} N° ${deletedClient.ncliente} ha sido inhabilitado exitosamente`
        });
}

export default {
    getAllClients,
    getOneClient,
    getClientTreatments,
    createNewClient,
    updateOneClient,
    updateOneClientBranch,
    deleteOneClient
}