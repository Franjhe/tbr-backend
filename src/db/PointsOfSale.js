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

const getAllPointsOfSale = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('bactivo', sql.Bit, true)
            .query('select cpos, xpos from mapos where bactivo = @bactivo');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfPointOfSaleExists = async (pointOfSaleId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cpos', sql.Int, pointOfSaleId)
            .query('select cpos from mapos where cpos = @cpos')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cpos;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllPointsOfSale,
    verifyIfPointOfSaleExists
}