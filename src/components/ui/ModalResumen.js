import React from "react";
import ResumenPedido from "../paginas/ResumenPedido";

//import { Overlay } from "react-portal-overlay";

const ModalResumen = ({ setModalAbierto, cerrar }) => {
  return (
    <>
      <div className="flex-1 rounded-lg	 w-auto my-6 mx-auto max-w-3xl bg-white z-50 overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
        <div className=" p-2 relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <ResumenPedido setModalAbierto={setModalAbierto} cerrar={cerrar} />
        </div>
      </div>
      <div
        className=" fixed inset-0 z-40"
        style={{ opacity: 0.25, backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        onClick={() => setModalAbierto(false)}
      />
    </>
  );
};

export default ModalResumen;
