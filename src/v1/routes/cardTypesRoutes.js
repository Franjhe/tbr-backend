import express from 'express';
import cardTypesController from '../../controllers/cardTypesController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/card-types:
     *   get:
     *     tags:
     *       - Card Types
     *     summary: Get all the Card Types
     *     description: Returns an object with all the Card Types
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
     *                     cardTypes: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           ctipo_tarjeta:
     *                             type: integer
     *                             example: 0
     *                           xtipo_tarjeta: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Card Type not found
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
    .get('/', cardTypesController.getAllCardTypes)

export default router;
