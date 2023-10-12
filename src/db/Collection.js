import sql from "mssql";

const sqlConfig = {
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const getAllClientDebtCollections = async (clientId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .input('bpago', sql.Bit, false)
            .input('bactivo', sql.Bit, true)
            .query(
                'select npaquete, mpaquete_cont, fcontrato, csucursal, xsucursal, ccuota, ipago, mcuota, fpago '
                + 'from vwbuscarcobranzapendientexcliente where bpago = @bpago and bactivo = @bactivo and ncliente = @ncliente order by fpago'
            );
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getAllContractDebtCollections = async (packageId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('bpago', sql.Bit, false)
            .input('bactivo', sql.Bit, true)
            .query(
                'select npaquete, mpaquete_cont, fcontrato, csucursal, xsucursal, ccuota, ipago, mcuota, fpago '
                + 'from vwbuscarcobranzapendientexcliente where bpago = @bpago and bactivo = @bactivo and npaquete = @npaquete order by fpago'
            );
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getInstallmentPayments = async (packageId, paymentInstallmentId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ccuota', sql.Int, paymentInstallmentId)
            .query(
                'select mmonto_cuota from cbrecibos_det where npaquete = @npaquete and ccuota = @ccuota'
            );
        if (result.recordset.length > 0) {
            return result.recordset.reduce((paidAmount, installmentPayment) => paidAmount + installmentPayment.mmonto_cuota, 0)
        }
        return false;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getAllClientPaidBillings = async (clientId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .input('bactivo', sql.Bit, true)
            .query(
                'select crecibo, npaquete, mpaquete_cont, fcontrato, csucursal, xsucursal, ccuota, ipago, mcuota, mpagado, fpago, fcobro '
                + 'from vwbuscarcuotascobradasxcliente where bactivo = @bactivo and ncliente = @ncliente order by fcobro desc'
            );
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const payOneClientDebts = async (userData, clientId, paidPaymentInstallments, paymentDistribution, paymentDate) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let resultPaymentDistribution = [];
        //Inserta la distribucion de pago.
        for (let i = 0; i < paymentDistribution.length; i++) {
            let result = await pool.request()
                .input('cmodalidad_pago', sql.Int, paymentDistribution[i].cmodalidad_pago)
                .input('ctipo_tarjeta', sql.Int, paymentDistribution[i].ctipo_tarjeta ? paymentDistribution[i].ctipo_tarjeta : undefined)
                .input('cbanco', sql.Int, paymentDistribution[i].cbanco ? paymentDistribution[i].cbanco : undefined)
                .input('cpos', sql.Int, paymentDistribution[i].cpos ? paymentDistribution[i].cpos : undefined)
                .input('mpago', sql.Numeric(11,2), paymentDistribution[i].mpago)
                .input('xtarjeta', sql.NVarChar, paymentDistribution[i].xtarjeta ? paymentDistribution[i].xtarjeta : undefined)
                .input('xvencimiento', sql.NVarChar, paymentDistribution[i].xvencimiento ? paymentDistribution[i].xvencimiento : undefined)
                .input('xobservacion', sql.NVarChar, paymentDistribution[i].xobservacion ? paymentDistribution[i].xobservacion : undefined)
                .query('insert into cbpagos (cmodalidad_pago, ctipo_tarjeta, cbanco, cpos, mpago, xtarjeta, xvencimiento, xobservacion) output inserted.cpago '
                                  + 'values (@cmodalidad_pago, @ctipo_tarjeta, @cbanco, @cpos, @mpago, @xtarjeta, @xvencimiento, @xobservacion)'
                )
            resultPaymentDistribution.push(result.recordset[0]);
        }
        //Inserta un recibo por cada contrato.
        for (let i = 0; i < paidPaymentInstallments.length; i++) {
            let result = await pool.request()
                .input('npaquete', sql.NVarChar, paidPaymentInstallments[i].npaquete)
                .input('ncliente', sql.Int, clientId)
                .input('mtotal', sql.Numeric(11,2), paidPaymentInstallments[i].mtotalrecibo)
                .input('fcobro', sql.Date, paymentDate)
                .input('xconceptopago', sql.NVarChar, paidPaymentInstallments[i].xconceptopago)
                .input('cvendedor', sql.Int, userData.cusuario)
                .input('bactivo', sql.Bit, true)
                .query('insert into cbrecibos (npaquete, ncliente, mtotal, fcobro, xconceptopago, cvendedor, bactivo) output inserted.crecibo '
                                    + 'values (@npaquete, @ncliente, @mtotal, @fcobro, @xconceptopago, @cvendedor, @bactivo)'
                )
            //Inserta el recibo y la distribucion del pago en el detalle.
            for (let j = 0; j < resultPaymentDistribution.length; j++) {
                await pool.request()
                    .input('crecibo', sql.Int, result.recordset[0].crecibo)
                    .input('cpago', sql.Int, resultPaymentDistribution[j].cpago)
                    .query('insert into cbpagos_det (crecibo, cpago) values (@crecibo, @cpago)')
            }
            //Inserta cuanto se pago de cada cuota en el recibo.
            for (let j = 0; j < paidPaymentInstallments[i].cuotas.length; j++) {
                await pool.request()
                    .input('crecibo', sql.Int, result.recordset[0].crecibo)
                    .input('ccuota', sql.Int, paidPaymentInstallments[i].cuotas[j].ccuota)
                    .input('npaquete', sql.NVarChar, paidPaymentInstallments[i].npaquete)
                    .input('mmonto_cuota', sql.Numeric(11,2), paidPaymentInstallments[i].cuotas[j].mpagado)
                    .query('insert into cbrecibos_det (crecibo, ccuota, npaquete, mmonto_cuota) values (@crecibo, @ccuota, @npaquete, @mmonto_cuota)')
                if (paidPaymentInstallments[i].cuotas[j].bpago) {
                    //Actualiza el estado de la cuota a pagado siempre y cuando la cuota no tenga deuda pendiente.
                    await pool.request()
                        .input('npaquete', sql.NVarChar, paidPaymentInstallments[i].npaquete)
                        .input('ccuota', sql.Int, paidPaymentInstallments[i].cuotas[j].ccuota)
                        .input('fcobro', sql.Date, paymentDate)
                        .input('bpago', sql.Bit, paidPaymentInstallments[i].cuotas[j].bpago)
                        .query('update cbcuotas set fcobro = @fcobro, bpago = @bpago where npaquete = @npaquete and ccuota = @ccuota')
                }
            }
        }
        return true;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfContractHasExpiredDebt = async (packageId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('bpago', sql.Bit, false)
            .query('select ccuota from cbcuotas where bpago = @bpago and npaquete = @npaquete and fpago < GETDATE()')
        if (result.recordset.length > 0 ) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllClientDebtCollections,
    getAllContractDebtCollections,
    getAllClientPaidBillings,
    getInstallmentPayments,
    payOneClientDebts,
    verifyIfContractHasExpiredDebt
}