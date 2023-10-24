import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import authenticate from './middlewares/authenticate.js'
import V1SwaggerDocs from "./v1/swagger.js";
import v1AuthRouter from './v1/routes/authRoutes.js';
import v1StateRouter from './v1/routes/stateRoutes.js';
import v1CityRouter from './v1/routes/cityRoutes.js';
import v1ClientRouter from './v1/routes/clientRoutes.js';
import v1ContractRouter from './v1/routes/contractRoutes.js';
import v1BranchRouter from './v1/routes/branchRoutes.js';
import v1SellerRouter from './v1/routes/sellerRoutes.js';
import v1TherapistRouter from './v1/routes/therapistRoutes.js';
import v1TreatmentGroupsRouter from './v1/routes/treatmentGroupsRoutes.js';
import v1TreatmentRouter from './v1/routes/treatmentRoutes.js';
import v1RrssRouter from './v1/routes/rrssRoutes.js';
import v1CommissionTypeRouter from './v1/routes/commissionTypeRoutes.js';
import v1GeneralParamsRouter from './v1/routes/generalParamsRoutes.js';
import v1PaymentInstallments from './v1/routes/paymentInstallmentsRoutes.js';
import v1PointsOfSaleRouter from './v1/routes/pointsOfSaleRoutes.js';
import v1PaymentMethodsRouter from './v1/routes/paymentMethodsRoutes.js';
import v1CardTypesRouter from './v1/routes/cardTypesRoutes.js';
import v1BankRouter from './v1/routes/bankRoutes.js';
import v1ReceiptRouter from './v1/routes/receiptRoutes.js';
import v1CancellationCauseRouter from './v1/routes/cancellationCauseRoutes.js';
import v1CollectionRouter from './v1/routes/collectionRoutes.js';
import v1ScheduleRouter from './v1/routes/scheduleRoutes.js';
import v1CabinRouter from './v1/routes/cabinRoutes.js';
import v1ReportsRouter from './v1/routes/reportsRoutes.js';

const app = express(); 

dotenv;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", v1AuthRouter);
app.use("/api/v1/states", authenticate, v1StateRouter);
app.use("/api/v1/cities", authenticate, v1CityRouter);
app.use("/api/v1/clients", authenticate, v1ClientRouter)
app.use("/api/v1/contracts", authenticate, v1ContractRouter);
app.use("/api/v1/branches", authenticate, v1BranchRouter);
app.use("/api/v1/sellers", authenticate, v1SellerRouter);
app.use("/api/v1/therapists", authenticate, v1TherapistRouter);
app.use("/api/v1/treatment-groups", authenticate, v1TreatmentGroupsRouter);
app.use("/api/v1/treatments", authenticate, v1TreatmentRouter);
app.use("/api/v1/rrss", authenticate, v1RrssRouter);
app.use("/api/v1/commission-types", authenticate, v1CommissionTypeRouter);
app.use("/api/v1/general-params", authenticate, v1GeneralParamsRouter);
app.use("/api/v1/payment-installments", authenticate, v1PaymentInstallments);
app.use("/api/v1/points-of-sale", authenticate, v1PointsOfSaleRouter);
app.use("/api/v1/payment-methods", authenticate, v1PaymentMethodsRouter);
app.use("/api/v1/card-types", authenticate, v1CardTypesRouter);
app.use("/api/v1/banks", authenticate, v1BankRouter);
app.use("/api/v1/receipts", authenticate, v1ReceiptRouter);
app.use("/api/v1/cancellation-cause", authenticate, v1CancellationCauseRouter);
app.use("/api/v1/collections", authenticate, v1CollectionRouter);
app.use("/api/v1/schedules", authenticate, v1ScheduleRouter);
app.use("/api/v1/cabins", authenticate, v1CabinRouter);
app.use("/api/v1/reports", authenticate, v1ReportsRouter);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => { 
    console.log(`\n API is listening on port ${PORT}`);
    V1SwaggerDocs(app, PORT);
});