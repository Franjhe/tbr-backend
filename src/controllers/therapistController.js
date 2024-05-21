import therapistService from '../services/therapistService.js';

const getAllTherapists = async (req, res) => {
    console.log(req.body.csucursal)
    const therapists = await therapistService.getAllTherapists(res.locals.decodedJWT, req.body.csucursal);
    if (therapists.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: therapists.permissionError
            });
    }
    if (therapists.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: therapists.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                therapists: therapists
            }
        });
}

export default {
    getAllTherapists
}