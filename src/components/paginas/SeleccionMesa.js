import React, { useContext, useEffect } from "react";
import BotonMesa from "../ui/BotonMesa";
import { useNavigate } from "react-router-dom";
import { useBeforeunload } from "react-beforeunload";

import PedidoContext from "../../context/pedidos/pedidosContext";

const SeleccionMesa = () => {
  useBeforeunload(() => "Perderás tu orden si recargas");

  const navigate = useNavigate();

  const { mesas, idorden, ordenActual, guardarEnComanda } = useContext(
    PedidoContext
  );

  return (
    <>
      {!ordenActual ? null : (
        <>
          {!idorden ? (
            <div className="mt-10 ml-2">
              <h2 className="font-bold text-center text-lg">
                Selecciona tu mesa:
              </h2>
              <div className="w-full flex justify-center flex-wrap">
                {/* map de mesa */}
                {mesas.map((num) => (
                  <BotonMesa key={num} num={num} />
                ))}
              </div>
            </div>
          ) : null}

          {idorden ? (
            <button
              className=" bg-blue-500 p-3  uppercase text-white justify-center flex w-full mt-64 "
              onClick={() => navigate("/menu-digital/progreso")}
            >
              <p>Volver a progreso de tu Orden</p>
            </button>
          ) : null}
        </>
      )}
    </>
  );
};

export default SeleccionMesa;
