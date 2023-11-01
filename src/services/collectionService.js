import Collection from '../db/Collection.js';
import Client from '../db/Client.js';
import Contract from '../db/Contract.js';
import moment from 'moment';

const getAllClientDebtCollections = async (userData, clientId) => {
    const client = await Client.getOneClient(clientId);
    if (client.error) {
        return {
            error: client.error
        }
    }
    if (!userData.bmaster && userData.csucursal != client.csucursal) {
        return {
            permissionError: 'El usuario solo puede visualizar la cobranza de los clientes de la sucursal a la que pertenece.'
        }
    }
    const contracts = await Contract.getClientAssociatedContracts(clientId);
    if (contracts.error) {
        return {
            error: contracts.error
        }
    }
    let debtCollections = [];
    for (let contract of contracts) {
        let contractDebtCollection = await Collection.getAllContractDebtCollections(contract.npaquete);
        if (contractDebtCollection.error) {
            return {
                error: contractDebtCollection.error
            }
        }
        for (let contractDebt of contractDebtCollection) {
            debtCollections.push(contractDebt);
        }
    }
    for (let i = 0; i < debtCollections.length; i++) {
        let debt = debtCollections[i];
        let paidDebt = await Collection.getInstallmentPayments(debt.npaquete, debt.ccuota);
        if (paidDebt) {
            debt.mpagado = paidDebt;
            debt.mpendiente = debt.mcuota - paidDebt;
        }
        else {
            debt.mpagado = 0;
            debt.mpendiente = debt.mcuota
        }
    }
    debtCollections.sort(function(a, b) {
        let dateA = new Date(a.fpago);
        let dateB = new Date(b.fpago);
        return dateA - dateB;
    });
    return debtCollections;
}

const getAllClientPaidBillings = async (userData, clientId) => {
    const client = await Client.getOneClient(clientId);
    if (client.error) {
        return {
            error: client.error
        }
    }
    if (!userData.bmaster && userData.csucursal != client.csucursal) {
        return {
            permissionError: 'El usuario solo puede visualizar la cobranza de los clientes de la sucursal a la que pertenece.'
        }
    }
    const paidBillings = await Collection.getAllClientPaidBillings(clientId);
    if (paidBillings.error) {
        return {
            error: paidBillings.error
        }
    }
    return paidBillings;
}

const payOneClientDebts = async (userData, paymentData) => {
    let actualDate = moment().format('YYYY-MM-DD');
    if (paymentData.fpago > actualDate) {
        return {
            errorBadRequest: 'No se puede insertar una fecha de pago mayor a la fecha actual.'
        }
    }
    if (!userData.bmaster && paymentData.fpago < actualDate) {
        return {
            permissionError: 'No tiene permisos para colocar una fecha de pago menor a la fecha actual.'
        }
    }
    const clientId = paymentData.ncliente;
    const contracts = await Contract.getClientAssociatedContracts(clientId);  //lista de contratos del cliente 
    if (contracts.error) {
        return {
            error: contractsdebtCollections.error
        }
    }
    let debtCollections = [];
    for (let contract of contracts) {
        let contractDebtCollection = await Collection.getAllContractDebtCollections(contract.npaquete); //cobranza del contrato
        if (contractDebtCollection.error) {
            return {
                error: contractDebtCollection.error
            }
        }
        for (let contractDebt of contractDebtCollection) {
            debtCollections.push(contractDebt);
        }
    }
    debtCollections.sort(function(a, b) {  
        let dateA = new Date(a.fpago);
        let dateB = new Date(b.fpago);
        return dateA - dateB;
    });
    /*const debtCollections = await Collection.getAllClientDebtCollections(paymentData.ncliente);
    if (debtCollections.error) {
        return {
            error: debtCollections.error
        }
    }*/
    for (let i = 0; i < debtCollections.length; i++) {
        let debt = debtCollections[i];
        //Se buscan los abonos de cada cuota.
        let paidDebt = await Collection.getInstallmentPayments(debt.npaquete, debt.ccuota);
        if (paidDebt) {
            debt.mpendiente = debt.mcuota - paidDebt;
        }
        else {
            debt.mpendiente = debt.mcuota
        }
    }
    const totalDebt = debtCollections.reduce((total, debt) => total + debt.mpendiente, 0)
    let totalPaymentAmount = paymentData.distribucionPago.reduce((totalAmount, paymentData) => totalAmount + paymentData.mpago, 0);
    if (totalDebt < totalPaymentAmount) {
        return {
            errorBadRequest: 'El monto del pago no puede ser superior al monto total de la deuda del cliente.'
        }
    }
    let paidInstallments = [];
    for (let i = 0; i < debtCollections.length; i++) {
        let debt = debtCollections[i];
        if (totalPaymentAmount > 0) {
            if (totalPaymentAmount >= debt.mpendiente) {
                totalPaymentAmount -= debt.mpendiente;
                debt.mpagado = debt.mpendiente;
                debt.bpago = true;
                paidInstallments.push(debt);
            }
            else {
                debt.mpagado = totalPaymentAmount;
                totalPaymentAmount -= debt.mpendiente;
                debt.bpago = false;
                paidInstallments.push(debt);
            }
        }
        else {
            break;
        }
    }
    //Ordena el arreglo por número de paquete.
    let paidInstallmentsGroupByPackageId = paidInstallments.reduce((acum, paymentInstallment) => {
        let index = acum.findIndex(item => item.npaquete === paymentInstallment.npaquete);
        if (index !== -1) {
            acum[index].cuotas.push({
                ccuota: paymentInstallment.ccuota,
                mpagado: paymentInstallment.mpagado,
                bpago: paymentInstallment.bpago
            })
        }
        else {
            acum.push({
                npaquete: paymentInstallment.npaquete,
                cuotas: [
                    {
                        ccuota: paymentInstallment.ccuota,
                        mpagado: paymentInstallment.mpagado,
                        bpago: paymentInstallment.bpago
                    }
                ]
            })
        }
        return acum;
    }, []);
    for (let i = 0; i < paidInstallmentsGroupByPackageId.length; i++) {
        let totalReceipt = paidInstallmentsGroupByPackageId[i].cuotas.reduce((total, cuota) => total + cuota.mpagado, 0)
        paidInstallmentsGroupByPackageId[i].mtotalrecibo = totalReceipt;
        let totalContractDebt = 0;
        debtCollections.forEach(debt => {
            if (debt.npaquete === paidInstallmentsGroupByPackageId[i].npaquete) {
                totalContractDebt += debt.mcuota;
            }
        })
        if (totalContractDebt > totalReceipt) {
            paidInstallmentsGroupByPackageId[i].xconceptopago = 'Parcial de tratamiento'
        }
        else {
            paidInstallmentsGroupByPackageId[i].xconceptopago = 'Total de tratamiento'
        }
    }
    const paidDebts = await Collection.payOneClientDebts(userData, clientId, paidInstallmentsGroupByPackageId, paymentData.distribucionPago, paymentData.fpago);
    if (paidDebts.error) {
        return {
            error: paidDebts.error
        }
    }
    return paidDebts;
}

