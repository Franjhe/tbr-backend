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

const verifyIfUsernameExists = async (clogin) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('clogin', sql.NVarChar, clogin)
            .query('select cusuario, xusuario, clogin from seusuarios where clogin = @clogin')
        if (result.rowsAffected < 1) {
            return false;
        }
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message }
    }
}

const verifyIfPasswordMatchs = async (clogin, xclavesec) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('clogin', sql.NVarChar, clogin)
            .input('xclavesec', sql.NVarChar, xclavesec)
            .query('select cusuario from seusuarios where clogin = @clogin and xclavesec = @xclavesec')
        if (result.rowsAffected < 1) {
            return false;
        }
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
}

const createNewUser = async (userData) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cusuario', sql.Int, userData.cusuario)
            .input('cgrupousuarios', sql.NVarChar, userData.cgrupousuarios)
            .input('cpais', sql.Int, userData.cpais)
            .input('csucursal', sql.Int, userData.csucursal)
            .input('nemp', sql.Int, userData.nemp)
            .input('ccategoria', sql.Int, userData.ccategoria)
            .input('xnombre', sql.NVarChar, userData.xnombre)
            .input('xapellido', sql.NVarChar, userData.xapellido)
            .input('xclavesec', sql.NVarChar, userData.xclavesec)
            .input('xusuario', sql.NVarChar, userData.xnombre + ' ' + userData.xapellido)
            .input('clogin', sql.NVarChar, userData.xlogin)
            .input('ipermite_cambio', sql.Int, 1)
            .input('ibloqueado', sql.NVarChar, 'N')
            .input('email', sql.NVarChar, userData.xemail) 
            .query('insert into seusuarios (cusuario, cgrupousuarios, cpais, csucursal, nemp, ccategoria, xnombre, xapellido, xclavesec, xusuario, clogin, ipermite_cambio, ibloqueado, email) values (@cusuario, @cgrupousuarios, @cpais, @csucursal, @nemp, @ccategoria, @xnombre, @xapellido, @xclavesec, @xusuario, @clogin, @ipermite_cambio, @ibloqueado, @email)');  
        return { result: result};
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
}

const getOneUser = async (clogin) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
           .input('clogin', sql.NVarChar, clogin)
           .query('select cusuario, xusuario, clogin, crol, csucursal, xsucursal, bmaster from vwbuscarusuarioxlogin where clogin = @clogin')
        if (result.rowsAffected < 1) {
            return false;
        }
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
}

const getUserRole = async (cusuario) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cusuario', sql.Int, cusuario)
            .query('select crol from seusuarios where cusuario = @cusuario')
        return result.recordset[0].crol;
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
}

const getUserModules = async (crol) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('crol', sql.Int, crol)
            .input('bactivo', sql.Bit, 1)
            .query('select cmodulo, xmodulo, xicono, xruta, cgrupo, xgrupo, xiconogrupo from vwbuscarmodulosxrol where bactivo = @bactivo and crol = @crol')
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message, code: 500 };
    }
}

const verifyIfModuleExists = async(cmodulo) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cmodulo', sql.Int, cmodulo)
            .input('bactivo', sql.Bit, 1)
            .query('select cmodulo from semodulos where bactivo = @bactivo and cmodulo = @cmodulo')
        if (result.rowsAffected < 1) {
            return false;
        }
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message, code: 500 };
    }
}

const getModulePermission = async (cmodulo, crol) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cmodulo', sql.Int, cmodulo)
            .input('crol', sql.Int, crol)
            .input('bactivo', sql.Bit, 1)
            .query('select bcrear, bmodificar, beliminar from sepermisos where bactivo = @bactivo and cmodulo = @cmodulo and crol = @crol')
        if (result.rowsAffected < 1) {
            return false;
        }
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message, code: 500 };
    }
}

export default {
    verifyIfUsernameExists,
    verifyIfPasswordMatchs,
    createNewUser,
    getOneUser,
    getUserRole,
    verifyIfModuleExists,
    getUserModules,
    getModulePermission
}