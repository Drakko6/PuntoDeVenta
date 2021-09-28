/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PedidoContext from "../../context/pedidos/pedidosContext";
import firebase from "../../firebase";

const ProgresoPedido = () => {
  const {
    idorden,
    ordenesDia,
    comanda,
    idcomanda,
    ordenFinalizada,
    banderaOrden,
    guardarComanda,
    comandasDia,
  } = useContext(PedidoContext);
  const navigate = useNavigate();

  // const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const guardarComandaBD = async () => {
      if (idcomanda) {
        let total = 0;
        comanda.forEach((orden) => {
          total += orden.total;
        });

        //  obtenemos la comanda de las comandas del día y actualizamos el total y ordenes
        const comandaObj = comandasDia.find((c) => c.idcomanda === idcomanda);
        comandaObj.total = total;
        comandaObj.ordenes = comanda;
        guardarComanda(comandaObj);
        firebase.db.collection("comandas").doc(idcomanda).update({
          ordenes: comanda,
          total,
        });

        guardarComandasDia(comandaObj);
      } else {
        //es una comanda nueva
        //calcular Total
        let total = 0;
        comanda.forEach((orden) => {
          total += orden.total;
        });

        const comandaObj = {
          ordenes: comanda,
          activa: true,
          cliente: comanda[0].cliente,
          total,
          creada: Date.now(),
        };

        const com = await firebase.db.collection("comandas").add(comandaObj);
        firebase.db.collection("comandas").doc(com.id).update({
          idcomanda: com.id,
        });
        comandaObj.idcomanda = com.id;

        guardarComanda(comandaObj);

        guardarComandasDia(comandaObj);
      }
    };

    if (idorden) {
      // if (banderaOrden) {
      //   obtenerProducto();
      // }

      if (!banderaOrden) {
        guardarOrdenesDia();
        guardarComandaBD();
        ordenFinalizada();
      }

      navigate("/");
    }
  }, []);

  //guardar orden en arreglo de dias
  const guardarOrdenesDia = async () => {
    //crear objeto de dia con las ordenes
    const diaObj = {
      dia: new Date(Date.now()).setHours(0, 0, 0, 0),
      ordenes: ordenesDia,
    };

    await firebase.db
      .collection("dias")
      .where("dia", "==", diaObj.dia)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docChanges().length === 0) {
          //console.log("No existía");
          //si no existe, crear el nuevo dia
          firebase.db.collection("dias").add(diaObj);
        } else {
          //si existe el dia, cargar el arreglo de ordenes de nuevo con update
          const documento = firebase.db
            .collection("dias")
            .doc(querySnapshot.docs[0].id);

          documento.update({
            ordenes: ordenesDia,
          });
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const guardarComandasDia = async (comandaNueva) => {
    let dia = new Date(Date.now()).setHours(0, 0, 0, 0);

    const diaObj = {
      dia,
      comandas: [comandaNueva],
    };

    firebase.db
      .collection("dias")
      .where("dia", "==", dia)
      .get()
      .then(function (querySnapshot) {
        if (querySnapshot.docs.length > 0) {
          // Suponiendo que el día existe
          let comandas = [];

          if (querySnapshot.docs[0].data().comandas) {
            comandas = querySnapshot.docs[0].data().comandas;
          } else {
            comandas.push(comandaNueva);
          }

          let existe = comandas.find(
            (com) => com.idcomanda === comandaNueva.idcomanda
          );

          if (existe) {
            comandas.forEach((comanda) => {
              if (comanda.idcomanda === comandaNueva.idcomanda) {
                //esta es la comanda, actualizar
                comanda.ordenes = comandaNueva.ordenes;
                comanda.total = comandaNueva.total;
              }
            });
          } else {
            comandas.push(comandaNueva);
          }

          //actualizar el arreglo
          firebase.db.collection("dias").doc(querySnapshot.docs[0].id).update({
            comandas,
          });
        } else {
          // si no existe, crear el día y agregar la comanda

          firebase.db.collection("dias").add(diaObj);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };
  return <></>;
};

export default ProgresoPedido;
