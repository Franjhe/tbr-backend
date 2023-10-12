import express from 'express';
import cityController from '../../controllers/cityController.js';
import cityDTO from '../../dto/cityDTO.js';
import verifyIfStateExists from '../../middlewares/verifyIfStateExists.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/cities/{stateId}:
     *   get:
     *     tags:
     *       - Cities
     *     summary: Get the state's cities
     *     description: Returns an object with the state's cities
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: stateId
     *         schema:
     *           type: integer
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
     *                     cities: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           cciudad:
     *                             type: integer
     *                             example: 0
     *                           xciudad: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Cities not found
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
    .get("/:stateId", cityDTO.validateCityDTO, verifyIfStateExists, cityController.getAllCities)

export default router;