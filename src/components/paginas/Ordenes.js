import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../../firebase";
import Orden from "../ui/Orden";
import PedidoContext from "../../context/pedidos/pedidosContext";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useNavigate } from "react-router-dom";

import SweetAlert from "react-bootstrap-sweetalert";
import Impresion from "../paginas/Impresion";

const Ordenes = () => {
  const navigate = useNavigate();

  // useBeforeunload(() => "Perderás las comandas no terminadas");

  const [showAlert, setShowAlert] = useState(false);

  const {
    iniciarNuevaOrden,
    guardarIDComanda,
    obtenerComanda,
    guardarClienteActual,
    obtenerClientes,
  } = useContext(PedidoContext);

  //context con las operaciones de firebase
  const { firebase } = useContext(FirebaseContext);

  //state de ordenes
  const [comandas, setComandas] = useState([]);
  const [imprimir, setImprimir] = useState(false);
  const [ordenesImprimir, setOrdenesImprimir] = useState({});
  const [total, setTotal] = useState(0);
  const [envio, setEnvio] = useState(25);
  const [domicilioActivo, setDomicilioActivo] = useState("");

  useEffect(() => {
    const obtenerOrdenes = async () => {
      await firebase.db
        .collection("comandas")
        .where("activa", "==", true)
        .onSnapshot(manejarSnapshot2);
    };

    obtenerOrdenes();
    obtenerClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function manejarSnapshot2(snapshot) {
    const comandas = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    setComandas(comandas);
  }

  const reiniciarMesa = (id, ordenes, total, envio, cliente) => {
    firebase.db.collection("comandas").doc(id).update({
      activa: false,
    });

    //  Obtener la comanda con el id  y guardarla en día en dia y en objeto de comandas

    //imprimir ticket abrir pantalla
    guardarComandasDia(id);

    setOrdenesImprimir(ordenes);
    setTotal(total);
    setEnvio(envio);

    obtenerDom(cliente);

    setImprimir(true);
    // }
  };

  const obtenerCliente = async (cliente) => {
    await firebase.db
      .collection("clientes")
      .get()
      .then((querySnapshot) => {
        const clientes = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        const client = clientes[0].clientes.find((c) => c.telefono === cliente);

        guardarClienteActual(client);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const guardarComandasDia = async (idcomanda) => {
    // Solo actualizar estado de comanda a false

    let dia = new Date(Date.now()).setHours(0, 0, 0, 0);

    await firebase.db
      .collection("dias")
      .where("dia", "==", dia)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docChanges().length > 0) {
          //si existe el dia, cargar el arreglo de comandas
          const comandas = querySnapshot.docs[0].data().comandas;

          comandas.forEach((comanda) => {
            if (comanda.idcomanda === idcomanda) {
              //esta es la comanda, actualizar
              comanda.activa = false;
            }
          });

          //actualizar el arreglo
          firebase.db.collection("dias").doc(querySnapshot.docs[0].id).update({
            comandas,
          });
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const obtenerDom = async (cliente) => {
    await firebase.db
      .collection("clientes")
      .get()
      .then((querySnapshot) => {
        const clientes = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        const client = clientes[0].clientes.find((c) => c.telefono === cliente);

        setDomicilioActivo(client.domicilio);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {!imprimir ? (
        <>
          <h1 className="text-3xl font-light mb-4 text-center">
            Pedidos/Comandas
          </h1>

          <>
            {comandas.length > 0 ? (
              <div className="flex">
                {comandas.map((comanda, i) => {
                  return (
                    <div className="sm: w-5/12 lg:w-1/4 shadow-md m-2" key={i}>
                      <button
                        type="button"
                        className="bg-blue-800 hover:bg-blue-700 w-1/2 mt-5 p-2 text-white uppercase font-bold "
                        onClick={() => {
                          iniciarNuevaOrden(comanda.cliente);
                          guardarIDComanda(comanda.id);
                          obtenerComanda(comanda.cliente);
                          obtenerCliente(comanda.cliente);
                          navigate("/menu-digital");
                        }}
                      >
                        Agregar orden
                      </button>

                      <button
                        className="font-bold bg-teal-600 hover:bg-teal-500  w-1/2 p-2 text-white  uppercase mt-2"
                        onClick={() =>
                          reiniciarMesa(
                            comanda.id,
                            comanda.ordenes,
                            comanda.total,
                            comanda.envio,
                            comanda.cliente
                          )
                        }
                      >
                        Imprimir Ticket
                      </button>
                      <h2 className="text-yellow-600 text-lg font-bold text-center">
                        Cliente: {comanda.cliente}
                      </h2>
                      <p className="text-gray-700  text-sm font-light text-center">
                        Hora:{" "}
                        {new Date(comanda.creada).toLocaleString("es-ES", {
                          hour12: true,
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="flex flex-wrap">
                        {comanda.ordenes.map((orden, i) => (
                          <Accordion style={{ width: "100%" }}>
                            <AccordionSummary
                              style={{ margin: 0 }}
                              expandIcon={<ExpandMoreIcon />}
                            >
                              <Typography>
                                Orden #{orden.num}{" "}
                                {orden.nombreOrden && orden.nombreOrden}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                              style={{ width: "100%", padding: 0 }}
                            >
                              <Orden key={i} orden={orden} />
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </div>

                      <div>
                        <h3 className="text-center font-bold text-md">
                          Subtotal: $ {comanda.total - comanda.envio}
                        </h3>
                        <h3 className="text-center font-bold text-md">
                          Envío: $ {comanda.envio}
                        </h3>
                        <h2 className="text-center font-bold text-xl">
                          Total comanda: $ {comanda.total}
                        </h2>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <h2 className="text-center font-bold mt-16">
                Aún no hay órdenes
              </h2>
            )}
          </>

          <SweetAlert
            warning
            confirmBtnText="Ok"
            confirmBtnBsStyle="primary"
            title="No es posible reiniciar aún"
            show={showAlert}
            onConfirm={() => setShowAlert(false)}
            closeOnClickOutside
            cancelBtnBsStyle="danger"
          >
            Todas las órdenes de la mesa deben estar completadas
          </SweetAlert>
        </>
      ) : (
        <Impresion
          setImprimir={setImprimir}
          ordenesImprimir={ordenesImprimir}
          total={total}
          envio={envio}
          domicilio={domicilioActivo}
        />
      )}
    </>
  );
};

export default Ordenes;
