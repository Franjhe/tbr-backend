import City from '../db/City.js';

const verifyIfCityBelongsToState = async (req, res, next) => {
    if (req.body.cestado && req.body.cciudad) {
        const verifiedCity = await City.verifyIfCityBelongsToState(req.body.cestado, req.body.cciudad);
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
                .status(400)
                .send({
                    status: false,
                    message: 'La ciudad no pertenece al estado suministrado'
                })
        }
    }
    next();
}

export default verifyIfCityBelongsToState;