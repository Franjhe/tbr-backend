import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';

const DeleteOneAppointmentBodyDTOSchema = Type.Object(
    {
        ccausa_anul: Type.Optional(
            Type.Integer({
                minimum: 1,
                maximum: 2147483647
            })
        )
    },
    {
        additionalProperties: false
    }
)

const DeleteOneAppointmentParametersDTOSchema = Type.Object(
    {
        appointmentId: Type.String({
            pattern: '^[0-9]*$',
            maxLength: 9,
            errorMessage: {
                pattern: 'must be an integer'
            }
        })
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addErrors(ajv);

const validateParameters = ajv.compile(DeleteOneAppointmentParametersDTOSchema);
const validateBody = ajv.compile(DeleteOneAppointmentBodyDTOSchema);

const validateDeleteOneAppointmentDTO = (req, res, next) => {
    const isParameterDTOValid = validateParameters(req.params);
    if(!isParameterDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validateParameters.errors, { dataVar: 'appointmentId', separator: '\n' })
            })
    }
    const isBodyDTOValid = validateBody(req.body);
    if(!isBodyDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validateBody.errors, { dataVar: 'appointment', separator: '\n' })
            })
    }
    next();
}

export default {
    DeleteOneAppointmentBodyDTOSchema,
    DeleteOneAppointmentParametersDTOSchema,
    validateDeleteOneAppointmentDTO
};