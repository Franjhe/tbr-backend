import express from 'express';
import pointsOfSaleController from '../../controllers/pointsOfSaleController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/points-of-sale:
     *   get:
     *     tags:
     *       - Points of Sale
     *     summary: Get all the Points of Sale
     *     description: Returns an object with all the Points of Sale
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
     *                     pos: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           cpos:
     *                             type: integer
     *                             example: 0
     *                           xpos: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Points of Sale not found
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
    .get('/', pointsOfSaleController.getAllPointsOfSale)

export default router;
