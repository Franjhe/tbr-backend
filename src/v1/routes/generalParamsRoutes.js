import express from 'express';
import generalParamsController from '../../controllers/generalParamsController.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/general-params:
     *   get:
     *     tags:
     *       - General Params
     *     summary: Get all the general params
     *     description: Returns an object with all the general params
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
     *                     params: 
     *                       type: object
     *                       properties:
     *                         ntrar_desc_1:
     *                           type: number
     *                         ntrar_desc_2:
     *                           type: number
     *                         ntrar_desc_3:
     *                           type: number
     *                         ntrar_desc_4:
     *                           type: number
     *                         mrec_desc_1:
     *                           type: number
     *                         mrec_desc_2:
     *                           type: number
     *                         mrec_desc_3:
     *                           type: number
     *                         mrec_desc_4:
     *                           type: number
     *                         npagos_max:
     *                           type: integer
     *                           example: 0
     *                         ndias_cuota:
     *                           type: integer
     *                           example: 0
     *                         edad_min:
     *                           type: integer
     *                           example: 0
     *                         edad_max:
     *                           type: integer
     *                           example: 0
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: General Params not found
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
    .get("/", generalParamsController.getAllGeneralParams)

export default router;