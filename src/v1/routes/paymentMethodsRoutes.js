import express from 'express';
import paymentMethodsController from '../../controllers/paymentMethodsController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/payment-methods:
     *   get:
     *     tags:
     *       - Payment Methods
     *     summary: Get all the Payment Methods
     *     description: Returns an object with all the Payment Methods
     *     security:
     *       - bearerAuth: []
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
     *                     paymentMethods: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           cmodalidad_pago:
     *                             type: integer
     *                             example: 0
     *                           xmodalidad_pago: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Payment Methods not found
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
    .get('/', paymentMethodsController.getAllPaymentMethods)

export default router;
