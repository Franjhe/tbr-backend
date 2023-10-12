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

const getAllGeneralParams = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .query('select ntrat_desc_1, ntrat_desc_2, ntrat_desc_3, ntrat_desc_4, mrec_desc_1, mrec_desc_2, mrec_desc_3, mrec_desc_4, npagos_max, ndias_cuota, edad_min, edad_max from prparam');
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllGeneralParams
}