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

// const reportsCollection = async (reportsCollection) => {
//     try {
//         let pool = await sql.connect(sqlConfig);
//         let results = [];
//         for (let i = 0; i < reportsCollection.csucursal.length; i++) {
//             const sucursal= reportsCollection.csucursal[i]
//             let result = await pool.request()
//             .input('csucursal', sql.Int, sucursal)
//             .input('fdesde', sql.Date, reportsCollection.fdesde)
//             .input('fhasta', sql.Date, reportsCollection.fhasta)
//             .input('bactivo', sql.Bit, true)
//             .input('ipago', sql.Char, 'A')
//             .query(
//                 'WITH RankedResults AS (' +
//                 '  SELECT ' +
//                 '    npaquete, ' +
//                 '    fcontrato, ' +
//                 '    fcobro, ' +
//                 '    mcuota, ' +
//                 '    mpagado, ' +
//                 '    mpaquete_cont, ' +
//                 '    xsucursal, ' +
//                 '    xmodalidad_pago, ' +
//                 '    xtipo_tarjeta, ' +
//                 '    ncliente, ' +
//                 '    xpos, ' +
//                 '    ROW_NUMBER() OVER (PARTITION BY ccuota, npaquete ORDER BY (SELECT NULL)) AS RowNum ' +
//                 '  FROM vwbuscarcobranzapendientexcliente ' +
//                 '  WHERE bactivo = @bactivo AND csucursal = @csucursal AND fcobro >= @fdesde AND fcobro <= @fhasta AND bpago = 1 ' +
//                 ') ' +
//                 'SELECT ' +
//                 '  npaquete, ' +
//                 '  fcontrato, ' +
//                 '  fcobro, ' +
//                 '  mcuota, ' +
//                 '  mpagado, ' +
//                 '  mpaquete_cont, ' +
//                 '  xsucursal, ' +
//                 '  xmodalidad_pago, ' +
//                 '  xtipo_tarjeta, ' +
//                 '  ncliente, ' +
//                 '  xpos ' +
//                 'FROM ' +
//                 '  RankedResults ' +
//                 'WHERE ' +
//                 '  RowNum = 1 ' +
//                 'ORDER BY npaquete'
//             );
//             results.push(result.recordset);
//           }
//           return results;
//     } catch (error) {
//         console.log(error.message);
//         return {
//             error: error.message
//         }
//     }
// }

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
            .query('SELECT * FROM vwbuscarcobranzapendientexcliente WHERE bactivo = @bactivo AND csucursal = @csucursal AND fcobro >= @fdesde AND fcobro <= @fhasta AND bpago = 1');
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
        let results = [];
        if(reportsSales.datos.csucursal.length && reportsSales.datos.vendedor.length){
            for (let i = 0; i < reportsSales.datos.csucursal.length; i++) {
                const sucursal = reportsSales.datos.csucursal[i];
                for (let j = 0; j < reportsSales.datos.vendedor.length; j++) {
                    const vendedor = reportsSales.datos.vendedor[j];
                    let result = await pool.request()
                        .input('csucursal', sql.Int, sucursal)
                        .input('fdesde', sql.Date, reportsSales.fdesde)
                        .input('fhasta', sql.Date, reportsSales.fhasta)
                        .input('ipago', sql.Char, 'A')
                        .input('bactivo', sql.Bit, true)
                        .input('cvendedor', sql.Int, vendedor)
                        .query(`
                            SELECT fcontrato, npaquete, xnombre, csucursal, xsucursal, 
                                mpaquete_cont, mcuota, (mpaquete_cont - mcuota) AS mpendiente, 
                                cvendedor, xvendedor, bactivo
                            FROM vwbuscarcobranzapendientexcliente
                            WHERE ipago = @ipago AND fcontrato >= @fdesde AND fcontrato <= @fhasta
                            AND (@cvendedor IS NULL OR cvendedor = @cvendedor)
                            AND (@csucursal IS NULL OR csucursal = @csucursal)
                        `);
    
                    results.push(result.recordset);
                }
            }
        }else{
            let result = await pool.request()
            .input('fdesde', sql.Date, reportsSales.fdesde)
            .input('fhasta', sql.Date, reportsSales.fhasta)
            .input('ipago', sql.Char, 'A')
            .input('bactivo', sql.Bit, true)
            .query(`
                SELECT fcontrato, npaquete, xnombre, csucursal, xsucursal, 
                    mpaquete_cont, mcuota, (mpaquete_cont - mcuota) AS mpendiente, 
                    cvendedor, xvendedor, bactivo
                FROM vwbuscarcobranzapendientexcliente
                WHERE ipago = @ipago AND fcontrato >= @fdesde AND fcontrato <= @fhasta
            `);

             results.push(result.recordset);
        }

        return results;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        };
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