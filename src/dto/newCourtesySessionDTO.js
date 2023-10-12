import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const NewCourtesySessionBodyDTOSchema = Type.Object(
    {
        tratamientoNuevo: Type.Object(
            {
                ncliente: Type.Integer({
                    minimum: 1,
                    maximum: 2147483647
                }),
                cgrupo: Type.Integer({
                    minimum: 1,
                    maximum: 2147483647
                }),
                ctratamiento: Type.Integer({
                    minimum: 1,
                    maximum: 2147483647
                }),
                nsesiones: Type.Integer({
                    minimum: 1,
                    maximum: 3
                }),
                xcomentario: Type.String({
                    maxLength: 1000
                })
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

const NewCourtesySessionParametersDTOSchema = Type.Object(
    {
        packageId: Type.String({
            maxLength: 16,
        })
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addFormats(ajv, ['date']);
addErrors(ajv);

const validateParameters = ajv.compile(NewCourtesySessionParametersDTOSchema);
const validateBody = ajv.compile(NewCourtesySessionBodyDTOSchema);

const validateNewCourtesySessionDTO = (req, res, next) => {
    const isParameterDTOValid = validateParameters(req.params);
    if(!isParameterDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validateParameters.errors, { dataVar: 'packageId', separator: '\n' })
            })
    }
    const isBodyDTOValid = validateBody(req.body);
    if(!isBodyDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validateBody.errors, { dataVar: 'treatment', separator: '\n' })
            })
    }
    next();
}

export default {
    NewCourtesySessionBodyDTOSchema,
    NewCourtesySessionParametersDTOSchema,
    validateNewCourtesySessionDTO
};
