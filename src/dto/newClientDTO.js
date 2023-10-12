import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const NewClientDTOSchema = Type.Object(
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
                enum: 'must be equal to H, M or O'
            }
        }),
        ctelefono: Type.String({
            maxLength: 20
        }),
        cid: Type.String({
            maxLength: 20
        }),
        xdireccion: Type.Optional(
            Type.String({
                maxLength: 60
            })
        ),
        cestado: Type.Optional(
            Type.Union([Type.Integer(), Type.Null()]), {
                minimum: 1,
                maximum: 2147483647
            }
        ),
        cciudad: Type.Optional(
            Type.Union([Type.Integer(), Type.Null()]), {
                minimum: 1,
                maximum: 2147483647
            }
        ),
        xcolonia: Type.Optional(
            Type.String({
                maxLength: 60
            })
        ),
        xpostal: Type.Optional(
            Type.Integer({
                minimum: 1,
                maximum: 2147483647
            })
        ),
        xcorreo: Type.String({
            maxLength: 80,
            format: 'email',
            errorMessage: {
            format: 'must match email format user@domain.com'
            }
        }),
        csucursal: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        })
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addFormats(ajv, ['email', 'date']);
addErrors(ajv);

const validate = ajv.compile(NewClientDTOSchema);

const validateNewClientDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validate.errors, { dataVar: 'client', separator: '\n' })
            })
    }
    next();
}

export default {
    NewClientDTOSchema,
    validateNewClientDTO
};
