import cabinService from '../services/cabinService.js';

const getAllBranchCabins = async (req, res) => {
    const cabins = await cabinService.getAllBranchCabins(req.params.branchId);
    if (cabins.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: cabins.permissionError
            });
    }
    if (cabins.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: cabins.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                cabins: cabins
            }
        });
}

export default {
    getAllBranchCabins
}