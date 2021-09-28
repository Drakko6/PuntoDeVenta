import React from "react";
import DetallePlatillo from "../paginas/DetallePlatillo";

//import { Overlay } from "react-portal-overlay";

const Modal = ({ open, setOpen, setModalAbierto, modalAbierto }) => {
  const cerrar = setOpen;
  return (
    <>
      {open ? (
        <>
          <div className="block  justify-center items-center m-1 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative  my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-2 border-b border-solid border-gray-300 rounded-t">
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                {/* <div className="h-screen"> */}
                <DetallePlatillo
                  cerrar={cerrar}
                  setModalAbierto={setModalAbierto}
                  modalAbierto={modalAbierto}
                />
                {/* </div> */}
              </div>
            </div>
          </div>
          <div
            className="opacity-25 fixed inset-0 z-40 bg-black"
            onClick={() => setOpen(false)}
          ></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
