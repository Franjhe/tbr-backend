import sql from "mssql";
import moment from "moment";

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

const createNewPaymentInstallments = async (receiptId, paymentInstallmentsData) => {
    try {
        //Se genera la cuota número 1 para el anticipo.
        let pool = await sql.connect(sqlConfig);
        let advanceInsert = await pool.request()
            .input('npaquete', sql.NVarChar, paymentInstallmentsData.npaquete)
            .input('ccuota', sql.Int, 1)
            .input('fpago', sql.Date, paymentInstallmentsData.fanticipo)
            .input('fcobro', sql.Date, paymentInstallmentsData.fanticipo)
            .input('ipago', sql.NVarChar, 'A')
            .input('bpago', sql.Bit, true)
            .input('bactivo', sql.Bit, true)
            .input('mcuota', sql.Numeric(11,2), paymentInstallmentsData.manticipo)
            .input('mpagado', sql.Numeric(11,2), paymentInstallmentsData.manticipo)
            .query('insert into cbcuotas (npaquete, ccuota, fpago, fcobro, ipago, bpago, bactivo, mcuota, mpagado) output inserted.ccuota '
                               + 'values (@npaquete, @ccuota, @fpago, @fcobro, @ipago, @bpago, @bactivo, @mcuota, @mpagado)'
            )
        //Se crea el detalle del recibo para el anticipo.
        await pool.request()
            .input('crecibo', sql.Int, receiptId)
            .input('ccuota', sql.Int, advanceInsert.recordset[0].ccuota)
            .input('npaquete', sql.NVarChar, paymentInstallmentsData.npaquete)
            .input('mmonto_cuota', sql.Numeric(11,2), paymentInstallmentsData.manticipo)
            .query('insert into cbrecibos_det (crecibo, ccuota, npaquete, mmonto_cuota) '
                               + 'values (@crecibo, @ccuota, @npaquete, @mmonto_cuota)'
            )
        //Se generan el resto de cuotas, a partir del ccuota número 2.
        let paymentInstallmentsRowsAffected = 0;
        if (paymentInstallmentsData.cuotas.length > 0) {
            for (let i = 0; i < paymentInstallmentsData.cuotas.length ; i++) {
                await pool.request()
                    .input('npaquete', sql.NVarChar, paymentInstallmentsData.npaquete)
                    .input('ccuota', sql.Int, i + 2)
                    .input('fpago', sql.DateTime, paymentInstallmentsData.cuotas[i].fpago ? paymentInstallmentsData.cuotas[i].fpago : undefined)
                    .input('ipago', sql.NVarChar, 'F')
                    .input('bpago', sql.Bit, false)
                    .input('bactivo', sql.Bit, true)
                    .input('mcuota', sql.Numeric(11,2), paymentInstallmentsData.cuotas[i].mcuota)
                    .input('mpagado', sql.Numeric(11,2), 0)
                    .query(
                        'insert into cbcuotas (npaquete, ccuota, fpago, ipago, bpago, bactivo, mcuota, mpagado) ' 
                                    + 'values (@npaquete, @ccuota, @fpago, @ipago, @bpago, @bactivo, @mcuota, @mpagado)'
                    );
                    paymentInstallmentsRowsAffected ++
            }
        }
        //Se actualiza el status de bcuotas del contrato.
        await pool.request()
            .input('npaquete', sql.NVarChar, paymentInstallmentsData.npaquete)
            .input('bcuotas', sql.Bit, true)
            .query('update pccontratos set bcuotas = @bcuotas where npaquete = @npaquete')
        return {
            npaquete: paymentInstallmentsData.npaquete
        }
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getContractPaymentInstallments = async (packageId) => {
    try {
        let pool = await sql.connect(sqlConfig)
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .query('select ccuota, fpago, ipago, bpago, mcuota from cbcuotas where npaquete = @npaquete')
        let receiptResult  = await pool.request()
            .input('ccuota', sql.Int, result.recordset[0].ccuota)
            .input('npaquete', sql.NVarChar, packageId)
            .query('select crecibo from cbrecibos_det where npaquete = @npaquete and ccuota = @ccuota')
        return {
            fanticipo: result.recordset[0].fpago,
            manticipo: result.recordset[0].mcuota,
            ncuotas: result.recordset.length - 1,
            crecibo: receiptResult.recordset[0].crecibo,
            cuotas: result.recordset.slice(1)
        }
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    createNewPaymentInstallments,
    getContractPaymentInstallments
}