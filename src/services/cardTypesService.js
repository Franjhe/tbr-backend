import CardType from '../db/CardType.js';

const getAllCardTypes = async () => {
    const cardTypes = await CardType.getAllCardTypes();
    if (cardTypes.error) {
        return {
            error: cardTypes.error
        }
    }
    return cardTypes;
}

export default {
    getAllCardTypes
}