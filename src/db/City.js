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

const getAllCities = async (cestado) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cestado', sql.Int, cestado)
            .query('select cciudad, xciudad from maciudades where cestado = @cestado');
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

const verifyIfCityExists = async (cityId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cciudad', sql.Int, cityId)
            .query('select cciudad from maciudades where cciudad = @cciudad')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cciudad;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfCityBelongsToState = async (stateId, cityId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cestado', sql.Int, stateId)
            .input('cciudad', sql.Int, cityId)
            .query('select cciudad from maciudades where cciudad = @cciudad and cestado = @cestado')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cciudad;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllCities,
    verifyIfCityExists,
    verifyIfCityBelongsToState
}