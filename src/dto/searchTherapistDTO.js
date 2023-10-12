import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const SearchTherapistDTOSchema = Type.Object(
    {
        csucursal: Type.Optional(
            Type.Union([Type.Integer(), Type.Null()]), {
                minimum: 1,
                maximum: 2147483647
            }
        ),
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const validate = ajv.compile(SearchTherapistDTOSchema);

const validateSearchTherapistDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validate.errors, { dataVar: 'search body', separator: '\n' })
            })
    }
    next();
}

export default {
    SearchTherapistDTOSchema,
    validateSearchTherapistDTO
};