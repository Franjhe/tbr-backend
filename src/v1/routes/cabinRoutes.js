import express from 'express';
import cabinController from '../../controllers/cabinController.js';
import searchCabinsDTO from '../../dto/searchCabinsDTO.js';
import verifyIfBranchExists from '../../middlewares/verifyIfBranchExists.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/cabins/{branchId}:
     *   get:
     *     tags:
     *       - Cabins
     *     summary: Get all the Branch Cabins
     *     description: Returns an object with all the Branch Cabins
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: branchId
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
     *                     cabins: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           ccabina:
     *                             type: integer
     *                             example: 0
     *                           cgrupo:
     *                             type: integer
     *                             example: 0
     *                           xcabina: 
     *                             type: string
     *                           bactivo:
     *                             type: boolean
     *                             example: true
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Cabin not found
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
    .get('/:branchId', searchCabinsDTO.validateSearchCabinsDTO, verifyIfBranchExists, cabinController.getAllBranchCabins)

export default router;
