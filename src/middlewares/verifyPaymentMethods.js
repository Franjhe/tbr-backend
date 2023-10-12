import valid from 'card-validator';

const verifyCash = (paymentMethod) => {
    if (
        paymentMethod.ctipo_tarjeta ||
        paymentMethod.cbanco ||
        paymentMethod.xtarjeta ||
        paymentMethod.xvencimiento ||
        paymentMethod.cpos
    ) {
        return {
            error: 'Si el tipo de método de pago es de efectivo, no puede tener campos de tarjeta activos.'
        }
    }
    return true;
}

const verifyCard = async (paymentMethod) => {
    if (
        !paymentMethod.ctipo_tarjeta ||
        !paymentMethod.cbanco ||
        !paymentMethod.xtarjeta ||
        !paymentMethod.xvencimiento ||
        !paymentMethod.cpos
    ) {
        return {
            error: 'Si el tipo de método de pago es de tarjeta de crédito/débito, no puede tener campos de tarjeta vacíos.'
        }
    }
    const actualDate = new Date().toISOString();
    const actualYear = parseInt(actualDate.split('-')[0]);
    const actualMonth = parseInt(actualDate.split('-')[1]);
    const expirationYear = parseInt(paymentMethod.xvencimiento.split('-')[0]);
    const expirationMonth = parseInt(paymentMethod.xvencimiento.split('-')[1]);
    if (expirationMonth > 12 || expirationMonth === 0) {
        return {
            error: `Error en el formato del mes de la fecha de vencimiento en la tarjeta ${paymentMethod.xtarjeta}, el mes de vencimiento no tiene un valor válido.`
        }
    }
    if (expirationYear < actualYear || (expirationYear === actualYear && expirationMonth < actualMonth)) {
        return {
            error: `La tarjeta ${paymentMethod.xtarjeta} se encuentra vencida, verifique la información e intente nuevamente.`
        }
    }
    const numberValidation = valid.number(paymentMethod.xtarjeta);
    if (!numberValidation.isValid) {
        return {
            error: `La tarjeta ${paymentMethod.xtarjeta} no tiene un formato válido, verifique la información suministrada.`
        }
    }
}

const verifyPaymentMethods = async (req, res, next) => {
    const paymentMethods = req.body.anticipo;
    let totalAmount = 0;
    for (let i = 0; i < paymentMethods.length; i++) {
        if (paymentMethods[i].cmodalidad_pago === 1) {
            let verifiedCash = verifyCash(paymentMethods[i]);
            if (verifiedCash.error) {
                return res
                    .status(400)
                    .send({
                        status: false,
                        message: verifiedCash.error
                    })
            }
            totalAmount += paymentMethods[i].mpago;
        }
        if (paymentMethods[i].cmodalidad_pago === 2 || paymentMethods[i].cmodalidad_pago == 3 || paymentMethods[i].cmodalidad_pago == 4) {
            let verifiedCard = verifyCard(paymentMethods[i]);
            if (verifiedCard.error) {
                return res
                    .status(400)
                    .send({
                        status: false,
                        message: verifiedCard.error
                    })
            }
            totalAmount += paymentMethods[i].mpago;
        }
    }
    if (totalAmount !== req.body.manticipo) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'El total de la sumatoria de los métodos de pago, no coincide con el total del monto del anticipo.'
            })
    }
    next();
}

export default verifyPaymentMethods;