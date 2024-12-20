import logo from "../assets/images/logotipo.svg";
function DashboardFooter() {
  return (
    <div className="row align-items-center dashboard-copyright-content pb-4 footer">
      <div className="col-lg-6">
        <p className="copy-desc d-flex aling-items-center">
          <img src={logo} width={"15px"} style={{marginRight: "3px"}} /> Glomind &copy; 2024. Todos los derechos reservados.
        </p>
      </div>
      <div className="col-lg-6">
        <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14 justify-content-end">
          <li className="mr-3">
            <a href="#">Terminos y condiciones</a>
          </li>
          <li>
            <a href="#">Políticas de privacidad</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardFooter;
