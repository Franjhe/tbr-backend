import treatmentService from '../services/treatmentService.js';

const getAllTreatments = async (req, res) => {
    const grouperId = req.params.grouperId;
    const treatments = await treatmentService.getAllTreatments(grouperId);
    if (treatments.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: treatments.errorNotFound
            });
    }
    if (treatments.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: treatments.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                treatments: treatments
            }
        });
}

export default {
    getAllTreatments
}