import Seller from '../db/Seller.js';

const getAllSellers = async (userData, csucursal) => {
    if (!userData.bmaster && userData.csucursal != csucursal) {
        return {
            permissionError: 'Solo los usuarios de tipo master pueden buscar vendedores de otras sucursales'
        }
    }
    const sellers = await Seller.getAllSellers(csucursal);
    if (sellers.error) {
        return {
            error: sellers.error
        }
    }
    return sellers;
}

export default {
    getAllSellers
}