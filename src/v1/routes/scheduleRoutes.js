import express from 'express';
import scheduleController from '../../controllers/scheduleController.js';
import getOneWeekScheduleDTO from '../../dto/searchOneWeekScheduleDTO.js';
import newAppointmentDTO from '../../dto/newAppointmentDTO.js';
import updateAppointmentDTO from '../../dto/updateAppointmentDTO.js';
import deleteOneAppointmentDTO from '../../dto/deleteOneAppointmentDTO.js';
import newNonBusinessHourDTO from '../../dto/newNonBusinessHourDTO.js';
import deleteNonBusinessHourDTO from '../../dto/deleteNonBusinessHourDTO.js';
import authorizate from '../../middlewares/authorizate.js';
import verifyIfBranchExists from '../../middlewares/verifyIfBranchExists.js';
import verifyIfContractExists from '../../middlewares/verifyIfContractExists.js';
import verifyIfClientExists from '../../middlewares/verifyIfClientExists.js';
import verifyIfClientBelongsToBranch from '../../middlewares/verifyIfClientBelongsToBranch.js';
import verifyIfTherapistExists from '../../middlewares/verifyIfTherapistExists.js';
import verifyIfTherapistBelongsToBranch from '../../middlewares/verifyIfTherapistBelongsToBranch.js';
import verifyIfCabinExists from '../../middlewares/verifyIfCabinExists.js';
import verifyIfCabinBelongsToBranch from '../../middlewares/verifyIfCabinBelongsToBranch.js';
import verifyIfAppointmentExists from '../../middlewares/verifyIfAppointmentExists.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/schedules/search:
     *   post:
     *     tags:
     *       - Schedules
     *     summary: Search One Week's Schedule
     *     description: Returns a List of the Appointments of one Schedule of a specific branch
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: false
     *       content:
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/SearchOneWeekScheduleDTOSchema'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: boolean
     *                 data:
     *                   type: object 
     *                   properties:
     *                     appointments: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           ccita: 
     *                             type: integer
     *                             example: 0
     *                           npaquete: 
     *                             type: string
     *                           ncliente: 
     *                             type: integer
     *                             example: 0
     *                           csucursal: 
     *                             type: integer
     *                             example: 0
     *                           ccabina: 
     *                             type: integer
     *                             example: 0
     *                           cgrupo: 
     *                             type: integer
     *                             example: 0
     *                           ctratamiento: 
     *                             type: integer
     *                             example: 0
     *                           cestatus_cita: 
     *                             type: integer
     *                             example: 0
     *                           cterapeuta: 
     *                             type: integer
     *                             example: 0
     *                           fentrada: 
     *                             type: string
     *                             format: date-time
     *                           fsalida: 
     *                             type: string
     *                             format: date-time
     *                           bactivo: 
     *                             type: boolean
     *                           xcliente: 
     *                             type: string
     *                           xsucursal: 
     *                             type: string
     *                           xcabina: 
     *                             type: string
     *                           xgrupo: 
     *                             type: string
     *                           xestatus_cita: 
     *                             type: string
     *                           xterapeuta: 
     *                             type: string
     *                           treatments:
     *                             type: array
     *                             items: 
     *                               type: object
     *                               properties:
     *                                 ncliente:
     *                                   type: integer
     *                                   example: 0
     *                                 npaquete:
     *                                   type: string
     *                                 cgrupo:
     *                                   type: integer
     *                                   example: 0
     *                                 ctratamiento:
     *                                   type: integer
     *                                   example: 0
     *                                 xcliente:
     *                                   type: string
     *                                 xgrupo:
     *                                   type: string
     *                                 xtratamiento:
     *                                   type: string
     *                                 ntiempo_min:
     *                                   type: integer
     *                                   example: 0
     *                                 bdoblemaquina:
     *                                   type: boolean
     *       400:
     *         description: Error Bad Request
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Schedule not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       5XX:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse' 
     */
    .post("/search", getOneWeekScheduleDTO.validateSearchOneWeekScheduleDTO, verifyIfBranchExists, scheduleController.getOneWeekSchedule)

    /**
     * @swagger
     * /api/v1/schedules:
     *   post:
     *     tags:
     *       - Schedules
     *     summary: Create a new Appointment
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: true
     *       content: 
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/NewAppointmentDTOSchema'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: boolean
     *                 message: 
     *                   type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Error not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       5XX:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse' 
     */
    .post("/", authorizate(11, true, false, false), newAppointmentDTO.validateNewAppointmentDTO, verifyIfBranchExists, verifyIfClientExists, verifyIfClientBelongsToBranch, verifyIfTherapistExists, verifyIfTherapistBelongsToBranch, verifyIfCabinExists, verifyIfCabinBelongsToBranch, scheduleController.createNewAppointment)


    .post("/non-business-hour/search", scheduleController.getCabinNonBusinessHours)

    /**
     * @swagger
     * /api/v1/schedules/non-business-hour:
     *   post:
     *     tags:
     *       - Schedules
     *     summary: Create a new Cabin's Non Business Hour
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: true
     *       content: 
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/NewNonBusinessHourDTOSchema'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: boolean
     *                 message: 
     *                   type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Error not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       5XX:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse' 
     */
    .post("/non-business-hour", authorizate(11, true, false, false), newNonBusinessHourDTO.validateNonBusinessHourDTO, verifyIfBranchExists, verifyIfCabinExists, scheduleController.createNonBusinessHour)

    /**
     * @swagger
     * /api/v1/schedules/{appointmentId}:
     *   patch:
     *     tags:
     *       - Schedules
     *     summary: Update one appointment therapist
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: appointmentId
     *         schema:
     *           type: integer
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateAppointmentBodyDTOSchema'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: boolean
     *                 message: 
     *                   type: string
     *       400:
     *         description: Bad Request
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Appointment not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       5XX:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse' 
     */
    .patch("/:appointmentId", authorizate(11, false, true, false), updateAppointmentDTO.validateUpdateAppointmentDTO, verifyIfAppointmentExists, verifyIfTherapistExists, scheduleController.updateOneAppointmentTherapist)

    /**
     * @swagger
     * /api/v1/schedules/delete/{appointmentId}:
     *   patch:
     *     tags:
     *       - Schedules
     *     summary: Soft delete one appointment
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: appointmentId
     *         schema:
     *           type: integer
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/DeleteOneAppointmentBodyDTOSchema'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: boolean
     *                 message: 
     *                   type: string
     *       400:
     *         description: Bad Request
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Appointment not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       5XX:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse' 
     */
    .patch("/delete/:appointmentId", authorizate(11, false, true, false), deleteOneAppointmentDTO.validateDeleteOneAppointmentDTO, verifyIfAppointmentExists, scheduleController.deleteOneAppointment)

    /**
     * @swagger
     * /api/v1/schedules/nonbusinessHours/{nonBusinessHourId}:
     *   delete:
     *     tags:
     *       - Schedules
     *     summary: Delete one Non Business Hour
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: nonBusinessHourId
     *         schema:
     *           type: integer
     *         required: true
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: boolean
     *                 message: 
     *                   type: string
     *       400:
     *         description: Bad Request
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Appointment not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       5XX:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse' 
     */
    .delete("/nonbusinessHours/:nonBusinessHourId", authorizate(11, false, false, true), deleteNonBusinessHourDTO.validateDeleteNonBusinessHourDTO, scheduleController.deleteOneNonBusinessHour)

    .post("/branch-appointments/:branchId", verifyIfBranchExists, scheduleController.getOneBranchAppointmentsByDate)

    .post("/branch-non-business-hours/:branchId", verifyIfBranchExists, scheduleController.getOneBranchNonBusinessHoursByDate)

    .post("/therapists/:therapistId", verifyIfTherapistExists, scheduleController.getTherapistAppointments)

    export default router;