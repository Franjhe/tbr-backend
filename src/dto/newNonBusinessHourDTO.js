import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const NewNonBusinessHourDTOSchema = Type.Object(
    {
        nonBusinessHour: Type.Object(
            {
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
            },
            {
                additionalProperties: false
            }
        )
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addFormats(ajv, ['date-time']);
addErrors(ajv);

const validate = ajv.compile(NewNonBusinessHourDTOSchema);

const validateNonBusinessHourDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validate.errors, { dataVar: 'nonBusinessHour', separator: '\n' })
            })
    }
    next();
}

export default {
    NewNonBusinessHourDTOSchema,
    validateNonBusinessHourDTO
};
