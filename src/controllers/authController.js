import authService from '../services/authService.js';

const createJWT = async (req, res) => {
    const clogin = req.body.clogin;
    const verifiedUsername = await authService.verifyIfUsernameExists(clogin);
    if (verifiedUsername.errorNotFound) { 
        return res
            .status(401)
            .send({ 
                status: false,
                message: verifiedUsername.errorNotFound
            });
    }
    if (verifiedUsername.error) { 
        return res
            .status(500)
            .send({ 
                status: false,
                message: verifiedUsername.error
            });
    }
    const xclavesec = req.body.xclavesec;
    const verifiedPassword = await authService.verifyIfPasswordMatchs(clogin, xclavesec);
    if (verifiedPassword.errorMismatchPassword) { 
        return res
            .status(401)
            .send({ 
                status: false,
                message: verifiedPassword.errorMismatchPassword
            });
    }
    if (verifiedPassword.error) { 
        return res
            .status(500)
            .send({ 
                status: false,
                message: verifiedPassword.error
            });
    }
    const user = await authService.getOneUser(clogin);
    if (user.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: user.errorNotFound
            });
    }
    if (user.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: user.error
            });
    }
    const jwt = authService.createJWT(user);

    const seller = await authService.searchSeller(user.xusuario);
    if (seller.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: seller.error
            });
    }
    return res
        .status(201).send({ 
            status: true, 
            message: 'Usuario Autenticado',
            data: {
                xusuario: user.xusuario,
                csucursal: user.csucursal,
                xsucursal: user.xsucursal,
                bmaster: user.bmaster,
                cvendedor: seller.cvendedor,
                token: 'Bearer ' + jwt
            }
        });
};

const getUserModules = async (req, res) => {
    const userModules = await authService.getUserModules(res.locals.decodedJWT.crol);
    if (userModules.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: userModules.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                groups: userModules
            }
        });
}

const verifyModulePermission = async (req, res) => {
    const permission = await authService.verifyModulePermission(req.params.moduleId, res.locals.decodedJWT.crol);
    if (permission.errorNotFound) {
        return res
            .status(403)
            .send({
                status: false,
                message: permission.errorNotFound
            });
    }
    if (permission.errorModuleNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: permission.errorModuleNotFound
            });
    }
    if (permission.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: permission.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                permission: permission
            }
        });
}

export default {
    createJWT,
    getUserModules,
    verifyModulePermission
}