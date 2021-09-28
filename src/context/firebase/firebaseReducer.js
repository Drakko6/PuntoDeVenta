import {OBTENER_PRODUCTOS_EXITO, OBTENER_ORDENES_DIA} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case OBTENER_PRODUCTOS_EXITO:
      return {
        ...state,
        menu: action.payload,
      };

    default:
      return state;
  }
};