const payOneFeesClientDebts = async (userData, paymentData) => {
    //Validaciones de fecha 
    let actualDate = moment().format('YYYY-MM-DD');

    if (paymentData.fpago > actualDate) {
        return {
            errorBadRequest: 'No se puede insertar una fecha de pago mayor a la fecha actual.'
        }
    }

    if (!userData.bmaster && paymentData.fpago < actualDate) {
        return {
            permissionError: 'No tiene permisos para colocar una fecha de pago menor a la fecha actual.'
        }
    }

    let debtCollections = [];
    let contractDebtCollection = await Collection.getAllContractDebtCollections(paymentData.npaquete); //cobranza del contrato
    if (contractDebtCollection.error) {
        return {
            error: contractDebtCollection.error
        }
    }
    for (let contractDebt of contractDebtCollection) {
        debtCollections.push(contractDebt);
    }


    let totalPaymentAmount = paymentData.distribucionPago.reduce((totalAmount, paymentData) => totalAmount + paymentData.mpago, 0);  //suma de montos de la distribucion de pago de la cuotas

    for (let i = 0; i < debtCollections.length; i++) {
        //Se buscan los abonos de cada cuota.
        let debt = debtCollections[i];
        let paidDebt = await Collection.getInstallmentPayments(paymentData.npaquete, paymentData.ccuota);
        if (paidDebt) {
            debt.mpendiente = paidDebt - totalPaymentAmount;
        }
        else {
            debt.mpendiente = totalPaymentAmount
        }
    }
    const totalDebt = debtCollections.reduce((total, debt) => total + debt.mpendiente, 0)

    if (totalDebt < totalPaymentAmount) {
        return {
            errorBadRequest: 'El monto del pago no puede ser superior al monto total de la deuda del cliente.'
        }
    }

    let paidInstallments = [];
    for (let i = 0; i < debtCollections.length; i++) {
        let debt = debtCollections[i];
        if (totalPaymentAmount > 0) {
            if (totalPaymentAmount >= debt.mpendiente) {
                totalPaymentAmount -= debt.mpendiente;
                debt.mpagado = debt.mpendiente;
                debt.bpago = true;
                paidInstallments.push(debt);
            }
            else {
                debt.mpagado = totalPaymentAmount;
                totalPaymentAmount -= debt.mpendiente;
                debt.bpago = false;
                paidInstallments.push(debt);
            }
        }
        else {
            break;
        }
    }

    for (let i = 0; i < paidInstallments.length; i++) {
        paidInstallments[i].mtotalrecibo = totalPaymentAmount;
        let totalContractDebt = 0;
        debtCollections.forEach(debt => {
            if (debt.npaquete === paidInstallments[i].npaquete) {
                totalContractDebt += debt.mcuota;
            }
        })
        if (totalContractDebt > totalPaymentAmount) {
            paidInstallments[i].xconceptopago = 'Parcial de tratamiento'
        }
        else {
            paidInstallments[i].xconceptopago = 'Total de tratamiento'
        }
    }     

    const paidDebts = await Collection.payOneFeesClientDebts(userData, paidInstallments, paymentData , npaquete , totalPaymentAmount , xconceptopago);
    if (paidDebts.error) {
        return {
            error: paidDebts.error
        }
    }
    return paidDebts;
}

const getAllDebtCollectionsPending = async (userData, searchData) => {
    if (!userData.bmaster) {
        return {
            permissionError: 'El usuario solo puede visualizar la cobranza de los clientes de la sucursal a la que pertenece.'
        }
    }

    let debtCollections = [];
    let contractDebtCollection = await Collection.getAllContractDebtCollectionsPending(searchData);
    if (contractDebtCollection.error) {
        return {
            error: contractDebtCollection.error
        }
    }
    for (let contractDebt of contractDebtCollection) {
        debtCollections.push(contractDebt);
    }
    

    return debtCollections;
}

export default {
    getAllClientDebtCollections,
    getAllClientPaidBillings,
    payOneClientDebts,
    payOneFeesClientDebts,
    getAllDebtCollectionsPending
}