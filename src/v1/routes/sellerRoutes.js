import express from 'express';
import sellerController from '../../controllers/sellerController.js';
import searchSellerDTO from '../../dto/searchSellerDTO.js'
import verifyIfBranchExists from '../../middlewares/verifyIfBranchExists.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/sellers:
     *   post:
     *     tags:
     *       - Sellers
     *     summary: Get all the Sellers of an specific branch
     *     description: Returns an object with all the sellers
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: true
     *       content:
     *         application/json:
     *          schema:
     *           $ref: '#/components/schemas/SearchSellerDTOSchema'
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
     *                     sellers: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           cvendedor:
     *                             type: integer
     *                             example: 0
     *                           xvendedor: 
     *                             type: string
     *                           cusuario_vend:
     *                             type: integer
     *                             example: 0
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Sellers not found
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
    .post('/', searchSellerDTO.validateSearchSellerDTO, verifyIfBranchExists, sellerController.getAllSellers)

export default router;