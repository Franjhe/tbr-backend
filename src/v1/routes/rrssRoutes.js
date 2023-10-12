import express from 'express';
import rrssController from '../../controllers/rrssController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/rrss:
     *   get:
     *     tags:
     *       - RRSS
     *     summary: Get all the RRSS sellers
     *     description: Returns an object with all the RRSS sellers
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
     *                     rrss: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           crrss:
     *                             type: integer
     *                             example: 0
     *                           xrrss: 
     *                             type: string
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
    .get('/', rrssController.getAllRrss)

export default router;
