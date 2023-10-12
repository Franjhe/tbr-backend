import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const UpdatedClientBodyDTOSchema = Type.Object(
    {
        xnombre: Type.String({
            maxLength: 60
        }),
        xapepaterno: Type.String({
            minLength: 2,
            maxLength: 60
        }),
        xapematerno: Type.String({
            maxLength: 60
        }),
        fnac: Type.String({
            format: 'date',
            errorMessage: {
                format: 'must match format yyyy-mm-dd'
            },
        }),
        isexo: Type.String({
            maxLength: 1,
            enum: ['H', 'M', 'O'],
            errorMessage: {
                enum: 'must be equal to M or F'
            }
        }),
        ctelefono: Type.String({
            maxLength: 20
        }),
        xdireccion: Type.Optional(
            Type.Union([Type.String(), Type.Null()]), {
                maxLength: 60
            }
        ),
        cestado: Type.Optional(
            Type.Integer({
                minimum: 1,
                maximum: 2147483647
            })
        ),
        cciudad: Type.Optional(
            Type.Integer({
                minimum: 1,
                maximum: 2147483647
            })
        ),
        xcolonia: Type.Optional(
            Type.Union([Type.String(), Type.Null()]), {
                maxLength: 60
            }
        ),
        xpostal: Type.Optional(
            Type.Union([Type.Integer(), Type.Null()]), {
                maximum: 2147483647
            }
        ),
        xcorreo:
        Type.String({
            maxLength: 80,
            format: 'email',
            errorMessage: {
                format: 'must match email format user@domain.com'
            }
        })
    },
    {
        additionalProperties: false
    }
)

const UpdatedClientParametersDTOSchema = Type.Object(
    {
        clientId: Type.String({
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
addFormats(ajv, ['email', 'date']);
addErrors(ajv);

const validateParameters = ajv.compile(UpdatedClientParametersDTOSchema);
const validateBody = ajv.compile(UpdatedClientBodyDTOSchema);

const validateUpdatedClientDTO = (req, res, next) => {
    const isParameterDTOValid = validateParameters(req.params);
    if(!isParameterDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validateParameters.errors, { dataVar: 'clientId', separator: '\n' })
            })
    }
    const isBodyDTOValid = validateBody(req.body);
    if(!isBodyDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validateBody.errors, { dataVar: 'client', separator: '\n' })
            })
    }
    next();
}

export default {
    UpdatedClientBodyDTOSchema,
    UpdatedClientParametersDTOSchema,
    validateUpdatedClientDTO
};
