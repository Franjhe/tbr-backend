import Schedule from '../db/Schedule.js';
import Therapist from '../db/Therapist.js';
import Contract from '../db/Contract.js';
import Collection from '../db/Collection.js';
import moment from 'moment';

const getOneWeekSchedule = async (userData, searchData) => {
    if (!userData.bmaster && userData.csucursal != searchData.csucursal) {
        return {
            permissionError: 'El usuario solo puede visualizar las citas de la sucursal a la que pertenece.'
        }
    }
    //Se agrega un día para que inicie la semana el lunes en lugar del domingo.
    const weekDay = moment.utc(searchData.fsemana);
    weekDay.locale('es');
    const startOfWeek = weekDay.startOf('week').set({ hour: 0, minute: 0, second: 0 }).toDate();
    const endOfWeek = weekDay.endOf('week').set({ hour: 23, minute: 59, second: 0 }).toDate();
    const appointments = await Schedule.getOneWeekSchedule(startOfWeek, endOfWeek, searchData);
    if (appointments.error) {
        return {
            error: appointments.error
        }
    }
    for (let appointment of appointments) {
        const clientAssociatedContracts = await Contract.getClientAssociatedContracts(appointment.ncliente);
        if (clientAssociatedContracts.error) {
            return {
                error: clientAssociatedContracts.error
            }
        }
        let expiredContracts = []
        for (const contract of clientAssociatedContracts) {
            const contractHasExpiredDebt = await Collection.verifyIfContractHasExpiredDebt(contract.npaquete);
            if (contractHasExpiredDebt.error) {
                return {
                    error: contractHasExpiredDebt.error
                }
            }
            if (contractHasExpiredDebt) {
                expiredContracts.push(contract);
            }
        }
        appointment.expiredContracts = expiredContracts;
    }
    return appointments;
}

const getCabinNonBusinessHours = async (userData, searchData) => {
    //Se agrega un día para que inicie la semana el lunes en lugar del domingo.
    const weekDay = moment.utc(searchData.fsemana);
    weekDay.locale('es');
    let startOfWeek = weekDay.startOf('week').set({ hour: 0, minute: 0, second: 0 }).toDate();
    let endOfWeek = weekDay.endOf('week').set({ hour: 23, minute: 59, second: 0 }).toDate();
    const nonBusinessHours = await Schedule.getCabinNonBusinessHours(startOfWeek, endOfWeek, searchData.ccabina);
    if (nonBusinessHours.error) {
        return {
            error: nonBusinessHours.error
        }
    }
    return nonBusinessHours;
}

