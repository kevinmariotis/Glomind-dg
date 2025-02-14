import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { mensajesDeError } from "./utils";
import Spinner from "./Spinner";
import SpamError from "./SpamError";
import Popup from "./Popup";
import DashboardFooter from "./DashboardFooter";

function FormularioCrearExamenPreguntaSmur() {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { jwt, temaActual } = useContext(AuthContext);
  const { id, id_curso } = useParams();
  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });

  const [pregunta, setPregunta] = useState("");
  const [retroalimentacionAfirmativa, setRetroalimentacionAfirmativa] =
    useState("");
  const [retroalimentacionNegativa, setRetroalimentacionNegativa] =
    useState("");
  const [agrupacion, setAgrupacion] = useState(-1);
  const [opciones, setOpciones] = useState([
    { respuesta: "", porcentaje: -1 },
    { respuesta: "", porcentaje: -1 },
    { respuesta: "", porcentaje: -1 },
  ]);

  const [agrupaciones, setAgrupaciones] = useState({});
  const [nombreexamen, setNombreExamen] = useState("");
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    obtenerDatosServidor();
  }, []);

  //Estados de los errores de campos
  const camposErrores = {
    texto_pregunta: [],
    texto_retro_afirmativa: [],
    texto_retro_negativa: [],
    id_agrupacion: [],
    tipo_pregunta: [],
    pregunta_opcion: [],
    archivo: [],
  };
  for (let i = 0; i <= 15; i++) {
    camposErrores[`pregunta_opcion.${i}`] = [];
    camposErrores[`porcentaje_opcion.${i}`] = [];
  }

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
    for (let propiedad in erroresCampos) {
      if (Array.isArray(erroresCampos[propiedad])) {
        erroresCampos[propiedad] = [];
      }
    }
  };

  const handlePreguntaChange = (event) => {
    setPregunta(event.target.value);
  };
  const handleRetroAfirmativaChange = (event) => {
    setRetroalimentacionAfirmativa(event.target.value);
  };
  const handleRetroNevativaChange = (event) => {
    setRetroalimentacionNegativa(event.target.value);
  };
  const handleAgrupacionChange = (event) => {
    setAgrupacion(event.target.value);
  };

  const handleOpcionChange = (index, event) => {
    const newOptions = [...opciones];
    newOptions[index].respuesta = event.target.value;
    setOpciones(newOptions);
  };

  const handlePorcentajeChange = (index, event) => {
    const newOptions = [...opciones];
    newOptions[index].porcentaje = parseInt(event.target.value);
    setOpciones(newOptions);
  };

  const handleAgregarOpcion = (event) => {
    if (opciones.length < 16) {
      event.preventDefault();
      setOpciones([...opciones, { respuesta: "", porcentaje: -1 }]);
    }
  };

  const handleQuitarOpcion = (index) => {
    const newOptions = [...opciones];
    newOptions.splice(index, 1);
    setOpciones(newOptions);
  };

  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };
  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const obtenerDatosServidor = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/examenpregunta/getFormularioCrear/${id}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setAgrupaciones(datos.agrupaciones);
        setNombreExamen(datos.nombre_examen);
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          false,
          { titulo: "", contenido: "" }
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const handleCrearPregunta = async (event) => {
    event.preventDefault();
    reiniciarErrorCampoGlobal();

    const formData = new FormData();
    formData.append("id_agrupacion", agrupacion.toString());
    formData.append("tipo_pregunta", 1);
    formData.append("texto_pregunta", pregunta);
    formData.append("texto_retro_afirmativa", retroalimentacionAfirmativa);
    formData.append("texto_retro_negativa", retroalimentacionNegativa);
    if (agrupacion == "0") {
      formData.append("id_examen", id);
    }
    if (typeof id_curso !== "undefined") {
      formData.append("id_curso", id_curso);
    }
    opciones.forEach((item) => {
      formData.append("pregunta_opcion[]", item.respuesta);
      formData.append("porcentaje_opcion[]", item.porcentaje);
    });
    let file = document.querySelector("input[name=archivo]").files[0];
    if (file) {
      formData.append("archivo", file);
    }

    const opcionesx = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/examenpregunta/crearpreguntacompleta/1`,
        opcionesx
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "Pregunta creada correctamente.",
        });
        setOpciones([]);
        setPregunta([]);
        setAgrupacion(-1);
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          {
            titulo: "Error al crear el examen",
            contenido: "Revise los errores en el formulario.",
          }
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
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
        <div className="container-fluid">
          <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-3">
            {typeof id_curso !== "undefined" ? (
              <Link
                to={`/examen/huecopreguntas/${id}${
                  typeof id_curso !== "undefined" ? `/${id_curso}` : ""
                }`}
              >
                <div
                  className="btn theme-btn btn-round"
                  data-toggle="tooltip"
                  data-placement="top"
                  data-title="Volver a la edición de contenidos"
                >
                  <i className="la la-angle-left mr-1"></i>
                  Atrás
                </div>
              </Link>
            ) : (
              ""
            )}
            <div className="media media-card align-items-center theme-title mt-3">
              <h3 className="fs-22 font-weight-semi-bold">
                Nueva pregunta de selección múltiple con única respuesta
              </h3>
              <h5>&nbsp;|&nbsp;{nombreexamen}</h5>
            </div>
            <div className="btn-box pt-30px"></div>
          </div>
          <form action="#">
            <div className="card-theme  ">
              <div className="card-body">
                <h3 className="fs-22 font-weight-semi-bold pb-2">General</h3>
                <div className="divider">
                  <span></span>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">
                        A que agrupación pertenecerá esta pregunta?
                      </label>
                      <select
                        onChange={handleAgrupacionChange}
                        value={agrupacion}
                        name="id_agrupacion"
                        className={`form-control ${
                          temaActual == 1 ? "" : "select-dark"
                        }`}
                      >
                        <option value=""> -- Seleccione --</option>
                        <option value="0"> -- Pregunta fija -- </option>
                        {Object.keys(agrupaciones).map((key) => (
                          <option
                            key={`agru-sel-${agrupaciones[key].id}`}
                            value={agrupaciones[key].id}
                          >
                            {agrupaciones[key].nombre}
                          </option>
                        ))}
                      </select>
                      {erroresCampos["id_agrupacion"].length > 0 && (
                        <SpamError mensaje={erroresCampos["id_agrupacion"]} />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">Pregunta</label>
                      <textarea
                        onChange={handlePreguntaChange}
                        value={pregunta}
                        name="pregunta"
                        className="form-control form--control user-text-editor pl-3"
                      ></textarea>
                      {erroresCampos["texto_pregunta"].length > 0 && (
                        <SpamError mensaje={erroresCampos["texto_pregunta"]} />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">
                        Retroalimentación al contestar correctramente
                      </label>
                      <textarea
                        onChange={handleRetroAfirmativaChange}
                        value={retroalimentacionAfirmativa}
                        name="texto_retro_afirmativa"
                        className="form-control form--control user-text-editor pl-3"
                      ></textarea>
                      {erroresCampos["texto_retro_afirmativa"].length > 0 && (
                        <SpamError
                          mensaje={erroresCampos["texto_retro_afirmativa"]}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">
                        Retroalimentación al contestar incorrectamente
                      </label>
                      <textarea
                        onChange={handleRetroNevativaChange}
                        value={retroalimentacionNegativa}
                        name="texto_retro_negativa"
                        className="form-control form--control user-text-editor pl-3"
                      ></textarea>
                      {erroresCampos["texto_retro_negativa"].length > 0 && (
                        <SpamError
                          mensaje={erroresCampos["texto_retro_negativa"]}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">Media (Imagen)</label>
                      <input
                        type="file"
                        name="archivo"
                        className="form-control form--control user-text-editor pl-3"
                      ></input>
                      {erroresCampos["archivo"].length > 0 && (
                        <SpamError mensaje={erroresCampos["archivo"]} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-theme mt-3">
              <div className="card-body">
                <h3 className="fs-22 font-weight-semi-bold pb-2">Opciones</h3>
                <div className="divider">
                  <span></span>
                </div>
                {erroresCampos["tipo_pregunta"].length > 0 && (
                  <SpamError mensaje={erroresCampos["tipo_pregunta"]} />
                )}
                {erroresCampos["pregunta_opcion"].length > 0 && (
                  <SpamError mensaje={erroresCampos["pregunta_opcion"]} />
                )}
                {opciones.map((opcion, index) => (
                  <>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="label-text">
                            Opción {index + 1}
                          </label>
                          <textarea
                            onChange={(e) => handleOpcionChange(index, e)}
                            value={opcion.respuesta}
                            name={`opcion${index}`}
                            className="form-control form--control user-text-editor pl-3"
                          ></textarea>
                          {erroresCampos["pregunta_opcion." + index].length >
                            0 && (
                            <SpamError
                              mensaje={
                                erroresCampos["pregunta_opcion." + index]
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-lg-5">
                        <div className="form-group">
                          <label className="label-text">Calificación</label>
                          <select
                            onChange={(e) => handlePorcentajeChange(index, e)}
                            value={opcion.porcentaje}
                            name={`porcentaje${index}`}
                            className={`form-control ${
                              temaActual == 1 ? "" : "select-dark"
                            }`}
                          >
                            <option value=""> -- Seleccione --</option>
                            <option value="0">Incorrecta</option>
                            <option value="100">Correcta</option>
                          </select>
                          {erroresCampos["porcentaje_opcion." + index].length >
                            0 && (
                            <SpamError
                              mensaje={
                                erroresCampos["porcentaje_opcion." + index]
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-lg-1">
                        <label
                          className="label-text"
                          style={{ visibility: "hidden" }}
                        >
                          Quitar
                        </label>
                        <br />
                        <div
                          onClick={() => handleQuitarOpcion(index)}
                          // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Borrar"
                          style={{
                            fontSize: "30px",
                            color: "var(--Lavander)",
                          }}
                        >
                          <span
                            data-toggle="modal"
                            data-target="#itemDeleteModal"
                            className="w-100 h-100 d-inline-block"
                          >
                            <i className="la la-trash"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                <button
                  className="btn theme-btn btn-round"
                  style={{ marginTop: "20px" }}
                  type="submit"
                  onClick={handleAgregarOpcion}
                >
                  <i className="la la-plus mr-2"></i> Agregar opción
                </button>
              </div>
            </div>
            <div className="course-submit-btn-box pb-4">
              <button
                className="btn theme-btn btn-round mt-3"
                type="submit"
                onClick={handleCrearPregunta}
              >
                Crear pregunta
              </button>
            </div>
          </form>
          <DashboardFooter />
        </div>
      </div>
    </>
  );
}

export default FormularioCrearExamenPreguntaSmur;
