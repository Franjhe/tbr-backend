import express from 'express';
import bankController from '../../controllers/bankController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/banks:
     *   get:
     *     tags:
     *       - Banks
     *     summary: Get all the Banks
     *     description: Returns an object with all the Banks
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
     *                     banks: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           cbanco:
     *                             type: integer
     *                             example: 0
     *                           xbanco: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Banks not found
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
    .get('/', bankController.getAllBanks)

export default router;
