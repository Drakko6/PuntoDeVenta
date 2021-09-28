/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../../firebase";

import _ from "lodash";
import ComandaCompletada from "../ui/ComandaCompletada";

const Completadas = () => {
  //context con las operaciones de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  //state de ordenes
  const [ordenes, setOrdenes] = useState([]);
  const [comandas, setComandas] = useState([]);

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

      let comandas = diaObj[0].comandas;

      //filtrar las completadas
      comandas = comandas.filter((orden) => orden.activa === false);

      setComandas(comandas);
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
                Selecciona la fecha{" "}
              </label>
              <input
                type="date"
                name="fecha"
                className="text-2xl font-bold mb-5  text-blue-700"
                lang="es"
                value={dia}
                onChange={actualizaState}
              />
            </form>

            {/* <button className="bg-teal-600   p-2" onClick={() => agruparMesa()}>
              <p className="text-white">{texto}</p>
            </button> */}
          </div>

          <div className="flex flex-wrap -mx-3">
            {comandas.map((comanda, i) => (
              <ComandaCompletada key={i} comanda={comanda} />
            ))}
          </div>
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
