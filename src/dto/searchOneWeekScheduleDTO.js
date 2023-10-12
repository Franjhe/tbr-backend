import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const SearchOneWeekScheduleDTOSchema = Type.Object(
    {
        csucursal: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        ccabina: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        fsemana: Type.String({
            format: 'date',
            errorMessage: {
                format: 'must match format yyyy-mm-dd'
            },
        })
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addFormats(ajv, ['date']);
addErrors(ajv);

const validate = ajv.compile(SearchOneWeekScheduleDTOSchema);

const validateSearchOneWeekScheduleDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validate.errors, { dataVar: 'schedule', separator: '\n' })
            })
    }
    next();
}

export default {
    SearchOneWeekScheduleDTOSchema,
    validateSearchOneWeekScheduleDTO
};