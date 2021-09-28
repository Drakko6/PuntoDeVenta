import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PedidoContext from "../../context/pedidos/pedidosContext";

const BotonResumen = ({ setModalAbierto }) => {
  const navigate = useNavigate();

  //leer el objeto de pedido
  const { pedido } = useContext(PedidoContext);

  if (pedido.length === 0) return null;

  return (
    <button
      className=" border-white border-4 p-1 bg-orange-500  text-white col-span-1"
      onClick={() =>
        // navigate("/menu-digital/resumen-pedido")
        setModalAbierto(true)
      }
    >
      Ir a Pedido
    </button>
  );
};

export default BotonResumen;
