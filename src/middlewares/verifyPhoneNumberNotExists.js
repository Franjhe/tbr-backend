import Client from '../db/Client.js';

const verifyPhoneNumberNotExists = async (req, res, next) => {
    const verifiedPhone = await Client.verifyPhoneNumberNotExists(req.body.ctelefono);
        if (verifiedPhone.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifiedPhone.error
                })
        }
        if (verifiedPhone) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `El número de teléfono ya se encuentra registrado para el cliente ${verifiedPhone.xcliente}, verifique que no esté registrando al mismo cliente.`
                })
        }
    next();
}

export default verifyPhoneNumberNotExists;