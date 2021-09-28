import React, { Fragment } from "react";

const ComandaCompletada = ({ comanda }) => {
  return (
    <div className=" sm: w-5/12 lg:w-1/4 mb-4 ml-3 ">
      <div className="p-3 shadow-md bg-white">
        <h1 className="text-yellow-600 text-lg font-bold">
          Cliente: {comanda.cliente}
        </h1>
        {/* <p className="text-gray-700 font-bold">Mesa: {comanda.mesa}</p> */}
        <p className="text-gray-700  text-sm font-light">
          Hora:{" "}
          {new Date(comanda.creada).toLocaleString("es-ES", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {comanda.ordenes.map((orden, i) => (
          <Fragment key={i}>
            <p className="text-gray-600">{orden.num}</p>

            {/* TO DO:mapear orden.orden en acordeon */}
            {/* <p className="text-gray-700 font-bold">
              Observaciones:{" "}
              <span className="text-gray-600 font-light">
                {platillos.observaciones}
              </span>
            </p> */}
          </Fragment>
        ))}

        <p className="text-gray-700 font-bold">Total: $ {comanda.total}</p>
      </div>
    </div>
  );
};

export default ComandaCompletada;
