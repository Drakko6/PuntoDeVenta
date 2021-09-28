import React, { useReducer } from "react";

import PedidoReducer from "./pedidosReducer";
import PedidoContext from "./pedidosContext";
import firebase from "../../firebase";

import {
  SELECCIONAR_PRODUCTO,
  CONFIRMAR_ORDENAR_PLATILLO,
  MOSTRAR_RESUMEN,
  ELIMINAR_PRODUCTO,
  PEDIDO_ORDENADO,
  GUARDAR_ORDEN,
  GUARDAR_MESA,
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

const PedidoState = (props) => {
  //Crear state inicial
  const initialState = {
    pedido: [],
    platillo: null,
    total: 0,
    idorden: "",
    mesa: "",
    ordenesDia: [],
    contOrdenes: 0,
    comandasDia: [],
    contComandas: 0,
    mesas: [1, 2, 3, 4, 5, 6, 7, "sin mesa"],
    ordenActual: null,
    comanda: [], //arreglo de pedidos
    idcomanda: "",
    banderaOrden: false,
    clienteActivo: "",
    clienteActual: null,
  };

  //useReducer con dispath para ejecutar funciones
  const [state, dispatch] = useReducer(PedidoReducer, initialState);

  const obtenerComanda = async (cliente) => {
    try {
      await firebase.db
        .collection("comandas")
        .where("cliente", "==", cliente)
        .where("activa", "==", true)
        .onSnapshot(manejarSnapshot);

      function manejarSnapshot(snapshot) {
        let comandaObj = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        if (comandaObj.length > 0) {
          const ordenes = comandaObj[0].ordenes;

          dispatch({
            type: OBTENER_COMANDA,
            payload: {
              id: comandaObj[0].id,
              ordenes: ordenes,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const guardarEnComanda = (orden) => {
    dispatch({
      type: GUARDAR_EN_COMANDA,
      payload: orden,
    });
  };

  const guardarIDComanda = (id) => {
    dispatch({
      type: GUARDAR_ID_COMANDA,
      payload: id,
    });
  };

  const guardarClienteActual = (cliente) => {
    dispatch({
      type: GUARDAR_CLIENTE_ACTUAL,
      payload: cliente,
    });
  };

  //obtener las ordenes del dia ya disponibles en firebase
  const obtenerOrdenesdelDia = () => {
    const hoy = new Date(Date.now()).setHours(0, 0, 0, 0);

    //consultar firebase
    firebase.db
      .collection("dias")
      .where("dia", "==", hoy) //solo los sean de hoy
      .onSnapshot(manejarSnapshot);

    function manejarSnapshot(snapshot) {
      let ordenesObj = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      let ordenes = [];
      let contOrdenes = 0;
      if (ordenesObj.length > 0) {
        ordenes = ordenesObj[0].ordenes;
        contOrdenes = ordenes.length;
      }
      //tenemos resultados de la base de datos
      dispatch({
        type: OBTENER_ORDENES_DIA,
        payload: {
          ordenes,
          contOrdenes,
        },
      });
    }
  };

  //Iniciar nueva orden
  const iniciarNuevaOrden = (cliente) => {
    dispatch({
      type: INICIAR_NUEVA,
      payload: cliente,
    });
  };

  //Selecciona el producto a ordenar
  const seleccionarPlatillo = (platillo) => {
    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: platillo,
    });
  };

  //Cuando el usuario confirma un platillo
  const guardarPedido = (pedido) => {
    dispatch({
      type: CONFIRMAR_ORDENAR_PLATILLO,
      payload: pedido,
    });
  };

  //Muestra el total a pagar en el resumen
  const mostrarResumen = (total) => {
    dispatch({
      type: MOSTRAR_RESUMEN,
      payload: total,
    });
  };

  //Elimina un articulo del carrito
  const eliminarProducto = (id) => {
    dispatch({
      type: ELIMINAR_PRODUCTO,
      payload: id,
    });
  };

  //completa la orden
  const pedidoRealizado = (id) => {
    dispatch({
      type: PEDIDO_ORDENADO,
      payload: id,
    });
  };

  //guardar orden en el arreglo del dia TO DO: Agregar guardar comanda
  const guardarOrden = (orden) => {
    dispatch({
      type: GUARDAR_ORDEN,
      payload: orden,
      //guardar en comanda la orden
    });
  };

  //para guardar el objeto de orden en el state para despues tomar la mesa
  const guardarObjOrden = (orden) => {
    dispatch({
      type: GUARDAR_OBJ_ORDEN,
      payload: orden,
    });
  };

  //guarda la mesa de la orden
  const guardarMesa = (mesa) => {
    dispatch({
      type: GUARDAR_MESA,
      payload: mesa,
    });
  };

  const ordenFinalizada = () => {
    dispatch({
      type: FINALIZAR_ORDEN,
    });
  };

  const guardarComanda = (comanda) => {
    dispatch({
      type: GUARDAR_COMANDA,
      payload: comanda,
    });
  };

  const obtenerComandasdelDia = () => {
    const hoy = new Date(Date.now()).setHours(0, 0, 0, 0);

    firebase.db
      .collection("dias")
      .where("dia", "==", hoy) //solo los sean de hoy
      .get()
      .then(function (querySnapshot) {
        const comandasObj = querySnapshot.docs.map((doc) => {
          return {
            // id: doc.id,
            ...doc.data(),
          };
        });

        // //consultar firebase
        // firebase.db
        //   .collection("dias")
        //   .where("dia", "==", hoy) //solo los sean de hoy
        //   .onSnapshot(manejarSnapshot);

        // function manejarSnapshot(snapshot) {
        //   let comandasObj = snapshot.docs.map((doc) => {
        //     return {
        //       id: doc.id,
        //       ...doc.data(),
        //     };
        //   });
        let comandas = [];
        let contComandas = 0;
        if (comandasObj.length > 0 && comandasObj[0].comandas) {
          comandas = comandasObj[0].comandas;
          contComandas = comandas.length;

          //tenemos resultados de la base de datos
          dispatch({
            type: OBTENER_COMANDAS_DIA,
            payload: {
              comandas,
              contComandas,
            },
          });
        }
      });
  };

  return (
    <PedidoContext.Provider
      value={{
        pedido: state.pedido,
        platillo: state.platillo,
        seleccionarPlatillo,
        guardarPedido,
        total: state.total,
        mostrarResumen,
        eliminarProducto,
        pedidoRealizado,
        idorden: state.idorden,
        ordenesDia: state.ordenesDia,
        guardarMesa,
        mesa: state.mesa,
        guardarOrden,
        obtenerOrdenesdelDia,
        contOrdenes: state.contOrdenes,
        iniciarNuevaOrden,
        mesas: state.mesas,
        ordenActual: state.ordenActual,
        guardarObjOrden,
        comanda: state.comanda,
        idcomanda: state.idcomanda,
        guardarEnComanda,
        obtenerComanda,
        guardarIDComanda,
        ordenFinalizada,
        banderaOrden: state.banderaOrden,
        clienteActivo: state.clienteActivo,
        guardarClienteActual,
        clienteActual: state.clienteActual,
        obtenerComandasdelDia,
        comandasDia: state.comandasDia,
        contComandas: state.contComandas,
        guardarComanda,
      }}
    >
      {props.children}
    </PedidoContext.Provider>
  );
};

export default PedidoState;
