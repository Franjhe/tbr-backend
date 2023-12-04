import express from 'express';
import reportsController from '../../controllers/reportsController.js';

const router = express.Router();

router

    .post("/collection", reportsController.reportsCollection)
    .post("/sales", reportsController.reportsSales)
    .post("/cancelled-appointments", reportsController.reportsCancelledAppointments)
    .post("/search-receipt", reportsController.reportsSearchReceipt)

export default router;