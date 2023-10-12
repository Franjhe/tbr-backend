import express from 'express';
import clientController from '../../controllers/clientController.js';
import authorizate from '../../middlewares/authorizate.js'
import verifyIfBranchExists from '../../middlewares/verifyIfBranchExists.js';
import verifyIfClientExists from '../../middlewares/verifyIfClientExists.js';
import verifyIfStateExists from '../../middlewares/verifyIfStateExists.js';
import verifyIfCityExists from '../../middlewares/verifyIfCityExists.js';
import verifyIfCityBelongsToState from '../../middlewares/verifyIfCityBelongsToState.js';
import verifyPhoneNumberNotExists from '../../middlewares/verifyPhoneNumberNotExists.js';
import verifyDateOfBirth from '../../middlewares/verifyDateOfBirth.js';
import newClientDTO from '../../dto/newClientDTO.js';
import updatedClientDTO from '../../dto/updatedClientDTO.js';
import deletedClientDTO from '../../dto/deletedClientDTO.js';
import searchClientDTO from '../../dto/searchClientDTO.js';
import searchOneClientDto from '../../dto/searchOneClientDTO.js';
import updateClientBranchDTO from '../../dto/updateClientBranchDTO.js';

const router = express.Router();

router

    /**
     * @swagger
     * /api/v1/clients/search:
     *   post:
     *     tags:
     *       - Clients
     *     summary: Search Clients by optional filters and branch
     *     description: Returns a List of Clients that match the optional filters and the user's branch 
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: false
     *       content:
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/SearchClientDTOSchema'
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
     *                     clients: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           ncliente: 
     *                             type: integer
     *                             example: 0
     *                           ncont_ant: 
     *                             type: integer
     *                             example: 0
     *                           xcliente: 
     *                             type: string
     *                           cid: 
     *                             type: string
     *                           csucursal:
     *                             type: integer
     *                             example: 0
     *       400:
     *         description: The client's CID already exists
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Client not found
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
    .post("/search", searchClientDTO.validateSearchClientDTO, clientController.getAllClients)

    /**
     * @swagger
     * /api/v1/clients/{clientId}:
     *   get:
     *     tags:
     *       - Clients
     *     summary: Get one specific client
     *     description: Returns an object with the client's information
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         schema:
     *           type: string
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
     *                     client: 
     *                       type: object
     *                       properties:
     *                         ncliente: 
     *                           type: integer
     *                           example: 0
     *                         xnombre: 
     *                           type: string
     *                         xapepaterno: 
     *                           type: string
     *                         xapematerno: 
     *                           type: string
     *                         fnac: 
     *                           type: string
     *                           format: date-time
     *                         isexo: 
     *                           type: string
     *                         ctelefono: 
     *                           type: string
     *                         cid: 
     *                           type: string
     *                         xcorreo: 
     *                           type: string
     *                         fingreso: 
     *                           type: string
     *                           format: date-time
     *                         xdireccion: 
     *                           type: string
     *                         xpostal: 
     *                           type: string
     *                         cestado: 
     *                           type: integer
     *                           example: 0
     *                         cciudad: 
     *                           type: integer
     *                           example: 0
     *                         xcolonia: 
     *                           type: string
     *                         csucursal:
     *                           type: integer
     *                           example: 0
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Client not found
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
    .get("/:clientId", searchOneClientDto.validateSearchClientDTO, clientController.getOneClient)

    /**
     * @swagger
     * /api/v1/clients/treatments/{clientId}:
     *   get:
     *     tags:
     *       - Clients
     *     summary: Get one client treatments
     *     description: Returns an object with the client's treatments
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         schema:
     *           type: string
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
     *                     tratamientos: 
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                          npaquete: 
     *                            type: string
     *                          cgrupo: 
     *                            type: integer
     *                            example: 0
     *                          ctratamiento: 
     *                            type: integer
     *                            example: 0
     *                          xtratamiento: 
     *                            type: string
     *                          nsesiones: 
     *                            type: integer
     *                            example: 0
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Client not found
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
    .get("/treatments/:clientId", searchOneClientDto.validateSearchClientDTO, clientController.getClientTreatments)

    /**
     * @swagger
     * /api/v1/clients:
     *   post:
     *     tags:
     *       - Clients
     *     summary: Create a new Client
     *     description: Returns the new client id and name
     *     security:
     *       - bearerAuth: []
     *     requestBody: 
     *       required: true
     *       content: 
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/NewClientDTOSchema'
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
     *                     client:
     *                       type: object
     *                       properties: 
     *                         ncliente:
     *                           type: integer
     *                           example: 0
     *                         xcliente:
     *                           type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Client not found
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
    .post("/", authorizate(1, true, false, false), newClientDTO.validateNewClientDTO, verifyPhoneNumberNotExists, verifyDateOfBirth, verifyIfBranchExists, verifyIfStateExists, verifyIfCityExists, verifyIfCityBelongsToState, clientController.createNewClient)

    /**
     * @swagger
     * /api/v1/clients/{clientId}:
     *   patch:
     *     tags:
     *       - Clients
     *     summary: Update one client
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         schema:
     *           type: integer
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdatedClientBodyDTOSchema'
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
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Client not found
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
    .patch("/:clientId", authorizate(1, false, true, false), updatedClientDTO.validateUpdatedClientDTO, verifyIfClientExists, verifyDateOfBirth, verifyIfStateExists, verifyIfCityExists, verifyIfCityBelongsToState, clientController.updateOneClient)

    /**
     * @swagger
     * /api/v1/clients/change-branch/{clientId}:
     *   patch:
     *     tags:
     *       - Clients
     *     summary: Update the branch of a client
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         schema:
     *           type: integer
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateClientBranchBodyDTOSchema'
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
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Client not found
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
    .patch("/change-branch/:clientId", authorizate(1, false, true, false), updateClientBranchDTO.validateUpdateClientBranchDTO, verifyIfClientExists, verifyIfBranchExists, clientController.updateOneClientBranch)

    /**
     * @swagger
     * /api/v1/clients/{clientId}:
     *   delete:
     *     tags:
     *       - Clients
     *     summary: Soft delete one client
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
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
     *                 message:
     *                   type: string
     *       401:
     *         description: User is not authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       403:
     *         description: User is not authorized to perform this action
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/ErrorResponse'
     *       404:
     *         description: Client not found
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
    .delete("/:clientId", authorizate(1, false, false, true), deletedClientDTO.validateDeletedClientDTO, verifyIfClientExists, clientController.deleteOneClient)

export default router;