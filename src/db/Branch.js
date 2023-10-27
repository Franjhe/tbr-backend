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

const getAllBranches = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .query('select csucursal, xsucursal from masucursales');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfBranchExists = async (branchId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, branchId)
            .query('select csucursal from masucursales where csucursal = @csucursal')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].csucursal;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllBranches,
    verifyIfBranchExists
}