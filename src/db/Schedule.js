import sql from "mssql";

const sqlConfig = {
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const getOneWeekSchedule = async (startOfWeek, endOfWeek, searchData) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, searchData.csucursal)
            .input('ccabina', sql.Int, searchData.ccabina)
            .input('finiciosemana', sql.DateTime, startOfWeek)
            .input('ffinsemana', sql.DateTime, endOfWeek)
            .input('bactivo', sql.Bit, true)
            .query(
                'select ccita, ncliente, csucursal, ccabina, cgrupo, cestatus_cita, cterapeuta, fentrada, fsalida, bactivo, '
                + 'xcliente, xsucursal, xcabina, xgrupo, xestatus_cita, xterapeuta '
                + 'from vwbuscarcitaxsemana where fentrada between @finiciosemana and @ffinsemana and csucursal = @csucursal and ccabina = @ccabina and bactivo = @bactivo '
                + 'order by fentrada'
            );
        let appointments = result.recordset;
        if (appointments.length > 0 ){
            appointments.treatments = [];
            for (let i = 0; i < appointments.length; i++) {
                let treatments = await pool.request()
                    .input('ccita', sql.Int, appointments[i].ccita)
                    .query(
                        'select ncliente, npaquete, cgrupo, ctratamiento, xcliente, xgrupo, xtratamiento, bdoblemaquina, ntiempo_min from vwbuscartratamientosxcita where ccita = @ccita order by bdoblemaquina desc, ctratamiento'
                    )
                treatments.recordset.forEach(treatment => {
                    if(treatment.bdoblemaquina) {
                        treatment.ntiempo_min /= 2;
                    }
                })
                appointments[i].treatments = treatments.recordset
            }
        }
        return appointments;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getOneAppointment = async(appointmentId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ccita', sql.Int, appointmentId)
            .query(
                'select ncliente, csucursal, ccabina, cestatus_cita, cterapeuta, ccausa_anul, fentrada, fsalida, bactivo from agcitas where ccita = @ccita'
            )
        return result.recordset[0];
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getCabinNonBusinessHours = async(startOfWeek, endOfWeek, cabinId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ccabina', sql.Int, cabinId)
            .input('finiciosemana', sql.DateTime, startOfWeek)
            .input('ffinsemana', sql.DateTime, endOfWeek)
            .input('bactivo', sql.Bit, true)
            .query(
                'select ccodigo, csucursal, ccabina, fentrada, fsalida from aghoras_bloqueadas where ccabina = @ccabina and fentrada between @finiciosemana and @ffinsemana and bactivo = @bactivo'
            )
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const createNewAppointment = async (appointmentData) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncliente', sql.Int, appointmentData.ncliente)
            .input('csucursal', sql.Int, appointmentData.csucursal)
            .input('ccabina', sql.Int, appointmentData.ccabina)
            .input('cestatus_cita', sql.Int, 1)
            .input('fentrada', sql.DateTime, appointmentData.fentrada)
            .input('fsalida', sql.DateTime, appointmentData.fsalida)
            .input('bactivo', sql.Bit, true)
            .query(
                'insert into agcitas (ncliente, csucursal, ccabina, cestatus_cita, fentrada, fsalida, bactivo) output inserted.ccita '
                          + 'values (@ncliente, @csucursal, @ccabina, @cestatus_cita, @fentrada, @fsalida, @bactivo)'
            )
        for (let i = 0; i < appointmentData.tratamientos.length; i++) {
            await pool.request()
                .input('ccita', sql.Int, result.recordset[0].ccita)
                .input('npaquete', sql.NVarChar, appointmentData.tratamientos[i].npaquete)
                .input('ncliente', sql.Int, appointmentData.ncliente)
                .input('cgrupo', sql.Int, appointmentData.tratamientos[i].cgrupo)
                .input('ctratamiento', sql.Int, appointmentData.tratamientos[i].ctratamiento)
                .input('bdoblemaquina', sql.Bit, appointmentData.tratamientos[i].bdoblemaquina)
                .input('bactivo', sql.Bit, true)
                .query(
                    'insert into agcitas_det (ccita, npaquete, ncliente, cgrupo, ctratamiento, bdoblemaquina, bactivo) values (@ccita, @npaquete, @ncliente, @cgrupo, @ctratamiento, @bdoblemaquina, @bactivo)'
                )
            let sessionNumber = await pool.request()
                .input('npaquete', sql.NVarChar, appointmentData.tratamientos[i].npaquete)
                .input('ncliente', sql.Int, appointmentData.ncliente)
                .input('cgrupo', sql.Int, appointmentData.tratamientos[i].cgrupo)
                .input('ctratamiento', sql.Int, appointmentData.tratamientos[i].ctratamiento)
                .query(
                    'select nsesiones from pccontratos_det where npaquete = @npaquete and ncliente = @ncliente and cgrupo = @cgrupo and ctratamiento = @ctratamiento'
                )
            let bfinalizado = false;
            if (sessionNumber.recordset[0].nsesiones == 1) {
                bfinalizado = true;
            }
            await pool.request()
                .input('npaquete', sql.NVarChar, appointmentData.tratamientos[i].npaquete)
                .input('ncliente', sql.Int, appointmentData.ncliente)
                .input('cgrupo', sql.Int, appointmentData.tratamientos[i].cgrupo)
                .input('ctratamiento', sql.Int, appointmentData.tratamientos[i].ctratamiento)
                .input('bfinalizado', sql.Bit, bfinalizado)
                .query(
                    'update pccontratos_det set nsesiones = nsesiones - 1, bfinalizado = @bfinalizado where npaquete = @npaquete and ncliente = @ncliente and cgrupo = @cgrupo and ctratamiento = @ctratamiento'
                )
        }
        let secondAppointmentTreatments = appointmentData.tratamientos.filter(treatment => treatment.bdoblemaquina);
        let secondAppointmentDuration = 0;
        let secondAppointmentStartDate = new Date(appointmentData.fentrada);
        let secondAppointmentEndDate;
        if (secondAppointmentTreatments.length > 0) {
            
            //Si el resultado tiene algún decimal, se redondeará hacia arriba.
            secondAppointmentDuration = Math.ceil(secondAppointmentTreatments.reduce((totalTime, treatment) => totalTime + treatment.ntiempo_min, 0));
            secondAppointmentEndDate = new Date(secondAppointmentStartDate.getTime() + secondAppointmentDuration * 60000);
            
            //Ver cómo hacer si hay 3 cabinas.
            let searchCabin = await pool.request()
                .input('ccabina', sql.Int, appointmentData.ccabina)
                .input('cgrupo', sql.Int, 2)
                .input('csucursal', sql.Int, appointmentData.csucursal)
                .query(
                    'select ccabina from agcabinas where cgrupo = @cgrupo and ccabina != @ccabina and csucursal = @csucursal'
                )
                
            let secondResult = await pool.request()
                .input('ccitaprincipal', sql.Int, result.recordset[0].ccita)
                .input('ncliente', sql.Int, appointmentData.ncliente)
                .input('csucursal', sql.Int, appointmentData.csucursal)
                .input('ccabina', sql.Int, searchCabin.recordset[0].ccabina)
                .input('cestatus_cita', sql.Int, 1)
                .input('fentrada', sql.DateTime, appointmentData.fentrada)
                .input('fsalida', sql.DateTime, secondAppointmentEndDate)
                .input('bactivo', sql.Bit, true)
                .query(
                    'insert into agcitas (ccitaprincipal, ncliente, csucursal, ccabina, cestatus_cita, fentrada, fsalida, bactivo) output inserted.ccita '
                              + 'values (@ccitaprincipal, @ncliente, @csucursal, @ccabina, @cestatus_cita, @fentrada, @fsalida, @bactivo)'
                )

            for (let i = 0; i < secondAppointmentTreatments.length; i++) {
                await pool.request()
                    .input('ccita', sql.Int, secondResult.recordset[0].ccita)
                    .input('ccitaprincipal', sql.Int, result.recordset[0].ccita)
                    .input('npaquete', sql.NVarChar, secondAppointmentTreatments[i].npaquete)
                    .input('ncliente', sql.Int, appointmentData.ncliente)
                    .input('cgrupo', sql.Int, secondAppointmentTreatments[i].cgrupo)
                    .input('ctratamiento', sql.Int, secondAppointmentTreatments[i].ctratamiento)
                    .input('bdoblemaquina', sql.Bit, true)
                    .input('bactivo', sql.Bit, true)
                    .query(
                        "insert into agcitas_det (ccita, ccitaprincipal, npaquete, ncliente, cgrupo, ctratamiento, bdoblemaquina, bactivo) values (@ccita, @ccitaprincipal, @npaquete, @ncliente, @cgrupo, @ctratamiento, @bdoblemaquina, @bactivo)"
                    );
            }
        }
        return true;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const createNonBusinessHour = async (nonBusinessHourData) => {
    try{
        let pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('csucursal', sql.Int, nonBusinessHourData.csucursal)
            .input('ccabina', sql.Int, nonBusinessHourData.ccabina)
            .input('fentrada', sql.DateTime, nonBusinessHourData.fentrada)
            .input('fsalida', sql.DateTime, nonBusinessHourData.fsalida)
            .input('bactivo', sql.Bit, true)
            .query(
                'insert into aghoras_bloqueadas (csucursal, ccabina, fentrada, fsalida, bactivo) values (@csucursal, @ccabina, @fentrada, @fsalida, @bactivo)'
            )
        return true;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const updateOneAppointmentTherapist = async (appointmentId, therapistId) => {
    try {
        let pool = await sql.connect(sqlConfig)
        //Busca si la cita seleccionada es la cita principal, o es la cita secundaria de doble máquina
        let result = await pool.request()
            .input('ccita', sql.Int, appointmentId)
            .query('select ccitaprincipal from agcitas where ccita = @ccita')
        //Si es una cita secundaria, entonces se actualiza la cita principal primero.
        if (result.recordset[0].ccitaprincipal) {
            await pool.request()
                .input('ccita', sql.Int, result.recordset[0].ccitaprincipal)
                .input('cterapeuta', sql.Int, therapistId)
                .input('cestatus_cita', sql.Int, 2)
                .query('update agcitas set cterapeuta = @cterapeuta, cestatus_cita = @cestatus_cita where ccita = @ccita')
            await pool.request()
                .input('ccita', sql.Int, appointmentId)
                .input('cterapeuta', sql.Int, therapistId)
                .input('cestatus_cita', sql.Int, 2)
                .query('update agcitas set cterapeuta = @cterapeuta, cestatus_cita = @cestatus_cita where ccita = @ccita')
        }
        //Si la cita es principal, entonces se actualizan ambas al mismo tiempo
        else {
            await pool.request()
                .input('ccita', sql.Int, appointmentId)
                .input('cterapeuta', sql.Int, therapistId)
                .input('cestatus_cita', sql.Int, 2)
                .query('update agcitas set cterapeuta = @cterapeuta, cestatus_cita = @cestatus_cita where ccita = @ccita or ccitaprincipal = @ccita')
        }
        return true;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfAppointmentExists = async (appointmentId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ccita', sql.Int, appointmentId)
            .query('select ccita, csucursal from agcitas where ccita = @ccita')
        if (result.rowsAffected < 1){
            return false;
        }
        return {
            ccita: result.recordset[0].ccita,
            csucursal: result.recordset[0].csucursal
        };
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const deleteOneAppointment = async (appointmentId, annulationCauseId) => {
    try {
        let pool = await sql.connect(sqlConfig)
        let principalId = await pool.request()
            .input('ccita', sql.Int, appointmentId)
            .query('select ccitaprincipal from agcitas where ccita = @ccita')
        //Cuando una cita tiene doble sesión, se genera una cita principal y una 
        //secundaria en la otra cabina, la cual solo tiene los tratamientos con doble sesión.
        //Si la cita no es la principal, entonces primero borro la cita secundaria
        if (principalId.recordset[0].ccitaprincipal) {
            await pool.request()
                .input('ccita', sql.Int, appointmentId)
                .input('ccausa_anul', sql.Int, annulationCauseId)
                .input('bactivo', sql.Bit, false)
                .query('update agcitas set bactivo = @bactivo, ccausa_anul = @ccausa_anul where ccita = @ccita')
            await pool.request()
                .input('ccita', sql.Int, appointmentId)
                .input('bactivo', sql.Bit, false)
                .query('update agcitas_det set bactivo = @bactivo where ccita = @ccita')
            //Luego, asigno a appointmentId el valor de la cita principal para después borrarla y reestablecer el número de sesiones
            appointmentId = principalId.recordset[0].ccitaprincipal
        }
        await pool.request()
            .input('ccita', sql.Int, appointmentId)
            .input('ccausa_anul', sql.Int, annulationCauseId)
            .input('bactivo', sql.Bit, false)
            .query('update agcitas set bactivo = @bactivo, ccausa_anul = @ccausa_anul where ccita = @ccita')
        await pool.request()
            .input('ccita', sql.Int, appointmentId)
            .input('bactivo', sql.Bit, false)
            .query('update agcitas_det set bactivo = @bactivo where ccita = @ccita')
        let result = await pool.request()
            .input('ccita', sql.Int, appointmentId)
            .query(
                'select npaquete, ncliente, cgrupo, ctratamiento from agcitas_det where ccita = @ccita'
            )
        let treatmentsToUpdate = result.recordset
        for (let i = 0; i < treatmentsToUpdate.length; i++) {
            await pool.request()
                .input('npaquete', sql.NVarChar, treatmentsToUpdate[i].npaquete)
                .input('ncliente', sql.Int, treatmentsToUpdate[i].ncliente)
                .input('cgrupo', sql.Int, treatmentsToUpdate[i].cgrupo)
                .input('ctratamiento', sql.Int, treatmentsToUpdate[i].ctratamiento)
                .input('bfinalizado', sql.Bit, false)
                .query(
                    'update pccontratos_det set nsesiones = nsesiones + 1, bfinalizado = @bfinalizado where npaquete = @npaquete and ncliente = @ncliente and cgrupo = @cgrupo and ctratamiento = @ctratamiento'
                )
        }
        if (annulationCauseId == 5) {
            let packageId = treatmentsToUpdate[0].npaquete;
            let penaltyFee = 250;
            let paymentInstallmentMaxId = await pool.request()
                .input('npaquete', sql.NVarChar, packageId)
                .query('select max(ccuota) as maxId from cbcuotas where npaquete = @npaquete')
                let lastPaymentInstallmentId = paymentInstallmentMaxId.recordset[0].maxId + 1;
            await pool.request()
                .input('npaquete', sql.NVarChar, packageId)
                .input('ccuota', sql.Int, lastPaymentInstallmentId)
                .input('ipago', sql.NVarChar, 'S')
                .input('bpago', sql.Bit, false)
                .input('bactivo', sql.Bit, true)
                .input('mcuota', sql.Numeric(11,2), penaltyFee)
                .input('mpagado', sql.Numeric(11,2), 0)
                .query(
                    'insert into cbcuotas (npaquete, ccuota, fpago, ipago, bpago, bactivo, mcuota, mpagado) output inserted.ccuota '
                               + 'values (@npaquete, @ccuota, GETDATE(), @ipago, @bpago, @bactivo, @mcuota, @mpagado)'
                )
        }
        return true;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const deleteOneNonBusinessHour = async (nonBusinessHourId) => {
    try {
        let pool = await sql.connect(sqlConfig)
        await pool.request()
            .input('ccodigo', sql.Int, nonBusinessHourId)
            .query('delete from aghoras_bloqueadas where ccodigo = @ccodigo')
        return true;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getOneBranchAppointmentsByDate = async (branchId, fentrada, fsalida) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, branchId)
            .input('fentrada', sql.DateTime, fentrada)
            .input('fsalida', sql.DateTime, fsalida)
            .input('bactivo', sql.Bit, true)
            .query(
                'select xcabina, xgrupo, xsucursal,	xcliente, ccita, ncliente, csucursal, ccabina, xestatus_cita, cestatus_cita, xterapeuta, cterapeuta, fentrada, fsalida, bactivo, cgrupo from vwbuscarcitaxsemana where csucursal = @csucursal and (fentrada between @fentrada and @fsalida) and bactivo = @bactivo'
            )
        
        const citasPorCabina = {};

        // Recorremos el arreglo original y agrupamos las citas por ccabina
        result.recordset.forEach(cita => {
            const ccabina = cita.ccabina;

            // Si aún no hemos creado un arreglo para esta ccabina, lo creamos
            if (!citasPorCabina[ccabina]) {
              citasPorCabina[ccabina] = {
                ccabina: ccabina,
                xcabina: cita.xcabina,
                citas: []
              };
            }

            // Agregamos la cita al arreglo correspondiente
            citasPorCabina[ccabina].citas.push({
                xcliente: cita.xcliente,
                ccita: cita.ccita,
                ncliente: cita.ncliente,
                csucursal: cita.csucursal,
                ccabina: cita.ccabina,
                xestatus_cita: cita.xestatus_cita,
                cestatus_cita: cita.cestatus_cita,
                xterapeuta: cita.xterapeuta,
                cterapeuta: cita.cterapeuta,
                fentrada: cita.fentrada,
                fsalida: cita.fsalida,
                bactivo: cita.bactivo,
                cgrupo: cita.cgrupo
            });
        });
      
        // Convertimos el objeto en un arreglo
        const resultado = Object.values(citasPorCabina);
        return resultado;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getOneBranchNonBusinessHoursByDate = async (branchId, fentrada, fsalida) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('csucursal', sql.Int, branchId)
            .input('fentrada', sql.DateTime, fentrada)
            .input('fsalida', sql.DateTime, fsalida)
            .input('bactivo', sql.Bit, true)
            .query(
                'select ccodigo, csucursal, ccabina, fentrada, fsalida from aghoras_bloqueadas where csucursal = @csucursal and fentrada between @fentrada and @fsalida and bactivo = @bactivo'
            )
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getAppointmentsByDate = async (cabinId, startDate, endDate) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ccabina', sql.Int, cabinId)
            .input('fentrada', sql.DateTime, startDate)
            .input('fsalida', sql.DateTime, endDate)
            .input('bactivo', sql.Bit, true)
            .query(
                'select ccita, csucursal, ccabina, fentrada, fsalida from agcitas where ccabina = @ccabina and (fentrada between @fentrada and @fsalida) and bactivo = @bactivo'
            )
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getNonBusinessHoursByDate = async (cabinId, startDate, endDate) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ccabina', sql.Int, cabinId)
            .input('fentrada', sql.DateTime, startDate)
            .input('fsalida', sql.DateTime, endDate)
            .input('bactivo', sql.Bit, true)
            .query(
                'select ccodigo, csucursal, ccabina, fentrada, fsalida from aghoras_bloqueadas where ccabina = @ccabina and (fentrada between @fentrada and @fsalida) and bactivo = @bactivo'
            )
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const getTherapistAppointments = async (therapistId, branchId, fentrada, fsalida) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool
            .request()
            .input("cterapeuta", sql.Int, therapistId)
            .input("csucursal", sql.Int, branchId)
            //.input("fentrada", sql.DateTime, fentrada)
            //.input("fsalida", sql.DateTime, fsalida)
            .input("bactivo", sql.Bit, true)
            .query(
                //and fentrada between @fentrada and @fsalida
                "select xcabina, xgrupo, xsucursal,	xcliente, ccita, ncliente, csucursal, ccabina, xestatus_cita, cestatus_cita, xterapeuta, cterapeuta, fentrada, fsalida, bactivo, cgrupo from vwbuscarcitaxsemana where cterapeuta = @cterapeuta and csucursal = @csucursal and bactivo = @bactivo"
            );

            if (result.recordset.length > 0) {

            for (let i = 0; i < result.recordset.length; i++) {
                let treatments = await pool
                    .request()
                    .input("ccita", sql.Int, result.recordset[i].ccita)
                    .query(
                        "select ncliente, npaquete, cgrupo, ctratamiento, xcliente, xgrupo, xtratamiento, bdoblemaquina, ntiempo_min from vwbuscartratamientosxcita where ccita = @ccita order by bdoblemaquina desc, ctratamiento"
                    );
                treatments.recordset.forEach((treatment) => {
                    if (treatment.bdoblemaquina) {
                        treatment.ntiempo_min /= 2;
                    }
                });
                result.recordset[i].treatments = treatments.recordset;
            }
        }

        const citasPorCabina = {};

        // Recorremos el arreglo original y agrupamos las citas por ccabina
        result.recordset.forEach((cita) => {
            const ccabina = cita.ccabina;

            // Si aún no hemos creado un arreglo para esta ccabina, lo creamos
            if (!citasPorCabina[ccabina]) {
                citasPorCabina[ccabina] = {
                    ccabina: ccabina,
                    xcabina: cita.xcabina,
                    citas: [],
                };
            }

            // Agregamos la cita al arreglo correspondiente
            citasPorCabina[ccabina].citas.push({
                xcliente: cita.xcliente,
                ccita: cita.ccita,
                ncliente: cita.ncliente,
                csucursal: cita.csucursal,
                ccabina: cita.ccabina,
                xestatus_cita: cita.xestatus_cita,
                cestatus_cita: cita.cestatus_cita,
                xterapeuta: cita.xterapeuta,
                cterapeuta: cita.cterapeuta,
                fentrada: cita.fentrada,
                fsalida: cita.fsalida,
                bactivo: cita.bactivo,
                cgrupo: cita.cgrupo,
                tratamientos: cita.treatments,
            });
        });

        // Convertimos el objeto en un arreglo
        const resultado = Object.values(citasPorCabina);
        return resultado;
    } catch (error) {
        console.log(error.message);
        return {
            error: error.message,
        };
    }
};
const startAppointment = async (appointmentId, signature, observation) => {
    try {
        let pool = await sql.connect(sqlConfig);
        //Busca si la cita seleccionada es la cita principal, o es la cita secundaria de doble máquina
        let result = await pool
            .request()
            .input("ccita", sql.Int, appointmentId)
            .query("select ccitaprincipal from agcitas where ccita = @ccita");
        //Si es una cita secundaria, entonces se actualiza la cita principal primero.
        if (result.recordset[0].ccitaprincipal) {
            await pool
                .request()
                .input("ccita", sql.Int, result.recordset[0].ccitaprincipal)
                .input("xfirma_entrada", sql.NVarChar, signature)
                .input("xobservaciones_entrada", sql.NVarChar, observation ? observation : undefined)
                .input("cestatus_cita", sql.Int, 3)
                .query(
                    "update agcitas set xobservaciones_entrada = @xobservaciones_entrada, xfirma_entrada = @xfirma_entrada,cestatus_cita = @cestatus_cita where ccita = @ccita"
                );
            await pool
                .request()
                .input("ccita", sql.Int, appointmentId)
                .input("xfirma_entrada", sql.NVarChar, signature)
                .input("xobservaciones_entrada", sql.NVarChar, observation ? observation : undefined)
                .input("cestatus_cita", sql.Int, 3)
                .query(
                    "update agcitas set xobservaciones_entrada = @xobservaciones_entrada, xfirma_entrada = @xfirma_entrada, cestatus_cita = @cestatus_cita where ccita = @ccita"
                );
        }
        //Si la cita es principal, entonces se actualizan ambas al mismo tiempo
        else {
            await pool
                .request()
                .input("ccita", sql.Int, appointmentId)
                .input("xfirma_entrada", sql.NVarChar, signature)
                .input("xobservaciones_entrada", sql.NVarChar, observation ? observation : undefined)
                .input("cestatus_cita", sql.Int, 3)
                .query(
                    "update agcitas set xobservaciones_entrada = @xobservaciones_entrada, xfirma_entrada = @xfirma_entrada, cestatus_cita = @cestatus_cita where ccita = @ccita or ccitaprincipal = @ccita"
                );
        }
        /*let appointment = await pool.request()
            .input("ccita", sql.Int, appointmentId)
            .query(
                "select * from agcitas where ccita = @ccita"
            );
        
        console.log(appointment.recordset);*/

        return true;
    } catch (error) {
        console.log(error.message);
        return {
            error: error.message,
        };
    }
};

const getStartedAppointmentDetail = async (appointmentId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool
            .request()
            .input("ccita", sql.Int, appointmentId)
            .query(
                "select ncliente, csucursal, ccabina, cestatus_cita, cterapeuta, ccausa_anul, fentrada, fsalida, bactivo, xobservaciones_entrada, xfirma_entrada from agcitas where ccita = @ccita"
            );
        return result.recordset[0];
    } catch (error) {
        console.log(error.message);
        return {
            error: error.message,
        };
    }
};

const endAppointment = async (appointmentId, signature, observation) => {
    try {
        let pool = await sql.connect(sqlConfig);
        //Busca si la cita seleccionada es la cita principal, o es la cita secundaria de doble máquina
        let result = await pool
            .request()
            .input("ccita", sql.Int, appointmentId)
            .query("select ccitaprincipal from agcitas where ccita = @ccita");
        //Si es una cita secundaria, entonces se actualiza la cita principal primero.
        if (result.recordset[0].ccitaprincipal) {
            await pool
                .request()
                .input("ccita", sql.Int, result.recordset[0].ccitaprincipal)
                .input("xfirma_salida", sql.NVarChar, signature)
                .input(
                    "xobservaciones_salida",
                    sql.NVarChar,
                    observation ? observation : undefined
                )
                .input("cestatus_cita", sql.Int, 4)
                .query(
                    "update agcitas set xobservaciones_salida = @xobservaciones_salida, xfirma_salida = @xfirma_salida,cestatus_cita = @cestatus_cita where ccita = @ccita"
                );
            await pool
                .request()
                .input("ccita", sql.Int, appointmentId)
                .input("xfirma_salida", sql.NVarChar, signature)
                .input(
                    "xobservaciones_salida",
                    sql.NVarChar,
                    observation ? observation : undefined
                )
                .input("cestatus_cita", sql.Int, 4)
                .query(
                    "update agcitas set xobservaciones_salida = @xobservaciones_salida, xfirma_salida = @xfirma_salida, cestatus_cita = @cestatus_cita where ccita = @ccita"
                );
        }
        //Si la cita es principal, entonces se actualizan ambas al mismo tiempo
        else {
            await pool
                .request()
                .input("ccita", sql.Int, appointmentId)
                .input("xfirma_salida", sql.NVarChar, signature)
                .input(
                    "xobservaciones_salida",
                    sql.NVarChar,
                    observation ? observation : undefined
                )
                .input("cestatus_cita", sql.Int, 4)
                .query(
                    "update agcitas set xobservaciones_salida = @xobservaciones_salida, xfirma_salida = @xfirma_salida, cestatus_cita = @cestatus_cita where ccita = @ccita or ccitaprincipal = @ccita"
                );
        }
        /*let appointment = await pool.request()
            .input("ccita", sql.Int, appointmentId)
            .query(
                "select * from agcitas where ccita = @ccita"
            );
        
        console.log(appointment.recordset);*/

        return true;
    } catch (error) {
        console.log(error.message);
        return {
            error: error.message,
        };
    }
};

export default {
    getOneWeekSchedule,
    getOneAppointment,
    getCabinNonBusinessHours,
    createNewAppointment,
    createNonBusinessHour,
    updateOneAppointmentTherapist,
    verifyIfAppointmentExists,
    deleteOneAppointment,
    deleteOneNonBusinessHour,
    getOneBranchAppointmentsByDate,
    getOneBranchNonBusinessHoursByDate,
    getAppointmentsByDate,
    getNonBusinessHoursByDate,
    getTherapistAppointments,
    startAppointment,
    getStartedAppointmentDetail,
    endAppointment
};