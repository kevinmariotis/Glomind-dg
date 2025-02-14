import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function DashboardMenu() {
  const location = useLocation();

  const urlBase = import.meta.env.VITE_URL_BASE;
  const currentMenu = location.pathname;
  const { permissions, esMovil, esDocente } = useContext(AuthContext);
  const [isSm, setIsSm] = useState(false);

  const validarPermisos = (lista = []) => {
    let retornar = false;
    lista.forEach(function (element) {
      if (permissions[element] === 1) {
        retornar = true;
      }
    });
    return retornar;
  };

  const getIsSm = () => {
    console.log(location.pathname?.split("/"));
    if (location.pathname?.split("/")[1] === "play" || esMovil) {
      setIsSm(true);
    } else {
      setIsSm(false);
    }
  };

  useEffect(() => {
    getIsSm();
  }, [location]);

  return (
    <div
      className={`off-canvas-menu dashboard-off-canvas-menu off--canvas-menu custom-scrollbar-styled pt-20px ${
        isSm ? "sidebar-sm" : "sidebar-lg"
      }`}
    >
      <div
        className="off-canvas-menu-close dashboard-menu-close icon-element icon-element-sm shadow-sm"
        data-toggle="tooltip"
        data-placement="left"
        title="Close menu"
      >
        <i className="la la-times"></i>
      </div>
      <div className="logo-box px-4 mt-3">
        <Link to="/" className="logo">
          <img
            src={`${urlBase}/images/logo_principal.png`}
            alt="logo"
            className="logo-sm"
          />
        </Link>
      </div>
      <ul className="generic-list-item off-canvas-menu-list off--canvas-menu-list pt-35px list-sm">
        <li className={currentMenu === "/" ? "page-active" : ""}>
          <Link to="/">
            <i className="la la-home mr-2"></i> <span>Inicio</span>
          </Link>
        </li>
        <li
          className={
            currentMenu === "/cursos/matriculados" ? "page-active" : ""
          }
        >
          <Link to="/cursos/matriculados">
            <i className="la la-book mr-2"></i> <span>{esDocente ? "Cursos Asignados" : "Mis cursos"}</span>
          </Link>
        </li>
        {/* <li className={currentMenu === '/cursos/favoritos' ? 'page-active' : ''}><Link to="/cursos/favoritos"><svg className="mr-2" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg> Curso Favoritos</Link></li> */}
        {/* <li className={currentMenu === '/factura/historial' ? 'page-active' : ''} ><Link to="/factura/historial"><svg className="mr-2" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg> Historial de compras</Link></li> */}
        {validarPermisos([20, 21, 22, 66, 67, 44]) && (
          <li
            className={
              currentMenu === "/cursos" ||
              currentMenu === "/curso/crear" ||
              currentMenu.includes("/curso/editar") ||
              currentMenu.includes("/curso/contenido") ||
              currentMenu.includes("/curso/videopreview") ||
              currentMenu.includes("/curso/imagen") ||
              currentMenu.includes("/examen/") ||
              currentMenu.includes("/curso/usuarios")
                ? "page-active"
                : ""
            }
          >
            <Link to="/cursos">
              <i className="la la-th-large mr-2"></i>{" "}
              <span>Cursos del sistema</span>
            </Link>
          </li>
        )}
        {validarPermisos([26, 27, 28]) && (
          <li
            className={
              currentMenu === "/video" ||
              currentMenu === "/video/crear" ||
              currentMenu.includes("/video/editar")
                ? "page-active"
                : ""
            }
          >
            <Link to="/video">
              <i className="la la la-video-camera mr-2"></i> <span>Video</span>
            </Link>
          </li>
        )}
        {!esDocente && (
          <li
            className={currentMenu === "/calificaciones" ? "page-active" : ""}
          >
            <Link to="/calificaciones">
              <i className="la la-book mr-2"></i>
              <span>Mis calificaciones</span>
            </Link>
          </li>
        )}
        <li className={currentMenu === "/usuario/editar" ? "page-active" : ""}>
          <Link to="/usuario/editar">
            <i className="la la-user mr-2"></i>
            <span>Mi Cuenta</span>
          </Link>
        </li>
        {validarPermisos([11, 12, 13, 37, 38, 39, 40, 41, 42]) && (
          <li className={currentMenu === "/permisos" ? "page-active" : ""}>
            <Link to="/permisos">
              <i className="la la-user-plus mr-2"></i>{" "}
              <span>Perfiles y permisos</span>
            </Link>
          </li>
        )}
        {validarPermisos([14, 15, 16, 50, 5, 52, 53, 54, 55, 56, 57, 58]) && (
          <li
            className={currentMenu === "/categoriasistema" ? "page-active" : ""}
          >
            <Link to="/categoriasistema">
              <i className="la la-tag mr-2"></i>
              <span>Categorías y Tags</span>
            </Link>
          </li>
        )}
        {validarPermisos([17, 18, 19]) && (
          <li className={currentMenu === "/usuario" ? "page-active" : ""}>
            <Link to="/usuario">
              <i className="la la-user-secret mr-2"></i>
              <span>Usuarios</span>
            </Link>
          </li>
        )}
        {/* {validarPermisos([76]) && <li className={currentMenu === '/factura' ? 'page-active' : ''}><Link to="/factura"><svg className="mr-2" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg> Compras y facturas</Link></li>} */}
        {/* {validarPermisos([61, 62 ,63]) && <li className={currentMenu === '/cupon' || currentMenu === '/cupon/crear' || currentMenu.includes('/cupon/editar') ? 'page-active' : ''}><Link to="/cupon"><svg className="mr-2" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg> Cupones</Link></li>} */}
        {validarPermisos([31, 32, 33]) && (
          <li
            className={
              currentMenu === "/certificado" ||
              currentMenu === "/certificado/crear" ||
              currentMenu.includes("/certificado/editar")
                ? "page-active"
                : ""
            }
          >
            <Link to="/certificado">
              <i className="la la-certificate mr-2"></i>
              <span>Certificados</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default DashboardMenu;
