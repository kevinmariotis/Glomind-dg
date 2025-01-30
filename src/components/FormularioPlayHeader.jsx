/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import Spinner from "./Spinner";
import SpamError from "./SpamError";
import Popup from "./Popup";
import { mensajesDeError } from "./utils";
import Dropdown from "./Dropdown";

function FormularioPlayHeader({
  id_curso = -1,
  nombre_curso = "",
  tipo = "",
  favorito = -1,
  archivado = -1,
  tiene_review = -1,
  porcentaje_progreso = -1,
  instructor_edita_contenido = false,
  curso_url_amigable = null,
  es_docente = false,
  callBackFavoritoCambiado = () => {},
}) {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const urlBase = import.meta.env.VITE_URL_BASE;
  const navigate = useNavigate();
  const { jwt, esMovil, temaActual, setTemaActual } = useContext(AuthContext);
  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [mostrarModalRating, setMostrarModalRating] = useState(false);
  // const [mostrarErroresModalRating, setMostrarErroresModalRating] = useState({calificacion:false, comentario:false});
  const [resena, setResena] = useState({ calificacion: -1, mensaje: "" });

  useEffect(() => {
    console.log(Popup);
    window.scrollTo(0, 0);
  }, []);

  const handleThemeToggle = () => {
    if (temaActual == 1) {
      setTemaActual(0);
    } else {
      setTemaActual(1);
    }
  };

  //manejo de errores:
  //Estados de los errores de campos
  const camposErrores = {
    calificacion: [],
    comentario: [],
  };
  const [erroresCampos, setErrorCampo] = useState(camposErrores);
  const setErrorCampoGlobal = (index, newValue) => {
    if (index in erroresCampos) {
      setErrorCampo((prevState) => ({
        ...prevState,
        [index]: [...(prevState[index] || []), newValue],
      }));
    }
  };
  const reiniciarErrorCampoGlobal = () => {
    setErrorCampo(camposErrores);
    for (let propiedad in erroresCampos) {
      if (Array.isArray(erroresCampos[propiedad])) {
        erroresCampos[propiedad] = [];
      }
    }
  };

  //popup
  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };
  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  //reseña
  const handleCalificacionResena = (event) => {
    setResena({ ...resena, calificacion: event.target.dataset.valor });
  };
  const handleMensajeResena = (event) => {
    setResena({ ...resena, mensaje: event.target.value });
  };
  const enviarResenaSevidor = async (event) => {
    event.preventDefault();
    reiniciarErrorCampoGlobal();
    const formData = new FormData();
    formData.append("id_curso", id_curso);
    formData.append("calificacion", resena.calificacion);
    formData.append("comentario", resena.mensaje);
    const opciones = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    };
    try {
      setMostrarSpinner(true);
      const response = await fetch(`${urlBaseApi}/api/cursoreview`, opciones);
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setMostrarModalRating(false);
        setResena({ ...resena, calificacion: -1, mensaje: "" });
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "La reseña fue guardada",
        });
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          { titulo: "", contenido: "" }
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  //favorito
  const establecerQuitarFavorito = async (event) => {
    if (favorito == 0) {
      const formData = new FormData();
      formData.append("id_curso", id_curso);
      const opciones = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      };

      try {
        const response = await fetch(
          `${urlBaseApi}/api/cursofavorito`,
          opciones
        );
        const data = await response.json();
        if (response.ok) {
          callBackFavoritoCambiado();
          return;
        } else {
          mensajesDeError(
            setPopup,
            response.status,
            typeof data.datos !== "undefined" ? data.datos : {},
            false,
            { titulo: "", contenido: "" }
          );
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    } else {
      const opciones = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      try {
        const response = await fetch(
          `${urlBaseApi}/api/cursofavorito/${id_curso}`,
          opciones
        );
        const data = await response.json();
        if (response.ok) {
          callBackFavoritoCambiado();
          return;
        } else {
          mensajesDeError(
            setPopup,
            response.status,
            typeof data.datos !== "undefined" ? data.datos : {},
            false,
            { titulo: "", contenido: "" }
          );
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    }
  };
  const establecerArchivarCurso = async (event) => {
    const raw = {
      archivado: archivado == 1 ? 0 : 1,
    };
    const opciones = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(raw),
    };
    try {
      const response = await fetch(
        `${urlBaseApi}/api/cursomatriculacion/archivar/${id_curso}`,
        opciones
      );
      const data = await response.json();
      if (response.ok) {
        callBackFavoritoCambiado();
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof data.datos !== "undefined" ? data.datos : {},
          false,
          { titulo: "", contenido: "" }
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  //Ir a la pagina de notas del curso
  const verPaginaNotasCurso = (_event) => {
    navigate(`/curso/notas/${id_curso}/${curso_url_amigable}`);
  };

  //Ir a la pagina de edicion de contenidos del curso si es docente
  const verPaginaEditarCurso = (_event) => {
    navigate(
      `/curso/contenido/${id_curso}${
        curso_url_amigable != null ? "/" + curso_url_amigable : ""
      }`
    );
  };

  return (
    <>
      {mostrarSpinner && <Spinner />}
      <Popup
        mostrarPopup={popUp.mostrar}
        tamano="xx"
        tipo={2}
        titulo={popUp.titulo}
        mensaje={popUp.contenido}
        funcionAceptar={handleFuncionAceptarPopUp}
        funcionCerrar={handleFuncionCerrarPopUp}
        textoCerrar="Aceptar"
      />
      {/* 
        Antes había un rating de curso
      */}
      <section className="header-menu-area">
        <div
          className=""
          style={{
            backgroundColor: "var(--Azul-petroleo)",
            position: "fixed",
            top: 0,
            width: "100%",
            height: "90px",
          }}
        >
          <div className="container-fluid" style={{ height: "100%" }}>
            <div
              className="main-menu-content d-flex align-items-center"
              style={{ height: "100%" }}
            >
              {esMovil ? (
                <ul
                  className="nav nav-tabs generic-tab"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item" style={{ fontSize: "26px" }}>
                    <Link
                      to={`/cursos/matriculados`}
                      className="nav-link"
                      style={{ padding: "0.5rem 0rem" }}
                      id="volver-tab"
                      data-toggle="tab"
                      href="#volver"
                      role="tab"
                      aria-controls="volver"
                      aria-selected="false"
                    >
                      <i className="la la-arrow-left"></i>
                    </Link>
                  </li>
                </ul>
              ) : (
                ""
              )}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="logo-box">
                  <Link to="/" className="logo">
                    <img
                      src={`${urlBase}/images/logo_principal_blanco.png`}
                      alt="logo"
                    />
                  </Link>
                </div>
                <div className="logo-box logo--box">
                  <div className="theme-picker d-flex align-items-center">
                    <button
                      onClick={handleThemeToggle}
                      className="theme-picker-btn dark-mode-btn"
                      title="Dark mode"
                    >
                      <svg
                        className="svg-icon-color-white"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={handleThemeToggle}
                      className="theme-picker-btn light-mode-btn"
                      title="Light mode"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line
                          x1="18.36"
                          y1="18.36"
                          x2="19.78"
                          y2="19.78"
                        ></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="course-dashboard-header-title pl-4">
                  <p
                    className="text-white"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span style={{ fontSize: "25px" }}>{tipo}</span>
                    <span className="mx-2 " style={{ fontSize: "25px" }}>
                      {">"}
                    </span>
                    <span style={{ fontSize: "16px" }}>{nombre_curso}</span>
                  </p>
                </div>
              </div>
              <div className="menu-wrapper ml-auto">
                <ul
                  className="nav nav-tabs generic-tab border-right border-right-gray pl-3 ml-3"
                  style={{ marginRight: "10px" }}
                  id="myTab"
                  role="tablist"
                >
                  <li
                    className="nav-item"
                    style={{ fontSize: "22px", marginBottom: "0" }}
                  >
                    <Link
                      className="nav-link"
                      style={{ padding: "0" }}
                      to="/cursos/matriculados"
                    >
                      <i className="la la-user mr-1"></i>
                    </Link>
                  </li>
                </ul>

                <div className="theme-picker d-flex align-items-center mr-3">
                  <button
                    onClick={handleThemeToggle}
                    className="theme-picker-btn dark-mode-btn"
                    title="Dark mode"
                  >
                    <svg
                      className="svg-icon-color-white"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={handleThemeToggle}
                    className="theme-picker-btn light-mode-btn"
                    title="Light mode"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  </button>
                </div>
                <div className="nav-right-button d-flex align-items-center">
                  {porcentaje_progreso >= 80 && tiene_review == 0 ? (
                    <a
                      href="#"
                      onClick={() => {
                        setMostrarModalRating(!mostrarModalRating);
                      }}
                      className="btn theme-btn theme-btn-sm theme-btn-transparent lh-26 text-white mr-2"
                      data-toggle="modal"
                      data-target="#ratingModal"
                    >
                      <i className="la la-star mr-1"></i> deja una reseña
                    </a>
                  ) : (
                    ""
                  )}
                  <a
                    href="#"
                    className="btn theme-btn theme-btn-sm theme-btn-transparent lh-26 text-white mr-2"
                    data-toggle="modal"
                    data-target="#shareModal"
                  >
                    <i className="la la-share mr-1"></i> comparte
                  </a>
                  <div className="generic-action-wrap generic--action-wrap">
                    <Dropdown
                      data={[
                        {
                          nombre:
                            favorito == 1
                              ? "Quitar de favorito"
                              : "Marcar como favorito",
                          tipo_link: "funcion",
                          href: () => {
                            establecerQuitarFavorito();
                          },
                        },
                        {
                          nombre:
                            archivado == 1
                              ? "Desarchivar curso"
                              : "Archivar curso",
                          tipo_link: "funcion",
                          href: () => {
                            establecerArchivarCurso();
                          },
                        },
                        ...(es_docente == 1
                          ? [
                              {
                                nombre: "Informe de calificador",
                                tipo_link: "funcion",
                                href: () => {
                                  verPaginaNotasCurso();
                                },
                              },
                            ]
                          : []),
                        ...(instructor_edita_contenido == 1
                          ? [
                              {
                                nombre: "Editar contenidos",
                                tipo_link: "funcion",
                                href: () => {
                                  verPaginaEditarCurso();
                                },
                              },
                            ]
                          : []),
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FormularioPlayHeader;
