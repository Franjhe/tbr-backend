import express from 'express';
import paymentInstallmentsController from '../../controllers/paymentInstallmentsController.js';
import authorizate from '../../middlewares/authorizate.js';
import newPaymentInstallmentsDTO from '../../dto/newPaymentInstallmentsDTO.js';
import verifyIfContractExists from '../../middlewares/verifyIfContractExists.js';
import verifyPaymentMethods from '../../middlewares/verifyPaymentMethods.js';
import verifyPaymentInstallmentsAmounts from '../../middlewares/verifyPaymentInstallmentsAmounts.js';
import verifyPaymentInstallmentsDates from '../../middlewares/verifyPaymentInstallmentsDates.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/payment-installments/{packageId}:
     *   get:
     *     tags:
     *       - Payment Installments
     *     summary: Get all the payment installments of an specific contract
     *     description: Returns the payment installments of the contract
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: packageId
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
     *                     fanticipo:
     *                       type: string
     *                       format: date
     *                     manticipo:
     *                       type: number
     *                     ncuotas:
     *                       type: integer
     *                       example: 0
     *                     crecibo:
     *                       type: integer
     *                       example: 0
     *                     cuotas: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           ccuota:
     *                             type: integer
     *                             example: 0
     *                           fpago: 
     *                             type: string
     *                             format: date
     *                           ipago:
     *                             type: string
     *                           bpago:
     *                             type: boolean
     *                           mcuota:
     *                             type: number
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
     *         description: Payment Installments not found
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
    .get('/:packageId', paymentInstallmentsController.getContractPaymentInstallments)

    /**
     * @swagger
     * /api/v1/payment-installments:
     *   post:
     *     tags:
     *       - Payment Installments
     *     summary: Create a new payment installment
     *     description: Returns the new payment installments id's
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: true
     *       content: 
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/NewPaymentInstallmentsDTOSchema'
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
    .post('/', authorizate(2, true, false, false), newPaymentInstallmentsDTO.validateNewPaymentInstallmentsDTO, verifyIfContractExists, verifyPaymentMethods, /*verifyPaymentInstallmentsDates,*/ verifyPaymentInstallmentsAmounts, paymentInstallmentsController.createNewPaymentInstallments)
    
    .patch('/', authorizate(2, true, true, false),  verifyIfContractExists, verifyPaymentInstallmentsAmounts, paymentInstallmentsController.editPaymentInstallments)

export default router;