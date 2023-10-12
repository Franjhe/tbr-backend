import Cabin from '../db/Cabin.js';

const getAllBranchCabins = async (branchId) => {
    const cabins = await Cabin.getAllBranchCabins(branchId);
    if (cabins.error) {
        return {
            error: cabins.error
        }
    }
    return cabins;
}

export default {
    getAllBranchCabins
}