const createNewAppointment = async (userData, appointmentData) => {
    if (!userData.bmaster && userData.csucursal != appointmentData.csucursal) {
        return {
            permissionError:
                "El usuario solo puede crear una cita en la sucursal a la que pertenece.",
        };
    }

    const tiempoEntrada = appointmentData.fentrada.slice(11,19).split(':');
    const horaEntrada = parseInt(tiempoEntrada[0]);
    const minutosEntrada = parseInt(tiempoEntrada[1]);
    const segundosEntrada = parseInt(tiempoEntrada[2]);

    const tiempoSalida = appointmentData.fsalida.slice(11, 19).split(':');
    const horaSalida = parseInt(tiempoSalida[0]);
    const minutosSalida = parseInt(tiempoSalida[1]);
    const segundosSalida = parseInt(tiempoSalida[2]);

    if (horaEntrada >= 21) {
        return {
            errorBadRequest: 'No puede agendar una cita para luego de las 9 de la noche.'
        }
    }

    if (horaEntrada < 8) {
        return {
            errorBadRequest: 'No puede agendar una cita antes de las 8 de la mañana.'
        }
    }

    if (horaSalida >= 21) {
        if (minutosSalida > 0 || segundosSalida > 0) {
            return {
                errorBadRequest: 'No puede agendar una cita para luego de las 9 de la noche.',
            };
        }
    }

    if (horaEntrada < 9 && !userData.bmaster) {
        return {
            permissionError: 'Solo un usuario master puede agendar una cita antes de las 9 de la mañana.'
        }
    }

    let fentrada = new Date(appointmentData.fentrada);
    fentrada.setHours(0, 0, 0, 0);
    const fentradaISOString = fentrada.toISOString();

    let fsalida = new Date(appointmentData.fsalida);
    fsalida.setHours(23, 59, 59, 999);
    const fsalidaISOString = fsalida.toISOString();

    const dayAppointments = await Schedule.getAppointmentsByDate(appointmentData.ccabina, fentradaISOString, fsalidaISOString);

    if (dayAppointments.error) {
        return {
            error: dayAppointments.error
        }
    }

    if (dayAppointments.length > 0) {
        const nuevafentrada = new Date(appointmentData.fentrada);

        const nuevafsalida = new Date(appointmentData.fsalida);

        for (const appointment of dayAppointments) {
            const fentrada = new Date(appointment.fentrada);

            const fsalida = new Date(appointment.fsalida);

            let partesfentrada = appointment.fentrada.toISOString().split('T');
            const tiempofentrada = partesfentrada[1].split('.')[0];

            let partesfsalida = appointment.fsalida.toISOString().split("T");
            const tiempofsalida = partesfsalida[1].split(".")[0];

            if (nuevafentrada >= fentrada && nuevafentrada < fsalida) {
                return {
                    errorBadRequest: `La hora de entrada choca con la cita agendada en el horario: ${tiempofentrada} - ${tiempofsalida}.`,
                };
            }

            if (nuevafsalida > fentrada && nuevafsalida <= fsalida) {
                return {
                    errorBadRequest: `La hora de finalización choca con la cita agendada en el horario: ${tiempofentrada} - ${tiempofsalida}.`,
                };
            }

            if (nuevafentrada < fentrada && nuevafsalida > fsalida) {
                return {
                    errorBadRequest: `La cita agendada entre las ${tiempofentrada} - ${tiempofsalida} se encuentra dentro del nuevo horario que se desea programar.`,
                };
            }
        }
    }
    const dayNonBusinessHours = await Schedule.getNonBusinessHoursByDate(appointmentData.ccabina, fentradaISOString, fsalidaISOString)
    if (dayNonBusinessHours.error) {
        return {
            error: dayNonBusinessHours.error
        }
    }

    if (dayNonBusinessHours.length > 0) {
        const nuevafentrada = new Date(appointmentData.fentrada);

        const nuevafsalida = new Date(appointmentData.fsalida);

        for (const nonBusinessHour of dayNonBusinessHours) {
            const fentrada = new Date(nonBusinessHour.fentrada);

            const fsalida = new Date(nonBusinessHour.fsalida);

            let partesfentrada = nonBusinessHour.fentrada.toISOString().split("T");
            const tiempofentrada = partesfentrada[1].split(".")[0];

            let partesfsalida = nonBusinessHour.fsalida.toISOString().split("T");
            const tiempofsalida = partesfsalida[1].split(".")[0];

            if (nuevafentrada >= fentrada && nuevafentrada < fsalida) {
                return {
                    errorBadRequest: `La hora de entrada choca con el horario bloqueado comprendido entre las: ${tiempofentrada} - ${tiempofsalida}.`,
                };
            }

            if (nuevafsalida > fentrada && nuevafsalida <= fsalida) {
                return {
                    errorBadRequest: `La hora de finalización choca con el horario bloqueado comprendido entre las: ${tiempofentrada} - ${tiempofsalida}.`,
                };
            }

            if (nuevafentrada < fentrada && nuevafsalida > fsalida) {
                return {
                    errorBadRequest: `El horario bloqueado ${tiempofentrada} - ${tiempofsalida} se encuentra dentro del horario de la nueva cita que desea programar.`,
                };
            }
        }
    }

    const createdAppointment = await Schedule.createNewAppointment(appointmentData);
    if (createdAppointment.error) {
        return {
            error: createdAppointment.error
        }
    }
    return createdAppointment;
}

const createNonBusinessHour = async (userData, nonBusinessHourData) => {
    if (!userData.bmaster) {
        return {
            permissionError: 'Solo un usuario máster puede bloquear el horario de una cabina.'
        }
    }

    const tiempoEntrada = nonBusinessHourData.fentrada.slice(11, 19).split(":");
    const horaEntrada = parseInt(tiempoEntrada[0]);
    const minutosEntrada = parseInt(tiempoEntrada[1]);
    const segundosEntrada = parseInt(tiempoEntrada[2]);

    const tiempoSalida = nonBusinessHourData.fsalida.slice(11, 19).split(":");
    const horaSalida = parseInt(tiempoSalida[0]);
    const minutosSalida = parseInt(tiempoSalida[1]);
    const segundosSalida = parseInt(tiempoSalida[2]);

    if (horaEntrada >= 21) {
        return {
            errorBadRequest:
                "No puede bloquear un horario luego de las 9 de la noche.",
        };
    }

    if (horaSalida >= 21) {
        if (minutosSalida > 0 || segundosSalida > 0) {
            return {
                errorBadRequest:
                    "No puede bloquear un horario luego de las 9 de la noche.",
            };
        }
    }

    if (horaEntrada < 9 && !userData.bmaster) {
        return {
            errorBadRequest:
                "No puede bloquear un horario antes de las 9 de la mañana.",
        };
    }
    const createdNonBusinessHour = await Schedule.createNonBusinessHour(nonBusinessHourData);
    if (createdNonBusinessHour.error) {
        return {
            error: createdNonBusinessHour.error
        }
    }
    return createdNonBusinessHour;
}

