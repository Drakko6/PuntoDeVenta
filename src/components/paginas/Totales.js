import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../../firebase";

const Totales = () => {
  //context con las operaciones de firebase
  const { firebase } = useContext(FirebaseContext);

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

  //state de ordenes
  const [ordenes, setOrdenes] = useState([]);

  //state de fecha
  const [fecha, setFecha] = useState("");

  //state de contOrdenes
  const [contOrden, setContOrden] = useState(0);
  //state de total
  const [total, setTotal] = useState(0);

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

    if (fecha) {
      obtenerOrdenes();
    }
    //calcularTotales();
  }, [fecha]);

  useEffect(() => {
    calcularTotales();
    //console.log("se consultó ordenes");
  }, [ordenes]);

  const obtenerOrdenes = async () => {
    await firebase.db
      .collection("dias")
      .where("dia", "==", fecha) //solo los sean del dia
      .onSnapshot(manejarSnapshot);
  };

  async function manejarSnapshot(snapshot) {
    try {
      let ordenesObj = await snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      let ordenes = ordenesObj[0].ordenes;

      //filtrar las completadas
      ordenes = ordenes.filter((orden) => orden.completado === true);

      setOrdenes(ordenes);
    } catch (error) {
      //console.log(error);
      setOrdenes([]);
    }
  }

  const calcularTotales = () => {
    let contOrdenes = 0;
    let totalDia = 0;
    ordenes.forEach((orden) => {
      contOrdenes = contOrdenes + 1;
      totalDia = totalDia + orden.total;
    });

    setContOrden(contOrdenes);
    setTotal(totalDia);
  };
  return (
    <>
      <div className=" content-center text-center">
        <h1 className="text-2xl font-light mb-4">Totales</h1>

        <form>
          <label className="text-xl font-light mb-3">
            Selecciona la fecha{" "}
          </label>
          <input
            type="date"
            name="fecha"
            className="text-xl font-bold mb-5  text-blue-700"
            lang="es"
            value={dia}
            onChange={actualizaState}
          />
        </form>
        <div className="lg: w-7/12 xl: w-9/12 pl-5">
          <p className="text-gray-600 mb-4"></p>

          <p className=" text-xl text-gray-600 mb-4 justify-center">
            Órdenes de este día:{" "}
            <span className="text-gray-700 font-bold">{contOrden}</span>
          </p>

          <p className=" text-xl text-gray-600 mb-4 justify-center">
            Total vendido:{" "}
            <span className="text-gray-700 font-bold">$ {total}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Totales;
