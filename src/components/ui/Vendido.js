import React, { useContext } from "react";
import { FirebaseContext } from "../../firebase";

const Vendido = ({ platillo }) => {
  //Context de firebase
  const { firebase } = useContext(FirebaseContext);

  const {
    nombre,
    imagen,

    categoria,

    id,
    vendidos,
  } = platillo;

  return (
    <div className="w-full px-3 mb-4">
      <div className="p-5 shadow-md bg-white">
        <div className="lg:flex">
          <div className="lg:w-5/12 xl:w-3/12">
            <img src={imagen} alt="imagen de platillo" />
          </div>

          <div className="lg: w-7/12 xl: w-9/12 pl-5">
            <p className="font-bold text-2xl text-yellow-600 mb-4">{nombre}</p>
            <p className="text-gray-600 mb-4">
              Categoría:{" "}
              <span className="text-gray-700 font-bold">
                {categoria.toUpperCase()}
              </span>
            </p>
            <p className="text-gray-600 mb-4">
              Vendidos:{" "}
              <span className="text-gray-700 font-bold">{vendidos}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendido;
