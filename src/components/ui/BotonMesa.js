import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PedidoContext from "../../context/pedidos/pedidosContext";

import firebase from "../../firebase";

const BotonMesa = ({ num }) => {
  const navigate = useNavigate();

  const [mesa, setMesa] = useState(null);

  useEffect(() => {
    obtenerComanda(mesa);
    if (mesa) {
      escogerMesa();
    }
  }, [mesa]);

  const {
    guardarMesa,
    ordenActual,
    guardarOrden,
    pedido,
    pedidoRealizado,
    guardarEnComanda,
    idcomanda,
    comanda,
    obtenerComanda,
    guardarIDComanda,
  } = useContext(PedidoContext);

  const seleccionarMesa = (mesa) => {
    setMesa(mesa);
  };
  const escogerMesa = async () => {
    const productos = [...pedido];
    //se saca el array
    await firebase.db
      .collection("productos")
      .get()
      .then((querySnapshot) => {
        //sacar los productos
        const menu = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        if (menu.length > 0) {
          let platillos = menu[0].productos;

          //se actualizan los vendidos buscando
          productos.forEach((producto) => {
            platillos.forEach((platillo) => {
              if (platillo.nombre === producto.nombre) {
                platillo.vendidos = producto.vendidos + producto.cantidad;
              }
            });
          });

          //actualizar el arreglo con los platillos
          firebase.db
            .collection("productos")
            .doc(querySnapshot.docs[0].id)
            .update({
              productos: platillos,
            });
        }
      });

    guardarMesa(mesa);
    pedidoRealizado(ordenActual.num);
    ordenActual.mesa = mesa;

    guardarOrden(ordenActual);

    guardarEnComanda(ordenActual);

    // //actualizar la orden en firebase ordenes
    // firebase.db.collection("ordenes").doc(pedidoGuardado.id).update({
    //   mesa: mesa,
    // });
    navigate("/menu-digital/progreso");
  };

  return (
    <button
      className="shadow bg-yellow-400 rounded p-5 border-teal-600 border-5 m-2"
      onClick={() => seleccionarMesa(num)}
    >
      <p>{num}</p>
    </button>
  );
};

export default BotonMesa;
