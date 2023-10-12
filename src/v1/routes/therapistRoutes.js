import express from 'express';
import therapistController from '../../controllers/therapistController.js';
import authorizate from '../../middlewares/authorizate.js';
import verifyIfBranchExists from '../../middlewares/verifyIfBranchExists.js';
import searchTherapistDTO from '../../dto/searchTherapistDTO.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/therapists/search:
     *   post:
     *     tags:
     *       - Therapists
     *     summary: Get all the Therapists
     *     description: Returns an object with all the therapists
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: true
     *       content:
     *         application/json:
     *          schema:
     *           $ref: '#/components/schemas/SearchTherapistDTOSchema'
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
     *                     therapists: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           cterapeuta:
     *                             type: integer
     *                             example: 0
     *                           xterapeuta: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Therapists not found
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
    .post('/search', searchTherapistDTO.validateSearchTherapistDTO, verifyIfBranchExists, therapistController.getAllTherapists)

export default router;