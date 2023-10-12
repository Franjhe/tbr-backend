import sql from "mssql";
import moment from "moment";

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

const getAllTreatmentGroups = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .query(
                `select cgrupo, xgrupo from maagrupacion`
            );
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllTreatmentGroups
}