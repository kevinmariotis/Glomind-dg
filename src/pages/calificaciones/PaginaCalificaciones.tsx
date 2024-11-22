import React from "react";
import DashboardArea from "../../components/DashboardArea";
import DashboardHeader from "../../components/DashboardHeader";
import FomularioCalificaciones from "./FomularioCalificaciones";

const PaginaCalificaciones = () => {
  return (
    <>
      <DashboardHeader />
      <DashboardArea>
        <FomularioCalificaciones />
      </DashboardArea>
    </>
  );
};

export default PaginaCalificaciones;
