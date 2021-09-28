import React, { Fragment } from "react";
const OrdenUsuario = ({ orden }) => {
  return (
    <div className=" sm: w-5/12 lg:w-1/4 mb-4 ml-3 ">
      <div className="p-3 shadow-md bg-white">
        <h1 className="text-yellow-600 text-lg font-bold">
          Orden: {orden.num}
        </h1>
        {/* <p className="text-gray-700 font-bold">Mesa: {orden.mesa}</p> */}
        <p className="text-gray-700  text-sm font-light">
          Hora:{" "}
          {new Date(orden.creado).toLocaleString("es-ES", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {orden.orden.map((platillos, i) => (
          <Fragment key={i}>
            <p className="text-gray-600">
              {platillos.cantidad} {platillos.nombre}
            </p>
            <p className="text-gray-700 font-bold">
              Observaciones:{" "}
              <span className="text-gray-600 font-light">
                {platillos.observaciones}
              </span>
            </p>
          </Fragment>
        ))}

        <p className="text-gray-700 font-bold">
          Total a Pagar: $ {orden.total}
        </p>

        {orden.completado && (
          <h2 className="text-center w-full mt-2 p-2 text-green-600 uppercase">
            Orden Completada
          </h2>
        )}
      </div>
    </div>
  );
};

export default OrdenUsuario;
