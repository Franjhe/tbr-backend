import cityService from '../services/cityService.js';

const getAllCities = async (req, res) => {
    const stateId = req.params['stateId'];
    const cities = await cityService.getAllCities(stateId);
    if (cities.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: cities.errorNotFound
            });
    }
    if (cities.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: cities.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                cities: cities
            }
        });
}

export default {
    getAllCities
}