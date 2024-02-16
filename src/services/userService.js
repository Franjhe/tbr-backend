import User from '../db/User.js';

const CreateUser = async (data) => {
    const CreateUser = await User.createNewUser(data);

    if (CreateUser.error) {
        return {
            error: CreateUser.error
        }
    }
    if(data.cgrupousuarios == 'VE  '){
        const createNewUserSeller = await User.createNewUserSeller(data);

        if (createNewUserSeller.error) {
            return {
                error: createNewUserSeller.error
            }
        }

    }
    else if(data.cgrupousuarios == 'TR  '){
        const createNewUserTera = await User.createNewUserTera(data);

        if (createNewUserTera.error) {
            return {
                error: createNewUserTera.error
            }
        }

    }


    return CreateUser;
}

const updateUser = async (data) => {
    const updateUser = await User.updateUser(data);

    if (updateUser.error) {
        return {
            error: updateUser.error
        }
    }

    return updateUser;
}

export default {
    CreateUser,
    updateUser
}