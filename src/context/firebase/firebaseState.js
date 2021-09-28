import React, { useReducer } from "react";

import FirebaseReducer from "./firebaseReducer";
import FirebaseContext from "./firebaseContext";
import firebase from "../../firebase";
import _ from "lodash";

//TYPES
import { OBTENER_PRODUCTOS_EXITO } from "../../types";

const FirebaseState = (props) => {
  //console.log(firebase);

  //Crear state inicial
  const initialState = {
    menu: [],
  };

  //useReducer con dispath para ejecutar funciones
  const [state, dispatch] = useReducer(FirebaseReducer, initialState);

  //para traer los productos
  const obtenerProductos = () => {
    //consultar firebase
    firebase.db
      .collection("productos")
      .where("existencia", "==", true) //solo los que esten en existencia
      .onSnapshot(manejarSnapshot);

    function manejarSnapshot(snapshot) {
      let platillos = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      //ordenar por categoria con lodash
      platillos = _.sortBy(platillos, "categoria");

      //tenemos resultados de la base de datos
      dispatch({
        type: "OBTENER_PRODUCTOS_EXITO",
        payload: platillos,
      });
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        menu: state.menu,
        firebase,
        obtenerProductos,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseState;
