import Treatment from '../db/Treatment.js';

const getAllTreatments = async (cgrupo) => {
    const treatments = await Treatment.getAllTreatments(cgrupo);
    if (treatments.error) {
        return {
            error: treatments.error
        }
    }
    if (!treatments) {
        return {
            errorNotFound: 'No se encontraron tratamientos para el grupo suministrado'
        }
    }
    return treatments;
}

export default {
    getAllTreatments
}