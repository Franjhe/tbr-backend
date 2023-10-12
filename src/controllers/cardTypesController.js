import cardTypesService from '../services/cardTypesService.js';

const getAllCardTypes = async (req, res) => {
    const cardTypes = await cardTypesService.getAllCardTypes();
    if (cardTypes.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: cardTypes.permissionError
            });
    }
    if (cardTypes.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: cardTypes.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                cardTypes: cardTypes
            }
        });
}

export default {
    getAllCardTypes
}