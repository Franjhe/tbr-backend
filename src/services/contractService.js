import Contract from '../db/Contract.js';
import Treatment from '../db/Treatment.js';
import GeneralParams from '../db/GeneralParams.js';
import Client from '../db/Client.js';

const createNewContract = async (userData, contractData) => {
    if (!userData.bmaster && userData.csucursal != contractData.csucursal) {
        return {
            permissionError: 'El usuario solo puede crear un contrato en la sucursal a la que pertenece.'
        }
    }
    const verifyIfContractExists = await Contract.verifyIfContractExists(contractData.npaquete);
    if (verifyIfContractExists === contractData.npaquete) {
        return {
            errorAlreadyExists: 'Ya existe un contrato con el Id suministrado'
        }
    }
    const createdContract = await Contract.createNewContract(userData, contractData);
    if (createdContract.error) {
        return {
            error: createdContract.error
        }
    }
    return createdContract;
}

const getAllContracts = async (searchData, idUser) => {
    const contracts = await Contract.getAllContracts(searchData,idUser);
    if (contracts.error) {
        return {
            error: contracts.error
        }
    }
    return contracts;
}

const getOneContract = async (userData, packageId) => {
    const contract = await Contract.getOneContract(packageId);
    if (contract.error) {
        return {
            error: contract.error
        }
    }
    if (!contract) {
        return {
            errorNotFound: 'No existe un contrato con el Id suministrado'
        }
    }
    // if (!userData.bmaster && parseInt(userData.csucursal) !== parseInt(contract.csucursal)) {
    //     return {
    //         permissionError: 'El usuario solo puede visualizar los contratos de la sucursal a la que pertenece.'
    //     }
    // }
    return contract;
}

const updateOneContract = async (userData, contractChanges, packageId) => {
    const contract = await Contract.getOneContract(packageId);
    if (contract.error) {
        return {
            error: contract.error
        }
    }
    if (contract.bcuotas) {
        return {
            errorBadRequest: 'No se puede modificar un contrato que ya tenga cuotas creadas.'
        }
    }
    const updatedContract = await Contract.updateOneContract(userData, contractChanges, packageId);
    if (updatedContract.error) {
        return {
            error: updatedContract.error
        }
    }
    return updatedContract;
}

const uploadDocumentOneContract = async (userData, Documents, packageId) => {
    const uploadDocumentContract = await Contract.uploadDocumentOneContract(userData, Documents, packageId);
    if (uploadDocumentContract.error) {
        return {
            error: uploadDocumentContract.error
        }
    }
    return uploadDocumentContract;
}


const updateOneContractTreatment = async (userData, packageId, treatmentToDelete, treatmentToCreate) => {
    const verifiedDeleteTreatment = await Treatment.verifyIfTreatmentExists(treatmentToDelete.cgrupo, treatmentToDelete.ctratamiento);
    if (verifiedDeleteTreatment.error) {
        return {
            error: verifiedDeleteTreatment.error
        }
    }
    if (!verifiedDeleteTreatment) {
        return {
            errorNotFound: 'No existe el tratamiento que desea eliminar, verifique la información.'
        }
    }
    const verifiedNewTreatment = await Treatment.verifyIfTreatmentExists(treatmentToCreate.cgrupo, treatmentToCreate.ctratamiento);
    if (verifiedNewTreatment.error) {
        return {
            error: verifiedNewTreatment.error
        }
    }
    if (!verifiedNewTreatment) {
        return {
            errorNotFound: 'No existe el tratamiento que desea crear, verifique la información.'
        }
    }
    const verifiedClient = await Client.verifyIfClientExists(treatmentToCreate.ncliente);
    if (verifiedClient.error) {
        return {
            error: verifiedClient.error
        }
    }
    if (!verifiedClient) {
        return {
            errorNotFound: 'No existe el cliente '
        }
    }
    const verifiedTreatmentToDelete = await Contract.verifyIfContractTreatmentExists(packageId, treatmentToDelete);
    if (verifiedTreatmentToDelete.error) {
        return {
            error: verifiedTreatmentToDelete.error
        }
    }
    if (!verifiedTreatmentToDelete) {
        return {
            errorNotFound: `No existe el tratamiento que se desea eliminar en el contrato ${packageId}, verifique la información.`
        }
    }
    if (!verifiedTreatmentToDelete.bactivo) {
        return {
            errorBadRequest: 'No puede cambiar un tratamiento que ya se encuentra deshabilitado.'
        }
    }
    const verifiedTreatmentToCreate = await Contract.verifyIfContractTreatmentAlreadyExists(packageId, treatmentToCreate);
    if (verifiedTreatmentToCreate.error) {
        return {
            error: verifiedTreatmentToCreate.error
        }
    }
    if (!verifiedTreatmentToCreate) {
        return {
            errorBadRequest: `Ya existe el tratamiento que se desea agregar en el contrato ${packageId}, verifique la información.`
        }
    }
    const contract = await Contract.getOneContract(packageId);
    if (contract.error) {
        return {
            error: contract.error
        }
    }
    if (contract.bprimerasesion) {
        return {
            errorBadRequest: 'No se puede hacer un cambio de tratamiento a un contrato que ya tenga una sesión tomada.'
        }
    }
    let newContractAmount = contract.mpaquete_cont + treatmentToCreate.mprecio_min;
    let amountDifference = newContractAmount - contract.mpaquete_cont;
    const changeContractTreatment = await Contract.changeOneContractTreatment(packageId, treatmentToDelete, treatmentToCreate, amountDifference, newContractAmount);
    if (changeContractTreatment.error) {
        return {
            error: changeContractTreatment.error
        }
    }
    return true;
}

