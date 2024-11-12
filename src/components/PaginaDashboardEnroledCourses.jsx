import DashboardHeader from "./DashboardHeader";
import DashboardArea from "./DashboardArea";
import FormularioDashboardEnroledCourses from "./FormularioDashboardEnroledCourses";

function PaginaDashboardEnroledCourses() {
  return (
    <>
      <DashboardHeader />
      <DashboardArea>
        <FormularioDashboardEnroledCourses />
      </DashboardArea>
    </>
  );
}

export default PaginaDashboardEnroledCourses;
