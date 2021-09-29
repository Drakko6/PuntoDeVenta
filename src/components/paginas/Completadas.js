/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../../firebase";
import PedidoContext from "../../context/pedidos/pedidosContext";

import _ from "lodash";
import ComandaCompletada from "../ui/ComandaCompletada";

const Completadas = () => {
  const { clientes, obtenerClientes } = useContext(PedidoContext);

  //context con las operaciones de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  //state de ordenes
  const [ordenes, setOrdenes] = useState([]);
  const [comandas, setComandas] = useState([]);
  const [totalDia, setTotalDia] = useState(0);
  const [totalOrdenes, setTotalOrdenes] = useState(0);

  //state de texto
  const [texto, setTexto] = useState("Ordenar por Mesa");

  //state de fecha
  const [fecha, setFecha] = useState();

  //hoy
  const [dia, setDia] = useState(
    new Date(Date.now())
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/. /g, "-")
      .slice(0, 10)
  );

  const actualizaState = (e) => {
    let fechaActual = new Date(e.target.value);
    fechaActual.setDate(fechaActual.getDate() + 1);
    fechaActual.setHours(0, 0, 0, 0);

    setFecha(fechaActual.getTime());
    setDia(
      fechaActual
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/. /g, "-")
        .slice(0, 10)
    );
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  useEffect(() => {
    if (!fecha) {
      let hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      setFecha(hoy.getTime());
    }

    const obtenerOrdenes = () => {
      firebase.db
        .collection("dias")
        .where("dia", "==", fecha) //solo los sean del dia
        .onSnapshot(manejarSnapshot);
    };

    if (fecha && usuario) {
      obtenerOrdenes();
    }
  }, [fecha]);

  function manejarSnapshot(snapshot) {
    try {
      let diaObj = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      if (diaObj.length === 0) {
        setTotalDia(0);
        setTotalOrdenes(0);
        setComandas([]);
        return;
      }
      let comandas = diaObj[0].comandas;

      if (comandas.length === 0 || diaObj.length === 0) {
        setTotalDia(0);
        setTotalOrdenes(0);
        return;
      }

      //filtrar las completadas
      comandas = comandas.filter((orden) => orden.activa === false);

      setComandas(comandas);

      let total = 0;
      let ordenes = 0;

      comandas.forEach((com) => {
        ordenes += com.ordenes.length;
        total += com.total;
      });

      setTotalDia(total);
      setTotalOrdenes(ordenes);
    } catch (error) {
      //console.log(error);
      setComandas([]);
    }
  }

  const agruparMesa = () => {
    if (texto === "Ordenar por Mesa") {
      setTexto("Ordenar por Número de Orden");
      setOrdenes(_.orderBy(ordenes, "mesa"));
    } else {
      setTexto("Ordenar por Mesa");

      setOrdenes(_.orderBy(ordenes, "num"));
    }
  };

  return (
    <>
      {usuario ? (
        <>
          <div className=" content-center text-center">
            <h1 className="text-3xl font-light mb-4 mt-2">
              Comandas del día completadas
            </h1>

            <form>
              <label className="text-xl font-light mb-3">
                Selecciona la fecha:{"  "}
              </label>
              <input
                type="date"
                name="fecha"
                className="text-2xl font-bold mb-5  text-blue-700 text-center"
                lang="es"
                value={dia}
                onChange={actualizaState}
              />
            </form>
          </div>

          {comandas.length > 0 ? (
            <>
              <div className="grid grid-cols-6 p-3 items-center text-center">
                <h1 className="text-yellow-600 text-lg font-bold col-span-1">
                  Cliente
                </h1>
                <p className="text-yellow-600 text-lg font-bold col-span-2 ">
                  Domicilio
                </p>
                <p className="text-yellow-600 text-lg font-bold col-span-1">
                  Hora:
                </p>

                <p className="text-yellow-600 text-lg font-bold col-span-1 ">
                  Total
                </p>

                <p className="text-yellow-600 text-lg font-bold col-span-1 ">
                  Órdenes
                </p>
              </div>
              <div className="block ">
                {comandas.map((comanda, i) => (
                  <ComandaCompletada
                    key={i}
                    comanda={comanda}
                    cliente={clientes.find(
                      (cl) => cl.telefono === comanda.cliente
                    )}
                  />
                ))}
              </div>

              <div className="p-3 grid grid-cols-6 items-center">
                <h1 className="text-blue-700  text-xl font-bold col-span-4 text-right">
                  TOTALES:
                </h1>

                <h1 className="text-black  text-xl font-bold col-span-1 text-center">
                  ${totalDia}
                </h1>

                <h1 className="text-black  text-lg font-bold col-span-1 text-center">
                  {comandas.length} comandas, {totalOrdenes} órdenes
                </h1>
              </div>
            </>
          ) : (
            <h2 className="text-center font-bold mt-16">Aún no hay comandas</h2>
          )}
        </>
      ) : (
        <h1 className="text-center flex">
          No cuentas con los permisos para ver esta página{" "}
        </h1>
      )}
    </>
  );
};

export default Completadas;