const createNewCourtesySession = async (userData, packageId, courtesySession) => {
    const contract = await Contract.getOneContract(packageId);
    if (contract.error) {
        return {
            error: contract.error
        }
    }
    const verifiedClient = await Client.verifyIfClientExists(courtesySession.ncliente);
    if (verifiedClient.error) {
        return {
            error: verifiedClient.error
        }
    }
    if (!verifiedClient) {
        return {
            errorNotFound: 'No existe un cliente con el id suministrado, verifique la información.'
        }
    }
    if (contract.value.ipaquete_tipo === 'U' && contract.value.ncliente != courtesySession.ncliente) {
        return {
            errorBadRequest: 'No se puede agregar un tratamiento a un cliente distinto al cliente principal en un contrato que es de tipo único.'
        }
    }
    const verifiedTreatment = await Treatment.verifyIfTreatmentExists(courtesySession.cgrupo, courtesySession.ctratamiento);
    if (verifiedTreatment.error) {
        return {
            error: verifiedTreatment.error
        }
    }
    if (!verifiedTreatment) {
        return {
            errorNotFound: 'No existe un tratamiento con el grupo y el id suministrado, verifique la información.'
        }
    }
    const verifiedTreatmentToCreate = await Contract.verifyIfContractTreatmentAlreadyExists(packageId, courtesySession);
    if (verifiedTreatmentToCreate.error) {
        return {
            error: verifiedTreatmentToCreate.error
        }
    }
    if (!verifiedTreatmentToCreate) {
        const addedSessions = await Contract.addSessionsToTreatment(packageId, courtesySession);
        if (addedSessions.error) {
            return {
                error: addedSessions.error
            }
        }
    }
    else {
        const newCourtesySession = await Contract.createNewCourtesySession(packageId, contract.value.ncontrato, courtesySession);
        if (newCourtesySession.error) {
            return {
                error: newCourtesySession.error
            }
        }
    }
    return true;
}

const decreaseNumberOfSessions = async (userData, packageId, treatment, numberOfSessionsToDecrease) => {
    const contractTreatment = await Contract.getOneContractTreatment(packageId, treatment.ncliente, treatment.cgrupo, treatment.ctratamiento);
    if (!contractTreatment) {
        return {
            errorNotFound: 'No existe el tratamiento que desea modificar.'
        }
    }
    if (contractTreatment.error) {
        return {
            error: contractTreatment.error
        }
    }
    const updatedContractTreatment = await Contract.decreaseNumberOfSessions(packageId, treatment, numberOfSessionsToDecrease);
    if (updatedContractTreatment.error) {
        return {
            error: updatedContractTreatment.error
        }
    }
    return true;
}

const deleteOneContract = async (userData, packageId) => {
    const deletedContract = await Contract.deleteOneContract(packageId);
    if (deletedContract.error) {
        return {
            error: deletedContract.error
        }
    }
    return deletedContract;
}

export default {
    createNewContract,
    getAllContracts,
    getOneContract,
    updateOneContract,
    uploadDocumentOneContract,
    updateOneContractTreatment,
    createNewCourtesySession,
    decreaseNumberOfSessions,
    deleteOneContract,
}