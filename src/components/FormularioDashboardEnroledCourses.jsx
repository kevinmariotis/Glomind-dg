/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { mensajesDeError } from "./utils";
import Spinner from "./Spinner";
import TarjetaCursoAdmin from "./cards/TarjetaCursoAdmin";
import Paginador from "./Paginador";
import Popup from "./Popup";
// import BotonDashboardNavegacionMovil from "./BotonDashboardNavegacionMovil";
import TarjetaCategoriaAdmin from "./cards/TarjetaCategoriaAdmin";
import DashboardFooter from "./DashboardFooter";
import CustomBreandcrumb from "./BreadCrumb/CustomBreandcrumb";

function FormularioDashboardEnroledCourses() {
  // const urlBase = import.meta.env.VITE_URL_BASE;
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { jwt } = useContext(AuthContext);
  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const [pestanaActivada, setPestanaActivada] = useState(1);
  const [datosUsuario, setDatosUsuario] = useState({ docente_rating: 99.9 });
  const [datosCursosTodos, setDatosCursosTodos] = useState([]);
  const [datosCursosProceso, setDatosCursosProceso] = useState([]);
  const [datosCursosCompletados, setDatosCursosCompletados] = useState([]);
  const [paginaNavegacion, setPaginaNavegacion] = useState(1);
  const [totalCursos, setTotalCursos] = useState(0);

  const [categorias, setCategorias] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [categoriasMatriculadas, setCategoriasMatriculadas] = useState([]);
  const [listaCategoriaNavegacion, setListaCategoriaNavegacion] = useState([]);

  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [categoriasNiveles, setCategoriasNiveles] = useState([
    {
      idCategoria: 0,
      nombre: "Mis cursos",
    },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    obtenerDatosDelServidor();
  }, []);

  useEffect(() => {
    //obtenerDatosCursos();
    obtenerIdsCategoriasMatriculadas();
  }, [pestanaActivada]);

  useEffect(() => {
    if (categoriaSeleccionada != 0) {
      obtenerDatosCursos();
    } else {
      setDatosCursosTodos([]);
      setDatosCursosProceso([]);
      setDatosCursosCompletados([]);
      setTotalCursos(0);
    }
  }, [paginaNavegacion]);

  useEffect(() => {
    obtenerCategorias(categoriaSeleccionada);
    if (categoriaSeleccionada != 0) {
      obtenerDatosCursos();
    }
  }, [categoriaSeleccionada]);

  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };
  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const handleCambiarPestana =
    ({ numero }) =>
    (event) => {
      event.preventDefault();
      setCategoriasMatriculadas([]);
      setListaCategoriaNavegacion([]);
      setCategoriaSeleccionada(0);
      setPestanaActivada(numero);
    };

  const obtenerDatosDelServidor = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      setMostrarSpinner(true);
      const response = await fetch(`${urlBaseApi}/api/usuario`, opciones);
      setMostrarSpinner(false);
      if (response.ok) {
        const datos = await response.json();
        setDatosUsuario(datos.usuario);
      } else {
        const data = await response.json();
        mensajesDeError(
          setPopup,
          response.status,
          typeof data.datos !== "undefined" ? data.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerDatosCursos = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      setMostrarSpinner(true);

      //buscamos los datos de los cursos a mostrar
      setMostrarSpinner(true);
      const response2 = await fetch(
        `${urlBaseApi}/api/usuario/cursos/0/${paginaNavegacion}/${pestanaActivada}/nombre-asc/9/${categoriaSeleccionada}`,
        opciones
      );
      setMostrarSpinner(false);
      if (response2.ok) {
        const datos2 = await response2.json();
        //Filtramos por los cursos que tienen su categoria final en categoriaSeleccionada
        let cursos_almacenar = [];
        let contador = 0;
        datos2.cursos.forEach((curso) => {
          if (curso.id_categoria === categoriaSeleccionada) {
            cursos_almacenar.push(curso);
            contador++;
          }
        });
        switch (pestanaActivada) {
          case 1:
            setDatosCursosTodos(cursos_almacenar);
            break;
          case 4:
            setDatosCursosProceso(cursos_almacenar);
            break;
          case 5:
            setDatosCursosCompletados(cursos_almacenar);
            break;
        }
        setTotalCursos(contador);
      } else {
        const datos2 = await response2.json();
        mensajesDeError(
          setPopup,
          response2.status,
          typeof datos2.datos !== "undefined" ? datos2.datos : {}
        );
      }

      obtenerIdsCategoriasMatriculadas();
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerIdsCategoriasMatriculadas = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };

      //buscamos los datos de los cursos a mostrar
      //setMostrarSpinner(true);
      const response2 = await fetch(
        `${urlBaseApi}/api/usuario/getCategoriasSistemaCursos/0/${pestanaActivada}`,
        opciones
      );
      //setMostrarSpinner(false);
      if (response2.ok) {
        const datos2 = await response2.json();
        setCategoriasMatriculadas(datos2);
      } else {
        const datos2 = await response2.json();
        mensajesDeError(
          setPopup,
          response2.status,
          typeof datos2.datos !== "undefined" ? datos2.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const contarCursosCategoria = (id_categoria) => {
    let contador = 0;

    categoriasMatriculadas.forEach((catx) => {
      if (catx == id_categoria) {
        contador++;
      }
    });
    /*datosCursosTodos.forEach((curso, index) => {            
            curso.categorias_perteneciente.forEach((cate, index2) => {                                            
                if(cate==id_categoria){                    
                    contador++;
                }                
            });                                
        });*/
    return contador;
  };

  const obtenerCategorias = async (id_padre) => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };

      //buscamos los datos de los cursos a mostrar
      //setMostrarSpinner(true);
      const response2 = await fetch(
        `${urlBaseApi}/api/categoriasistema/getCategoriasPorPadre/${id_padre}/1`,
        // `${urlBaseApi}/api/categoriasistema/getCategoriasPorPadre/${id_padre}/1/personalizado_1:programa`,
        // `${urlBaseApi}/api/categoriasistema/getCursos/0/1/1/precio_actual-asc/1/filtro_inicial:categorias_pantalla_inicio`,
        opciones
      );
      //setMostrarSpinner(false);
      if (response2.ok) {
        const datos2 = await response2.json();
        // console.log(datos2)
        setCategorias(datos2);
        // console.log(datos2.subcategorias)
        // setCategorias(datos2.subcategorias);
      } else {
        const datos2 = await response2.json();
        mensajesDeError(
          setPopup,
          response2.status,
          typeof datos2.datos !== "undefined" ? datos2.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const cambiarCategoria = (id_categoria_destino) => {
    if (categoriaSeleccionada !== -1) {
      let copia = [...listaCategoriaNavegacion];
      copia.push(categoriaSeleccionada);
      setListaCategoriaNavegacion(copia);
    }
    setCategoriaSeleccionada(id_categoria_destino);
    setCategoriasNiveles([
      ...categoriasNiveles,
      {
        id_categoria_destino,
        nombre: categorias.find((item) => item.id === id_categoria_destino).nombre,
      },
    ]);
  };

  const handleVolverCategoriaAnterior = () => {
    let copialista = [...listaCategoriaNavegacion];
    let ultima = copialista.pop();
    setListaCategoriaNavegacion(copialista);
    setCategoriaSeleccionada(ultima);
    let copialistaNiveles = [...categoriasNiveles];
    copialistaNiveles.pop();
    setCategoriasNiveles(copialistaNiveles);
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
      <div className="dashboard-content-wrap">
        {/* {esMovil && <BotonDashboardNavegacionMovil />} */}
        <div className="container-fluid mt-5">
          <CustomBreandcrumb
            titles={[...categoriasNiveles.map((item) => item.nombre)]}
          />
          <ul
            className="nav nav-tabs generic-tab pb-30px"
            id="myTab"
            role="tablist"
            style={{ display: "none" }}
          >
            <li className="nav-item">
              <a
                className={`nav-link ${pestanaActivada == 1 ? "active" : ""}`}
                onClick={() => {
                  handleCambiarPestana({ numero: 1 })(event);
                }}
                id="all-course-tab"
                data-toggle="tab"
                href="#"
                role="tab"
                aria-controls="all-course"
                aria-selected="false"
              >
                Todos los cursos
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${pestanaActivada == 4 ? "active" : ""}`}
                onClick={() => {
                  handleCambiarPestana({ numero: 4 })(event);
                }}
                id="active-course-tab"
                data-toggle="tab"
                href="#"
                role="tab"
                aria-controls="active-course"
                aria-selected="true"
              >
                Cursos en proceso
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${pestanaActivada == 5 ? "active" : ""}`}
                onClick={() => {
                  handleCambiarPestana({ numero: 5 })(event);
                }}
                id="completed-course-tab"
                data-toggle="tab"
                href="#"
                role="tab"
                aria-controls="completed-course"
                aria-selected="false"
              >
                Cursos completados
              </a>
            </li>
          </ul>
          <div
            className="tab-content"
            id="myTabContent"
            style={{ marginBottom: totalCursos == 0 ? "100px" : "0px" }}
          >
            {listaCategoriaNavegacion.length > 0 && (
              <div
                className="more-btn-box mt-4 text-left"
                style={{ marginBottom: "50px" }}
              >
                <button
                  onClick={handleVolverCategoriaAnterior}
                  className="btn theme-btn"
                >
                  <i className="la la-arrow-left icon ml-1"></i> Atrás
                </button>{" "}
                <h3
                  className="fs-22 font-weight-semi-bold"
                  style={{ marginLeft: "120px" }}
                ></h3>
              </div>
            )}

            <div
              className={`tab-pane fade ${
                pestanaActivada == 1 ? "show active" : ""
              }`}
              id="all-course"
              role="tabpanel"
              aria-labelledby="all-course-tab"
            >
              <div className="category-wrapper mt-30px">
                <div className="row">
                  {Object.keys(categorias).map((key) => {
                    const categoria = categorias[key];
                    if (categoriasMatriculadas.includes(categoria.id)) {
                      return (
                        <TarjetaCategoriaAdmin
                          key={`tarjeta-categoria-admin-${categoria.id}`}
                          id_categoria={categoria.id}
                          nombre={categoria.nombre}
                          imagen={categoria.imagen_pequena}
                          funcionNavegar={cambiarCategoria}
                          funcionCantidadCursos={contarCursosCategoria}
                        />
                      );
                    }
                    // Si no está en categoriasMostrar, no se renderiza nada
                    return null;
                  })}
                </div>
              </div>
              <div className="row">
                {Object.keys(datosCursosTodos).map((key) => {
                  const curso = datosCursosTodos[key];
                  if (curso.id_categoria === categoriaSeleccionada) {
                    return (
                      <TarjetaCursoAdmin
                        key={`tarjeta${curso.id}`}
                        idcurso={curso.id}
                        url_amigable={curso.url_amigable}
                        nombre={curso.nombre}
                        imagen={curso.imagen_pequena}
                        instructor={curso.instructor}
                        id_instructor={curso.id_instructor}
                        descripcion_instructor={curso.docente_descripcion}
                        reviews_puntuacion={curso.reviews_puntuacion}
                        porcentaje_progreso={curso.porcentaje_progreso}
                        curso={curso}
                      />
                    );
                  }
                  // Si no coincide, no renderiza nada
                  return null;
                })}
              </div>
            </div>
            <div
              className={`tab-pane fade ${
                pestanaActivada == 4 ? "show active" : ""
              }`}
              id="active-course"
              role="tabpanel"
              aria-labelledby="active-course-tab"
            >
              <div className="category-wrapper mt-30px">
                <div className="row">
                  {Object.keys(categorias).map((key) => {
                    const categoria = categorias[key];
                    if (categoriasMatriculadas.includes(categoria.id)) {
                      return (
                        <TarjetaCategoriaAdmin
                          key={`tarjeta-categoria-admin-${categoria.id}`}
                          id_categoria={categoria.id}
                          nombre={categoria.nombre}
                          imagen={categoria.imagen_pequena}
                          funcionNavegar={cambiarCategoria}
                          funcionCantidadCursos={contarCursosCategoria}
                        />
                      );
                    }
                    // Si no está en categoriasMostrar, no se renderiza nada
                    return null;
                  })}
                </div>
              </div>
              <div className="row">
                {Object.keys(datosCursosProceso).map((key) => {
                  const curso = datosCursosProceso[key];
                  if (curso.id_categoria === categoriaSeleccionada) {
                    return (
                      <TarjetaCursoAdmin
                        key={`tarjeta${curso.id}`}
                        idcurso={curso.id}
                        url_amigable={curso.url_amigable}
                        nombre={curso.nombre}
                        imagen={curso.imagen_pequena}
                        instructor={curso.instructor}
                        id_instructor={curso.id_instructor}
                        descripcion_instructor={curso.docente_descripcion}
                        reviews_puntuacion={curso.reviews_puntuacion}
                        porcentaje_progreso={curso.porcentaje_progreso}
                      />
                    );
                  }
                })}
              </div>
            </div>
            <div
              className={`tab-pane fade ${
                pestanaActivada == 5 ? "show active" : ""
              }`}
              id="completed-course"
              role="tabpanel"
              aria-labelledby="completed-course-tab"
            >
              <div className="category-wrapper mt-30px">
                <div className="row">
                  {Object.keys(categorias).map((key) => {
                    const categoria = categorias[key];
                    if (categoriasMatriculadas.includes(categoria.id)) {
                      return (
                        <TarjetaCategoriaAdmin
                          key={`tarjeta-categoria-admin-${categoria.id}`}
                          id_categoria={categoria.id}
                          nombre={categoria.nombre}
                          imagen={categoria.imagen_pequena}
                          funcionNavegar={cambiarCategoria}
                          funcionCantidadCursos={contarCursosCategoria}
                        />
                      );
                    }
                    // Si no está en categoriasMostrar, no se renderiza nada
                    return null;
                  })}
                </div>
              </div>
              <div className="row">
                {Object.keys(datosCursosCompletados).map((key) => {
                  const curso = datosCursosCompletados[key];
                  if (curso.id_categoria === categoriaSeleccionada) {
                    return (
                      <TarjetaCursoAdmin
                        key={`tarjeta${curso.id}`}
                        idcurso={curso.id}
                        url_amigable={curso.url_amigable}
                        nombre={curso.nombre}
                        imagen={curso.imagen_pequena}
                        instructor={curso.instructor}
                        id_instructor={curso.id_instructor}
                        descripcion_instructor={curso.docente_descripcion}
                        reviews_puntuacion={curso.reviews_puntuacion}
                        porcentaje_progreso={curso.porcentaje_progreso}
                      />
                    );
                  }
                })}
              </div>
            </div>
          </div>
          <Paginador
            elemetosTotales={totalCursos}
            elementosPorPagina={9}
            paginaActual={paginaNavegacion}
            callbackCambioPagina={setPaginaNavegacion}
          />
          <DashboardFooter />
        </div>
      </div>
    </>
  );
}

export default FormularioDashboardEnroledCourses;
