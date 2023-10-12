import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const NewAppointmentDTOSchema = Type.Object(
    {
        ncliente: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        csucursal: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        ccabina: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        fentrada: Type.String({
            format: 'date-time',
            errorMessage: {
                format: 'must match format YYYY-MM-DDTHH:mm:ss.sssZ'
            },
        }),
        fsalida: Type.String({
            format: 'date-time',
            errorMessage: {
                format: 'must match format YYYY-MM-DDTHH:mm:ss.sssZ'
            },
        }),
        tratamientos: Type.Array(
            Type.Object(
                {
                    npaquete: Type.String({
                        maxLength: 60
                    }),
                    cgrupo: Type.Integer({
                        minimum: 1,
                        maximum: 2147483647
                    }),
                    ctratamiento: Type.Integer({
                        minimum: 1,
                        maximum: 2147483647
                    }),
                    ntiempo_min: Type.Number({
                        minimum: 1
                    }),
                    bdoblemaquina: Type.Boolean()
                },
                {
                    additionalProperties: false
                }
            )
        )
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addFormats(ajv, ['date-time']);
addErrors(ajv);

const validate = ajv.compile(NewAppointmentDTOSchema);

const validateNewAppointmentDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validate.errors, { dataVar: 'appointment', separator: '\n' })
            })
    }
    next();
}

export default {
    NewAppointmentDTOSchema,
    validateNewAppointmentDTO
};
