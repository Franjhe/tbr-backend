import bankService from '../services/bankService.js';

const getAllBanks = async (req, res) => {
    const banks = await bankService.getAllBanks();
    if (banks.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: banks.permissionError
            });
    }
    if (banks.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: banks.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                banks: banks
            }
        });
}

export default {
    getAllBanks
}