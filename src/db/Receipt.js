import sql from "mssql";

const sqlConfig = {
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    server: process.env.SERVER_BD,
        database: process.env.NAME_BD,
    requestTimeout: 60000, 
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const ajustarFechaCobro = (fechaAnticipo, horaActual) => {
    // Clonar la fecha de anticipo para evitar modificar el objeto original
    let fechaCobro = new Date(fechaAnticipo);
    
    // Si la hora actual es igual o mayor a las 7 PM (19 horas), y la fecha de anticipo es antes de hoy, ajusta la fecha de cobro al día siguiente
    if (horaActual >= 19 && fechaCobro < new Date()) {
        fechaCobro.setDate(fechaCobro.getDate());
    }else{
        fechaCobro.setDate(fechaCobro.getDate());
    }
    
    return fechaCobro;
};

const createNewReceipt = async (userId, clientId, packageId, paymentInstallmentsData) => {
    try {
        let horaActual = new Date().getHours();
        let fechaCobro = ajustarFechaCobro(paymentInstallmentsData.fanticipo, horaActual);

        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ncliente', sql.Int, clientId)
            .input('cvendedor', sql.Int, userId)
            .input('fcobro', sql.Date, fechaCobro)
            .input('mtotal', sql.Numeric(11,2), paymentInstallmentsData.manticipo)
            .input('xconceptopago', sql.NVarChar, paymentInstallmentsData.xconceptopago)
            .input('bactivo', sql.Bit, true)
            .query('insert into cbrecibos (npaquete, ncliente, cvendedor, fcobro, mtotal, xconceptopago, bactivo) output inserted.crecibo '
                                + 'values (@npaquete, @ncliente, @cvendedor, @fcobro, @mtotal, @xconceptopago, @bactivo)'
            )
        return result.recordset[0].crecibo;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const createReceiptPaymentDistribution = async (receiptId, receiptPaymentDistribution) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let resultPaymentDistribution = [];
        for (let i = 0; i < receiptPaymentDistribution.length; i++) {
            let result = await pool.request()
                .input('crecibo', sql.Int, receiptId)
                .input('cmodalidad_pago', sql.Int, receiptPaymentDistribution[i].cmodalidad_pago)
                .input('ctipo_tarjeta', sql.Int, receiptPaymentDistribution[i].ctipo_tarjeta ? receiptPaymentDistribution[i].ctipo_tarjeta : undefined)
                .input('cbanco', sql.Int, receiptPaymentDistribution[i].cbanco ? receiptPaymentDistribution[i].cbanco : undefined)
                .input('cpos', sql.Int, receiptPaymentDistribution[i].cpos ? receiptPaymentDistribution[i].cpos : undefined)
                .input('mpago', sql.Numeric(11,2), receiptPaymentDistribution[i].mpago)
                .input('xtarjeta', sql.NVarChar, receiptPaymentDistribution[i].xtarjeta ? receiptPaymentDistribution[i].xtarjeta : undefined)
                .input('xvencimiento', sql.NVarChar, receiptPaymentDistribution[i].xvencimiento ? receiptPaymentDistribution[i].xvencimiento : undefined)
                .input('xobservacion', sql.NVarChar, receiptPaymentDistribution[i].xobservacion ? receiptPaymentDistribution[i].xobservacion : undefined)
                .input('xreferencia', sql.NVarChar, receiptPaymentDistribution[i].xreferencia ? receiptPaymentDistribution[i].xreferencia : undefined)
                .query('insert into cbpagos (crecibo, cmodalidad_pago, ctipo_tarjeta, cbanco, cpos, mpago, xtarjeta, xvencimiento, xobservacion, xreferencia) output inserted.cpago '
                                  + 'values (@crecibo, @cmodalidad_pago, @ctipo_tarjeta, @cbanco, @cpos, @mpago, @xtarjeta, @xvencimiento, @xobservacion, @xreferencia)'
                )
                resultPaymentDistribution.push(result.recordset[0]);
        }
        for (let i = 0; i < resultPaymentDistribution.length; i++) {
            await pool.request()
                .input('crecibo', sql.Int, receiptId)
                .input('cpago', sql.Int, resultPaymentDistribution[i].cpago)
                .query('insert into cbpagos_det (crecibo, cpago) values (@crecibo, @cpago)')
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

const getOneReceipt = async (receiptId) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('crecibo', sql.Int, receiptId)
            .query('select npaquete, crecibo, cvendedor, ncliente, xcliente, xconceptopago, mtotal, fcobro from vwbuscardetallerecibo where crecibo = @crecibo')
        return result.recordset[0]
    }
    catch (error) {
        console.log(error);
        return {
            error: error.message
        }
    }
}

const getReceiptPaymentDistribution = async (receiptId) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('crecibo', sql.Int, receiptId)
            .query('select cpago, cmodalidad_pago, xmodalidad_pago from vwbuscardistribuciondepagosxrecibo where crecibo = @crecibo')
        return result.recordset;
    }
    catch (error) {
        console.log(error);
        return {
            error: error.message
        }
    }
}

