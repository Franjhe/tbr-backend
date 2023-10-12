import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';

const LoginDTOSchema = Type.Object(
    {
        clogin: Type.String({
            maxLength: 30
        }),
        xclavesec: Type.String({
            maxLength: 30
        })
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addErrors(ajv);

const validate = ajv.compile(LoginDTOSchema);

const validateLoginDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validate.errors, { dataVar: 'login', separator: '\n' })
            })
    }
    next();
}

export default {
    LoginDTOSchema,
    validateLoginDTO
};