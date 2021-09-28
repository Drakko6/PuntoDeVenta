import React, { useContext, useRef, useState } from "react";
import { FirebaseContext } from "../../firebase";
import { useNavigate } from "react-router-dom";

import SweetAlert from "react-bootstrap-sweetalert";

const Platillo = ({ platillo }) => {
  const navigate = useNavigate();

  //Existencia ref acceder a un valor del DOM directamente
  const existenciaRef = useRef(platillo.existencia);

  //Context de firebase
  const { firebase } = useContext(FirebaseContext);

  const [showAlert, setShowAlert] = useState(false);
  const [seElimino, setSeElimino] = useState(false);

  const { nombre, imagen, existencia, categoria, precio, descripcion } =
    platillo;

  const [disponible, setDisponible] = useState(existencia);

  //modificar estado del platillo en firebase
  const actualizarDisponibilidad = () => {
    const existencia = existenciaRef.current.value === "true";

    try {
      // firebase.db.collection("productos").doc(id).update({
      //   existencia,
      // });

      //sacar el array primero
      firebase.db
        .collection("productos")
        .get()
        .then(function (querySnapshot) {
          if (querySnapshot.docs.length > 0) {
            const productos = querySnapshot.docs[0].data().productos;

            //iterar para buscar producto por nombre
            productos.forEach((producto) => {
              //cambiar el producto con la existencia

              if (producto.nombre === nombre) {
                producto.existencia = existencia;
              }
            });

            firebase.db
              .collection("productos")
              .doc(querySnapshot.docs[0].id)
              .update({
                productos: productos,
              });
            setDisponible(existencia);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  //borrar Platillo
  const confirmarEliminacion = () => {
    //solo mostrar alerta
    setShowAlert(true);
  };

  const eliminarProducto = (platillo) => {
    //eliminar en firebase
    try {
      // firebase.db
      //   .collection("productos")
      //   .doc(id)
      //   .delete()
      //   .then(() => {
      //     console.log("Eliminado correctamente");
      //     setShowAlert(false);
      //     setSeElimino(true);
      //   })
      //   .catch(function (error) {
      //     console.error("Error removing document: ", error);
      //   });
      firebase.db
        .collection("productos")
        .get()
        .then(function (querySnapshot) {
          if (querySnapshot.docs.length > 0) {
            firebase.db
              .collection("productos")
              .doc(querySnapshot.docs[0].id)
              .update({
                productos: firebase.firestore.FieldValue.arrayRemove(platillo),
              });

            setShowAlert(false);
            setSeElimino(true);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!seElimino ? (
        <div className="w-full px-3 mb-4">
          <div className="p-5 shadow-md bg-white">
            <div className="lg:flex">
              <div className="lg:w-5/12 xl:w-3/12">
                <img
                  src={imagen}
                  alt="imagen de platillo"
                  className=" object-scale-down left-0 lg:h-48 h-20 w-full"
                />

                <div className="sm:flex sm:-mx-2 pl-2">
                  <label className="block mt-5 sm:w-2/4">
                    <span className="block text-gray-800 mb-2">
                      {" "}
                      Existencia
                    </span>

                    <select
                      className="bg-white shadow appearance-none border
             rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline "
                      value={disponible}
                      ref={existenciaRef}
                      onChange={() => actualizarDisponibilidad()}
                    >
                      <option value="true">Disponible</option>
                      <option value="false">No disponible</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="lg: w-7/12 xl: w-9/12 pl-5">
                <p className="font-bold text-lg text-yellow-600 ">{nombre}</p>
                <p className="text-gray-600 ">
                  Categoría:{" "}
                  <span className="text-gray-700 font-bold">
                    {categoria.toUpperCase()}
                  </span>
                </p>
                <p className="text-gray-600 ">{descripcion}</p>
                <p className="text-gray-600 ">
                  Precio:{" "}
                  <span className="text-gray-700 font-bold">$ {precio}</span>
                </p>
              </div>
              <div>
                <button
                  className="bg-green-600 w-full p-2"
                  onClick={() =>
                    navigate(
                      "editar/" +
                        nombre +
                        "/" +
                        precio +
                        "/" +
                        categoria +
                        "/" +
                        descripcion
                    )
                  }
                >
                  <p className="text-white">Editar Platillo</p>
                </button>

                <button
                  className="bg-red-600 w-full p-2 mt-2"
                  onClick={() => confirmarEliminacion()}
                >
                  <p className="text-white">Eliminar Platillo</p>
                </button>
              </div>
            </div>
          </div>

          <SweetAlert
            warning
            showCancel
            confirmBtnText="Confirmar"
            confirmBtnBsStyle="primary"
            cancelBtnText="Cancelar"
            title="¿Seguro que quieres eliminar?"
            onConfirm={() => eliminarProducto(platillo)}
            show={showAlert}
            onCancel={() => setShowAlert(false)}
            closeOnClickOutside
            cancelBtnBsStyle="danger"
          >
            Una vez eliminado, no podrás recuperarlo
          </SweetAlert>
        </div>
      ) : null}
    </>
  );
};

export default Platillo;