const getReceiptPaymentDistributionDetail = async (receiptId) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('crecibo', sql.Int, receiptId)
            .query('select cpago, cmodalidad_pago, ctipo_tarjeta, cbanco, cpos, mpago, xtarjeta, xvencimiento, xobservacion from cbpagos where crecibo = @crecibo')
        return result.recordset;
    }
    catch (error) {
        console.log(error);
        return {
            error: error.message
        }
    }
}

const getReceiptPaymentInstallments = async (receiptId) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('crecibo', sql.Int, receiptId)
            .query('select ccuota, ipago, mcuota from vwbuscarcuotasxrecibo where crecibo = @crecibo')
        return result.recordset;
    }
    catch (error) {
        console.log(error);
        return {
            error: error.message
        }
    }
}

const getClientOutstandingBalance = async (clientId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .input('bpago', sql.Bit, false)
            .query('select mcuota, mpagado from vwbuscarpagospendientesxcliente where ncliente = @ncliente and bpago = @bpago')
        let totalBalance = 0;
        if (result.recordset.length > 0) {
            result.recordset.forEach(amount => {
                totalBalance += (amount.mcuota - mpagado)
            })
        }
        return totalBalance;
    }
    catch (error) {
        console.log(error);
        return {
            error: error.message
        }
    }
}

const getContractOutstandingBalance = async (packageId, receiptId) => {
    try {
        let query = `
        SELECT			
            contrato.npaquete,contrato.mpaquete_cont,cuota.mcuota,cuota.mpagado, cuota.ccuota,
            (contrato.mpaquete_cont - cuota.mpagado ) as mpendiente,
            relPagoRec.crecibo
        FROM            
            dbo.cbcuotas as cuota INNER JOIN
            dbo.cbrecibos_det as relPagoRec ON cuota.npaquete = relPagoRec.npaquete AND cuota.ccuota = relPagoRec.ccuota INNER JOIN
            dbo.cbrecibos as recibo ON relPagoRec.crecibo = recibo.crecibo INNER JOIN
            dbo.pccontratos as contrato ON cuota.npaquete = contrato.npaquete INNER JOIN
            dbo.masucursales as sucursal ON contrato.csucursal = sucursal.csucursal INNER JOIN
            dbo.maclientes as cliente ON contrato.ncliente = cliente.ncliente INNER JOIN
            dbo.mavendedores as vendedor ON contrato.cvendedor = vendedor.cvendedor
            where contrato.bactivo = 1 and
        `
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('crecibo', sql.Int, receiptId)
            .input('bpago', sql.Bit, false)
            .input('bactivo', sql.Bit, true)
            .query(query + ' contrato.npaquete = @npaquete and relPagoRec.crecibo <= @crecibo')
        let totalBalance = 0;
        let paquete = 0;
        let cuotas = 0;
        if (result.recordset.length > 0) {
            result.recordset.forEach(amount => {
                paquete = amount.mpaquete_cont
                cuotas += amount.mpagado
            })
            totalBalance = paquete - cuotas

        }
        return totalBalance;
    }
    catch (error) {
        console.log(error);
        return {
            error: error.message
        }
    }
}

export default {
    createNewReceipt,
    createReceiptPaymentDistribution,
    getOneReceipt,
    getReceiptPaymentDistribution,
    getReceiptPaymentDistributionDetail,
    getReceiptPaymentInstallments,
    getClientOutstandingBalance,
    getContractOutstandingBalance
}