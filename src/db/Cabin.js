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

const getAllBranchCabins = async (branchId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, branchId)
            .query('select ccabina, cgrupo, xcabina, bactivo from agcabinas where csucursal = @csucursal');
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

const verifyIfCabinExists = async (cabinId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ccabina', sql.Int, cabinId)
            .query('select ccabina from agcabinas where ccabina = @ccabina')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].ccabina;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfCabinBelongsToBranch = async (branchId, cabinId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, branchId)
            .input('ccabina', sql.Int, cabinId)
            .query('select ccabina from agcabinas where ccabina = @ccabina and csucursal = @csucursal')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].ccabina;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllBranchCabins,
    verifyIfCabinExists,
    verifyIfCabinBelongsToBranch
}