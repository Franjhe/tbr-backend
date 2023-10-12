import scheduleService from '../services/scheduleService.js';

const getOneWeekSchedule = async (req, res) => {
    const appointments = await scheduleService.getOneWeekSchedule(res.locals.decodedJWT, req.body);
    if (appointments.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: appointments.permissionError
            });
    }
    if (appointments.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: appointments.errorNotFound
            });
    }
    if (appointments.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: appointments.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                appointments: appointments
            }
        });
}

const getCabinNonBusinessHours = async (req, res) => {
    const nonBusinessHours = await scheduleService.getCabinNonBusinessHours(res.locals.decodedJWT, req.body);
    if (nonBusinessHours.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: nonBusinessHours.permissionError
            });
    }
    if (nonBusinessHours.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: nonBusinessHours.errorNotFound
            });
    }
    if (nonBusinessHours.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: nonBusinessHours.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                nonBusinessHours: nonBusinessHours
            }
        });
}

const createNewAppointment = async (req, res) => {
    const createdAppointment = await scheduleService.createNewAppointment(res.locals.decodedJWT, req.body);
    if (createdAppointment.errorBadRequest) {
        return res
            .status(400)
            .send({
                status: false,
                message: createdAppointment.errorBadRequest
            });
    }
    if (createdAppointment.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createdAppointment.permissionError
            });
    }
    if (createdAppointment.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: createdAppointment.errorNotFound
            });
    }
    if (createdAppointment.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createdAppointment.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: 'Se ha agendado la cita exitosamente.'
        });
}

const createNonBusinessHour = async (req, res) => {
    const createdBusinessHour = await scheduleService.createNonBusinessHour(res.locals.decodedJWT, req.body.nonBusinessHour);
    if (createdBusinessHour.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createdBusinessHour.permissionError
            });
    }
    if (createdBusinessHour.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: createdBusinessHour.errorNotFound
            });
    }
    if (createdBusinessHour.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createdBusinessHour.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: 'Se ha bloqueado el horario seleccionado.'
        });
}

const updateOneAppointmentTherapist = async (req, res) => {
    const updatedAppointment = await scheduleService.updateOneAppointmentTherapist(res.locals.decodedJWT, req.params.appointmentId, req.body.cterapeuta, res.locals.appointmentBranchId);
    if (updatedAppointment.errorBadRequest) {
        return res
            .status(400)
            .send({
                status: false,
                message: updatedAppointment.errorBadRequest
            })
    }
    if (updatedAppointment.error){
        return res
            .status(500)
            .send({
                status: false,
                message: updatedAppointment.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: `Se ha asignado exitosamente el terapeuta a la cita.`
        });
}

const deleteOneAppointment = async (req, res) => {
    const deletedAppointment = await scheduleService.deleteOneAppointment(res.locals.decodedJWT, req.params.appointmentId, req.body.ccausa_anul);
    if (deletedAppointment.errorBadRequest) {
        return res
            .status(400)
            .send({
                status: false,
                message: deletedAppointment.errorBadRequest
            })
    }
    if (deletedAppointment.error){
        return res
            .status(500)
            .send({
                status: false,
                message: deletedAppointment.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: `La cita ha sido eliminada exitosamente.`
        });
}

const deleteOneNonBusinessHour = async (req, res) => {
    const deletedNonBusinessHour = await scheduleService.deleteOneNonBusinessHour(res.locals.decodedJWT, req.params.nonBusinessHourId);
    if (deletedNonBusinessHour.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: deletedNonBusinessHour.errorNotFound
            })
    }
    if (deletedNonBusinessHour.error){
        return res
            .status(500)
            .send({
                status: false,
                message: deletedNonBusinessHour.error
            });
    }
    return res
        .status(201)
        .send({
            status: true,
            message: `Se ha desbloqueado el horario exitosamente.`
        });
}

const getOneBranchAppointmentsByDate = async (req, res) => {
    const appointments = await scheduleService.getOneBranchAppointmentsByDate(req.params.branchId, req.body.fbusqueda);
    if (appointments.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: appointments.permissionError
            });
    }
    if (appointments.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: appointments.errorNotFound
            });
    }
    if (appointments.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: appointments.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                cabins: appointments
            }
        });
}

const getOneBranchNonBusinessHoursByDate = async (req, res) => {
    const nonBusinessHours = await scheduleService.getOneBranchNonBusinessHoursByDate(req.params.branchId, req.body.fbusqueda);
    if (nonBusinessHours.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: nonBusinessHours.permissionError
            });
    }
    if (nonBusinessHours.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: nonBusinessHours.errorNotFound
            });
    }
    if (nonBusinessHours.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: nonBusinessHours.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                nonBusinessHours: nonBusinessHours
            }
        });
}

const getTherapistAppointments = async (req, res) => {
    const appointments = await scheduleService.getTherapistAppointments(res.locals.decodedJWT, req.params.therapistId, req.body.fbusqueda);
    if (appointments.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: appointments.permissionError
            });
    }
    if (appointments.errorNotFound) {
        return res
            .status(404)
            .send({
                status: false,
                message: appointments.errorNotFound
            });
    }
    if (appointments.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: appointments.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                cabins: appointments
            }
        });
}

export default {
    getOneWeekSchedule,
    getCabinNonBusinessHours,
    createNewAppointment,
    createNonBusinessHour,
    updateOneAppointmentTherapist,
    deleteOneAppointment,
    deleteOneNonBusinessHour,
    getOneBranchAppointmentsByDate,
    getOneBranchNonBusinessHoursByDate,
    getTherapistAppointments
};
