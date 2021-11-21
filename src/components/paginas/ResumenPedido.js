/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormUsuario from "../ui/FormUsuario";
import SweetAlert from "react-bootstrap-sweetalert";
import { FirebaseContext } from "../../firebase";
import PedidoContext from "../../context/pedidos/pedidosContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const ResumenPedido = ({ setModalAbierto, cerrar }) => {
  const { firebase } = useContext(FirebaseContext);
  const { clienteActual } = useContext(PedidoContext);

  //Redireccionar
  const navigate = useNavigate();
  //context de pedido
  const {
    pedido,
    total,
    mostrarResumen,
    eliminarProducto,
    pedidoRealizado,
    contOrdenes,
    idorden,
    guardarOrden,
    guardarEnComanda,
    // ordenActual,
  } = useContext(PedidoContext);

  const [showAlert, setShowAlert] = useState(false);

  //validacion y leer formulario
  const formik = useFormik({
    initialValues: {
      telefono: clienteActual ? clienteActual.telefono : "",
      nombre: clienteActual ? clienteActual.nombre : "",
      domicilio: clienteActual ? clienteActual.domicilio : "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre del cliente es obligatorio"),
      domicilio: Yup.string().required(
        "El domicilio del cliente es obligatorio"
      ),
      telefono: Yup.string().required("El teléfono del cliente es obligatorio"),
      nombreOrden: Yup.string().default(""),
    }),
    onSubmit: async (cliente) => {
      try {
        //hacer el objeto registro si no existe, si sí, actualizar
        await firebase.db
          .collection("clientes")
          .get()
          .then((querySnapshot) => {
            let { nombreOrden, ...clienteNuevo } = cliente;

            if (querySnapshot.docs.length === 0) {
              //si no existe, crear el registro

              const registro = {
                clientes: [clienteNuevo],
              };
              firebase.db.collection("clientes").add(registro);
            } else {
              //si existe el registro, sacar los clientes y agregar el cliente al array
              let clientesActualizados = querySnapshot.docs[0].data().clientes;
              clientesActualizados.push(clienteNuevo);

              console.log(clientesActualizados);
              firebase.db
                .collection("clientes")
                .doc(querySnapshot.docs[0].id)
                .update({
                  clientes:
                    firebase.firestore.FieldValue.arrayUnion(clienteNuevo),
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });

        //  confirmar orden
        confirmarOrden(cliente.telefono, cliente.nombreOrden);

        //redireccionar
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    },
  });

  //Para cargar todo el pedido
  useEffect(() => {
    calcularTotal();
  }, [pedido]);

  const calcularTotal = () => {
    let nuevoTotal = 0;
    nuevoTotal = pedido.reduce(
      (nuevoTotal, articulo) => nuevoTotal + articulo.total,
      0
    );

    mostrarResumen(nuevoTotal);
  };

  const confirmarOrden = async (telefono, nombreOrden) => {
    //crear objeto con el pedido, agregar el cliente
    const pedidoObj = {
      tiempoentrega: 0,
      completado: false,
      total: Number(total),
      orden: pedido, //array
      creado: Date.now(),
      num: contOrdenes + 1,
      cliente: telefono,
      nombreOrden: nombreOrden ? nombreOrden : "",
    };

    try {
      const productos = [...pedido];
      //se saca el array
      await firebase.db
        .collection("productos")
        .get()
        .then((querySnapshot) => {
          //sacar los productos
          const menu = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });

          if (menu.length > 0) {
            let platillos = menu[0].productos;

            //se actualizan los vendidos buscando
            productos.forEach((producto) => {
              platillos.forEach((platillo) => {
                if (platillo.nombre === producto.nombre) {
                  platillo.vendidos = producto.vendidos + producto.cantidad;
                }
              });
            });

            //actualizar el arreglo con los platillos
            firebase.db
              .collection("productos")
              .doc(querySnapshot.docs[0].id)
              .update({
                productos: platillos,
              });
          }
        });

      const { tiempoentrega, ...pedidoObj2 } = pedidoObj;

      guardarOrden(pedidoObj2);

      guardarEnComanda(pedidoObj2);

      pedidoRealizado(pedidoObj2.num);

      setShowAlert(false);

      navigate("/menu-digital/progreso");
    } catch (error) {
      console.log(error);
    }
  };

  //Redirecciona a progreso pedido
  // const progresoPedido = () => {
  //   setShowAlert(true);
  // };

  //elimina un producto del arreglo de pedido
  const confirmarEliminacion = (nombre) => {
    //Mostrar otra alerta primero

    //eliminar del state
    eliminarProducto(nombre);
  };

  return (
    <div className="  justify-center flex-1 z-30 ">
      <div className="w-full">
        {setModalAbierto ? (
          <>
            {!idorden ? (
              <>
                <h1 className="text-xl font-bold text-center mb-6">
                  Resumen de Pedido
                </h1>
                {pedido.map((platillo, i) => {
                  const { cantidad, nombre } = platillo;

                  return (
                    <div key={i} className="shadow-md bg-white mb-5 pb-3">
                      <div className="grid grid-cols-4">
                        <div className="flex col-span-3 ml-5">
                          <p className="mr-10">{cantidad}</p>
                          <p className=" font-bold">{nombre}</p>
                        </div>
                        <div className="flex col-span-1 ml-5">
                          <button
                            className="bg-red-600 w-full p-2"
                            onClick={() => confirmarEliminacion(nombre)}
                          >
                            <p className="text-white">Eliminar</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <p className="font-bold text-center">
                  Total a pagar: {"$"}
                  {total}
                </p>

                <div>
                  <FormUsuario formik={formik} />
                </div>

                <footer className="sticky bottom-0 grid grid-cols-2 ">
                  <button
                    className="col-span-2  m-1 text-white bg-green-500  active:bg-green-700 p-3"
                    onClick={formik.handleSubmit}
                  >
                    <p>Ordenar pedido</p>
                  </button>
                </footer>
              </>
            ) : null}
          </>
        ) : null}
      </div>

      <SweetAlert
        warning
        showCancel
        confirmBtnText="Confirmar"
        confirmBtnBsStyle="primary"
        cancelBtnText="Cancelar"
        title="¿Confirmar orden?"
        onConfirm={() => confirmarOrden()}
        show={showAlert}
        onCancel={() => setShowAlert(false)}
        closeOnClickOutside
        cancelBtnBsStyle="danger"
      >
        Una vez confirmada, no podrás cambiar la orden
      </SweetAlert>
    </div>
  );
};

export default ResumenPedido;
