import userService from '../services/userService.js';

const createUser = async (req, res) => {
    const createUser = await userService.CreateUser(req.body);
    if (createUser.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createUser.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Usuario creado con exito'
            }
        });
}

const updateUser = async (req, res) => {
    const createUser = await userService.updateUser(req.body);
    if (createUser.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createUser.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Usuario creado con exito'
            }
        });
}

export default {
    createUser,
    updateUser
}