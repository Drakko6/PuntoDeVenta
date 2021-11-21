import React, { useState, useContext, useEffect } from "react";

import { FirebaseContext } from "../../firebase";

// import { useNavigate } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";

import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import PedidoContext from "../../context/pedidos/pedidosContext";

const useStyles = makeStyles({
  helper: {
    marginLeft: 10,
    color: "red",
  },
});

const FormUsuario = ({ formik }) => {
  const classes = useStyles();

  //Context con las operaciones de firebase
  const { firebase, usuario } = useContext(FirebaseContext);
  const { clienteActual } = useContext(PedidoContext);

  const [clients, setClients] = useState([]);
  const [comandasActivas, setComandasActivas] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  //Hook para redireccionar
  // const navigate = useNavigate();

  useEffect(() => {
    const obtenerClientes = async () => {
      await firebase.db.collection("clientes").onSnapshot(manejarSnapshot);
    };

    obtenerClientes();

    // Si escriben el cliente, Lanzar un alert que avise y borrarlo del formik

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manejarSnapshot(snapshot) {
    const clientes = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    if (clienteActual) {
      setClients(clientes[0].clientes);
      formik.setFieldValue(`telefono`, clienteActual.telefono);
      return;
    }

    await firebase.db
      .collection("comandas")
      .where("activa", "==", true)
      .get()
      .then((querySnapshot) => {
        //sacar las comandas
        const comandas = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setComandasActivas(comandas);

        setClients(
          clientes[0].clientes.filter(
            (c) => !comandas.find((com) => com.cliente === c.telefono)
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {usuario ? (
        <div>
          <h1 className="text-xl text-center font-light mt-4">Cliente</h1>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <form>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="telefono"
                  >
                    Teléfono
                  </label>
                  <Autocomplete
                    freeSolo
                    options={clients.map((c) => c.telefono)}
                    getOptionLabel={(option) => option}
                    style={{ width: "100%" }}
                    size="small"
                    inputValue={formik.values.telefono}
                    onInputChange={(e, value) => {
                      if (value) {
                        // validar que no esté en comandas activas
                        if (
                          comandasActivas.find((com) => com.cliente === value)
                        ) {
                          // lanzar alerta
                          setShowAlert(true);
                          formik.setFieldValue(`telefono`, "");
                          return;
                        }
                        formik.setFieldValue(`telefono`, value);
                        if (clients.find((c) => c.telefono === value)) {
                          formik.setFieldValue(
                            `nombre`,
                            clients.find((c) => c.telefono === value).nombre
                          );
                          formik.setFieldValue(
                            `domicilio`,
                            clients.find((c) => c.telefono === value).domicilio
                          );
                        } else {
                          formik.setFieldValue(`nombre`, "");
                          formik.setFieldValue(`domicilio`, "");
                        }
                      } else {
                        formik.setFieldValue(`telefono`, "");
                      }
                    }}
                    name="telefono"
                    ListboxProps={{ style: { maxHeight: "3em" } }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Para un nuevo teléfono, escríbelo y presiona ENTER"
                        error={
                          !!(formik.errors.telefono && !formik.values.telefono)
                        }
                        helperText={
                          !!(
                            formik.errors.telefono && !formik.values.telefono
                          ) && formik.errors.telefono
                        }
                      />
                    )}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="nombre"
                  >
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    placeholder="Nombre del cliente"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                  />
                  {formik.touched.nombre && formik.errors.nombre && (
                    <FormHelperText className={classes.helper}>
                      {formik.errors.nombre}
                    </FormHelperText>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="domicilio"
                  >
                    Domicilio
                  </label>
                  <input
                    id="domicilio"
                    placeholder="Domicilio del Cliente"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                    value={formik.values.domicilio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                  />
                  {formik.touched.domicilio && formik.errors.domicilio && (
                    <FormHelperText className={classes.helper}>
                      {formik.errors.domicilio}
                    </FormHelperText>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="nombreOrden"
                  >
                    Orden a nombre de: (opcional)
                  </label>
                  <input
                    id="nombreOrden"
                    placeholder="Nombre para la orden"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                    value={formik.values.nombreOrden}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                  />
                </div>
              </form>
            </div>
          </div>
          <SweetAlert
            warning
            confirmBtnText="Ok"
            confirmBtnBsStyle="primary"
            title="El cliente ya tiene una comanda activa"
            show={showAlert}
            onConfirm={() => setShowAlert(false)}
            closeOnClickOutside
            cancelBtnBsStyle="danger"
          ></SweetAlert>
        </div>
      ) : (
        <h1 className="text-center flex">
          No cuentas con los permisos para ver esta página
        </h1>
      )}
    </>
  );
};

export default FormUsuario;
