import React, { useContext, Fragment } from "react";
import { FirebaseContext } from "../../firebase";

const Orden = ({ orden }) => {
  //console.log(orden);
  //const [tiempoentrega, setTiempoEntrega] = useState(0);

  //context de firebase
  const { firebase } = useContext(FirebaseContext);

  //define el tiempo de entrega
  // const definirTiempo = (id) => {
  //   try {
  //     firebase.db.collection("ordenes").doc(id).update({
  //       tiempoentrega,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //completa una orden
  const completarOrden = (id) => {
    try {
      //actualizarlas en el conjunto del dia

      // //actualizar ordenes
      // firebase.db.collection("ordenes").doc(id).update({
      //   completado: true,
      // });

      //completar también en la comanda
      firebase.db
        .collection("comandas")
        .where("activa", "==", true)
        .where("cliente", "==", orden.cliente)
        .onSnapshot(manejarSnapshot2);

      function manejarSnapshot2(snapshot) {
        //sacar el objeto completo de la comanda
        let comandaObj = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        //arreglo de ordenes de comanda
        if (comandaObj.length > 0) {
          const ordenesComandas = comandaObj[0].ordenes;

          //recorrer las ordenes y guardar el completado true
          ordenesComandas.forEach((orden, i) => {
            if (orden.num === id) {
              //esta es la orden, actualizar completado
              ordenesComandas[i].completado = true;
            }
          });
          //ya se actualizó el objeto, actualizar con nuevo arreglo
          firebase.db.collection("comandas").doc(comandaObj[0].id).update({
            ordenes: ordenesComandas,
          });
        }
      }

      //Obtener todas las ordenes del día
      const hoy = new Date(Date.now()).setHours(0, 0, 0, 0);

      //consultar firebase para sacar la que se refiere
      firebase.db
        .collection("dias")
        .where("dia", "==", hoy) //solo los sean de hoy
        .onSnapshot(manejarSnapshot);

      function manejarSnapshot(snapshot) {
        //sacar el objeto completo del día
        let ordenesObj = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        //arreglo con las ordenes
        const ordenes = ordenesObj[0].ordenes;

        //recorrer las ordenes y guardar el completado true
        ordenes.forEach((orden, i) => {
          if (orden.num === id) {
            //esta es la orden, actualizar completado
            ordenes[i].completado = true;
          }
        });

        //ya se actualizó el objeto, actualizar con nuevo arreglo
        firebase.db.collection("dias").doc(ordenesObj[0].id).update({
          ordenes: ordenes,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="  w-full ">
      <div className="pr-3 pl-3 pb-3 bg-white">
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
