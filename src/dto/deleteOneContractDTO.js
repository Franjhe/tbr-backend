import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const DeleteOneContractDTOSchema = Type.Object(
    {
        packageId: Type.String({
            maxLength: 16,
        }),
        cancellationCauseId: Type.String({
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
addFormats(ajv);
addErrors(ajv);

const validateParameters = ajv.compile(DeleteOneContractDTOSchema);

const validateDeleteOneContractDTO = (req, res, next) => {
    const isDTOValid = validateParameters(req.params);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validateParameters.errors, { dataVar: 'contract', separator: '\n' })
            })
    }
    next();
}

export default {
    DeleteOneContractDTOSchema,
    validateDeleteOneContractDTO
};