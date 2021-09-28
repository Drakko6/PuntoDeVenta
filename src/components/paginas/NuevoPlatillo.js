import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase";
import { useNavigate } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";

const NuevoPlatillo = () => {
  //state para imagenes
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlimagen, setUrlimagen] = useState("");

  //Context con las operaciones de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  //Hook para redireccionar
  const navigate = useNavigate();

  //validacion y leer formulario
  const formik = useFormik({
    initialValues: {
      nombre: "",
      precio: "",
      categoria: "",
      imagen: "",
      descripcion: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .min(3, "Los platillos deben tener al menos 3 caracteres")
        .required("El nombre del platillo es obligatorio"),
      precio: Yup.number()
        .min(1, "Debes agregar un número")
        .required("El precio es obligatorio"),

      categoria: Yup.string().required("La categoría es obligatoria"),
      descripcion: Yup.string()
        .min(10, "La descripción debe ser más larga")
        .required("La descripción del platillo es obligatoria"),
    }),
    onSubmit: async (platillo) => {
      try {
        platillo.existencia = true;
        platillo.imagen = urlimagen;
        platillo.vendidos = 0;

        //hacer el objeto menu si no existe, si sí, actualizar
        await firebase.db
          .collection("productos")
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.docs.length === 0) {
              //si no existe, crear el menu

              const menu = {
                productos: [platillo],
              };
              firebase.db.collection("productos").add(menu);
            } else {
              //si existe el menu, sacar los productos y agregar el platillo al array
              let productosActualizados =
                querySnapshot.docs[0].data().productos;
              productosActualizados.push(platillo);

              firebase.db
                .collection("productos")
                .doc(querySnapshot.docs[0].id)
                .update({
                  productos: firebase.firestore.FieldValue.arrayUnion(platillo),
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });

        //firebase.db.collection("productos").add(platillo);

        //redireccionar
        navigate("/menu");
      } catch (error) {
        console.log(error);
      }
    },
  });

  //Imagenes
  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };
  const handleUploadError = (error) => {
    setSubiendo(false);
    console.log(error);
  };

  const handleUploadSuccess = async (nombre) => {
    setProgreso(100);
    setSubiendo(false);

    //almacenar la url de destino
    const url = await firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL();

    console.log(url);
    setUrlimagen(url);
  };
  const handleProgress = (progreso) => {
    setProgreso(progreso);
    //console.log(progreso);
  };
  return (
    <>
      {usuario ? (
        <div>
          <h1 className="text-3xl font-light mb-4">Agregar Platillo</h1>
          <div className="flex justify-center mt-10">
            <div className="w-full max-w-3xl">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="nombre"
                  >
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    placeholder="Nombre de Platillo"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.nombre && formik.errors.nombre ? (
                  <div
                    role="alert"
                    className="mb-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                  >
                    <p className="font-bold">Hubo un error</p>
                    <p>{formik.errors.nombre}</p>
                  </div>
                ) : null}

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="precio"
                  >
                    Precio
                  </label>
                  <input
                    id="precio"
                    placeholder="$20"
                    min="0"
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                    value={formik.values.precio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                {formik.touched.precio && formik.errors.precio ? (
                  <div
                    role="alert"
                    className="mb-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                  >
                    <p className="font-bold">Hubo un error</p>
                    <p>{formik.errors.precio}</p>
                  </div>
                ) : null}

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="categoria"
                  >
                    Categoría
                  </label>
                  <select
                    id=""
                    name="categoria"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                    value={formik.values.categoria}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">-- Seleccione --</option>
                    <option value="entrada">Entrada</option>
                    <option value="desayuno">Desayuno</option>
                    <option value="comida">Comida</option>
                    <option value="cena">Cena</option>
                    <option value="bebida">Bebidas</option>
                    <option value="postre">Postre</option>
                    <option value="ensalada">Ensalada</option>
                  </select>
                </div>

                {formik.touched.categoria && formik.errors.categoria ? (
                  <div
                    role="alert"
                    className="mb-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                  >
                    <p className="font-bold">Hubo un error</p>
                    <p>{formik.errors.categoria}</p>
                  </div>
                ) : null}

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="imagen"
                  >
                    Imagen
                  </label>
                  <FileUploader
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </div>

                {subiendo && (
                  <div className="h-12 w-full relative border">
                    <div
                      style={{ width: `${progreso}%` }}
                      className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                    >
                      {progreso} %
                    </div>
                  </div>
                )}

                {urlimagen && (
                  <p className="bg-green-500 text-white p-3 text-center my-5">
                    La imagen se subió correctamente
                  </p>
                )}

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="descripcion"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    placeholder="Descripción del platillo"
                    className="h-40 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                    value={formik.values.descripcion}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea>
                </div>

                {formik.touched.descripcion && formik.errors.descripcion ? (
                  <div
                    role="alert"
                    className="mb-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                  >
                    <p className="font-bold">Hubo un error</p>
                    <p>{formik.errors.descripcion}</p>
                  </div>
                ) : null}

                <input
                  value="Agregar Platillo"
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white font-bold"
                />
              </form>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center flex">
          No cuentas con los permisos para ver esta página{" "}
        </h1>
      )}
    </>
  );
};

export default NuevoPlatillo;
