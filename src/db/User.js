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
            .input('cgrupousuarios', sql.NVarChar, userData.cgrupousuarios)
            .input('cpais', sql.Int, userData.cpais)
            .input('csucursal', sql.Int, userData.csucursal)
            .input('xnombre', sql.NVarChar, userData.xnombre)
            .input('xapellido', sql.NVarChar, userData.xapellido)
            .input('xclavesec', sql.NVarChar, userData.xclavesec)
            .input('xusuario', sql.NVarChar, userData.xnombre + ' ' + userData.xapellido)
            .input('clogin', sql.NVarChar, userData.clogin)
            .input('ipermite_cambio', sql.Int, 1)
            .input('ibloqueado', sql.NVarChar, 'N')
            .input('email', sql.NVarChar, userData.xemail) 
            .input('crol', sql.NChar(10), userData.crol) 
            .query('insert into seusuarios '+
            '( cgrupousuarios, cpais, csucursal,  xnombre, xapellido, xclavesec, xusuario, clogin, ipermite_cambio, ibloqueado, email,crol) '+
            'values ( @cgrupousuarios, @cpais, @csucursal,  @xnombre, @xapellido, @xclavesec, @xusuario, @clogin, @ipermite_cambio, @ibloqueado, @email,@crol)');  
        return { result: result};
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
}

const createNewUserSeller = async (userData) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let idUserSeller = await pool.request()
        .query('select max(cusuario) as id from seusuarios')
        let idUserS = idUserSeller.recordset[0].id ;
        let name = userData.xnombre + ' ' + userData.xapellido

        let result = await pool.request()
            .input('xvendedor', sql.VarChar(250), name.toUpperCase())
            .input('cusuario_vend', sql.Int, idUserS)
            .input('bactivo', sql.Int, userData.cpais)
            .input('fcreacion', sql.Int, userData.csucursal)
            .input('cusuariocreacion', sql.Int, userData.nemp)
            .query('insert into mavendedores'+
            '(xvendedor, cusuario_vend, bactivo, fcreacion, cusuariocreacion) '+
            'values (@xvendedor, @cusuario_vend, @bactivo, @fcreacion, @cusuariocreacion)');  
        return { result: result.recordset};
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
}

const createNewUserTera = async (userData) => {
    try {

        let pool = await sql.connect(sqlConfig);
        let idUserTera = await pool.request()
        .query('select max(cusuario) as id from seusuarios')
        let idUserT = idUserTera.recordset[0].id ;

        let result = await pool.request()
            .input('cterapeuta', sql.Int, idUserT)
            .input('xterapeuta', sql.VarChar(250), userData.xnombre + ' ' + userData.xapellido)
            .input('bactivo', sql.Int, userData.cpais)
            .input('csucursal', sql.Int, userData.csucursal)
            .input('fcreacion', sql.DateTime, new Date())
            .input('cusuariocreacion', sql.Int, userData.nemp)
            .query('insert into materapeutas'+
            '(cterapeuta, xterapeuta, bactivo, csucursal ,fcreacion, cusuariocreacion) '+
            'values (@cterapeuta , @xterapeuta,  @bactivo, @csucursal, @fcreacion, @cusuariocreacion)');  
        return { result: result.recordset};
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

const updateUser = async (userData) => {
    try {

        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, userData.csucursal_destino)
            .input('cusuario', sql.Int, userData.cvendedor)
            .query('update seusuarios set csucursal = @csucursal where cusuario = @cusuario')

        return { result: result};
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
}

const getAllUser = async (userData) => {
    try {

        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .query('select * from vwbuscarusuarioxlogin')

            return result.recordset;
        }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
}

const searchSeller = async (seller) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
           .input('xvendedor', sql.NVarChar, seller)
           .query('select cvendedor from mavendedores where xvendedor = @xvendedor')
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

const updateLoginUser = async (userData) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let Seller = await pool.request()
        .input('bactivo', sql.Bit, userData.bactivo)
        .input('contrasena', sql.VarChar(250), userData.contrasena)
        .input('usuario', sql.Int, userData.usuario)
        .input('xusuario', sql.VarChar(250), userData.xusuario)
        .query('update seusuarios set xclavesec = @contrasena, xusuario = @xusuario, bactivo = @bactivo where cusuario = @usuario' );  
        return { result: Seller.recordset};
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
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
    getModulePermission,
    createNewUserTera,
    createNewUserSeller,
    updateUser,
    getAllUser,
    searchSeller,
    updateLoginUser,
}