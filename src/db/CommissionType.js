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

const getAllCommissionTypes = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('bactivo', sql.Bit, true)
            .query('select ctipocom, xtipocom from matipocom where bactivo = @bactivo ');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfCommissionTypeExists = async (commissionTypeId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ctipocom', sql.Int, commissionTypeId)
            .query('select ctipocom from matipocom where ctipocom = @ctipocom')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].ctipocom;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllCommissionTypes,
    verifyIfCommissionTypeExists
}