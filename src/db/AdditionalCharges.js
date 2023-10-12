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

const getOneAdditionalCharge = async (additionalChargeId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ctipo_cobro', sql.Int, additionalChargeId)
            .query('select mtipo_cobro from matipos_cobrosotros where ctipo_cobro = @ctipo_cobro');
        return result.recordset[0].mtipo_cobro;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getOneAdditionalCharge
}