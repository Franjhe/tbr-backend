import express from 'express';
import receiptController from '../../controllers/receiptController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/receipts/{receiptId}:
     *   get:
     *     tags:
     *       - Receipts
     *     summary: Get one specific receipt
     *     description: Returns an object with the receipt's information
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: receiptId
     *         schema:
     *           type: string
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
     *                     receipt: 
     *                       type: object
     *                       properties:
     *                         crecibo: 
     *                           type: integer
     *                           example: 0
     *                         cvendedor: 
     *                           type: integer
     *                           example: 0
     *                         ncliente: 
     *                           type: integer
     *                           example: 0
     *                         xcliente: 
     *                           type: string
     *                         xconceptopago: 
     *                           type: string
     *                         mtotal:
     *                           type: number
     *                         fcobro: 
     *                           type: string
     *                           format: date-time
     *                         msaldopendiente:
     *                           type: number
     *                         distribucionpago:
     *                           type: array
     *                           items:
     *                             type: object
     *                             properties:
     *                               cpago:
     *                                 type: integer
     *                                 example: 0
     *                               cmodalidad_pago:
     *                                 type: integer
     *                                 example: 0
     *                               xmodalidad_pago:
     *                                 type: string
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
     *         description: Receipt not found
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
    .get("/:receiptId", receiptController.getOneReceipt)

    /**
     * @swagger
     * /api/v1/receipts/payment-distribution/{receiptId}:
     *   get:
     *     tags:
     *       - Receipts
     *     summary: Get the payment distribution of one specific receipt
     *     description: Returns an object with the receipt's payment distribution information
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: receiptId
     *         schema:
     *           type: string
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
     *                     receipt: 
     *                       type: object
     *                       properties:
     *                         distribucionpago:
     *                           type: array
     *                           items:
     *                             type: object
     *                             properties:
     *                               cpago:
     *                                 type: integer
     *                                 example: 0
     *                               cmodalidad_pago:
     *                                 type: integer
     *                                 example: 0
     *                               ctipo_tarjeta:
     *                                 type: integer
     *                                 example: 0
     *                               cbanco:
     *                                 type: integer
     *                                 example: 0
     *                               cpos:
     *                                 type: integer
     *                                 example: 0
     *                               mpago:
     *                                 type: number
     *                               xtarjeta:
     *                                 type: string
     *                               xvencimiento:
     *                                 type: string
     *                               xobservacion:
     *                                 type: string
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
     *         description: Receipt not found
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
    .get("/payment-distribution/:receiptId", receiptController.getReceiptPaymentDistributionDetail)

    export default router;