import React, { useEffect } from "react";

import "../../assets/styles.css";

const Impresion = ({ setImprimir, ordenesImprimir, total }) => {
  useEffect(() => {
    setTimeout(() => {
      window.print();
      setImprimir(false);
    }, 500);
  }, []);

  return (
    <div
      className="z-40 relative items-center "
      style={{
        width: 200,
        maxWidth: 200,
        fontFamily: "Arial Narrow",
      }}
    >
      <img
        src={require("../../assets/logotortas.png")}
        alt="Logotipo"
        style={{ maxWidth: 150, width: 150 }}
        className=" self-center ml-6"
      />

      <p className="text-center">
        Tortas Chícharo
        <br />
        <span className="text-sm font-normal mt-2">
          {new Date(Date.now()).toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <br />
        <span className="text-xs font-normal mt-2">
          San Martin 83-A, Centro, 46400 Tequila, Jal.
        </span>
      </p>
      <table className="border-collapse border-black border-t mt-2">
        <thead>
          <tr>
            <th
              className="font-bold  text-sm border-collapse border-black border-t"
              style={{ width: 20, maxWidth: 20, wordBreak: "break-words" }}
            >
              #
            </th>
            <th
              className="font-bold  text-sm border-collapse border-black border-t"
              style={{ width: 20, maxWidth: 20, wordBreak: "break-words" }}
            >
              C
            </th>
            <th
              className="font-bold  text-sm border-collapse border-black border-t"
              style={{ width: 150, maxWidth: 150, wordBreak: "break-words" }}
            >
              Producto
            </th>
            <th
              style={{ width: 20, maxWidth: 20, wordBreak: "break-words" }}
              className="font-bold  text-sm border-collapse border-black border-t text-center"
            >
              $
            </th>
            <th
              className="font-bold  text-sm border-collapse border-black border-t text-left"
              style={{ width: 40, maxWidth: 40, wordBreak: "break-words" }}
            >
              Subt
            </th>
          </tr>
        </thead>
        {/* aqui se iteran los productos */}

        {ordenesImprimir.map((orden) => (
          <tbody className="border-collapse border-black border-t border-b-2">
            {orden.orden.map((producto, i) => (
              <tr className="border-collapse">
                <td
                  style={{ width: 20, maxWidth: 20, wordBreak: "break-words" }}
                  className=" font-bold text-sm border-collapse "
                >
                  {i === 0 ? orden.num : " "}
                </td>

                <td
                  style={{ width: 20, maxWidth: 20, wordBreak: "break-words" }}
                  className=" font-normal text-sm border-collapse "
                >
                  {producto.cantidad}
                </td>
                <td
                  className="font-normal text-sm border-collapse "
                  style={{
                    width: 150,
                    maxWidth: 150,
                    wordBreak: "break-words",
                  }}
                >
                  {producto.nombre}
                </td>
                <td
                  className="font-normal text-sm border-collapse  text-center"
                  style={{ width: 20, maxWidth: 20, wordBreak: "break-words" }}
                >
                  ${producto.precio}
                </td>
                <td
                  className="font-normal text-sm border-collapse  text-left"
                  style={{ width: 40, maxWidth: 40, wordBreak: "break-words" }}
                >
                  ${producto.total}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
        <tbody>
          <tr className="border-collapse border-black border-t">
            <td style={{ width: 20, maxWidth: 20 }}></td>
            <td style={{ width: 20, maxWidth: 20 }}></td>
            <td style={{ width: 110, maxWidth: 110 }}></td>
            <td
              className="font-bold text-sm border-collapse border-black border-t"
              style={{ width: 30 }}
            >
              TOTAL:
            </td>
            <td
              className="font-bold text-sm text-left border-collapse border-black border-t"
              style={{ width: 50 }}
            >
              ${total}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-center mt-4 text-sm">
        ¡GRACIAS POR SU COMPRA!
        <br />
      </p>

      {/* <button
        onClick={() => {
          window.print();
          setImprimir(false);
        }}
        className="oculto-impresion bg-teal-500 text-center mt-10 p-3 font-bold self-center ml-6 "
      >
        IMPRIMIR
      </button> */}
    </div>
  );
};

export default Impresion;
