import Branch from '../db/Branch.js';

const verifyIfBranchExists = async (req, res, next) => {
    let branchId = 0;
    if (req.body.csucursal) {
        branchId = req.body.csucursal;
    }
    if (req.params.branchId) {
        branchId = req.params.branchId;
    }
    if (branchId){
        const verifiedBranch = await Branch.verifyIfBranchExists(branchId);
        if (verifiedBranch.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifiedBranch.error
                })
        }
        if (!verifiedBranch) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: 'No se encontró una sucursal con el Id suministrado'
                })   
        }
    }
    next();
}

export default verifyIfBranchExists;