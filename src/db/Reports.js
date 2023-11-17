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

const reportsCollection = async (reportsCollection) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, reportsCollection.csucursal)
            .input('fdesde', sql.Date, reportsCollection.fdesde)
            .input('fhasta', sql.Date, reportsCollection.fhasta)
            .input('bpago', sql.Bit, false)
            .input('bactivo', sql.Bit, true)
            .query(
                'select npaquete, mpaquete_cont, fcontrato, xsucursal, ccuota, ipago, mcuota, fpago , ncliente '
                + 'from vwbuscarcobranzapendientexcliente where bpago = @bpago and bactivo = @bactivo and csucursal = @csucursal and fpago >= @fdesde AND fpago <= @fhasta'
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

const reportsSales = async (reportsSales) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, reportsSales.csucursal)
            .input('fdesde', sql.Date, reportsSales.fdesde)
            .input('fhasta', sql.Date, reportsSales.fhasta)
            .input('igarantizada', sql.Char, 'S')
            .input('bactivo', sql.Bit, true)
            .query('select * from vwbuscarcontratosxvendedores where bactivo = @bactivo and csucursal = @csucursal and fcontrato >= @fdesde AND fcontrato <= @fhasta ');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const reportsCancelledAppointments = async (reportsCancelledAppointments) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, reportsCancelledAppointments.csucursal)
            .input('fdesde', sql.Date, reportsCancelledAppointments.fdesde)
            .input('fhasta', sql.Date, reportsCancelledAppointments.fhasta)
            .query('select * from vwbuscarcitasanuladas where csucursal = @csucursal and fentrada >= @fdesde AND fentrada <= @fhasta');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    reportsCollection,
    reportsSales,
    reportsCancelledAppointments
}