import cancellationCauseService from '../services/cancellationCauseService.js';

const getAllCancellationCauses = async (req, res) => {
    const cancellationCauses = await cancellationCauseService.getAllCancellationCauses();
    if (cancellationCauses.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: cancellationCauses.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                cancellationCauses: cancellationCauses
            }
        });
}

export default {
    getAllCancellationCauses
}