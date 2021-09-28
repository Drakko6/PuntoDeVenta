import React, { useContext, useState, useEffect } from "react";
import OrdenUsuario from "../ui/OrdenUsuario";
import { useNavigate } from "react-router-dom";
import { useBeforeunload } from "react-beforeunload";

import PedidoContext from "../../context/pedidos/pedidosContext";

const Comanda = () => {
  useBeforeunload(() => "Perderás tu orden si recargas");

  const { comanda, clienteActivo, idorden } = useContext(PedidoContext);

  const navigate = useNavigate();

  const [total, setTotal] = useState();

  useEffect(() => {
    const calcularTotal = () => {
      let total = 0;
      comanda.forEach((orden) => {
        total += orden.total;
      });
      setTotal(total);
    };
    calcularTotal();
  });

  return (
    <>
      <div>
        <div className="bg-transparent mt-20">
          <button
            onClick={() => {
              if (clienteActivo && !idorden) {
                navigate("/menu-digital");
              } else {
                navigate("/menu-digital/progreso");
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                className="heroicon-ui"
                d="M5.41 11H21a1 1 0 0 1 0 2H5.41l5.3 5.3a1 1 0 0 1-1.42 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.42 1.4L5.4 11z"
              />
            </svg>
          </button>
        </div>
        <h1 className="mb-15  text-center uppercase font-bold text-blue-700">
          Resumen de tu Mesa
        </h1>
        <div className="flex flex-wrap">
          {comanda.map((orden, i) => (
            <OrdenUsuario orden={orden} key={i} />
          ))}
        </div>

        <h2 className="text-center font-bold text-lg text-green-600 mt-5">
          Total de la Mesa: ${total}
        </h2>
        {clienteActivo ? (
          <a
            href="https://www.google.com"
            className=" text-center mt-5 block w-full rounded bg-black uppercase font-bold text-white p-3"
          >
            Salir
          </a>
        ) : null}
      </div>
    </>
  );
};

export default Comanda;
