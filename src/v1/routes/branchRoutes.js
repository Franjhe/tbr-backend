import express from 'express';
import branchController from '../../controllers/branchController.js';

const router = express.Router();

router

/**
     * @swagger
     * /api/v1/branches:
     *   get:
     *     tags:
     *       - Branches
     *     summary: Get all the Branches
     *     description: Returns an object with all the Branches
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
     *                     branches: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           csucursal:
     *                             type: integer
     *                             example: 0
     *                           xsucursal: 
     *                             type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Branches not found
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
.get("/", branchController.getAllBranches)

export default router;