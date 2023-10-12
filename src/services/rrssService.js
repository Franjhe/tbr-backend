import Rrss from '../db/Rrss.js';

const getAllRrss = async () => {
    const rrss = await Rrss.getAllRrss();
    if (rrss.error) {
        return {
            error: rrss.error
        }
    }
    return rrss;
}

export default {
    getAllRrss
}