import treatmentGroupsService from '../services/treatmentGroupsService.js';

const getAllTreatmentGroups = async (req, res) => {
    const treatmentGroups = await treatmentGroupsService.getAllTreatmentGroups();
    if (treatmentGroups.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: treatmentGroups.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                treatmentGroups: treatmentGroups
            }
        });
}

export default {
    getAllTreatmentGroups
}