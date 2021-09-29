/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from "react";

import ModalResumen from "../ui/ModalResumen";

// import { useNavigate } from "react-router-dom";

import PedidoContext from "../../context/pedidos/pedidosContext";

const DetallePlatillo = ({
  cerrar,
  setModalAbierto,
  modalAbierto,
  platillo,
}) => {
  // useBeforeunload(() => "Perderás tu orden si recargas");

  //state para cantidades
  const [cantidad, setCantidad] = useState(0);
  const [observaciones] = useState("");
  //const [modalAbierto, setModalAbierto] = useState(false);

  //Context de pedido
  const { pedido, guardarPedido } = useContext(PedidoContext);

  //En cuanto carga, calcular la cantidad a pagar
  useEffect(() => {
    if (platillo) {
    }
  }, [cantidad, pedido]);

  useEffect(() => {
    if (pedido.length > 0) {
      pedido.forEach((p) => {
        if (p.nombre === platillo.nombre) {
          setCantidad(p.cantidad);
        }
      });

      if (!pedido.find((p) => p.nombre === platillo.nombre)) {
        setCantidad(0);
      }
    }
  }, [modalAbierto]);

  let nombre = "";
  let imagen = "";
  let precio = "";
  if (platillo) {
    nombre = platillo.nombre;
    imagen = platillo.imagen;
    precio = platillo.precio;
  }

  //decrementa en uno
  const decrementarUno = () => {
    if (cantidad >= 1) {
      const nuevaCantidad = parseInt(cantidad) - 1;
      setCantidad(nuevaCantidad);

      const pedido = {
        ...platillo,
        cantidad: nuevaCantidad,
        total: precio * nuevaCantidad,
        observaciones,
      };
      guardarPedido(pedido);
    }
  };

  //incrementa en uno la cantidad
  const incrementarUno = () => {
    const nuevaCantidad = parseInt(cantidad) + 1;

    const pedido = {
      ...platillo,
      cantidad: nuevaCantidad,
      total: precio * nuevaCantidad,
      observaciones,
    };
    guardarPedido(pedido);

    setCantidad(nuevaCantidad);
  };

  //Redireccionar
  // const navigate = useNavigate();

  return (
    <>
      <div className="shadow-md bg-white block ">
        <div>
          <img
            src={imagen}
            alt="imagen de platillo"
            className=" w-full object-cover left-0 lg:h-32 h-32 cursor-pointer active:opacity-75 "
            onClick={() => incrementarUno()}
          />
        </div>

        <div className="pt-2 h-16  mb-2">
          <p className="font-bold text-sm text-center text-yellow-700  h-">
            {nombre}
          </p>
        </div>

        <div className="grid grid-cols-3">
          <div className="col-span-3 grid grid-cols-3">
            <button
              className="col-span-1 block bg-yellow-500 text-center text-2xl font-bold hover:bg-yellow-400 active:bg-yellow-500"
              onClick={() => decrementarUno()}
            >
              -
            </button>
            <p className="text-center text-xl bg-white">{cantidad}</p>

            <button
              className="col-span-1 block bg-yellow-500 text-center text-2xl font-bold hover:bg-yellow-400 active:bg-yellow-500"
              onClick={() => incrementarUno()}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {modalAbierto ? (
        <ModalResumen setModalAbierto={setModalAbierto} cerrar={cerrar} />
      ) : null}
    </>
  );
};

export default DetallePlatillo;
