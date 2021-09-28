import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "../../assets/styles.css";
import PedidoContext from "../../context/pedidos/pedidosContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(true);

  const { firebase } = useContext(FirebaseContext);
  const { guardarIDComanda, iniciarNuevaOrden, guardarClienteActual } =
    useContext(PedidoContext);

  const cerrarSesion = () => {
    firebase.auth
      .signOut()
      .then(() => {
        navigate("/");
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  const mostrarMenu = () => {
    setMenu(!menu);
  };
  return (
    <>
      <div className="hidden md:block md:w-2/5 xl:w-1/5 bg-gray-800 oculto-impresion">
        <div className="p-6">
          <p className="uppercase text-white text-xl tracking-wide text-center font-bold">
            Tortas Chícharo
          </p>

          <nav className="mt-5 flex justify-center">
            <NavLink
              className="p-3 text-center text-black  bg-yellow-500 text-xl hover:bg-yellow-300 active:bg-yellow-600"
              activeClassName="text-black-500"
              end
              to="/menu-digital"
              onClick={() => {
                iniciarNuevaOrden("");
                guardarIDComanda("");
                guardarClienteActual(null);
              }}
            >
              Nuevo Pedido
            </NavLink>
          </nav>

          <p className="mt-3 text-gray-600 text-center ">
            Administra tu restaurant
          </p>

          <nav className="mt-5">
            <NavLink
              className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
              activeClassName="text-yellow-500"
              end
              to="/"
            >
              Pedidos/Comandas
            </NavLink>

            <NavLink
              className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
              activeClassName="text-yellow-500"
              end
              to="/menu"
            >
              Modificar Menú
            </NavLink>
          </nav>

          <div className="mt-5 text-gray-300 block">
            <p className="mt-3 text-gray-600 ">Otras Opciones</p>
          </div>
          <nav>
            <NavLink
              className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
              activeClassName="text-yellow-500"
              end
              to="/completadas"
            >
              Completadas del día
            </NavLink>
            <NavLink
              className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
              activeClassName="text-yellow-500"
              end
              to="/mas-vendidos"
            >
              Más Vendidos
            </NavLink>
            <NavLink
              className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
              activeClassName="text-yellow-500"
              end
              to="/totales"
            >
              Totales
            </NavLink>
          </nav>

          <div className="mt-8 p-1 text-gray-400 block hover:bg-red-800 ">
            <button onClick={() => cerrarSesion()} type="submit">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* para movil*/}

      <div className="block md:hidden z-10 oculto-impresion">
        <button className="bg-gray-200 p-5" onClick={() => mostrarMenu()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              className="heroicon-ui"
              d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
            />
          </svg>
        </button>
      </div>

      {menu ? null : (
        <div className=" block w-6/12 md:hidden bg-gray-800 z-10 ">
          <div className="p-1">
            <nav className="mt-1">
              <NavLink
                className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
                activeClassName="text-yellow-500"
                end
                to="/"
                onClick={() => setMenu(!menu)}
              >
                Órdenes
              </NavLink>

              <NavLink
                className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
                activeClassName="text-yellow-500"
                end
                to="/menu"
                onClick={() => setMenu(!menu)}
              >
                Modificar Menú
              </NavLink>
            </nav>

            <div className="mt-2 text-gray-300 block">
              <p className="text-gray-600 ">Otras Opciones</p>
            </div>
            <nav>
              <NavLink
                className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
                activeClassName="text-yellow-500"
                end
                to="/completadas"
                onClick={() => setMenu(!menu)}
              >
                Completadas del día
              </NavLink>
              <NavLink
                className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
                activeClassName="text-yellow-500"
                end
                to="/mas-vendidos"
                onClick={() => setMenu(!menu)}
              >
                Más Vendidos
              </NavLink>
              <NavLink
                className="p-1 text-gray-400 block hover:bg-yellow-500 hover:text-gray-900"
                activeClassName="text-yellow-500"
                end
                to="/totales"
                onClick={() => setMenu(!menu)}
              >
                Totales
              </NavLink>
            </nav>

            <div className="mt-3 p-1 text-gray-400 block hover:bg-red-800 ">
              <button onClick={() => cerrarSesion()} type="submit">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
