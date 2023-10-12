import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import authController from '../../controllers/authController.js';
import loginDTO from '../../dto/loginDTO.js';
import verifyModulePermissionDTO from '../../dto/verifyModulePermissionDTO.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/auth/signIn:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Sign in
     *     description: Returns an object with some user information
     *     requestBody: 
     *       required: true
     *       content:
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/LoginDTOSchema'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object 
     *                   properties:
     *                     xusuario: 
     *                       type: string
     *                     csucursal: 
     *                       type: integer
     *                       example: 0
     *                     xsucursal: 
     *                       type: string
     *                     bmaster:
     *                       type: boolean
     *                     token: 
     *                       type: string
     *       401:
     *         description: The password or the user's name are incorrect
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
    .post("/signIn", loginDTO.validateLoginDTO, authController.createJWT)

    /**
     * @swagger
     * /api/v1/auth/user-modules:
     *   get:
     *     tags:
     *       - Auth
     *     summary: Get user modules
     *     description: Returns an object with the user modules
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
     *                     groups: 
     *                       type: object
     *                       properties:
     *                         cgrupo:
     *                           type: integer
     *                           example: 0
     *                         xgrupo:
     *                           type: string
     *                         xicono:
     *                           type: string
     *                         modules: 
     *                           type: array
     *                           items:
     *                             type: object
     *                             properties:
     *                               cmodulo: 
     *                                 type: integer
     *                                 example: 0
     *                               xmodulo:
     *                                 type: string
     *                               xruta:
     *                                 type: string
     *                               xicono:
     *                                 type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Modules not found
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
    .get("/user-modules", authenticate, authController.getUserModules)

    /**
     * @swagger
     * /api/v1/auth/verify-module-permission/{moduleId}:
     *   get:
     *     tags:
     *       - Auth
     *     summary: Get module permissions
     *     description: Returns an object with the module permissions
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: moduleId
     *         schema:
     *           type: integer
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
     *                     permission: 
     *                       type: object
     *                       properties:
     *                         bcrear:
     *                           type: boolean
     *                         bmodificar:
     *                           type: boolean
     *                         beliminar:
     *                           type: boolean
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: The user does not have permission to access the indicated module
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Module not found
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
    .get("/verify-module-permission/:moduleId", authenticate, verifyModulePermissionDTO.validateModulePermissionDTO, authController.verifyModulePermission);

export default router;