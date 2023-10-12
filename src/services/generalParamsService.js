import GeneralParams from '../db/GeneralParams.js';

const getAllGeneralParams = async () => {
    const params = await GeneralParams.getAllGeneralParams();
    if (params.error) {
        return {
            error: params.error
        }
    }
    return params;
}

export default {
    getAllGeneralParams
}