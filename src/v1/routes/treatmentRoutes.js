import express from 'express';
import treatmentController from '../../controllers/treatmentController.js';

const router = express.Router();

router
    /**
     * @swagger
     * /api/v1/treatments/{grouperId}:
     *   get:
     *     tags:
     *       - Treatments
     *     summary: Get all treatments of a specific group
     *     description: Returns an object with all the treatments of a specific group
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: grouperId
     *         schema:
     *           type: string
     *         required: true
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
     *                     treatments: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           cgrupo:
     *                             type: integer
     *                             example: 0
     *                           ctratamiento:
     *                             type: integer
     *                             example: 0
     *                           xtratamiento: 
     *                             type: string
     *                           xtratamiento_c: 
     *                             type: string
     *                           mprecio_min: 
     *                             type: number
     *                           nsesiones:
     *                             type: integer
     *                             example: 0
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Treatments not found
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
    .get('/:grouperId', treatmentController.getAllTreatments)

export default router;