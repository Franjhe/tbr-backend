import Branch from '../db/Branch.js';

const getAllBranches = async () => {
    const branches = await Branch.getAllBranches();
    if (branches.error) {
        return {
            error: branches.error
        }
    }
    return branches;
}

export default {
    getAllBranches
}