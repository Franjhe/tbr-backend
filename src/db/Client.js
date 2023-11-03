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

const getAllClients = async (clientData) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, clientData.csucursal ? clientData.csucursal : null)
            .input('xnombre', sql.NVarChar, clientData.xnombre ? clientData.xnombre : null)
            .input('cid', sql.NVarChar, clientData.cid ? clientData.cid : null)
            .input('bactivo', sql.Bit, true)
            .query(
                `select ncliente, ncont_ant, xcliente, cid, csucursal `
                + `from vwbuscarclientes where bactivo = @bactivo  ${clientData.csucursal ? `and csucursal = @csucursal` : '' }  ${clientData.xnombre ? `and xcliente like '%${clientData.xnombre}%'` : ''} ${clientData.cid ? `and cid = @cid` : '' } `
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

const getOneClient = async (clientId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .input('bactivo', sql.Bit, true)
            .query(
                `select ncliente, ncont_ant, xnombre, xapepaterno, xapematerno, xcliente, fnac, isexo, ctelefono, cid, xcorreo, fingreso, xdireccion, xpostal, cestado, cciudad, xcolonia, csucursal `
                + `from vwbuscarclientes where bactivo = @bactivo and ncliente = @ncliente `
            );
        if (result.rowsAffected[0] === 0) {
            return false;
        }
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getClientTreatments = async (clientId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .input('bfinalizado', sql.Bit, false)
            .query(
                'select npaquete, cgrupo, ctratamiento, xtratamiento, nsesiones, ntiempo_min, bpermitedoblecabina '
                + 'from vwbuscartratamientosxcontrato where ncliente = @ncliente and bfinalizado = @bfinalizado order by ncontrato desc'
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

const createNewClient = async (userData, clientData) => {
    try {
        let xpostal;
        if (clientData.xpostal) {
            xpostal = clientData.xpostal.toString();
        }
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('xnombre', sql.NVarChar, clientData.xnombre)
            .input('xapepaterno', sql.NVarChar, clientData.xapepaterno)
            .input('xapematerno', sql.NVarChar, clientData.xapematerno)
            .input('xcliente', sql.NVarChar, clientData.xnombre + ' ' + clientData.xapepaterno + ' ' + clientData.xapematerno)
            .input('fnac', sql.Date, clientData.fnac)
            .input('isexo', sql.NVarChar, clientData.isexo)
            .input('ctelefono', sql.NVarChar, clientData.ctelefono)
            .input('cid', sql.NVarChar, clientData.cid)
            .input('xdireccion', sql.NVarChar, clientData.xdireccion ? clientData.xdireccion : undefined)
            .input('cestado', sql.Int, clientData.cestado)
            .input('cciudad', sql.Int, clientData.cciudad)
            .input('xcolonia', sql.NVarChar, clientData.xcolonia ? clientData.xcolonia : undefined)
            .input('xpostal', sql.NVarChar, xpostal ? xpostal : undefined)
            .input('xcorreo', sql.NVarChar, clientData.xcorreo)
            .input('csucursal', sql.Int, clientData.csucursal)
            .input('fingreso', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            .input('bactivo', sql.Bit, true)
            .query(
                'insert into maclientes (xnombre, xapepaterno, xapematerno, xcliente, fnac, isexo, ctelefono, cid, xdireccion, cestado, cciudad, xcolonia, xpostal, xcorreo, csucursal, fingreso, bactivo) output inserted.ncliente ' 
                + 'values (@xnombre, @xapepaterno, @xapematerno, @xcliente, @fnac, @isexo, @ctelefono, @cid, @xdireccion, @cestado, @cciudad, @xcolonia, @xpostal, @xcorreo, @csucursal, @fingreso, @bactivo)'
            );
        return {
            ncliente: result.recordset[0].ncliente,
            xcliente: clientData.xnombre + ' ' + clientData.xapepaterno + ' ' + clientData.xapematerno
        }
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfCIDAlreadyExists = async (cid) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cid', sql.NVarChar, cid)
            .query(
                'select cid from maclientes where cid = @cid'
            )
        if (result.rowsAffected > 0) {
            return false;
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

const verifyIfClientExists = async (clientId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .query('select ncliente, ncont_ant from vwbuscarclientes where ncliente = @ncliente')
        if (result.rowsAffected < 1){
            return false;
        }
        return { 
            ncliente: result.recordset[0].ncliente,
            ncont_ant: result.recordset[0].ncont_ant
        };
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const updateOneClient = async (userData, clientChanges, clientId) => {
    try {
        let xpostal;
        if (clientChanges.xpostal) {
            xpostal = clientChanges.xpostal.toString();
        }
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .input('xnombre', sql.NVarChar, clientChanges.xnombre)
            .input('xapepaterno', sql.NVarChar, clientChanges.xapepaterno)
            .input('xapematerno', sql.NVarChar, clientChanges.xapematerno)
            .input('xcliente', sql.NVarChar, clientChanges.xnombre + ' ' + clientChanges.xapepaterno + ' ' + clientChanges.xapematerno)
            .input('fnac', sql.Date, clientChanges.fnac)
            .input('isexo', sql.NVarChar, clientChanges.isexo)
            .input('ctelefono', sql.NVarChar, clientChanges.ctelefono)
            .input('xdireccion', sql.NVarChar, clientChanges.xdireccion ? clientChanges.xdireccion : undefined)
            .input('cestado', sql.Int, clientChanges.cestado)
            .input('cciudad', sql.Int, clientChanges.cciudad)
            .input('xcolonia', sql.NVarChar, clientChanges.xcolonia ? clientChanges.xcolonia : undefined)
            .input('xpostal', sql.NVarChar, xpostal ? xpostal : undefined)
            .input('xcorreo', sql.NVarChar, clientChanges.xcorreo)
            .query('update maclientes set xnombre = @xnombre, xapepaterno = @xapepaterno, xapematerno = @xapematerno, xcliente = @xcliente, '
            + 'fnac = @fnac, ctelefono = @ctelefono, xdireccion = @xdireccion, cestado = @cestado, cciudad = @cciudad, xcolonia = @xcolonia, '
            + 'xpostal = @xpostal, xcorreo = @xcorreo output deleted.ncliente, deleted.xcliente where ncliente = @ncliente')
        return {
            xcliente: clientChanges.xnombre + ' ' + clientChanges.xapepaterno + ' ' + clientChanges.xapematerno
        };
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const updateOneClientBranch = async (branchId, clientId, additionalChargeAmount) => {
    try {
        let pool = await sql.connect(sqlConfig)
        await pool.request()
            .input('csucursal', sql.Int, branchId)
            .input('ncliente', sql.Int, clientId)
            .query('update maclientes set csucursal = @csucursal where ncliente = @ncliente')
        await pool.request()
            .input('csucursal', sql.Int, branchId)
            .input('ncliente', sql.Int, clientId)
            .query('update pccontratos set csucursal = @csucursal where ncliente = @ncliente')
        await pool.request()
            .input('csucursal', sql.Int, branchId)
            .input('ncliente', sql.Int, clientId)
            .query('update pccontratos_det set csucursal = @csucursal where ncliente = @ncliente')
        let lastContractId = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .query('select npaquete from pccontratos where ncliente = @ncliente order by ncontrato desc')
        if (lastContractId.recordset.length === 0) {
            return {
                error: 'No puede cambiar de sucursal a un cliente que no tenga al menos un contrato.'
            }
        }
        if (additionalChargeAmount > 0) {
            let packageId = lastContractId.recordset[0].npaquete
            let paymentInstallmentMaxId = await pool.request()
                .input('npaquete', sql.NVarChar, packageId)
                .query('select max(ccuota) as maxId from cbcuotas where npaquete = @npaquete')
                let lastPaymentInstallmentId = paymentInstallmentMaxId.recordset[0].maxId + 1;
            await pool.request()
                .input('npaquete', sql.NVarChar, packageId)
                .input('ccuota', sql.Int, lastPaymentInstallmentId)
                .input('ipago', sql.NVarChar, 'S')
                .input('bpago', sql.Bit, false)
                .input('bactivo', sql.Bit, true)
                .input('mcuota', sql.Numeric(11,2), additionalChargeAmount)
                .input('mpagado', sql.Numeric(11,2), 0)
                .query(
                    'insert into cbcuotas (npaquete, ccuota, fpago, ipago, bpago, bactivo, mcuota, mpagado) output inserted.ccuota '
                               + 'values (@npaquete, @ccuota, GETDATE(), @ipago, @bpago, @bactivo, @mcuota, @mpagado)'
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

const deleteOneClient = async (userData, clientId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .input('bactivo', sql.Bit, false)
            .query('update maclientes set bactivo = @bactivo' 
                + ' output deleted.ncliente, deleted.xcliente where ncliente = @ncliente')
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfClientBelongsToBranch = async (clientId, branchId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, clientId)
            .input('csucursal', sql.Int, branchId)
            .query('select ncliente from maclientes where ncliente = @ncliente and csucursal = @csucursal')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].ncliente;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyPhoneNumberNotExists = async (phoneNumber) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ctelefono', sql.NVarChar, phoneNumber)
            .query('select xnombre, xapepaterno, xapematerno from maclientes where ctelefono = @ctelefono')
        if (result.rowsAffected > 0){ 
            return {
                xcliente: result.recordset[0].xnombre + ' ' + result.recordset[0].xapepaterno + ' ' + result.recordset[0].xapematerno
            };
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

const verifyEmailNotExists = async (email) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('xcorreo', sql.NVarChar, email)
            .query('select xnombre, xapepaterno, xapematerno from maclientes where xcorreo = @xcorreo')
        if (result.rowsAffected > 0){ 
            return {
                xcliente: result.recordset[0].xnombre + ' ' + result.recordset[0].xapepaterno + ' ' + result.recordset[0].xapematerno
            };
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
    getAllClients,
    getOneClient,
    getClientTreatments,
    createNewClient,
    verifyIfCIDAlreadyExists,
    verifyIfClientExists,
    updateOneClient,
    updateOneClientBranch,
    deleteOneClient,
    verifyIfClientBelongsToBranch,
    verifyPhoneNumberNotExists,
    verifyEmailNotExists
}