import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const SearchClientDTOSchema = Type.Object(
    {
        csucursal: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        xnombre: Type.Optional(
            Type.String({
                maxLength: 100
            })
        ),
        cid: Type.Optional(
            Type.String({
                maxLength: 40
            })
        )
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const validate = ajv.compile(SearchClientDTOSchema);

const validateSearchClientDTO = (req, res, next) => {
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
    SearchClientDTOSchema,
    validateSearchClientDTO
};