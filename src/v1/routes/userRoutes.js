import express from 'express';
import userController from '../../controllers/userController.js';

const router = express.Router();

router
    .post("/create", userController.createUser)
    .post("/update", userController.updateUser)
    .get("/user", userController.getAllUser)


export default router;