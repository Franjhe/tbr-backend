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

const getAllUser = async (req, res) => {
    const createUser = await userService.getAllUser();
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
            data: createUser
        });
}

const updateUserLogin = async (req, res) => {
    const createUser = await userService.updateLoginUser(req.body);
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

const updateTherapists = async (req, res) => {
    const createTher = await userService.updateTherapists(req.body);
    if (createTher.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createTher.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Terapeuta creado con exito'
            }
        });
}

export default {
    createUser,
    updateUser,
    getAllUser,
    updateUserLogin,
    updateTherapists
}