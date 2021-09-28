import {
  SELECCIONAR_PRODUCTO,
  CONFIRMAR_ORDENAR_PLATILLO,
  MOSTRAR_RESUMEN,
  ELIMINAR_PRODUCTO,
  PEDIDO_ORDENADO,
  GUARDAR_MESA,
  GUARDAR_ORDEN,
  OBTENER_ORDENES_DIA,
  INICIAR_NUEVA,
  GUARDAR_OBJ_ORDEN,
  GUARDAR_EN_COMANDA,
  GUARDAR_ID_COMANDA,
  OBTENER_COMANDA,
  FINALIZAR_ORDEN,
  GUARDAR_CLIENTE_ACTUAL,
  GUARDAR_COMANDA,
  OBTENER_COMANDAS_DIA,
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        platillo: action.payload,
      };
    case CONFIRMAR_ORDENAR_PLATILLO:
      return {
        ...state,
        pedido: state.pedido.find((p) => p.nombre === action.payload.nombre)
          ? state.pedido
              .map((p) => {
                if (p.nombre === action.payload.nombre) {
                  return {
                    ...action.payload,
                  };
                }
                return p;
              })
              .filter((p) => p.cantidad !== 0)
          : [...state.pedido, action.payload],
      };
    case MOSTRAR_RESUMEN:
      return {
        ...state,
        total: action.payload,
      };
    case ELIMINAR_PRODUCTO:
      return {
        ...state,
        pedido: state.pedido.filter(
          (articulo) => articulo.nombre !== action.payload
        ),
      };
    case PEDIDO_ORDENADO:
      return {
        ...state,
        pedido: [],
        total: 0,
        idorden: action.payload,
      };
    case OBTENER_ORDENES_DIA:
      return {
        ...state,
        ordenesDia: action.payload.ordenes,
        contOrdenes: action.payload.contOrdenes,
      };

    case GUARDAR_ORDEN:
      return {
        ...state,
        ordenesDia: [...state.ordenesDia, action.payload],
        contOrdenes: state.contOrdenes + 1,
      };

    case OBTENER_COMANDAS_DIA:
      return {
        ...state,
        comandasDia: action.payload.comandas,
        contComandas: action.payload.contComandas,
      };

    case GUARDAR_COMANDA:
      return {
        ...state,
        comandasDia: state.comandasDia.find(
          (com) => com.idcomanda === action.payload.idcomanda
        )
          ? state.comandasDia.map((com) => {
              if (com.idcomanda === action.payload.idcomanda) {
                return {
                  ...action.payload,
                };
              }
              return com;
            })
          : [...state.comandasDia, action.payload],

        contComandas: state.comandasDia.find(
          (com) => com.idcomanda === action.payload.idcomanda
        )
          ? state.contComandas
          : state.contComandas + 1,
      };

    case GUARDAR_MESA:
      return {
        ...state,
        mesa: action.payload,
      };
    case INICIAR_NUEVA:
      return {
        ...state,
        idorden: "",
        pedido: [],
        total: 0,
        ordenActual: null,
        mesa: "",
        banderaOrden: false,
        clienteActivo: action.payload,
        comanda: [],
      };
    case GUARDAR_OBJ_ORDEN:
      return {
        ...state,
        ordenActual: action.payload,
      };
    case GUARDAR_EN_COMANDA:
      return {
        ...state,
        comanda: [...state.comanda, action.payload],
      };
    case GUARDAR_ID_COMANDA:
      return {
        ...state,
        idcomanda: action.payload,
      };

    case OBTENER_COMANDA:
      return {
        ...state,
        idcomanda: action.payload.id,
        comanda: action.payload.ordenes,
      };
    case FINALIZAR_ORDEN:
      return {
        ...state,
        banderaOrden: true,
      };
    case GUARDAR_CLIENTE_ACTUAL:
      return {
        ...state,
        clienteActual: action.payload,
      };

    default:
      return state;
  }
};
