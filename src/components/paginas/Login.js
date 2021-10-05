import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const lanzarError = () =>
    toast.error("Usuario o contraseña incorrectos", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const { firebase } = useContext(FirebaseContext);

  const formik = useFormik({
    initialValues: {
      correo: "",
      password: "",
    },
    validationSchema: Yup.object({
      correo: Yup.string()
        .email("Correo inválido")
        .required("El correo es obligatorio"),
      password: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .required("Contraseña requerida"),
    }),
    onSubmit: (usuario) => {
      try {
        //autenticar

        firebase.auth
          .signInWithEmailAndPassword(usuario.correo, usuario.password)
          .catch((error) => {
            //Toast con usuario o contraseña incorrectas
            lanzarError();
          });

        firebase.auth.onAuthStateChanged((user) => {
          if (user) {
            //hay usuario, redireccionar

            navigate("/");
          } else {
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="p-10  justify-center bg-blue-700 w-full h-screen">
      <h1 className="text-3xl font-light mb-4 text-center text-white">
        Tortas Chícharo - Punto de Venta
      </h1>
      <h1 className="text-xl  mb-4 text-center text-gray-900">
        Inicia sesión para administrar las ventas
      </h1>

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-3xl text-center">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4 text-center">
              <label
                className="block text-gray-200 text-sm font-bold mb-2"
                htmlFor="correo"
              >
                Correo
              </label>
              <input
                id="correo"
                placeholder="Correo"
                type="text"
                className="text-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                value={formik.values.correo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
              />
            </div>
            {formik.touched.correo && formik.errors.correo ? (
              <div
                role="alert"
                className=" text-center mb-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
              >
                <p className="font-bold">Hubo un error</p>
                <p>{formik.errors.correo}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className=" text-center  block text-gray-200 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                id="password"
                placeholder="Contraseña"
                type="password"
                className=" text-center  shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
              />
            </div>

            {formik.touched.password && formik.errors.password ? (
              <div
                role="alert"
                className=" text-center mb-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
              >
                <p className="font-bold">Hubo un error</p>
                <p>{formik.errors.password}</p>
              </div>
            ) : null}

            <input
              value="Ingresar"
              type="submit"
              className="uppercase bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white font-bold"
            />
          </form>

          <ToastContainer />

          {/* <button
            onClick={() => navigate("/menu")}
            type="submit"
            className="text-center text-xl mt-8 mb-4  text-blue-200 hover:text-blue-300  uppercase "
          >
            Registrar cuenta
          </button>
        */}
        </div>
      </div>
    </div>
  );
};

export default Login;
