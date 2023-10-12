import branchService from '../services/branchService.js';

const getAllBranches = async (req, res) => {
    const branches = await branchService.getAllBranches();
    if (branches.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: branches.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                branches: branches
            }
        });
}

export default {
    getAllBranches
}