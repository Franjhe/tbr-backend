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

const getAllStates = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .query('select cestado, xestado from maestados');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfStateExists = async (stateId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cestado', sql.Int, stateId)
            .query('select cestado from maestados where cestado = @cestado')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cestado;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllStates,
    verifyIfStateExists
}