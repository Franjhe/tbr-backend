import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';

const UpdateClientBranchBodyDTOSchema = Type.Object(
    {
        csucursal: Type.Integer({
                minimum: 1,
                maximum: 2147483647
        }),
        bpago: Type.Boolean()
    },
    {
        additionalProperties: false
    }
)

const UpdateClientBranchParametersDTOSchema = Type.Object(
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
addErrors(ajv);

const validateParameters = ajv.compile(UpdateClientBranchParametersDTOSchema);
const validateBody = ajv.compile(UpdateClientBranchBodyDTOSchema);

const validateUpdateClientBranchDTO = (req, res, next) => {
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
    UpdateClientBranchBodyDTOSchema,
    UpdateClientBranchParametersDTOSchema,
    validateUpdateClientBranchDTO
};
