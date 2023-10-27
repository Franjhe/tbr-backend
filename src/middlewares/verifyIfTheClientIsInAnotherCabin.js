import Client from '../db/Client.js';

const verifyIfClientExists = async (req, res, next) => {

    let ccabina = '';
    if (req.body.ccabina) {
        ccabina = req.body.ccabina;
    }
    next();
}

export default verifyIfClientExists;