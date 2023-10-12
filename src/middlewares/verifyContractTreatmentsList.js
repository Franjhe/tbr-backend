import Treatment from '../db/Treatment.js';

const verifyContractTreatmentsList = async (req, res, next) => {
    let numberOfTreatments = 0;
    let treatmentsAmount = 0;
    for (let i = 0; i < req.body.clientes.length; i++) {  
        numberOfTreatments += 1;     
        let verifyTreatment = await Treatment.verifyIfTreatmentExists(req.body.clientes[i].tratamiento.cgrupo, req.body.clientes[i].tratamiento.ctratamiento);
        if (!verifyTreatment) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: `No existe el tratamiento ${req.body.clientes[i].tratamiento.cgrupo} - ${req.body.clientes[i].tratamiento.ctratamiento}`
                })
        }
        if (verifyTreatment.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifyTreatment.error
                })
        }
        let verifyIfTreatmentValuesMatch = await Treatment.verifyIfTreatmentValuesMatch(req.body.clientes[i].tratamiento, req.method);
        if (verifyIfTreatmentValuesMatch.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifyIfTreatmentValuesMatch.error
                })
        }
        if (verifyIfTreatmentValuesMatch.errorUnmatchedValue) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: verifyIfTreatmentValuesMatch.errorUnmatchedValue
                })
        }
        treatmentsAmount += req.body.clientes[i].tratamiento.mprecio_min;
    }
    res.locals.mtotal = treatmentsAmount;
    res.locals.numberOfTreatments = numberOfTreatments;
    next();
}

export default verifyContractTreatmentsList;