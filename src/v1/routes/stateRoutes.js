import express from 'express';
import stateController from '../../controllers/stateController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/states:
     *   get:
     *     tags:
     *       - States
     *     summary: Get all the states
     *     description: Returns an object with all the states
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
     *                     states: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           cestado:
     *                             type: integer
     *                             example: 0
     *                           xestado: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: States not found
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
    .get("/", stateController.getAllStates)

export default router;