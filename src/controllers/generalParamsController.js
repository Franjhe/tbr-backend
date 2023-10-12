import generalParamsService from '../services/generalParamsService.js';

const getAllGeneralParams = async (req, res) => {
    const params = await generalParamsService.getAllGeneralParams();
    if (params.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: params.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                params: params
            }
        });
}

export default {
    getAllGeneralParams
}