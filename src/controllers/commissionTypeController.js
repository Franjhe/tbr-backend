import commissionTypeService from '../services/commissionTypeService.js';

const getAllCommissionTypes = async (req, res) => {
    const commissionTypes = await commissionTypeService.getAllCommissionTypes();
    if (commissionTypes.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: commissionTypes.permissionError
            });
    }
    if (commissionTypes.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: commissionTypes.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                commissionTypes: commissionTypes
            }
        });
}

export default {
    getAllCommissionTypes
}