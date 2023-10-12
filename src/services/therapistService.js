import Therapist from '../db/Therapist.js';

const getAllTherapists = async (userData, csucursal) => {
    if (!userData.bmaster && userData.csucursal != csucursal) {
        return {
            permissionError: 'Solo los usuarios de tipo master pueden buscar terapeutas de otras sucursales'
        }
    }
    const therapists = await Therapist.getAllTherapists(csucursal);
    if (therapists.error) {
        return {
            error: therapists.error
        }
    }
    return therapists;
}

export default {
    getAllTherapists
}