import DashboardHeader from "./DashboardHeader";
import DashboardArea from "./DashboardArea";
import FormularioEditarPerfil from "./FormularioEditarPerfil";

function PaginaEditarPerfil() {
  return (
    <>
      <DashboardHeader />
      <DashboardArea>
        {/* <DashboardMenu /> */}
        <FormularioEditarPerfil />
      </DashboardArea>
    </>
  );
}

export default PaginaEditarPerfil;
