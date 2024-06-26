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

const ajustarFechaCobro = (fechaAnticipo, horaActual) => {
    // Clonar la fecha de anticipo para evitar modificar el objeto original
    let fechaCobro = new Date(fechaAnticipo);
    console.log(horaActual)
    // Si la hora actual es igual o mayor a las 7 PM (19 horas), y la fecha de anticipo es antes de hoy, ajusta la fecha de cobro al día siguiente
    if (horaActual >= 19) {
        fechaCobro.setDate(fechaCobro.getDate());
    }else{
        fechaCobro.setDate(fechaCobro.getDate());
    }
    console.log(fechaCobro)
    return fechaCobro;
};

const createNewPaymentInstallments = async (receiptId, paymentInstallmentsData) => {
    try {
        let horaActual = new Date().getHours();
        let fechaCobro = ajustarFechaCobro(paymentInstallmentsData.fanticipo, horaActual);
        //Se genera la cuota número 1 para el anticipo.
        let pool = await sql.connect(sqlConfig);
        let advanceInsert = await pool.request()
            .input('npaquete', sql.NVarChar, paymentInstallmentsData.npaquete)
            .input('ccuota', sql.Int, 1)
            .input('fpago', sql.Date, paymentInstallmentsData.fanticipo)
            .input('fcobro', sql.Date, fechaCobro)
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
            .input('ibono', sql.Bit, paymentInstallmentsData.bbono)
            .input('iliquidado', sql.Bit, paymentInstallmentsData.bliquidado)
            .input('igarantizada', sql.Bit, paymentInstallmentsData.bgarantizada)
            .query('update pccontratos set bcuotas = @bcuotas, igarantizada = @igarantizada , ibono = @ibono , iliquidado = @iliquidado where npaquete = @npaquete')
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

const updatePaymentInstallments = async ( paymentInstallmentsData) => {
        try {
            let pool = await sql.connect(sqlConfig)
            for (let i = 0; i < paymentInstallmentsData.cuotas.length ; i++) {
                let result = await pool.request()
                .input('npaquete', sql.NVarChar, paymentInstallmentsData.npaquete)
                .input('ccuota', sql.Int, paymentInstallmentsData.cuotas[i].ccuota)
                .input('fpago', sql.DateTime, paymentInstallmentsData.cuotas[i].fpago )
                .input('mcuota', sql.Numeric(17,2), paymentInstallmentsData.cuotas[i].mcuota)
                .query(
                    'update cbcuotas set fpago = @fpago , mcuota = @mcuota  where npaquete = @npaquete and ccuota = @ccuota'
                );

            }
            return true
                
            
    
        }
        catch (error) {
            return {
                error: error.message
            }
        }
    

}

export default {
    createNewPaymentInstallments,
    getContractPaymentInstallments,
    updatePaymentInstallments
}