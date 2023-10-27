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

const getAllTherapists = async (csucursal) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, csucursal ? csucursal : undefined)
            .input('bactivo', sql.Bit, true)
            .query(`select cterapeuta, xterapeuta from materapeutas where bactivo = @bactivo ${csucursal ? `and csucursal = ${csucursal}` : ''} `);
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfTherapistExists = async (therapistId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cterapeuta', sql.Int, therapistId)
            .query('select cterapeuta from materapeutas where cterapeuta = @cterapeuta')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cterapeuta;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}


const verifyIfTherapistBelongsToBranch = async (therapistId, branchId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cterapeuta', sql.Int, therapistId)
            .input('csucursal', sql.Int, branchId)
            .query('select cterapeuta from materapeutas where cterapeuta = @cterapeuta and csucursal = @csucursal')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cterapeuta;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllTherapists,
    verifyIfTherapistExists,
    verifyIfTherapistBelongsToBranch
}