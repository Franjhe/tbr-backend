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

const createNewContract = async (userData, contractData) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, contractData.npaquete)
            .input('ipaquete_tipo', sql.NVarChar, contractData.ipaquete_tipo)
            .input('csucursal', sql.Int, contractData.csucursal)
            .input('ncliente', sql.Int, contractData.ncliente)
            .input('fcontrato', sql.Date, contractData.fcontrato)
            .input('cvendedor', sql.Int, contractData.cvendedor)
            .input('ctipocom', sql.Int, contractData.ctipocom)
            .input('cterapeuta', sql.Int, contractData.cterapeuta ? contractData.cterapeuta : undefined)
            .input('crrss', sql.Int, contractData.crrss ? contractData.crrss : undefined)
            .input('mtotal', sql.Numeric(11,2), contractData.mtotal)
            .input('pdesc', sql.Numeric(11,2), contractData.pdesc)
            .input('mdesc', sql.Numeric(11,2), contractData.mdesc)
            .input('mpaquete', sql.Numeric(11,2), contractData.mpaquete)
            .input('mbono_cupon', sql.Numeric(11,2), contractData.mbono_cupon ? contractData.mbono_cupon : undefined)
            .input('mpaquete_cont', sql.Numeric(11,2), contractData.mpaquete_cont)
            .input('bactivo', sql.Bit, true)
            .input('igarantizada', sql.Bit, true)
            .input('bcuotas', sql.Bit, false)
            .input('bprimerasesion', sql.Bit, false)
            .query(
                'insert into pccontratos (npaquete, ipaquete_tipo, csucursal, ncliente, fcontrato, cvendedor, ctipocom, cterapeuta, crrss, mtotal, pdesc, mdesc, mpaquete, mbono_cupon, mpaquete_cont, bactivo, igarantizada,  bcuotas, bprimerasesion) output inserted.ncontrato ' 
                              + 'values (@npaquete, @ipaquete_tipo, @csucursal, @ncliente, @fcontrato, @cvendedor, @ctipocom, @cterapeuta, @crrss, @mtotal, @pdesc, @mdesc, @mpaquete, @mbono_cupon, @mpaquete_cont, @bactivo, @igarantizada, @bcuotas, @bprimerasesion)'
            );
        if (parseInt(result.rowsAffected) > 0){
            for (let i = 0; i < contractData.clientes.length; i++) {
                let subresult = await pool.request()
                    .input('ncontrato', sql.Int, result.recordset[0].ncontrato)
                    .input('npaquete', sql.NVarChar, contractData.npaquete)
                    .input('ncliente', sql.Int, contractData.clientes[i].ncliente)
                    .input('ncliente_cont', sql.Int, contractData.ncliente)
                    .input('cgrupo', sql.Int, contractData.clientes[i].tratamiento.cgrupo)
                    .input('ctratamiento', sql.Int, contractData.clientes[i].tratamiento.ctratamiento)
                    .input('csucursal', sql.Int, contractData.csucursal)
                    .input('ipaquete_tipo', sql.NVarChar, contractData.ipaquete_tipo)
                    .input('mprecio_min', sql.Numeric(11,2), contractData.clientes[i].tratamiento.mprecio_min)
                    .input('nsesiones', sql.Int, contractData.clientes[i].tratamiento.nsesiones)
                    .input('bfinalizado', sql.Bit, false)
                    .input('bactivo', sql.Bit, true)
                    .query(
                        'insert into pccontratos_det (ncontrato, npaquete, ncliente, cgrupo, ctratamiento, ncliente_cont, csucursal, ipaquete_tipo, mprecio_min, nsesiones, bfinalizado, bactivo) '
                                         + 'values (@ncontrato, @npaquete, @ncliente, @cgrupo, @ctratamiento, @ncliente_cont, @csucursal, @ipaquete_tipo, @mprecio_min, @nsesiones, @bfinalizado, @bactivo)'
                    )
            }

        }
        //let treatments = [];
        //contractData.tratamientos.forEach(treatment => treatments.push(treatment.cgrupo + ' - ' + treatment.ctratamiento));
        return {
            npaquete: contractData.npaquete
            //treatments: treatments.join(', ')
        }
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfContractExists = async (packageId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .query('select npaquete from pccontratos where npaquete = @npaquete')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].npaquete;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getAllContracts = async (searchData) => {

    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, searchData.csucursal ? searchData.csucursal : null)
            .input('ncliente', sql.Int, searchData.ncliente ? searchData.ncliente : null)
            .input('bactivo', sql.Bit, true)
            .query(
                `select npaquete,documentos_paquete, ncliente, xcliente, xsucursal, fcontrato, xvendedor, ipaquete_tipo, mpaquete_cont, bactivo, bcuotas, bprimerasesion `
                + `from vwbuscarcontratos where bactivo = @bactivo ${searchData.ncliente ? `and ncliente = '${searchData.ncliente}'` : ''}  ${searchData.csucursal ? `and csucursal = '${searchData.csucursal}'` : ''}  order by fcontrato desc`
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

const getAllContractsSeller = async (searchData,userData) => {

    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, searchData.csucursal ? searchData.csucursal : null)
            .input('cusuario_vend', sql.Int, userData.cusuario ? userData.cusuario : null)
            .input('ncliente', sql.Int, searchData.ncliente ? searchData.ncliente : null)
            .input('bactivo', sql.Bit, true)
            .query(
                `select npaquete, ncliente, xcliente, xsucursal, fcontrato, xvendedor, ipaquete_tipo, mpaquete_cont, bactivo, bcuotas, bprimerasesion `
                + `from vwbuscarcontratos where bactivo = @bactivo ${searchData.ncliente ? `and ncliente = '${searchData.ncliente}'` : ''}  ${searchData.csucursal ? `and csucursal = '${searchData.csucursal}'` : ''}  ${userData.cusuario ? `and cusuario_vend = '${userData.cusuario}'` : ''}order by fcontrato desc`
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

const getOneContract = async (packageId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .query(
                'select npaquete, ncontrato, csucursal, fcontrato, igarantizada, ipaquete_tipo, ncliente, ctipocom, cvendedor, crrss, cterapeuta, mtotal, pdesc, mdesc, mpaquete, mbono_cupon, mpaquete_cont, bactivo, bcuotas, bprimerasesion '
                + 'from vwbuscarcontratos where npaquete = @npaquete'
            );
        if (result.rowsAffected[0] === 0) {
            return false;
        }

            let document =  await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .query(
                'select id, xruta, ndocumento from pcdocumentos where npaquete = @npaquete AND bactivo = 1 ORDER BY ndocumento ASC'
                );


        let subresult = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .query(
                'select ncliente, cgrupo, ctratamiento, cgrupo_ant, ctratamiento_ant, xtratamiento, xtratamiento_ant, ncliente_ant, mprecio_min, nsesiones, xcomentario, bactivo '
                + 'from vwbuscartratamientosxcontrato where npaquete = @npaquete'
            )
        let clientes = subresult.recordset.map(function (client) {
            return {
                ncliente: client.ncliente,
                tratamientos: {
                    cgrupo: client.cgrupo,
                    ctratamiento: client.ctratamiento,
                    xtratamiento: client.xtratamiento,
                    cgrupo_ant: client.cgrupo_ant,
                    ctratamiento_ant: client.ctratamiento_ant,
                    xtratamiento_ant: client.xtratamiento_ant,
                    ncliente_ant: client.ncliente_ant,
                    mprecio_min: client.mprecio_min,
                    nsesiones: client.nsesiones,
                    xcomentario: client.xcomentario,
                    bactivo: client.bactivo
                },
                documentos : document.recordsets
            }
        });

        let documentos = document.recordset.map(function (document) {
            return {
                ruta: document.xruta,
                ndocumento: document.ndocumento,
                id: document.id
            }
        });

        result.recordset[0].clientes = clientes;
        return { 
            value : result.recordset[0],
            documents : documentos
        
        };
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const updateOneContract = async (userData, contractChanges, packageId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ipaquete_tipo', sql.NVarChar, contractChanges.ipaquete_tipo)
            .input('ncliente', sql.Int, contractChanges.ncliente)
            .input('fcontrato', sql.Date, contractChanges.fcontrato)
            .input('cvendedor', sql.Int, contractChanges.cvendedor)
            .input('ctipocom', sql.Int, contractChanges.ctipocom)
            .input('cterapeuta', sql.Int, contractChanges.cterapeuta ? contractChanges.cterapeuta : undefined)
            .input('crrss', sql.Int, contractChanges.crrss ? contractChanges.crrss : undefined)
            .input('mtotal', sql.Numeric(11,2), contractChanges.mtotal)
            .input('pdesc', sql.Numeric(11,2), contractChanges.pdesc)
            .input('mdesc', sql.Numeric(11,2), contractChanges.mdesc)
            .input('mpaquete', sql.Numeric(11,2), contractChanges.mpaquete)
            .input('mbono_cupon', sql.Numeric(11,2), contractChanges.mbono_cupon ? contractChanges.mbono_cupon : undefined)
            .input('mpaquete_cont', sql.Numeric(11,2), contractChanges.mpaquete_cont)
            .query('update pccontratos set ipaquete_tipo = @ipaquete_tipo, ncliente = @ncliente, fcontrato = @fcontrato, cvendedor = @cvendedor,' 
                 + 'ctipocom = @ctipocom, cterapeuta = @cterapeuta, crrss = @crrss, mtotal = @mtotal, pdesc = @pdesc, mdesc = @mdesc, mpaquete = @mpaquete, mbono_cupon = @mbono_cupon,'
                 + 'mpaquete_cont = @mpaquete_cont output deleted.ncontrato '
                 + 'where npaquete = @npaquete')
        await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .query('delete from pccontratos_det where npaquete = @npaquete')
        if (parseInt(result.rowsAffected) > 0){
            for (let i = 0; i < contractChanges.clientes.length; i++) {
                await pool.request()
                    .input('ncontrato', sql.Int, result.recordset[0].ncontrato)
                    .input('npaquete', sql.NVarChar, packageId)
                    .input('ncliente', sql.Int, contractChanges.clientes[i].ncliente)
                    .input('ncliente_cont', sql.Int, contractChanges.ncliente)
                    .input('cgrupo', sql.Int, contractChanges.clientes[i].tratamiento.cgrupo)
                    .input('ctratamiento', sql.Int, contractChanges.clientes[i].tratamiento.ctratamiento)
                    .input('ipaquete_tipo', sql.NVarChar, contractChanges.ipaquete_tipo)
                    .input('mprecio_min', sql.Numeric(11,2), contractChanges.clientes[i].tratamiento.mprecio_min)
                    .input('nsesiones', sql.Int, contractChanges.clientes[i].tratamiento.nsesiones)
                    .input('bfinalizado', sql.Bit, false)
                    .input('bactivo', sql.Bit, true)
                    .query(
                        'insert into pccontratos_det (ncontrato, npaquete, ncliente, cgrupo, ctratamiento, ncliente_cont, ipaquete_tipo, mprecio_min, nsesiones, bfinalizado, bactivo)'
                                         + 'values (@ncontrato, @npaquete, @ncliente, @cgrupo, @ctratamiento, @ncliente_cont, @ipaquete_tipo, @mprecio_min, @nsesiones, @bfinalizado, @bactivo)'
                    )
            }


        }
        return {
            npaquete: packageId
        };
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const deleteDocumentOneContract = async(id) => {
    try {
        let pool = await sql.connect(sqlConfig)
        let preresult = await sql.query`SELECT * FROM pcdocumentos WHERE id = ${id}`
            if(preresult.recordset.length > 0){
                let check = await sql.query`UPDATE pcdocumentos SET bactivo = 0 WHERE id = ${id}`
            }
        return preresult
    } catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const uploadDocumentOneContract = async (userData, contractChanges, packageId) => {
    try {
        let pool = await sql.connect(sqlConfig)
        for (let i = 0; i < contractChanges.length; i++) {
            if(contractChanges[i].ndocumento < 8) {
                let preresult = await sql.query`SELECT * FROM pcdocumentos WHERE npaquete = ${packageId} AND ndocumento = ${contractChanges[i].ndocumento}`
                if(preresult.recordset.length > 0){
                    let check = await sql.query`UPDATE pcdocumentos SET bactivo = 0 WHERE npaquete = ${packageId} AND ndocumento = ${contractChanges[i].ndocumento}`
                }
            }
            let result = await pool.request()
                    .input('xruta', sql.NVarChar, contractChanges[i].ruta)
                    .input('ndocumento', sql.Numeric(4,0), contractChanges[i].ndocumento)
                    .input('npaquete', sql.NVarChar, packageId)
                    .input('fingreso', sql.DateTime, new Date())
                    .input('cusuario', sql.Numeric(4,0), userData.cusuario)
                    .query('insert into pcdocumentos (xruta , npaquete, fingreso, cusuario, ndocumento, bactivo) values (@xruta, @npaquete, @fingreso, @cusuario, @ndocumento, 1) ')
                }
        return {
            status: true
        };
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getOneContractTreatment = async (packageId, clientId, groupId, treatmentId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ncliente', sql.Int, clientId)
            .input('cgrupo', sql.Int, groupId)
            .input('ctratamiento', sql.Int, treatmentId)
            .query('select mprecio_min, nsesiones, bactivo from pccontratos_det where npaquete = @npaquete and ncliente = @ncliente and cgrupo = @cgrupo and ctratamiento = @ctratamiento')
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const changeOneContractTreatment = async (packageId, treatmentToDelete, treatmentToCreate, amountDifference, newContractAmount) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ncliente', sql.Int, treatmentToDelete.ncliente)
            .input('cgrupo', sql.Int, treatmentToDelete.cgrupo)
            .input('ctratamiento', sql.Int, treatmentToDelete.ctratamiento)
            .query('delete pccontratos_det output deleted.ncontrato where npaquete = @npaquete and ncliente = @ncliente and cgrupo = @cgrupo and ctratamiento = @ctratamiento')
        await pool.request()
            .input('ncontrato', sql.Int, result.recordset[0].ncontrato)
            .input('npaquete', sql.NVarChar, packageId)
            .input('ncliente', sql.Int, treatmentToCreate.ncliente)
            .input('cgrupo', sql.Int, treatmentToCreate.cgrupo)
            .input('ctratamiento', sql.Int, treatmentToCreate.ctratamiento)
            .input('cgrupo_ant', sql.Int, treatmentToDelete.cgrupo)
            .input('ctratamiento_ant', sql.Int, treatmentToDelete.ctratamiento)
            .input('ncliente_ant', sql.Int, treatmentToDelete.ncliente)
            .input('nsesiones', sql.Int, treatmentToCreate.nsesiones)
            .input('mprecio_min', sql.Numeric(11,2), treatmentToCreate.mprecio_min)
            .input('xcomentario', sql.NVarChar, treatmentToCreate.xcomentario)
            .input('bfinalizado', sql.Bit, false)
            .input('bactivo', sql.Bit, true)
            .query(
                'insert into pccontratos_det (ncontrato, npaquete, ncliente, cgrupo, ctratamiento, cgrupo_ant, ctratamiento_ant, ncliente_ant, nsesiones, mprecio_min, xcomentario, bfinalizado, bactivo) '
                                    + 'values (@ncontrato, @npaquete, @ncliente, @cgrupo, @ctratamiento, @cgrupo_ant, @ctratamiento_ant, @ncliente_ant, @nsesiones, @mprecio_min, @xcomentario, @bfinalizado, @bactivo)'
            )
        if (amountDifference !== 0) {
            await pool.request()
                .input('npaquete', sql.NVarChar, packageId)
                .input('mpaquete_cont', sql.Numeric(11,2), newContractAmount)
                .query('update pccontratos set mpaquete_cont = @mpaquete_cont where npaquete = @npaquete')
            let paymentInstallmentMaxId = await pool.request()
                .input('npaquete', sql.NVarChar, packageId)
                .query('select max(ccuota) as maxId from cbcuotas where npaquete = @npaquete')
            let paymentDate = new Date();
            let year = paymentDate.getFullYear();
            let month = paymentDate.getMonth() + 1; // Se suma 1, porque el mes empieza en 0
            let day = paymentDate.getDate();
            await pool.request()
                .input('npaquete', sql.NVarChar, packageId)
                .input('ccuota', sql.Int, paymentInstallmentMaxId.recordset[0].maxId + 1)
                .input('fpago', sql.Date, `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)
                .input('ipago', sql.NVarChar, 'C')
                .input('bpago', sql.Bit, false)
                .input('bactivo', sql.Bit, true)
                .input('mcuota', sql.Numeric(11,2), amountDifference)
                .input('mpagado', sql.Numeric(11,2), 0)
                .query(
                    'insert into cbcuotas (npaquete, ccuota, fpago, ipago, bpago, bactivo, mcuota, mpagado) output inserted.ccuota '
                               + 'values (@npaquete, @ccuota, @fpago, @ipago, @bpago, @bactivo, @mcuota, @mpagado)'
                )
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

const addSessionsToTreatment = async (packageId, newCourtesySession) => {
    try {
        let pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ncliente', sql.Int, newCourtesySession.ncliente)
            .input('cgrupo', sql.Int, newCourtesySession.cgrupo)
            .input('ctratamiento', sql.Int, newCourtesySession.ctratamiento)
            .input('nsesiones', sql.Int, newCourtesySession.nsesiones)
            .input('xcomentario', sql.NVarChar, newCourtesySession.xcomentario)
            .query(
                'update pccontratos_det set nsesiones = nsesiones + @nsesiones, xcomentario = @xcomentario where npaquete = @npaquete and ncliente = @ncliente and cgrupo = @cgrupo and ctratamiento = @ctratamiento '
            )
        return true;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const decreaseNumberOfSessions = async (packageId, treatment, numberOfSessions) => {
    try {
        let pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ncliente', sql.Int, treatment.ncliente)
            .input('cgrupo', sql.Int, treatment.cgrupo)
            .input('ctratamiento', sql.Int, treatment.ctratamiento)
            .input('nsesiones', sql.Int, numberOfSessions)
            .query('update pccontratos_det set nsesiones = @nsesiones where npaquete = @npaquete and ncliente = @ncliente and cgrupo = @cgrupo and ctratamiento = @ctratamiento')
        return true;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const createNewCourtesySession = async (packageId, packageNumber, newCourtesySession) => {
    try {
        let pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ncontrato', sql.Int, packageNumber)
            .input('ncliente', sql.Int, newCourtesySession.ncliente)
            .input('cgrupo', sql.Int, newCourtesySession.cgrupo)
            .input('ctratamiento', sql.Int, newCourtesySession.ctratamiento)
            .input('nsesiones', sql.Int, newCourtesySession.nsesiones)
            .input('mprecio_min', sql.Numeric(11,2), 0)
            .input('xcomentario', sql.NVarChar, newCourtesySession.xcomentario)
            .input('bfinalizado', sql.Bit, false)
            .input('bactivo', sql.Bit, true)
            .query(
                'insert into pccontratos_det (ncontrato, npaquete, ncliente, cgrupo, ctratamiento, nsesiones, mprecio_min, xcomentario, bfinalizado, bactivo) '
                                    + 'values (@ncontrato, @npaquete, @ncliente, @cgrupo, @ctratamiento, @nsesiones, @mprecio_min, @xcomentario, @bfinalizado, @bactivo)'
            )
        return true;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfContractTreatmentExists = async (packageId, treatment) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ncliente', sql.Int, treatment.ncliente)
            .input('cgrupo', sql.Int, treatment.cgrupo)
            .input('ctratamiento', sql.Int, treatment.ctratamiento)
            .input('mprecio_min', sql.Numeric(11,2), treatment.mprecio_min)
            .input('nsesiones', sql.Int, treatment.nsesiones)
            .query('select bactivo from pccontratos_det where npaquete = @npaquete and ncliente = @ncliente and cgrupo = @cgrupo and ctratamiento = @ctratamiento and mprecio_min = @mprecio_min and nsesiones = @nsesiones')
        if (result.recordset.length === 0) {
            return false;
        }
        return {
            bactivo: result.recordset[0].bactivo
        };
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfContractTreatmentAlreadyExists = async (packageId, treatment) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('ncliente', sql.Int, treatment.ncliente)
            .input('cgrupo', sql.Int, treatment.cgrupo)
            .input('ctratamiento', sql.Int, treatment.ctratamiento)
            .query('select * from pccontratos_det where npaquete = @npaquete and ncliente = @ncliente and cgrupo = @cgrupo and ctratamiento = @ctratamiento')
        if (result.recordset.length > 0) {
            return false;
        }
        return true
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const deleteOneContract = async (packageId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('bactivo', sql.Bit, false)
            .query('update pccontratos set bactivo = @bactivo where npaquete = @npaquete')
        await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('bactivo', sql.Bit, false)
            .query('update pccontratos_det set bactivo = @bactivo where npaquete = @npaquete')
        await pool.request()
            .input('npaquete', sql.NVarChar, packageId)
            .input('bactivo', sql.Bit, false)
            .query('update cbcuotas set bactivo = @bactivo where npaquete = @npaquete')
        return {
            npaquete: packageId
        };
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

//Retorna una lista con todos los contratos asociados a un cliente, ya sea el titular único del contrato
//o pertenezca al grupo de clientes de un contrato grupal.
const getClientAssociatedContracts = async (clientId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .input('bactivo', sql.Bit, true)
            .query(
                'select npaquete from pccontratos where ncliente = @ncliente and bactivo = @bactivo ' +
                'union ' +
                'select distinct npaquete from pccontratos_det where ncliente = @ncliente and bactivo = @bactivo'
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

export default {
    createNewContract,
    verifyIfContractExists,
    getAllContracts,
    getOneContract,
    updateOneContract,
    deleteDocumentOneContract,
    uploadDocumentOneContract,
    getOneContractTreatment,
    changeOneContractTreatment,
    addSessionsToTreatment,
    decreaseNumberOfSessions,
    createNewCourtesySession,
    verifyIfContractTreatmentExists,
    verifyIfContractTreatmentAlreadyExists,
    deleteOneContract,
    getClientAssociatedContracts,
    getAllContractsSeller
}