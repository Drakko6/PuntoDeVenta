import React, { useState, useEffect, useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import _ from "lodash";
import Platillo from "../ui/Platillo";

const scrollToRef = (ref) => window.scrollTo(0, ref.offsetTop - 100);

const Menu = () => {
  const referencias = [];
  const hacerScroll = (categoria) => {
    referencias.forEach((ref) => {
      if (ref.textContent === categoria) {
        scrollToRef(ref);
      }
    });
  };

  const [platillos, setPLatillos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [platillosAgrupados, setPlatillosAgrupados] = useState([]);

  const { firebase, usuario } = useContext(FirebaseContext);

  //CONSULTAR BD al cargar
  useEffect(() => {
    const obtenerPlatillos = async () => {
      //hacer con get
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
            //arreglo ordenado a eleccion del cliente
            let categorias = [
              "entrada",
              "desayuno",
              "comida",
              "cena",
              "bebida",
              "postre",
              "ensalada",
            ];

            let platillosAgrupados = [];

            let categoriasEncontradas = [];
            //sacar categorias de los platillos para eliminar las que no tengan
            menu[0].productos.forEach((platillo) => {
              //si no se encuentra un platillo con categoria, borrar
              if (
                !categoriasEncontradas.find(
                  (plat) => plat === platillo.categoria
                )
              ) {
                categoriasEncontradas.push(platillo.categoria);
              }
            });

            categorias = categorias.filter(
              (categoria) =>
                categoria ===
                categoriasEncontradas.find((cat) => cat === categoria)
            );

            //llenar arreglo con objetos de categorias
            categorias.forEach((categoria) => {
              platillosAgrupados.push({
                categoria: categoria,
                platillos: [],
              });
            });

            //agrupar platillos por categoria
            menu[0].productos.forEach((platillo) => {
              platillosAgrupados.forEach((categoria) => {
                if (categoria.categoria === platillo.categoria) {
                  categoria.platillos.push(platillo);
                }
              });
            });

            //ordenar los arreglos de cada categoría
            //en orden alfabético

            platillosAgrupados.forEach((categoria) => {
              categoria.platillos = _.orderBy(
                categoria.platillos,
                [(platillo) => platillo.nombre.toUpperCase()],
                "asc"
              );
            });

            setCategorias(categorias);

            //setPLatillos(platillos);

            setPlatillosAgrupados(platillosAgrupados);
            // //ALMACENA RESULTADOS EN EL STATE
            // setPLatillos(platillos);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      //firebase.db.collection("productos").onSnapshot(handleSnapshot);
    };
    if (usuario) {
      obtenerPlatillos();
    }
  }, []);

  // //Snapshot nos permite utilizar la BD en tiempo real
  // function handleSnapshot(snapshot) {
  //   const platillos = snapshot.docs.map((doc) => {
  //     return {
  //       id: doc.id,
  //       ...doc.data(),
  //     };
  //   });
  //   //ALMACENA RESULTADOS EN EL STATE
  //   setPLatillos(platillos);
  // }

  const mostrarCategoria = (categoria) => {
    return (
      <button
        className="p-2 text-gray-600 hover:bg-blue-300 hover:text-white"
        onClick={() => hacerScroll(categoria)}
      >
        {categoria}
      </button>
    );
  };

  const mostrarHeading = (categoria) => {
    return (
      <div
        ref={(ref) => referencias.push(ref)}
        className="  mb-3 p-2
          text-white bg-blue-800  uppercase font-bold text-center text-xs border-t-2 border-b-2"
      >
        <p>{categoria}</p>
      </div>
    );
  };

  //state para aparecer boton hacia arriba
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  window.addEventListener("scroll", checkScrollTop);

  return (
    <>
      {usuario ? (
        <div>
          <h1 className="text-3xl font-light mb-4 text-center">
            Modificar Menú
          </h1>
          <div className=" text-center">
            <Link
              to="/nuevo-platillo"
              className="bg-blue-800 hover:bg-blue-700 inline-block mb-5 p-2
            text-white uppercase font-bold text-center "
            >
              Agregar Platillo
            </Link>
          </div>
          <div className="sticky top-0 grid">
            {showScroll ? (
              <button
                className="rounded-lg p-1 bg-indigo-600 text-white text-center text-xs md:text-sm "
                onClick={() => window.scrollTo(0, 0)}
              >
                Ir Arriba
              </button>
            ) : null}
            <div className="sticky top-0 bg-white  md:block  md:overflow-visible flex flex-no-wrap overflow-x-scroll md:flex-wrap h-10  align-middle text-center text-sm">
              {categorias.map((categoria, i) => (
                <Fragment key={i}>{mostrarCategoria(categoria)}</Fragment>
              ))}
            </div>
          </div>

          {platillosAgrupados.map((categoria, i) => (
            <div key={i}>
              {mostrarHeading(categoria.categoria)}

              {categoria.platillos.map((platillo, i) => {
                return <Platillo key={i} platillo={platillo} />;
              })}
            </div>
          ))}
        </div>
      ) : (
        <h1 className="text-center flex">
          No cuentas con los permisos para ver esta página{" "}
        </h1>
      )}
    </>
  );
};

export default Menu;
