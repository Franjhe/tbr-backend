import express from 'express';
import commissionTypeController from '../../controllers/commissionTypeController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/commission-types:
     *   get:
     *     tags:
     *       - Commission Types
     *     summary: Get all the Commission Types
     *     description: Returns an object with all the commission types
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
     *                     commissionTypes: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           ctipocom:
     *                             type: integer
     *                             example: 0
     *                           xtipocom:
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Commission Types not found
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
    .get('/', commissionTypeController.getAllCommissionTypes)

export default router;