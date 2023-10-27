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

const getAllCardTypes = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('bactivo', sql.Bit, true)
            .query('select ctipo_tarjeta, xtipo_tarjeta from matipo_tarjetas where bactivo = @bactivo ');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfCardTypeExists = async (cardTypeId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ctipo_tarjeta', sql.Int, cardTypeId)
            .query('select ctipo_tarjeta from matipo_tarjetas where ctipo_tarjeta = @ctipo_tarjeta')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].ctipo_tarjeta;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllCardTypes,
    verifyIfCardTypeExists
}