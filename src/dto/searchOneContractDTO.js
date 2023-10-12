import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const SearchOneContractDTOSchema = Type.Object(
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
addFormats(ajv);
addErrors(ajv);

const validateParameters = ajv.compile(SearchOneContractDTOSchema);

const validateSearchOneContractDTO = (req, res, next) => {
    const isDTOValid = validateParameters(req.params);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validateParameters.errors, { dataVar: 'packageId', separator: '\n' })
            })
    }
    next();
}

export default {
    SearchOneContractDTOSchema,
    validateSearchOneContractDTO
};