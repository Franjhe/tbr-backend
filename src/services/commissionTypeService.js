import CommissionType from '../db/CommissionType.js';

const getAllCommissionTypes = async () => {
    const commissionTypes = await CommissionType.getAllCommissionTypes();
    if (commissionTypes.error) {
        return {
            error: commissionTypes.error
        }
    }
    return commissionTypes;
}

export default {
    getAllCommissionTypes
}