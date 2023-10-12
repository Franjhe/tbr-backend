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

const getAllCancellationCauses = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('bactivo', sql.Bit, true)
            .query('select ccausa_anul, xcausa_anul from macausas_anul where bactivo = @bactivo ');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfCancellationCauseExists = async (cancellationCauseId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ccausa_anul', sql.Int, cancellationCauseId)
            .query('select ccausa_anul from macausas_anul where ccausa_anul = @ccausa_anul')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].ccausa_anul;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllCancellationCauses,
    verifyIfCancellationCauseExists
}