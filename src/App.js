import React, { useState } from "react";
import { Route, Routes } from "react-router";

import firebase, { FirebaseContext } from "./firebase";
import PedidoState from "./context/pedidos/pedidosState";

import Login from "./components/paginas/Login";

import Menu from "./components/paginas/Menu";
import NuevoPlatillo from "./components/paginas/NuevoPlatillo";
import EditarPlatillo from "./components/paginas/EditarPlatillo";
import MenuMostrar from "./components/paginas/MenuMostrar";
import Ordenes from "./components/paginas/Ordenes";
import Completadas from "./components/paginas/Completadas";
import MasVendidos from "./components/paginas/MasVendidos";

import ProgresoPedido from "./components/paginas/ProgresoPedido";
import Comanda from "./components/paginas/Comanda";

import Sidebar from "./components/ui/Sidebar";

function App() {
  const [usuario, setUsuario] = useState(false);

  firebase.auth.onAuthStateChanged((user) => {
    if (user) {
      if (!user.isAnonymous) {
        //hay usuario NO Anonimo
        setUsuario(true);
      } else {
        setUsuario(false);
      }
    } else {
      setUsuario(false);
    }
  });

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        usuario,
      }}
    >
      <PedidoState>
        <div className="md:flex min-h-screen">
          {usuario ? <Sidebar /> : null}
          <div className="w-full">
            <Routes>
              {usuario ? (
                <Route exact path="/" element={<Ordenes />} />
              ) : (
                <Route exact path="/" element={<Login />} />
              )}

              <Route path="/menu" element={<Menu />} />
              <Route path="/nuevo-platillo" element={<NuevoPlatillo />} />
              <Route path="/completadas" element={<Completadas />} />
              {/* <Route path="/totales" element={<Totales />} /> */}
              <Route path="/mas-vendidos" element={<MasVendidos />} />
              <Route
                path="/menu/editar/:nombre/:precio/:categoria/:descripcion"
                element={<EditarPlatillo />}
                end
              />

              <Route path="/menu-digital" element={<MenuMostrar />} />

              <Route
                path="/menu-digital/progreso"
                element={<ProgresoPedido />}
              />
              <Route path="/menu-digital/comanda" element={<Comanda />} />
            </Routes>
          </div>
        </div>
      </PedidoState>
    </FirebaseContext.Provider>
  );
}

export default App;
