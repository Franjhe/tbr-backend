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

const getAllTreatments = async (groupId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cgrupo', sql.Int, groupId)
            .input('bactivo', sql.Bit, true)
            .query(
                `select cgrupo, ctratamiento, xtratamiento, mprecio_min, nsesiones from matratamientos where cgrupo = @cgrupo and bactivo = @bactivo`
            );
        if (result.rowsAffected < 1) {
            return false;
        }
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfTreatmentExists = async (groupId, treatmentId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cgrupo', sql.Int, groupId)
            .input('ctratamiento', sql.Int, treatmentId)
            .query('select ctratamiento from matratamientos where cgrupo = @cgrupo and ctratamiento = @ctratamiento')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].ctratamiento;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfTreatmentValuesMatch = async (treatment, httpMethod) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ctratamiento', sql.Int, treatment.ctratamiento)
            .input('cgrupo', sql.Int, treatment.cgrupo)
            .query('select cgrupo, ctratamiento, mprecio_min, nsesiones from matratamientos where ctratamiento = @ctratamiento and cgrupo = @cgrupo')
            if (treatment.cgrupo !== result.recordset[0].cgrupo) {
            return {
                errorUnmatchedValue: `El código del grupo del tratamiento de ${treatment.ctratamiento} no coincide con el valor almacenado en la base de datos`
            }
        }
        if (treatment.mprecio_min !== result.recordset[0].mprecio_min && httpMethod === 'POST') {
            return {
                errorUnmatchedValue: `El precio del tratamiento de ${treatment.ctratamiento} no coincide con el valor almacenado en la base de datos`
            }
        }
        /*if (treatment.nsesiones !== result.recordset[0].nsesiones) {
            return {
                errorUnmatchedValue: `El número de sesiones del tratamiento de ${treatment.ctratamiento} no coincide con el valor almacenado en la base de datos`
            }
        }*/
        return result.recordset[0].ctratamiento;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllTreatments,
    verifyIfTreatmentExists,
    verifyIfTreatmentValuesMatch
}