import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const UpdateContractBodyDTOSchema = Type.Object(
    {
        ipaquete_tipo: Type.String({
            enum: ['G', 'U']
        }),
        ncliente: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        csucursal: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        fcontrato: Type.String({
            format: 'date',
            errorMessage: {
                format: 'must match format yyyy-mm-dd'
            },
        }),
        cvendedor: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        ctipocom: Type.Integer({
            minimum: 1,
            maximum: 2147483647
        }),
        cterapeuta: Type.Optional(
            Type.Union([Type.Integer(), Type.Null()]), {
                minimum: 1,
                maximum: 2147483647
            }
        ),
        crrss: Type.Optional(
            Type.Union([Type.Integer(), Type.Null()]), {
                minimum: 1,
                maximum: 2147483647
            }
        ),
        mtotal: Type.Number({
            minimum: 1
        }),
        pdesc: Type.Number({
            minimum: 0
        }),
        mdesc: Type.Number({
            minimum: 0
        }),
        mpaquete: Type.Number({
            minimum: 0
        }),
        mbono_cupon: Type.Optional(
            Type.Union([Type.Number(), Type.Null()]), {
                minimum: 0
            }
        ),
        mpaquete_cont: Type.Number({
            minimum: 0
        }),
        ncont_ant: Type.Integer({
            minimum: 0,
            maximum: 2147483647
        }),
        clientes: Type.Array(
            Type.Object(
                {
                    ncliente: Type.Integer({
                        minimum: 1,
                        maximum: 2147483647
                    }),
                    tratamiento: Type.Object(
                        {
                            cgrupo: Type.Integer({
                                minimum: 1,
                                maximum: 2147483647
                            }),
                            ctratamiento: Type.Integer({
                                minimum: 1,
                                maximum: 2147483647
                            }),
                            xtratamiento: Type.String({
                                maxLength: 100
                            }),
                            mprecio_min: Type.Number({
                                minimum: 1,
                                maximum: 2147483647
                            }),
                            nsesiones: Type.Integer({
                                minimum: 1,
                                maximum: 2147483647
                            })
                        },
                        {
                            additionalProperties: false
                        }
                    )
                },
                {
                    additionalProperties: false
                }
            )
        ),
    },
    {
        additionalProperties: true
    }
)

const UpdateContractParametersDTOSchema = Type.Object(
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
addFormats(ajv, ['email', 'date']);
addErrors(ajv);

const validateParameters = ajv.compile(UpdateContractParametersDTOSchema);
const validateBody = ajv.compile(UpdateContractBodyDTOSchema);

const validateUpdateContractDTO = (req, res, next) => {
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
                message: ajv.errorsText(validateBody.errors, { dataVar: 'contract', separator: '\n' })
            })
    }
    next();
}

export default {
    UpdateContractBodyDTOSchema,
    UpdateContractParametersDTOSchema,
    validateUpdateContractDTO
};
