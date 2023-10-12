const verifyRepeatedTreatmentsPerClient = async (req, res, next) => {
    let combinations = new Set();
    for (let i = 0; i < req.body.clientes.length; i++){
        let client = req.body.clientes[i];
        let key = `${client.ncliente}_${client.tratamiento.cgrupo}_${client.tratamiento.ctratamiento}`;
        if (combinations.has(key)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `No puede asignar el tratamiento ${client.tratamiento.xtratamiento} más de una vez a un mismo cliente.`
                })
        }
        combinations.add(key);
    }
    next();
}

export default verifyRepeatedTreatmentsPerClient;