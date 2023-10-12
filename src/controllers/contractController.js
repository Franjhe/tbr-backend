import contractService from '../services/contractService.js';

const createNewContract = async (req, res) => {
    const createdContract = await contractService.createNewContract(res.locals.decodedJWT, req.body);
    if (createdContract.errorAlreadyExists) {
        return res
            .status(400)
            .send({
                status: false,
                message: createdContract.errorAlreadyExists
            })
    }
    if (createdContract.errorUnmatchedValue) {
        return res
            .status(400)
            .send({
                status: false,
                message: createdContract.errorUnmatchedValue
            })
    }
    if (createdContract.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createdContract.permissionError
            });
    }
    if (createdContract.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: createdContract.errorNotFound
            });
    }
    if (createdContract.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createdContract.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: `El Contrato N° ${createdContract.npaquete} ha sido creado exitosamente`,
            data: {
                contract: createdContract
            }
        });
}

const getAllContracts = async (req, res) => {
    const contracts = await contractService.getAllContracts(req.body);
    if (contracts.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: contracts.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                contracts: contracts
            }
        });
}

const getOneContract = async (req, res) => {
    const contract = await contractService.getOneContract(res.locals.decodedJWT, req.params.packageId);
    if (contract.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: contract.permissionError
            })
    }
    if (contract.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: contract.errorNotFound
            })
    }
    if (contract.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: contract.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                contract: contract
            }
        });
}

const updateOneContract = async (req, res) => {
    const updatedContract = await contractService.updateOneContract(res.locals.decodedJWT, req.body, req.params.packageId);
    if (updatedContract.error){
        return res
            .status(500)
            .send({
                status: false,
                message: updatedContract.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: `El Contrato N° ${updatedContract.npaquete} ha sido actualizado exitosamente`
        });
}

const updateOneContractTreatment = async (req, res) => {
    const updatedContractTreatment = await contractService.updateOneContractTreatment(res.locals.decodedJWT, req.params.packageId, req.body.tratamientoEliminado, req.body.tratamientoNuevo);
    if (updatedContractTreatment.errorBadRequest) {
        return res
            .status(400)
            .send({
                status: false,
                message: updatedContractTreatment.errorBadRequest
            })
    }
    if (updatedContractTreatment.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: updatedContractTreatment.errorNotFound
            })
    }
    if (updatedContractTreatment.error){
        return res
            .status(500)
            .send({
                status: false,
                message: updatedContractTreatment.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: 'Se realizó el cambio de tratamiento correctamente.'
        })
}

const createNewCourtesySession = async (req, res) => {
    const newCourtesySession = await contractService.createNewCourtesySession(res.locals.decodedJWT, req.params.packageId, req.body.tratamientoNuevo);
    if (newCourtesySession.errorBadRequest) {
        return res
            .status(400)
            .send({
                status: false,
                message: newCourtesySession.errorBadRequest
            })
    }
    if (newCourtesySession.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: newCourtesySession.errorNotFound
            })
    }
    if (newCourtesySession.error){
        return res
            .status(500)
            .send({
                status: false,
                message: newCourtesySession.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: 'Se agregó la sesión de cortesía correctamente.'
        })
}

const decreaseNumberOfSessions = async (req, res) => {
    const updatedContractTreatment = await contractService.decreaseNumberOfSessions(res.locals.decodedJWT, req.params.packageId, req.body.tratamiento, req.body.nsesiones);
    if (updatedContractTreatment.errorBadRequest) {
        return res
            .status(400)
            .send({
                status: false,
                message: updatedContractTreatment.errorBadRequest
            })
    }
    if (updatedContractTreatment.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: updatedContractTreatment.errorNotFound
            })
    }
    if (updatedContractTreatment.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: updatedContractTreatment.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            message: 'Se editó el número de sesiones correctamente.'
        });
}

const deleteOneContract = async (req, res) => {
    const deletedContract = await contractService.deleteOneContract(res.locals.decodedJWT, req.params.packageId);
    if (deletedContract.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: deletedContract.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            message: `El Contrato N° ${deletedContract.npaquete} ha sido inhabilitado exitosamente`
        });
}

export default {
    createNewContract,
    getAllContracts,
    getOneContract,
    updateOneContract,
    updateOneContractTreatment,
    createNewCourtesySession,
    decreaseNumberOfSessions,
    deleteOneContract
}