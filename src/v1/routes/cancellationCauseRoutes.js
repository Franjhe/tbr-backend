import express from 'express';
import cancellationCauseController from '../../controllers/cancellationCauseController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/cancellation-cause:
     *   get:
     *     tags:
     *       - Cancellation Cause
     *     summary: Get all the cancellation causes
     *     description: Returns an object with all the cancellation causes
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
     *                     cancellationCauses: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           ccausa_anul:
     *                             type: integer
     *                             example: 0
     *                           xcausa_anul: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Cancellation Cause not found
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
    .get('/', cancellationCauseController.getAllCancellationCauses)

export default router;
