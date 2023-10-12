import express from 'express';
import collectionController from '../../controllers/collectionController.js';
import authorizate from '../../middlewares/authorizate.js'
import verifyIfClientExists from '../../middlewares/verifyIfClientExists.js';
import searchClientDebtCollectionsDTO from '../../dto/searchClientDebtCollectionsDTO.js';
import payOneClientDebtsDTO from '../../dto/payOneClientDebtsDTO.js';
import SearchCollectionPendingDTOSchema from '../../dto/searchCollectionPendingDTO.js';


const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/collections/debt-collections/{clientId}:
     *   get:
     *     tags:
     *       - Collections
     *     summary: Get all the Debt Collections of an specific client
     *     description: Returns an object with all the client's debt collections
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         schema:
     *           type: string
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
     *                 data:
     *                   type: object 
     *                   properties:
     *                     debtCollections: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           npaquete: 
     *                             type: string
     *                           mpaquete_cont: 
     *                             type: number
     *                           fcontrato: 
     *                             type: string
     *                             format: date-time
     *                           csucursal:
     *                             type: integer
     *                             example: 0
     *                           xsucursal: 
     *                             type: string
     *                           ccuota:
     *                             type: integer
     *                             example: 0
     *                           ipago: 
     *                             type: string
     *                           mcuota: 
     *                             type: number
     *                           mpagado: 
     *                             type: number
     *                           mpendiente: 
     *                             type: number
     *                           fpago: 
     *                             type: string
     *                             format: date-time
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: RRSS not found
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
    .get('/debt-collections/:clientId', searchClientDebtCollectionsDTO.validateSearchClientDebtCollectionsDTO, verifyIfClientExists, collectionController.getAllClientDebtCollections)

    /**
     * @swagger
     * /api/v1/collections/paid-billings/{clientId}:
     *   get:
     *     tags:
     *       - Collections
     *     summary: Get all the paid billing from an specific client
     *     description: Returns an object with all the client's paid billing
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         schema:
     *           type: string
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
     *                 data:
     *                   type: object 
     *                   properties:
     *                     paidBillings: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           crecibo:
     *                             type: integer
     *                             example: 0
     *                           npaquete: 
     *                             type: string
     *                           mpaquete_cont: 
     *                             type: number
     *                           fcontrato: 
     *                             type: string
     *                             format: date-time
     *                           csucursal:
     *                             type: integer
     *                             example: 0
     *                           xsucursal: 
     *                             type: string
     *                           ccuota:
     *                             type: integer
     *                             example: 0
     *                           ipago: 
     *                             type: string
     *                           mcuota: 
     *                             type: number
     *                           mpagado: 
     *                             type: number
     *                           fpago: 
     *                             type: string
     *                             format: date-time
     *                           fcobro: 
     *                             type: string
     *                             format: date-time
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: RRSS not found
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
    .get('/paid-billings/:clientId', searchClientDebtCollectionsDTO.validateSearchClientDebtCollectionsDTO, verifyIfClientExists, collectionController.getAllClientPaidBillings)

    /**
     * @swagger
     * /api/v1/collections:
     *   post:
     *     tags:
     *       - Collections
     *     summary: Pay one client debts
     *     description: Returns the new receipts id's
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: true
     *       content: 
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/PayOneClientDebtsDTOSchema'
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
     *                 crecibo:
     *                   type: integer
     *                   example: 0
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
    .post('/', authorizate(2, true, false, false), payOneClientDebtsDTO.validatePayOneClientDebtsDTO, verifyIfClientExists, collectionController.payOneClientDebts)

        /**
     * @swagger
     * /api/v1/collections/branch:
     *   post:
     *     tags:
     *       - Collections
     *     summary: Search for debts by branch with date range
     *     description: Returns pending receipts
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: true
     *       content: 
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/PayOneClientDebtsDTOSchema'
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
     *                 crecibo:
     *                   type: integer
     *                   example: 0
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
        .post('/pending-collections', authorizate(2, true, false, false), SearchCollectionPendingDTOSchema.validateSearchCollectionPendingsDTO, collectionController.getAllDebtCollectionsPending)

export default router;