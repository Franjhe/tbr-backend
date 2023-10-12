import State from '../db/State.js';

const getAllStates = async () => {
    const states = await State.getAllStates();
    if (states.error) {
        return {
            error: states.error
        }
    }
    return states;
}

export default {
    getAllStates
}