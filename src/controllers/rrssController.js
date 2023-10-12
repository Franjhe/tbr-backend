import rrssService from '../services/rrssService.js';

const getAllRrss = async (req, res) => {
    const rrss = await rrssService.getAllRrss();
    if (rrss.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: rrss.permissionError
            });
    }
    if (rrss.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: rrss.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                rrss: rrss
            }
        });
}

export default {
    getAllRrss
}