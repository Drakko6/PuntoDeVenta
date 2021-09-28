import React from "react";

const PlatilloMostrar = ({ platillo }) => {
  const { nombre, imagen, descripcion, precio } = platillo;

  return (
    <div className="grid grid-cols-4 shadow-md bg-white mb-2">
      <div className=" col-span-1">
        <img
          src={imagen}
          alt="imagen de platillo"
          className=" w-full object-cover left-0 lg:h-48 h-20"
        />
      </div>

      <div className=" pl-5 col-span-3">
        <p className="font-bold text-sm text-yellow-700 ">{nombre}</p>

        <p className="text-gray-600 text-xs ">{descripcion}</p>
        <p className="text-gray-600 mb-4 text-xs">
          Precio: <span className="text-gray-700 font-bold">$ {precio}</span>
        </p>
      </div>
    </div>
  );
};

export default PlatilloMostrar;
