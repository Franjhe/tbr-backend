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

const getAllSellers = async (csucursal) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('bactivo', sql.Bit, true)
            .input('csucursal', sql.Int, csucursal ? csucursal : undefined)
            .query(`select cvendedor, xvendedor, cusuario_vend from vwbuscarvendedoresxsucursal where bactivo = @bactivo ${csucursal ? `and csucursal = ${csucursal}` : ''} `);
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getSellerByUserId = async (userId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cusuario_vend', sql.Int, userId)
            .query('select cvendedor from mavendedores where cusuario_vend = @cusuario_vend');
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfSellerExists = async (sellerId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cvendedor', sql.Int, sellerId)
            .query('select cvendedor from mavendedores where cvendedor = @cvendedor')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cvendedor;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfSellerBelongsToBranch = async (sellerId, branchId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cvendedor', sql.Int, sellerId)
            .input('csucursal', sql.Int, branchId)
            .query('select cvendedor from vwbuscarsucursalvendedor where cvendedor = @cvendedor and csucursal = @csucursal')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cvendedor;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllSellers,
    getSellerByUserId,
    verifyIfSellerExists,
    verifyIfSellerBelongsToBranch
}