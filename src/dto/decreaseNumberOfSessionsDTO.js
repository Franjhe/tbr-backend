import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const DecreaseNumberOfSessionsBodyDTOSchema = Type.Object(
    {
        tratamiento: Type.Object(
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
                })
            },
            {
                additionalProperties: false
            }
        ),
        nsesiones : Type.Integer({
            minimum: 1,
            maximum: 2147483647
        })
    },
    {
        additionalProperties: false
    }
)

const DecreaseNumberOfSessionsParametersDTOSchema = Type.Object(
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

const validateParameters = ajv.compile(DecreaseNumberOfSessionsParametersDTOSchema);
const validateBody = ajv.compile(DecreaseNumberOfSessionsBodyDTOSchema);

const validateDecreaseNumberOfSessionsDTO = (req, res, next) => {
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
    DecreaseNumberOfSessionsBodyDTOSchema,
    DecreaseNumberOfSessionsParametersDTOSchema,
    validateDecreaseNumberOfSessionsDTO
};
