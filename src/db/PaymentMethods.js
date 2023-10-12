import sql from "mssql";

const sqlConfig = {
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const getAllPaymentMethods = async () => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('bactivo', sql.Bit, true)
            .query('select cmodalidad_pago, xmodalidad_pago from mamodalidad_pago where bactivo = @bactivo ');
        return result.recordset;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

const verifyIfPaymentMethodExists = async (paymentMethodId) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cmodalidad_pago', sql.Int, paymentMethodId)
            .query('select cmodalidad_pago from mamodalidad_pago where cmodalidad_pago = @cmodalidad_pago')
        if (result.rowsAffected < 1){
            return false;
        }
        return result.recordset[0].cmodalidad_pago;
    }
    catch (error) {
        console.log(error.message);
        return {
            error: error.message
        }
    }
}

export default {
    getAllPaymentMethods,
    verifyIfPaymentMethodExists
}