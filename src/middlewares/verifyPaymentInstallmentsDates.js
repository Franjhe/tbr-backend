const verifyPaymentInstallmentsDates = (req, res, next) => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');
    let formattedCurrentDate = `${year}-${month}-${day}`;
    if (!res.locals.decodedJWT.bmaster && new Date(req.body.fanticipo).getTime() < new Date(formattedCurrentDate).getTime()) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'Solo un usuario master puede colocar una fecha de anticipo menor a la fecha actual.'
            })
    }
    if (new Date(req.body.fanticipo).getTime() > new Date(formattedCurrentDate).getTime()) {
        return res
            .status(400)
            .send({
                status: false,
                message: 'No puedes colocar una fecha de anticipo superior a la fecha actual.'
            })
    }
    let paymentInstallmentsDates = [];
    for (let i = 0; i < req.body.cuotas.length; i++) {
        if (new Date(req.body.cuotas[i].fpago) <= new Date(req.body.fanticipo)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: 'No puedes colocar una fecha de pago de una cuota que sea menor o igual a la fecha del anticipo.'
                })
        }
        if (i !== 0) {
            paymentInstallmentsDates.forEach(paymentDate => {
                if (new Date(paymentDate) >= new Date(req.body.cuotas[i].fpago)) {
                    return res
                        .status(400)
                        .send({
                            status: false,
                            message: 'No puedes colocar una fecha de pago de una cuota que sea menor o igual a las fechas de pago de las cuotas anteriores.'
                        })
                }
            })
            let lastPaymentDate = paymentInstallmentsDates[paymentInstallmentsDates.length - 1];
            let diferenciaEnMilisegundos = new Date(req.body.cuotas[i].fpago) - new Date(lastPaymentDate);
            let unDiaEnMilisegundos = 1000 * 60 * 60 * 24;
            var diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / unDiaEnMilisegundos)
            if (!res.locals.decodedJWT.bmaster && diferenciaEnDias < 15) {
                return res
                    .status(400)
                    .send({
                        status: false,
                        message: 'Solo un usuario master puede hacer que la fecha entre una cuota y otra sea menor a 15 días.'
                    })
            }
            paymentInstallmentsDates.push(req.body.cuotas[i].fpago);
        }
        if (i === 0) {
            paymentInstallmentsDates.push(req.body.cuotas[i].fpago);
        }
    }
    next();
}

export default verifyPaymentInstallmentsDates;