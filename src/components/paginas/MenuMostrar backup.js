import React, {
  useContext,
  useState,
  useEffect,
  Fragment,
  useRef,
} from "react";
import PlatilloMostrar from "../ui/PlatilloMostrar";
import BotonResumen from "../ui/BotonResumen";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

//Contexts
import { FirebaseContext } from "../../firebase";
import PedidoContext from "../../context/pedidos/pedidosContext";

const scrollToRef = (ref) => window.scrollTo(0, ref.offsetTop - 40);

const MenuMostrar = () => {
  //const [referencias, setReferencias] = useState([]);

  const referencias = [];
  const hacerScroll = (categoria) => {
    referencias.forEach((ref) => {
      if (ref.textContent === categoria) {
        scrollToRef(ref);
      }
    });
  };

  const navigate = useNavigate();

  const [platillos, setPLatillos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [platillosAgrupados, setPlatillosAgrupados] = useState([]);

  //state que verifica si hay mesa Activa
  const [hayMesa, setHayMesa] = useState(false);

  const { firebase } = useContext(FirebaseContext);

  const {
    seleccionarPlatillo,
    obtenerOrdenesdelDia,
    idorden,
    mesaActiva,
    obtenerComanda,
  } = useContext(PedidoContext);

  //CONSULTAR BD al cargar
  useEffect(() => {
    firebase.auth.signInAnonymously().catch(function (error) {
      // Handle Errors here.
      console.log(error);
      // ...s
    });

    const verificarMesaActiva = async () => {
      if (mesaActiva) {
        //revisar en firebase si existe
        await firebase.db
          .collection("comandas")
          .where("activa", "==", true)
          .where("mesa", "==", mesaActiva)
          .onSnapshot(manejarSnapshot);

        function manejarSnapshot(snapshot) {
          let comandaObj = snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });

          if (comandaObj.length > 0) {
            //hay una comanda activa con esa mesa

            //obtener comanda para el state
            obtenerComanda(mesaActiva);
            setHayMesa(true);
          } else {
            setHayMesa(false);
          }
        }
      }
    };

    verificarMesaActiva();

    obtenerOrdenesdelDia();
    const obtenerPlatillos = () => {
      firebase.db
        .collection("productos")
        .where("existencia", "==", true) //solo los que esten en existencia
        .onSnapshot(manejarSnapshot);
    };
    obtenerPlatillos();
  }, []);

  //Snapshot nos permite utilizar la BD en tiempo real
  function manejarSnapshot(snapshot) {
    let platillos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

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
    platillos.forEach((platillo) => {
      //si no se encuentra un platillo con categoria, borrar
      if (!categoriasEncontradas.find((plat) => plat === platillo.categoria)) {
        categoriasEncontradas.push(platillo.categoria);
      }
    });

    categorias = categorias.filter(
      (categoria) =>
        categoria === categoriasEncontradas.find((cat) => cat === categoria)
    );

    //llenar arreglo con objetos de categorias
    categorias.forEach((categoria) => {
      platillosAgrupados.push({
        categoria: categoria,
        platillos: [],
      });
    });

    //agrupar platillos por categoria
    platillos.forEach((platillo) => {
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
  }

  const mostrarHeading = (categoria, i) => {
    return (
      <div
        ref={(ref) => referencias.push(ref)}
        className="  mb-2 p-2
          text-black uppercase font-bold text-center text-xs border-t-2 border-b-2"
      >
        <p>{categoria}</p>
      </div>
    );
  };

  const mostrarCategoria = (categoria) => {
    return (
      <button
        className="p-2 text-gray-600 "
        onClick={() => hacerScroll(categoria)}
      >
        {categoria}
      </button>
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
    <div>
      <div className="grid grid-cols-5  bg-yellow-500 p-2  ">
        <div className="col-span-1">
          <img
            className="object-scale-down"
            src={require("../../assets/logotortas.png")}
          />
        </div>
        <h1 className="pt-5  align-bottom text-center col-span-3 font-semibold">
          Tortas Ahogadas Chícharo
        </h1>
        <BotonResumen />
      </div>

      <div className="sticky top-0 grid">
        {showScroll ? (
          <button
            className="rounded-lg p-1 bg-indigo-600 text-white text-center text-xs md:text-sm "
            onClick={() => window.scrollTo(0, 0)}
          >
            Ir a Arriba
          </button>
        ) : null}

        <div className="sticky top-0 bg-white md:h-20 md:block  md:overflow-visible flex flex-no-wrap overflow-x-scroll md:flex-wrap h-14  align-middle text-center text-sm">
          {categorias.map((categoria, i) => (
            <Fragment key={i}>{mostrarCategoria(categoria)}</Fragment>
          ))}
        </div>
      </div>

      {platillosAgrupados.map((categoria, i) => (
        <Fragment key={i}>
          {mostrarHeading(categoria.categoria)}

          {categoria.platillos.map((platillo) => (
            <div
              key={platillo.id}
              className="hover:opacity-75"
              onClick={() => {
                seleccionarPlatillo(platillo);
                navigate("/menu-digital/detalle-platillo");
              }}
            >
              <PlatilloMostrar platillo={platillo} />
            </div>
          ))}
        </Fragment>
      ))}

      {idorden ? (
        <button
          className="bg-blue-500 p-3 uppercase text-white justify-center flex w-full mt-12 sticky bottom-0 z-10"
          onClick={() => navigate("/menu-digital/progreso")}
        >
          <p>Volver a progreso de tu Orden</p>
        </button>
      ) : null}
      {hayMesa ? (
        <button
          className="bg-green-500 p-3 uppercase text-white justify-center flex w-full mt-12 sticky bottom-0 z-10"
          onClick={() => navigate("/menu-digital/comanda")}
        >
          <p>Volver a resumen de tu Mesa</p>
        </button>
      ) : null}
    </div>
  );
};

export default MenuMostrar;
