import User from '../db/User.js'

const authorizate = (cmodulo, bcrear, bmodificar, beliminar) => {
    return async (req, res, next) => {
        const modulePermission = await User.getModulePermission(cmodulo, res.locals.decodedJWT.crol);
        if (modulePermission.error) {
            return res
                .status(modulePermission.code)
                .send({
                    status: false,
                    message: modulePermission.error
                });
        }
        if (bcrear && modulePermission.bcrear !== bcrear) {
            return res
                .status(403)
                .send({
                    status: false,
                    message: 'No tiene permitido crear este registro'
                });
        }
        if (bmodificar && modulePermission.bmodificar !== bmodificar) {
            return res
                .status(403)
                .send({
                    status: false,
                    message: 'No tiene permitido modificar este registro'
                });
        }
        if (beliminar && modulePermission.beliminar !== beliminar) {
            return res
                .status(403)
                .send({
                    status: false,
                    message: 'No tiene permitido eliminar este registro'
                });
        }
        next()
    }
}

export default authorizate;