import Schedule from '../db/Schedule.js';

const verifyIfAppointmentExists = async (req, res, next) => {
    if (req.params.appointmentId) {
        const verifiedAppointment = await Schedule.verifyIfAppointmentExists(req.params.appointmentId);
        if (verifiedAppointment.error) {
            return res
                .status(500)
                .send({
                    status: false,
                    message: verifiedAppointment.error
                })
        }
        if (!verifiedAppointment) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: 'No se encontró una cita con el Id suministrado'
                })
        }
        res.locals.appointmentBranchId = verifiedAppointment.csucursal;
    }
    next();
}

export default verifyIfAppointmentExists;