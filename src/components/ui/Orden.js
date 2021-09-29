import React, { Fragment } from "react";

const Orden = ({ orden }) => {
  return (
    <div className="  w-full ">
      <div className="pr-3 pl-3 pb-3 bg-white text-left">
        {orden.orden.map((platillos, i) => (
          <Fragment key={i}>
            <p className="text-gray-600">
              {platillos.cantidad} {platillos.nombre}
            </p>
          </Fragment>
        ))}

        <p className="text-gray-700 font-bold">
          Total a Pagar: $ {orden.total}
        </p>
      </div>
    </div>
  );
};

export default Orden;
