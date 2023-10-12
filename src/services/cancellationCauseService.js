import CancellationCause from '../db/CancellationCause.js';

const getAllCancellationCauses = async () => {
    const cancellationCauses = await CancellationCause.getAllCancellationCauses();
    if (cancellationCauses.error) {
        return {
            error: cancellationCauses.error
        }
    }
    return cancellationCauses;
}

export default {
    getAllCancellationCauses
}