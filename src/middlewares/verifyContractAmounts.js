import GeneralParams from '../db/GeneralParams.js';

const verifyContractAmounts = async (req, res, next) => {
    /*if (req.body.mtotal !== res.locals.mtotal){
        return res
            .status(400)
            .send({
                status: false,
                message: 'No coincide la suma del total de los tratamientos con la suma suministrada.'
            })
    }*/
    if (req.body.ncont_ant !== res.locals.ncont_ant) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'La cantidad de contratos del cliente no coincide con la cantidad almacenada en la base de datos.'
            })
    }
    const generalParams = await GeneralParams.getAllGeneralParams();
    if (generalParams.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: generalParams.error
            })
    }
    let mbono_cupon = 0;
    if (res.locals.ncont_ant === 0) {
        mbono_cupon = 0;
    }
    if (res.locals.ncont_ant > 0 && res.locals.numberOfTreatments === 1) {
        mbono_cupon = generalParams.mrec_desc_1;
    }
    if (res.locals.ncont_ant > 0 && res.locals.numberOfTreatments === 2) {
        mbono_cupon = generalParams.mrec_desc_2;
    }
    if (res.locals.ncont_ant > 0 && res.locals.numberOfTreatments === 3){
        mbono_cupon = generalParams.mrec_desc_3;
    }
    if (res.locals.ncont_ant > 0 && res.locals.numberOfTreatments >= 4) {
        mbono_cupon = generalParams.mrec_desc_4;
    }
    if (req.body.mbono_cupon > mbono_cupon) {
        return res
            .status(400)
            .send({
                status: false,
                message: `El monto del bono cupón no puede ser superior a ${mbono_cupon}$`
            })
    }
    let pdesc = 0;
    if (res.locals.numberOfTreatments === 1) {
        pdesc = generalParams.ntrat_desc_1;
    }
    if (res.locals.numberOfTreatments === 2) {
        pdesc = generalParams.ntrat_desc_2;
    }
    if (res.locals.numberOfTreatments === 3) {
        pdesc = generalParams.ntrat_desc_3;
    }
    if (res.locals.numberOfTreatments >= 4) {
        pdesc = generalParams.ntrat_desc_4;
    }
    if (req.body.pdesc > pdesc) {
        return res
            .status(400)
            .send({
                status: false,
                message: `El descuento no puede ser mayor que ${pdesc}%`
            })
    }
    let total = (res.locals.mtotal - (res.locals.mtotal * (pdesc/100))) - mbono_cupon;
    if (!res.locals.decodedJWT.bmaster && req.body.mpaquete_cont < total) {
        return res
            .status(400)
            .send({
                status: false,
                message: `El monto mínimo del total del contrato es de ${total}$, solo un usuario master puede vender debajo de ese precio`
            })
    }
    next();
}

export default verifyContractAmounts;