import Bank from '../db/Bank.js';

const getAllBanks = async () => {
    const banks = await Bank.getAllBanks();
    if (banks.error) {
        return {
            error: banks.error
        }
    }
    return banks;
}

export default {
    getAllBanks
}