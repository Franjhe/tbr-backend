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

const getAllRrss = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('bactivo', sql.Bit, true)
            .query('select crrss, xrrss from marrss where bactivo = @bactivo ');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfRrssExists = async (rrssId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('crrss', sql.Int, rrssId)
            .query('select crrss from marrss where crrss = @crrss')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].crrss;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllRrss,
    verifyIfRrssExists
}