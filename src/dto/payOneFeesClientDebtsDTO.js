import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const PayOneFeesClientDebtsDTOSchema = Type.Object(
    {
        ncliente: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        ccuota: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        fpago: Type.String({
            format: 'date',
            errorMessage: {
                format: 'must match format yyyy-mm-dd'
            },
        }),
        distribucionPago: Type.Array(
            Type.Object(
                {
                    mpago: Type.Number({
                        minimum: 1
                    }),
                    cmodalidad_pago: Type.Integer({
                        minimum: 1,
                        maximum: 2147483647
                    }),
                    ctipo_tarjeta: Type.Optional(
                        Type.Union([Type.Integer(), Type.Null()]), {
                            minimum: 1,
                            maximum: 2147483647
                        }
                    ),
                    cbanco: Type.Optional(
                        Type.Union([Type.Integer(), Type.Null()]), {
                            minimum: 1,
                            maximum: 2147483647
                        }
                    ),
                    xtarjeta: Type.Optional(
                        Type.Union([Type.String(), Type.Null()]), {
                            pattern: '^[0-9]*$',
                            minLength: 15,
                            maxLength: 16,
                            errorMessage: {
                                pattern: 'must be an integer'
                            }
                        }
                    ),
                    xvencimiento: Type.Optional(
                        Type.Union([Type.String(), Type.Null()]), {
                            pattern: '/^[0-9]{2}-[10][0-9]$/',
                            minLength: 5,
                            maxLength: 5,
                            errorMessage: {
                                pattern: 'must follow the pattern: yy-mm'
                            }
                        }
                    ),
                    cpos: Type.Optional(
                        Type.Union([Type.Integer(), Type.Null()]), {
                            minimum: 1,
                            maximum: 2147483647
                        }
                    ),
                    xobservacion: Type.Optional(
                        Type.Union([Type.String(), Type.Null()]), {
                            maxLength: 100,
                        }
                    ),
                    xreferencia: Type.Optional(
                        Type.Union([Type.String(), Type.Null()]), {
                            maxLength: 100,
                        }
                    ),
                },
                {
                    additionalProperties: false
                }
            )
        ),
    },
    {
        additionalProperties: false
    }
)

const ajv = new Ajv({ allErrors: true });
addFormats(ajv, ['date']);
addErrors(ajv);

const validate = ajv.compile(PayOneFeesClientDebtsDTOSchema);

const validatePayOneFeesClientDebtsDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);
    if(!isDTOValid) {
        return res
            .status(400)
            .send({
                message: ajv.errorsText(validate.errors, { dataVar: 'payment', separator: '\n' })
            })
    }
    next();
}

export default {
    PayOneFeesClientDebtsDTOSchema,
    validatePayOneFeesClientDebtsDTO
};
