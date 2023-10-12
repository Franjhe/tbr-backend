import TreatmentGroups from '../db/TreatmentGroups.js';

const getAllTreatmentGroups = async () => {
    const treatmentGroups = await TreatmentGroups.getAllTreatmentGroups();
    if (treatmentGroups.error) {
        return {
            error: treatmentGroups.error
        }
    }
    return treatmentGroups;
}

export default {
    getAllTreatmentGroups
}