import express from 'express';
import reportsController from '../../controllers/reportsController.js';

const router = express.Router();

router

.post("/collection", reportsController.reportsCollection)

export default router;