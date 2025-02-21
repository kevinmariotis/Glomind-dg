import DashboardArea from "../../components/DashboardArea";
import DashboardHeader from "../../components/DashboardHeader";
import FormularioPeriodos from "./FormularioPeriodos";

const PaginaPeriodos = () => {
  return (
    <>
      <DashboardHeader />
      <DashboardArea>
        <FormularioPeriodos />
      </DashboardArea>
    </>
  );
};

export default PaginaPeriodos;
