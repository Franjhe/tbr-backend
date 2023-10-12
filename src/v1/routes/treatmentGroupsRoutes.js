import express from 'express';
import treatmentGroupsController from '../../controllers/treatmentGroupsController.js';

const router = express.Router();

router
    /**
     * @swagger
     * /api/v1/treatment-groups:
     *   get:
     *     tags:
     *       - Treatment Groups
     *     summary: Get all the treatment groups
     *     description: Returns an object with all the treatment groups
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
     *                     treatmentGroups: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           cgrupo:
     *                             type: integer
     *                             example: 0
     *                           xgrupo: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Treatments groups not found
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
    .get('/', treatmentGroupsController.getAllTreatmentGroups)

export default router;