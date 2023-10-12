import stateService from '../services/stateService.js';

const getAllStates = async (req, res) => {
    const states = await stateService.getAllStates();
    if (states.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: states.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                states: states
            }
        });
}

export default {
    getAllStates
}