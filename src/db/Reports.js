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

    let query = `
    SELECT			
        cuota.npaquete, cuota.ccuota, cuota.mcuota, cuota.bpago, cuota.bactivo, cuota.ipago,cuota.fpago,
        relPagoRec.crecibo,relPagoRec.mmonto_cuota AS mpagado,
        relRec.crecibo,
        pago_detalle.mpago,
        tarjeta.xtipo_tarjeta,punto_v.xpos,punto_v.cpos,modalidad.cmodalidad_pago,modalidad.xmodalidad_pago,
        contrato.mpaquete_cont, contrato.csucursal,contrato.fcontrato, contrato.ncliente, 
        sucursal.xsucursal, 
        recibo.fcobro,
        vendedor.cvendedor,vendedor.xvendedor ,cliente.xcliente

      FROM            
            dbo.cbcuotas as cuota INNER JOIN
            dbo.cbrecibos_det as relPagoRec ON cuota.npaquete = relPagoRec.npaquete AND cuota.ccuota = relPagoRec.ccuota INNER JOIN
            dbo.cbrecibos as recibo ON relPagoRec.crecibo = recibo.crecibo INNER JOIN
            dbo.pccontratos as contrato ON cuota.npaquete = contrato.npaquete INNER JOIN
            dbo.masucursales as sucursal ON contrato.csucursal = sucursal.csucursal INNER JOIN
            dbo.cbpagos_det as relRec ON relPagoRec.crecibo = relRec.crecibo INNER JOIN
            dbo.cbpagos as pago_detalle ON relRec.cpago = pago_detalle.cpago left outer JOIN
            dbo.mapos as punto_v ON pago_detalle.cpos = punto_v.cpos left outer JOIN
            dbo.matipo_tarjetas as tarjeta ON pago_detalle.ctipo_tarjeta = tarjeta.ctipo_tarjeta left outer JOIN
            dbo.mamodalidad_pago as modalidad ON pago_detalle.cmodalidad_pago = modalidad.cmodalidad_pago INNER JOIN
            dbo.maclientes as cliente ON contrato.ncliente = cliente.ncliente INNER JOIN
            dbo.mavendedores as vendedor ON contrato.cvendedor = vendedor.cvendedor
            where contrato.bactivo = 1 and `

const reportsCollection = async (reportsCollection) => {
  try {


      let pool = await sql.connect(sqlConfig);
      let results = [];

      if(reportsCollection.cvendedor){
          if(reportsCollection.csucursal.length > 0){
              for (let i = 0; i < reportsCollection.csucursal.length; i++) {
                  const sucursal= reportsCollection.csucursal[i]
                  
                  let result = await pool.request()
                  .input('csucursal', sql.Int, sucursal)
                  .input('fdesde', sql.Date, reportsCollection.fdesde)
                  .input('fhasta', sql.Date, reportsCollection.fhasta)
                  .input('cvendedor', sql.Int, reportsCollection.cvendedor)
                  .input('bactivo', sql.Bit, true)
                  .query( query + ` recibo.fcobro >= @fdesde and recibo.fcobro <= @fhasta
                          and contrato.csucursal = @csucursal `);
                  results.push(result.recordset);
              }
          }else{
              console.log(reportsCollection)
              let result = await pool.request()
              .input('csucursal', sql.Int, reportsCollection.csucursal)
              .input('fdesde', sql.Date, reportsCollection.fdesde)
              .input('fhasta', sql.Date, reportsCollection.fhasta)
              .input('cvendedor', sql.Int, reportsCollection.cvendedor)
              .input('bactivo', sql.Bit, true)
              .query(query + ` recibo.fcobro >= @fdesde and recibo.fcobro <= @fhasta
                      and contrato.csucursal = @csucursal `);
              results.push(result.recordset);  
          }

      }else{
          for (let i = 0; i < reportsCollection.csucursal.length; i++) {
              const sucursal= reportsCollection.csucursal[i]
              let result = await pool.request()
              .input('csucursal', sql.Int, sucursal)
              .input('fdesde', sql.Date, reportsCollection.fdesde)
              .input('fhasta', sql.Date, reportsCollection.fhasta)
              .input('bactivo', sql.Bit, true)
              .query(query + ` recibo.fcobro >= @fdesde and recibo.fcobro <= @fhasta
                      and contrato.csucursal = @csucursal `);
              results.push(result.recordset);
          }
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
        if(reportsSales.datos.csucursal.length > 0 && reportsSales.datos.vendedor.length > 0){
            for (let i = 0; i < reportsSales.datos.csucursal.length; i++) {
                const sucursal = reportsSales.datos.csucursal[i];
                for (let j = 0; j < reportsSales.datos.vendedor.length; j++) {
                    const vendedor = reportsSales.datos.vendedor[j];
                    let result = await pool.request()
                        .input('csucursal', sql.Int, sucursal)
                        .input('fdesde', sql.Date, reportsSales.fdesde)
                        .input('fhasta', sql.Date, reportsSales.fhasta)
                        .input('ipago', sql.Char, 'A')
                        .input('cvendedor', sql.Int, vendedor)
                        .query(query +` cuota.ipago = 'A' 
                            AND contrato.fcontrato >= @fdesde 
                            AND contrato.fcontrato <= @fhasta
                            AND contrato.csucursal = @csucursal
                            AND contrato.cvendedor = @cvendedor
                         
                      `);
    
                    results.push(result.recordset);
                }
            }
        }else if(reportsSales.datos.csucursal.length > 0 && !reportsSales.datos.vendedor.length){
            for (let i = 0; i < reportsSales.datos.csucursal.length; i++) {
                const sucursal = reportsSales.datos.csucursal[i];
                let result = await pool.request()
                    .input('csucursal', sql.Int, sucursal)
                    .input('fdesde', sql.Date, reportsSales.fdesde)
                    .input('fhasta', sql.Date, reportsSales.fhasta)
                    .input('ipago', sql.Char, 'A')
                    .input('bactivo', sql.Bit, true)
                    .query( query +`
                        cuota.ipago = 'A' 
                        AND contrato.fcontrato >= @fdesde 
                        AND contrato.fcontrato <= @fhasta
                        AND contrato.csucursal = @csucursal 
                        `);
    
                results.push(result.recordset);
            }
        }else if(!reportsSales.datos.csucursal.length && reportsSales.datos.vendedor.length > 0){
                for (let j = 0; j < reportsSales.datos.vendedor.length; j++) {
                    const vendedor = reportsSales.datos.vendedor[j];
                    let result = await pool.request()
                        .input('fdesde', sql.Date, reportsSales.fdesde)
                        .input('fhasta', sql.Date, reportsSales.fhasta)
                        .input('ipago', sql.Char, 'A')
                        .input('bactivo', sql.Bit, true)
                        .input('cvendedor', sql.Int, vendedor)
                        .query(query + `
                            cuota.ipago = 'A' 
                            AND contrato.fcontrato >= @fdesde 
                            AND contrato.fcontrato <= @fhasta
                            AND contrato.cvendedor = @cvendedor
                             `);
    
                    results.push(result.recordset);
                }
        }else{
            let result = await pool.request()
            .input('fdesde', sql.Date, reportsSales.fdesde)
            .input('fhasta', sql.Date, reportsSales.fhasta)
            .input('ipago', sql.Char, 'A')
            .input('bactivo', sql.Bit, true)
            .query(query +
                `cuota.ipago = 'A' 
                AND contrato.fcontrato >= @fdesde 
                AND contrato.fcontrato <= @fhasta
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