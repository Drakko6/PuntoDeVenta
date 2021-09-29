import React, { Fragment } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";

import Orden from "./Orden";

const ComandaCompletada = ({ comanda, cliente }) => {
  return (
    <div className=" mb-2 ml-3 ">
      <div className="grid grid-cols-6 p-2 shadow-md bg-white text-center items-center">
        <p className="text-gray-700 font-bold col-span-1">{cliente.nombre}</p>
        <p className="text-gray-700 font-bold col-span-2">
          {cliente.domicilio}
        </p>
        <p className="text-gray-700 font-bold col-span-1">
          {new Date(comanda.creada).toLocaleString("es-ES", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <p className="text-gray-700 font-bold col-span-1">$ {comanda.total}</p>

        <div className="flex  col-span-1">
          <Accordion style={{ width: "100%" }}>
            <AccordionSummary
              style={{ margin: 0 }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>
                {comanda.ordenes.length}{" "}
                {comanda.ordenes.length > 1 ? "Órdenes" : "Orden"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{ display: "block", width: "100%", padding: 0 }}
            >
              {comanda.ordenes.map((orden, i) => (
                <Fragment key={i}>
                  <div className="flex">
                    <p className="font-bold p-2 text-yellow-600">{orden.num}</p>
                    <Orden key={i} orden={orden} />
                  </div>

                  <Divider />
                </Fragment>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ComandaCompletada;
