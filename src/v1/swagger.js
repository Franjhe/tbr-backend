import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import searchClientDTO from '../dto/searchClientDTO.js';
import newClientDTO from '../dto/newClientDTO.js';
import updatedClientDTO from '../dto/updatedClientDTO.js';
import searchTherapistDTO from '../dto/searchTherapistDTO.js';
import loginDTO from '../dto/loginDTO.js';
import newContractDTO from '../dto/newContractDTO.js';
import searchContractDTO from '../dto/searchContractDTO.js';
import searchSellerDTO from '../dto/searchSellerDTO.js';
import updateContractDTO from '../dto/updateContractDTO.js';
import newPaymentInstallmentsDTO from '../dto/newPaymentInstallmentsDTO.js';
import changeTreatmentDTO from '../dto/changeTreatmentDTO.js';
import payOneClientDebtsDTO from '../dto/payOneClientDebtsDTO.js';
import newCourtesySessionDTO from '../dto/newCourtesySessionDTO.js';
import updateClientBranchDTO from '../dto/updateClientBranchDTO.js';
import decreaseNumberOfSessionsDTO from '../dto/decreaseNumberOfSessionsDTO.js';
import searchOneWeekScheduleDTO from '../dto/searchOneWeekScheduleDTO.js';
import newAppointmentDTO from '../dto/newAppointmentDTO.js';
import updateAppointmentDTO from '../dto/updateAppointmentDTO.js';
import deleteOneAppointmentDTO from '../dto/deleteOneAppointmentDTO.js';
import newNonBusinessHourDTO from '../dto/newNonBusinessHourDTO.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Bodyroom API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
      },
      responses: {
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string'
            }
          }
        }
      },
      schemas: {
        SearchClientDTOSchema: searchClientDTO.SearchClientDTOSchema,
        NewClientDTOSchema: newClientDTO.NewClientDTOSchema,
        UpdatedClientBodyDTOSchema: updatedClientDTO.UpdatedClientBodyDTOSchema,
        LoginDTOSchema: loginDTO.LoginDTOSchema,
        SearchTherapistDTOSchema: searchTherapistDTO.SearchTherapistDTOSchema,
        NewContractDTOSchema: newContractDTO.NewContractDTOSchema,
        SearchContractDTOSchema: searchContractDTO.SearchContractDTOSchema,
        SearchSellerDTOSchema: searchSellerDTO.SearchSellerDTOSchema,
        UpdateContractBodyDTOSchema: updateContractDTO.UpdateContractBodyDTOSchema,
        NewPaymentInstallmentsDTOSchema: newPaymentInstallmentsDTO.NewPaymentInstallmentsDTOSchema,
        ChangeTreatmentBodyDTOSchema: changeTreatmentDTO.ChangeTreatmentBodyDTOSchema,
        PayOneClientDebtsDTOSchema: payOneClientDebtsDTO.PayOneClientDebtsDTOSchema,
        NewCourtesySessionBodyDTOSchema: newCourtesySessionDTO.NewCourtesySessionBodyDTOSchema,
        UpdateClientBranchBodyDTOSchema: updateClientBranchDTO.UpdateClientBranchBodyDTOSchema,
        DecreaseNumberOfSessionsBodyDTOSchema: decreaseNumberOfSessionsDTO.DecreaseNumberOfSessionsBodyDTOSchema,
        SearchOneWeekScheduleDTOSchema: searchOneWeekScheduleDTO.SearchOneWeekScheduleDTOSchema,
        NewAppointmentDTOSchema: newAppointmentDTO.NewAppointmentDTOSchema,
        UpdateAppointmentBodyDTOSchema: updateAppointmentDTO.UpdateAppointmentBodyDTOSchema,
        DeleteOneAppointmentBodyDTOSchema: deleteOneAppointmentDTO.DeleteOneAppointmentBodyDTOSchema,
        NewNonBusinessHourDTOSchema: newNonBusinessHourDTO.NewNonBusinessHourDTOSchema
      },
    },
  },
  apis: ["./src/v1/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
  // Route-Handler to visit our docs
  app.use("/api/v1/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Make our docs in JSON format available
  app.get("/api/v1/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log(
    `\n Version 1 Docs are available on http://localhost:${port}/api/v1/documentation`
  );
};

export default swaggerDocs;
