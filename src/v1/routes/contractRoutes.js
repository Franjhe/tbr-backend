import express from 'express';
import contractController from '../../controllers/contractController.js';
import newContractDTO from '../../dto/newContractDTO.js';
import searchContractDTO from '../../dto/searchContractDTO.js';
import searchOneContractDTO from '../../dto/searchOneContractDTO.js';
import updateContractDTO from '../../dto/updateContractDTO.js';
import changeTreatmentDTO from '../../dto/changeTreatmentDTO.js';
import deleteOneContractDTO from '../../dto/deleteOneContractDTO.js';
import authorizate from '../../middlewares/authorizate.js';
import verifyIfClientExists from '../../middlewares/verifyIfClientExists.js';
import verifyIfBranchExists from '../../middlewares/verifyIfBranchExists.js';
import verifyIfSellerExists from '../../middlewares/verifyIfSellerExists.js';
import verifyIfRrssExists from '../../middlewares/verifyIfRrssExists.js';
import verifyIfTherapistExists from '../../middlewares/verifyIfTherapistExists.js';
import verifyIfCommissionTypeExists from '../../middlewares/verifyIfCommissionTypeExists.js';
import verifyContractClientsList from '../../middlewares/verifyContractClientsList.js';
import verifyContractTreatmentsList from '../../middlewares/verifyContractTreatmentsList.js';
import verifyContractAmounts from '../../middlewares/verifyContractAmounts.js';
import verifyIfContractExists from '../../middlewares/verifyIfContractExists.js';
import verifyIfClientBelongsToBranch from '../../middlewares/verifyIfClientBelongsToBranch.js';
import verifyIfTherapistBelongsToBranch from '../../middlewares/verifyIfTherapistBelongsToBranch.js';
import verifyIfSellerBelongsToBranch from '../../middlewares/verifyIfSellerBelongsToBranch.js';
import verifyContractDate from '../../middlewares/verifyContractDate.js';
import verifyRepeatedTreatmentsPerClient from '../../middlewares/verifyRepeatedTreatmentsPerClient.js';
import verifyIfCancellationCauseExists from '../../middlewares/verifyIfCancellationCauseExists.js';
import newCourtesySessionDTO from '../../dto/newCourtesySessionDTO.js';
import decreaseNumberOfSessionsDTO from '../../dto/decreaseNumberOfSessionsDTO.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/contracts/search:
     *   post:
     *     tags:
     *       - Contracts
     *     summary: Search Contracts by optional filters and branch
     *     description: Returns a List of Contracts that match the optional filters and the user's branch 
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: false
     *       content:
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/SearchContractDTOSchema'
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
     *                     contracts: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           npaquete: 
     *                             type: integer
     *                             example: 0
     *                           ncliente:
     *                             type: integer
     *                             example: 0
     *                           xcliente: 
     *                             type: string
     *                           xsucursal: 
     *                             type: string
     *                           fcontrato: 
     *                             type: string
     *                             format: date-time
     *                           xvendedor: 
     *                             type: string
     *                           ipaquete_tipo: 
     *                             type: string
     *                           mpaquete_cont: 
     *                             type: number
     *                           bactivo:
     *                             type: boolean
     *                           bcuotas:
     *                             type: boolean
     *                           bprimerasesion:
     *                             type: boolean
     *       400:
     *         description: The client's CID already exists
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
     *         description: Client not found
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
    .post('/search', verifyIfClientExists, contractController.getAllContracts)
    
    /**
     * @swagger
     * /api/v1/contracts/{packageId}:
     *   get:
     *     tags:
     *       - Contracts
     *     summary: Get one specific contract
     *     description: Returns an object with the contract's information
     *     security:
     *       - bearerAuth: []
     *     parameters: 
     *       - in: path
     *         name: packageId
     *         schema:
     *           type: String
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
     *                     contract: 
     *                       type: object
     *                       properties:
     *                         npaquete: 
     *                           type: string
     *                         csucursal: 
     *                           type: integer
     *                           example: 0
     *                         fcontrato: 
     *                           type: string
     *                           format: date-time
     *                         ipaquete_tipo: 
     *                           type: string
     *                         ncliente: 
     *                           type: integer
     *                           example: 0
     *                         ctipocom: 
     *                           type: integer
     *                           example: 0
     *                         cvendedor: 
     *                           type: integer
     *                           example: 0
     *                         crrss: 
     *                           type: integer
     *                           example: 0
     *                         cterapeuta: 
     *                           type: integer
     *                           example: 0
     *                         mtotal: 
     *                           type: number
     *                         pdesc: 
     *                           type: number
     *                         mdesc: 
     *                           type: number
     *                         mpaquete: 
     *                           type: number
     *                         mbono_cupon: 
     *                           type: number
     *                         mpaquete_cont: 
     *                           type: number
     *                         igarantizada: 
     *                           type: string
     *                         ibono: 
     *                           type: string
     *                         bactivo:
     *                           type: boolean
     *                         bcuotas:
     *                           type: boolean
     *                         bprimerasesion:
     *                           type: boolean
     *                         clientes:
     *                           type: array
     *                           items:
     *                             type: object
     *                             properties:
     *                               ncliente:
     *                                 type: integer
     *                               tratamientos:
     *                                 type: array
     *                                 items: 
     *                                   type: object
     *                                   properties:
     *                                     cgrupo: 
     *                                       type: integer
     *                                       example: 0
     *                                     ctratamiento:
     *                                       type: integer
     *                                       example: 0
     *                                     cgrupo_ant: 
     *                                       type: integer
     *                                       example: 0
     *                                     ctratamiento_ant:
     *                                       type: integer
     *                                       example: 0
     *                                     xtratamiento:
     *                                       type: string
     *                                     xtratamiento_ant:
     *                                       type: string
     *                                     ncliente_ant: 
     *                                       type: integer
     *                                       example: 0
     *                                     mprecio_min:
     *                                       type: number
     *                                     nsesiones:
     *                                       type: integer
     *                                       example: 0
     *                                     xcomentario:
     *                                       type: string
     *                                     bactivo:
     *                                       type: boolean
     *       400:
     *         description: The client's CID already exists
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
     *         description: Client not found
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
    .get('/:packageId', searchOneContractDTO.validateSearchOneContractDTO, contractController.getOneContract)
    
    /**
     * @swagger
     * /api/v1/contracts:
     *   post:
     *     tags:
     *       - Contracts
     *     summary: Create a new Contract
     *     description: Returns the new contract id
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: true
     *       content: 
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/NewContractDTOSchema'
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
     *                 data:
     *                   type: object 
     *                   properties: 
     *                     contract:
     *                       type: object
     *                       properties: 
     *                         npaquete:
     *                           type: string
     *       400:
     *         description: Bad request
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
     *         description: Data not found
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
    .post('/', authorizate(2, true, false, false), newContractDTO.validateNewContractDTO, verifyContractDate, verifyIfBranchExists, verifyIfClientExists, verifyIfClientBelongsToBranch, verifyIfSellerExists, verifyIfSellerBelongsToBranch, verifyIfTherapistExists, verifyIfTherapistBelongsToBranch, verifyIfRrssExists, verifyIfCommissionTypeExists, verifyContractClientsList, verifyRepeatedTreatmentsPerClient, verifyContractTreatmentsList, verifyContractAmounts, contractController.createNewContract)

    /**
     * @swagger
     * /api/v1/contracts/{packageId}:
     *   patch:
     *     tags:
     *       - Contracts
     *     summary: Update one contract
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: packageId
     *         schema:
     *           type: string
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateContractBodyDTOSchema'
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
     *         description: Bad request
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
     *         description: Contract not found
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
    .patch('/:packageId', authorizate(2, false, true, false), updateContractDTO.validateUpdateContractDTO, verifyIfContractExists, verifyIfBranchExists, verifyIfClientExists, verifyIfClientBelongsToBranch, verifyIfSellerExists, verifyIfSellerBelongsToBranch, verifyIfTherapistExists, verifyIfTherapistBelongsToBranch, verifyIfRrssExists, verifyIfCommissionTypeExists, verifyContractClientsList, verifyRepeatedTreatmentsPerClient, verifyContractTreatmentsList, verifyContractAmounts, contractController.updateOneContract)

    /**
     * @swagger
     * /api/v1/contracts/treatment-change/{packageId}:
     *   patch:
     *     tags:
     *       - Contracts
     *     summary: Change One Treatment Contract
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: packageId
     *         schema:
     *           type: string
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ChangeTreatmentBodyDTOSchema'
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
     *         description: Bad request
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
     *         description: Contract not found
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
    .patch('/treatment-change/:packageId', authorizate(2, false, true, false), changeTreatmentDTO.validateChangeTreatmentDTO, verifyIfContractExists, contractController.updateOneContractTreatment)

    /**
     * @swagger
     * /api/v1/contracts/courtesy-session/{packageId}:
     *   patch:
     *     tags:
     *       - Contracts
     *     summary: Add one courtesy session to a contract
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: packageId
     *         schema:
     *           type: string
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/NewCourtesySessionBodyDTOSchema'
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
     *         description: Bad request
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
     *         description: Contract not found
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
    .patch('/courtesy-session/:packageId', authorizate(2, false, true, false), newCourtesySessionDTO.validateNewCourtesySessionDTO, verifyIfContractExists, contractController.createNewCourtesySession)

    /**
     * @swagger
     * /api/v1/contracts/decrease-sessions/{packageId}:
     *   patch:
     *     tags:
     *       - Contracts
     *     summary: Decrease the session's number of a treatment
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: packageId
     *         schema:
     *           type: string
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/DecreaseNumberOfSessionsBodyDTOSchema'
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
     *         description: Bad request
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
     *         description: Contract not found
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
    .patch('/decrease-sessions/:packageId', authorizate(2, false, true, false), decreaseNumberOfSessionsDTO.validateDecreaseNumberOfSessionsDTO, verifyIfContractExists, contractController.decreaseNumberOfSessions)


    /**
     * @swagger
     * /api/v1/contracts/{packageId}/{cancellationCauseId}:
     *   delete:
     *     tags:
     *       - Contracts
     *     summary: Soft delete one contract
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: packageId
     *         schema:
     *           type: string
     *         required: true    
     *       - in: path
     *         name: cancellationCauseId
     *         schema:
     *           type: integer
     *         required: true  
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
     *         description: Contract not found
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
    .delete('/:packageId/:cancellationCauseId', authorizate(2, false, false, true), deleteOneContractDTO.validateDeleteOneContractDTO, verifyIfContractExists, verifyIfCancellationCauseExists, contractController.deleteOneContract)

export default router;