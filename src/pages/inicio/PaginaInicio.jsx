import DashboardArea from "../../components/DashboardArea";
import DashboardHeader from "../../components/DashboardHeader";
import FormularioInicio from "./FormularioInicio";

const PaginaInicio = () => {
  
  return (
    <>
      <>
        <DashboardHeader />
        <DashboardArea>
          <FormularioInicio />
        </DashboardArea>
      </>
    </>
  );
};

export default PaginaInicio;
