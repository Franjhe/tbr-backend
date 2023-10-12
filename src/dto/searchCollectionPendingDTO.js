import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const SearchCollectionPendingDTOSchema = Type.Object(
    {
        csucursal: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        fhasta:  Type.String({
            format: 'date',
            errorMessage: {
                format: 'must match format yyyy-mm-dd'
            },
        }),
        fdesde: Type.String({
            format: 'date',
            errorMessage: {
                format: 'must match format yyyy-mm-dd'
            },
        }),
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const validateParameters = ajv.compile(SearchCollectionPendingDTOSchema);

const validateSearchCollectionPendingsDTO = (req, res, next) => {
    const isDTOValid = validateParameters(req.body);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validateParameters.errors, { dataVar: 'Collection', separator: '\n' })
            })
    }
    next();
}

export default {
    SearchCollectionPendingDTOSchema,
    validateSearchCollectionPendingsDTO
};