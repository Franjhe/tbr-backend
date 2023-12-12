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
        let results = [];
        for (let i = 0; i < reportsCollection.csucursal.length; i++) {
            const sucursal= reportsCollection.csucursal[i]
            let result = await pool.request()
            .input('csucursal', sql.Int, sucursal)
            .input('fdesde', sql.Date, reportsCollection.fdesde)
            .input('fhasta', sql.Date, reportsCollection.fhasta)
            .input('bactivo', sql.Bit, true)
            .query(
                'WITH RankedResults AS (' +
                '  SELECT ' +
                '    npaquete, ' +
                '    fcontrato, ' +
                '    fpago, ' +
                '    mcuota, ' +
                '    mpagado, ' +
                '    mpaquete_cont, ' +
                '    xsucursal, ' +
                '    xmodalidad_pago, ' +
                '    xtipo_tarjeta, ' +
                '    ncliente, ' +
                '    xpos, ' +
                '    ROW_NUMBER() OVER (PARTITION BY ccuota, npaquete ORDER BY (SELECT NULL)) AS RowNum ' +
                '  FROM vwbuscarcobranzapendientexcliente ' +
                '  WHERE bactivo = @bactivo AND csucursal = @csucursal AND fcontrato >= @fdesde AND fcontrato <= @fhasta ' +
                ') ' +
                'SELECT ' +
                '  npaquete, ' +
                '  fcontrato, ' +
                '  fpago, ' +
                '  mcuota, ' +
                '  mpagado, ' +
                '  mpaquete_cont, ' +
                '  xsucursal, ' +
                '  xmodalidad_pago, ' +
                '  xtipo_tarjeta, ' +
                '  ncliente, ' +
                '  xpos ' +
                'FROM ' +
                '  RankedResults ' +
                'WHERE ' +
                '  RowNum = 1 ' +
                'ORDER BY npaquete'
            );
            results.push(result.recordset);
          }
          return results;
    } catch (error) {
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

const reportsSearchReceipt = async (reportsSearchReceipt) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, reportsSearchReceipt.ncliente)
            .query('select * from vwbuscarrecibosxpagos where ncliente = @ncliente');
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
    reportsCancelledAppointments,
    reportsSearchReceipt
}