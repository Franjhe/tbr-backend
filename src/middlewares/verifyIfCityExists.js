import City from '../db/City.js';

const verifyIfCityExists = async (req, res, next) => {
    if (req.body.cciudad) {
        const verifiedCity = await City.verifyIfCityExists(req.body.cciudad);
        if (verifiedCity.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifiedCity.error
                })
        }
        if (!verifiedCity) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: 'No se encontró una ciudad con el Id suministrado'
                })   
        }
    }
    next();
}

export default verifyIfCityExists;