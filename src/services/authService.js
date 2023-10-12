import User from '../db/User.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const verifyIfUsernameExists = async (clogin) => {
    const verifiedUsername = await User.verifyIfUsernameExists(clogin.toLowerCase());
    if (verifiedUsername.error) {
        return { error: verifiedUsername.error };
    }
    if (!verifiedUsername) {
        return { errorNotFound: "Authentication Error" };
    }
    return verifiedUsername;
}

const verifyIfPasswordMatchs = async (clogin, xclavesec) => {
    const verifiedPassword = await User.verifyIfPasswordMatchs(clogin, xclavesec);
    if (verifiedPassword.error) {
        return { error: verifiedPassword.error };
    }
    if (!verifiedPassword) {
        return { errorMismatchPassword: "Authentication Error" };
    }
    return verifiedPassword;
};

const createJWT = (user) => {
    if (user.bmaster) {
        user.csucursal = null;
    }
    const payload = {
        cusuario: user.cusuario,
        csucursal: user.csucursal,
        bmaster: user.bmaster,
        crol: user.crol,
        iat: moment().unix(),
        exp: moment().add(1, 'day').unix(),
    }
    return jwt.sign(payload, process.env.JWT_SECRET)
}

const getOneUser = async (clogin) => {
    const user = await User.getOneUser(clogin);
    if (user.error) {
        return { error: user.error };
    }
    if (!user) {
        return { errorNotFound: "User not found" };
    }
    if (user.bmaster) {
        user.xsucursal = 'Usuario Master';
    }
    return user;
}

const getUserModules = async (crol) => {
    const userModules = await User.getUserModules(crol);
    if (userModules.error) {
        return { error: userModules.error };
    }
    let groups = [];
    userModules.forEach(module => {
        const groupIndex = groups.findIndex(group => group.cgrupo === module.cgrupo);
        if (groupIndex === -1) {
            groups.push({
                cgrupo: module.cgrupo,
                xgrupo: module.xgrupo,
                xicono: module.xiconogrupo,
                modules: [{
                    cmodulo: module.cmodulo,
                    xmodulo: module.xmodulo,
                    xruta: module.xruta,
                    xicono: module.xicono,
                }]
            });
        } else {
            groups[groupIndex].modules.push({
                cmodulo: module.cmodulo,
                xmodulo: module.xmodulo,
                xruta: module.xruta,
                xicono: module.xicono
            });
        }
    });
    return groups;
}

const verifyModulePermission = async (cmodulo, crol) => {
    const verifyIfModuleExists = await User.verifyIfModuleExists(cmodulo);
    if (verifyIfModuleExists.error) {
        return { error: verifyIfModuleExists.error, code: verifyIfModuleExists.code };
    }
    if (!verifyIfModuleExists) {
        return { errorModuleNotFound: 'No se encontró un módulo para el código indicado' };
    }
    const modulePermission = await User.getModulePermission(cmodulo, crol);
    if (modulePermission.error) {
        return { error: modulePermission.error };
    }
    if (!modulePermission) {
        return { errorNotFound: 'El Usuario no tiene permiso para acceder al módulo indicado' }
    }
    return modulePermission;
}

export default {
    verifyIfUsernameExists,
    verifyIfPasswordMatchs,
    createJWT,
    getOneUser,
    getUserModules,
    verifyModulePermission
}