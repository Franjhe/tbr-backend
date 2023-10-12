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

const getAllBanks = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('bactivo', sql.Bit, true)
            .query('select cbanco, xbanco from mabancos where bactivo = @bactivo ');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfBankExists = async (bankId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cbanco', sql.Int, bankId)
            .query('select cbanco from mabancos where cbanco = @cbanco')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cbanco;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllBanks,
    verifyIfBankExists
}