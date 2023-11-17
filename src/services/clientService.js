import Client from '../db/Client.js';
import AdditionalCharges from '../db/AdditionalCharges.js';

const getAllClients = async (userData, clientData) => {
    if (!userData.bmaster && userData.csucursal != clientData.csucursal) {
        return {
            permissionError: 'El usuario solo puede visualizar los clientes de la sucursal a la que pertenece.'
        }
    }
    const clients = await Client.getAllClients(clientData);
    if (clients.error) {
        return {
            error: clients.error
        }
    }
    return clients;
}

const getOneClient = async (userData, clientId) => {
    const client = await Client.getOneClient(clientId);
    if (client.error) {
        return {
            error: client.error
        }
    }
    if (!client) {
        return {
            errorNotFound: 'No existe un cliente con el Id suministrado'
        }
    }
    // if (!userData.bmaster && parseInt(userData.csucursal) !== parseInt(client.csucursal)) {
    //     return {
    //         permissionError: 'El usuario solo puede visualizar los clientes de la sucursal a la que pertenece.'
    //     }
    // }
    return client;
}

const getClientTreatments = async (userData, clientId) => {
    const client = await Client.getOneClient(clientId);
    if (client.error) {
        return {
            error: client.error
        }
    }
    if (!userData.bmaster && parseInt(userData.csucursal) !== parseInt(client.csucursal)) {
        return {
            permissionError: 'El usuario solo puede visualizar los tratamientos de los clientes de la sucursal a la que pertenece.'
        }
    }
    const clientTreatments = await Client.getClientTreatments(clientId);
    if (clientTreatments.error) {
        return {
            error: clientTreatments.error
        }
    }
    return clientTreatments;
}

const createNewClient = async (userData, clientData) => {
    if (!userData.bmaster && userData.csucursal != clientData.csucursal) {
        return {
            permissionError: 'El usuario solo puede crear un cliente en la sucursal a la que pertenece.'
        }
    }
    const lastnameFirstCharacter = clientData.xapepaterno.slice(0, 1).toUpperCase();
    let lastnameFirstVocal = '';
    if (/[aeiou]/i.test(clientData.xapepaterno.slice(1))) {
        lastnameFirstVocal = clientData.xapepaterno.slice(1).match(/[aeiou]/i)[0].toUpperCase();
    } // Si el apellido no tiene una vocal, entonces se utiliza el segundo caracter del apellido paterno
    else {
        lastnameFirstVocal = clientData.xapepaterno[1].toUpperCase();
    }
    const motherLastNameFirstCharacter = clientData.xapematerno[0].toUpperCase();
    const nameFirstCharacter = clientData.xnombre[0].toUpperCase();
    const [year, month, day] = clientData.fnac.split('-');
    const yearDigits = year.slice(-2);
    const monthDigits = month.padStart(2, '0');
    const dayDigits = day.padStart(2, '0');
    const cid = lastnameFirstCharacter + lastnameFirstVocal + motherLastNameFirstCharacter + nameFirstCharacter + yearDigits + monthDigits + dayDigits;
    if (clientData.cid !== cid) {
        return {
            errorCidFormat: 'Error en el formato del código de identificación.'
        }
    }
    const verifyIfCIDAlreadyExists = await Client.verifyIfCIDAlreadyExists(clientData.cid);
    if (verifyIfCIDAlreadyExists.error) {
        return {
            error: verifyIfCIDAlreadyExists.error
        }
    }
    if (!verifyIfCIDAlreadyExists) {
        return {
            errorCidAlreadyExists: 'Ya existe un cliente con los mismos datos personales, verifique que no está creando un cliente duplicado.'
        }
    }
    const verifiedEmail = await Client.verifyEmailNotExists(clientData.xcorreo);
    if (verifiedEmail.error) {
        return {
            error: verifiedEmail.error
        }
    }
    if (verifiedEmail) {
        return {
            errorEmailAlreadyExists: `La dirección de correo ya se encuentra registrada para el cliente ${verifiedEmail.xcliente}.`
        }
    }

    const createdClient = await Client.createNewClient(userData, clientData);
    if (createdClient.error) {
        return {
            error: createdClient.error
        }
    }
    return createdClient;
}

const updateOneClient = async (userData, clientChanges, clientId) => {
    const clientInfo = await Client.getOneClient(clientId);
    if (clientInfo.error) {
        return {
            error: clientInfo.error
        }
    }
    if (!userData.bmaster && userData.csucursal !== clientInfo.csucursal) {
        return {
            permissionError: 'El usuario solo tiene permisos para editar un cliente perteneciente a su sucursal.'
        }
    }
    if (clientChanges.xcorreo !== clientInfo.xcorreo) {
        const verifiedEmail = await Client.verifyEmailNotExists(clientChanges.xcorreo);
        if (verifiedEmail.error) {
            return {
                error: verifiedEmail.error
            }
        }
        if (verifiedEmail) {
            return {
                errorEmailAlreadyExists: `La dirección de correo ya se encuentra registrada para el cliente ${verifiedEmail.xcliente}.`
            }
        }
    }
    if (clientChanges.ctelefono !== clientInfo.ctelefono) {
        const verifiedPhone = await Client.verifyPhoneNumberNotExists(clientChanges.ctelefono);
        if (verifiedPhone.error) {
            return {
                error: verifiedPhone.error
            }
        }
        if (verifiedPhone) {
            return {
                errorPhoneAlreadyExists: `El número de teléfono ya se encuentra registrado para el cliente ${verifiedPhone.xcliente}.`
            }
        }
    }
    const updatedClient = await Client.updateOneClient(userData, clientChanges, clientId);
    if (updatedClient.error) {
        return {
            error: updatedClient.error
        }
    }
    return updatedClient;
}

const updateOneClientBranch = async (userData, branchId, clientId, paymentStatus) => {
    const client = await Client.getOneClient(clientId);
    if (client.error) {
        return {
            error: client.error
        }
    }
    if (!userData.bmaster && userData.csucursal !== branchId) {
        return {
            permissionError: 'Solo puede cambiar la sucursal de un cliente que pertenezca a su sucursal.'
        }
    }
    if (client.csucursal == branchId) {
        return {
            errorBadRequest: 'El cliente ya pertenece a esa sucursal'
        }
    }
    let additionalChargeAmount = 0;
    if (paymentStatus) {
        additionalChargeAmount = await AdditionalCharges.getOneAdditionalCharge(1);
        if (additionalChargeAmount.error) {
            return {
                error: additionalChargeAmount.error
            }
        }
    }
    const updatedClient = await Client.updateOneClientBranch(branchId, clientId, additionalChargeAmount);
    if (updatedClient.error) {
        return {
            error: updatedClient.error
        }
    }
    return {
        xcliente: client.xcliente
    }
}

const deleteOneClient = async (userData, clientId) => {
    const deletedClient = await Client.deleteOneClient(userData, clientId);
    if (deletedClient.error) {
        return {
            error: deletedClient.error
        }
    }
    return deletedClient;
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