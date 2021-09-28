import React, { useContext, useState, useEffect } from "react";
import DetallePlatillo from "../paginas/DetallePlatillo";
// import { useBeforeunload } from "react-beforeunload";

// import _ from "lodash";
// import { useNavigate } from "react-router-dom";

import Modal from "../ui/Modal";
import ModalResumen from "../ui/ModalResumen";

//Contexts
import { FirebaseContext } from "../../firebase";
import PedidoContext from "../../context/pedidos/pedidosContext";

// const scrollToRef = (ref) => window.scrollTo(0, ref.offsetTop - 100);

const MenuMostrar = () => {
  // useBeforeunload(() => "Perderás las comandas no terminadas");

  //para abrir modal
  const [open, setOpen] = useState(false);

  const [platillos, setPLatillos] = useState([]);

  const [modalAbierto, setModalAbierto] = useState(false);

  const { firebase, usuario } = useContext(FirebaseContext);

  const {
    seleccionarPlatillo,
    obtenerOrdenesdelDia,
    pedido,
    obtenerComandasdelDia,
  } = useContext(PedidoContext);

  //CONSULTAR BD al cargar
  useEffect(() => {
    obtenerOrdenesdelDia();
    obtenerComandasdelDia();
    const obtenerPlatillos = () => {
      firebase.db
        .collection("productos")
        // .where("existencia", "==", true) //solo los que esten en existencia
        .onSnapshot(manejarSnapshot);
    };
    obtenerPlatillos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Snapshot nos permite utilizar la BD en tiempo real
  function manejarSnapshot(snapshot) {
    let menu = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    //hacer un state de categorias
    if (menu.length > 0) {
      let platillos = menu[0].productos.filter(
        (producto) => producto.existencia === true
      );

      setPLatillos(platillos);
    }
  }

  //state para aparecer boton hacia arriba
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  window.addEventListener("scroll", checkScrollTop);

  const ordenarPedido = () => {
    if (pedido.length > 0) {
      setModalAbierto(true);
    }
  };

  return (
    <>
      {usuario ? (
        <div className="h-screen bg-green-100">
          <div className="sticky top-0 grid"></div>

          <div className="grid grid-cols-6  mb-2">
            {platillos.map((platillo, i) => (
              <div
                key={i}
                className=" p-2"
                onClick={() => {
                  seleccionarPlatillo(platillo);
                }}
              >
                <DetallePlatillo
                  cerrar={setOpen}
                  setModalAbierto={setModalAbierto}
                  modalAbierto={modalAbierto}
                  platillo={platillo}
                />
              </div>
            ))}
          </div>

          <Modal
            open={open}
            setOpen={setOpen}
            setModalAbierto={setModalAbierto}
            modalAbierto={modalAbierto}
          />

          {modalAbierto ? (
            <ModalResumen setModalAbierto={setModalAbierto} cerrar={setOpen} />
          ) : null}

          <div className="absolute bottom-0 p-8 flex justify-center w-3/4">
            <button
              className="col-span-2 text-xl  text-white bg-green-500 hover:bg-green-200 active:bg-green-800 hover:text-black sticky top-0 text-center p-4 ml-1"
              onClick={() => ordenarPedido()}
            >
              Realizar Pedido
            </button>
          </div>
        </div>
      ) : (
        <h1 className="text-center flex">
          No cuentas con los permisos para ver esta página{" "}
        </h1>
      )}
    </>
  );
};

export default MenuMostrar;
