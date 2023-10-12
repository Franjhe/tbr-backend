import City from '../db/City.js';

const getAllCities = async (stateId) => {
    const cities = await City.getAllCities(stateId);
    if (cities.error) {
        return {
            error: cities.error
        }
    }
    if (!cities) {
        return {
            errorNotFound: 'No se encontraron ciudades para el estado suministrado'
        }
    }
    return cities;
}
 
export default {
    getAllCities
}