const updateOneAppointmentTherapist = async (userData, appointmentId, therapistId, appointmentBranchId) => {
    const verifiedTherapist = await Therapist.verifyIfTherapistBelongsToBranch(therapistId, appointmentBranchId);
    if (verifiedTherapist.error) {
        return {
            error: verifiedTherapist.error
        }
    }
    if (!verifiedTherapist) {
        return {
            errorBadRequest: 'El Terapeuta no pertenece a la sucursal suministrada'
        }
    }
    const updatedAppointment = await Schedule.updateOneAppointmentTherapist(appointmentId, therapistId);
    if (updatedAppointment.error) {
        return {
            error: updatedAppointment.error
        }
    }
    return updatedAppointment;
}

const deleteOneAppointment = async (userData, appointmentId, annulationCauseId) => {
    const appointment = await Schedule.getOneAppointment(appointmentId);
    if (appointment.error) {
        return {
            error: appointment.error
        }
    }
    if (!appointment.bactivo) {
        return {
            errorBadRequest: 'No puede anular una cita que ya se encuentra eliminada.'
        }
    }
    const deletedAppointment = await Schedule.deleteOneAppointment(appointmentId, annulationCauseId);
    if (deletedAppointment.error) {
        return {
            error: deletedAppointment.error
        }
    }
    return deletedAppointment;
}

const deleteOneNonBusinessHour = async (userData, nonBusnessHourId) => {
    const deletedNonBusinessHour = await Schedule.deleteOneNonBusinessHour(nonBusnessHourId);
    if (deletedNonBusinessHour.error) {
        return {
            error: deletedNonBusinessHour.error
        }
    }
    return deletedNonBusinessHour;
}

const getOneBranchAppointmentsByDate = async (branchId, fbusqueda) => {
    let fentrada = new Date(fbusqueda);
    fentrada.setHours(0, 0, 0, 0);

    const fentradaISOString = fentrada.toISOString();

    let fsalida = new Date(fbusqueda);
    fsalida.setHours(23, 59, 59, 999);

    const fsalidaISOString = fsalida.toISOString();

    const appointments = await Schedule.getOneBranchAppointmentsByDate(branchId, fentradaISOString, fsalidaISOString);
    if (appointments.error) {
        return {
            error: appointments.error
        }
    }
    return appointments;
}

const getOneBranchNonBusinessHoursByDate = async (branchId, fbusqueda) => {
    let fentrada = new Date(fbusqueda);
    fentrada.setHours(0, 0, 0, 0);

    const fentradaISOString = fentrada.toISOString();

    let fsalida = new Date(fbusqueda);
    fsalida.setHours(23, 59, 59, 999);

    const fsalidaISOString = fsalida.toISOString();

    const nonBusinessHours = await Schedule.getOneBranchNonBusinessHoursByDate(branchId, fentradaISOString, fsalidaISOString);
    if (nonBusinessHours.error) {
        return {
            error: nonBusinessHours.error
        }
    }
    return nonBusinessHours;
}

const getTherapistAppointments = async (userData, therapistId, fbusqueda) => {
    let fentrada = new Date(fbusqueda);
    fentrada.setHours(0, 0, 0, 0);

    const fentradaISOString = fentrada.toLocaleDateString() + "T" + fentrada.toLocaleTimeString();

    let fsalida = new Date(fbusqueda);
    fsalida.setHours(23, 59, 59, 999);

    const fsalidaISOString = fsalida.toLocaleDateString() + "T" + fsalida.toLocaleTimeString();

    const appointments = await Schedule.getTherapistAppointments(therapistId, userData.csucursal, fentradaISOString, fsalidaISOString);
    if (appointments.error) {
        return {
            error: appointments.error
        }
    }
    return appointments;
}

const startAppointment = async (userData, appointmentId, signature, observation) => {
    const updatedAppointment = await Schedule.startAppointment(appointmentId, signature, observation);

    if (updatedAppointment.error) {
        return {
            error: updatedAppointment.error
        }
    }

    return updatedAppointment;
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
    getTherapistAppointments,
    startAppointment,
};