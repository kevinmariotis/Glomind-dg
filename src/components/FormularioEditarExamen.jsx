import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import {
  mensajesDeError,
  calcularSegundosDeHorasMinutos,
  convertirSegundosAHorasMinutosSegundos,
} from "./utils";
import Spinner from "./Spinner";
import SpamError from "./SpamError";
import Popup from "./Popup";
import DashboardFooter from "./DashboardFooter";

//para el date picker
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "react-day-picker/dist/style.css";
//fin de para el date picker

function FormularioEditarExamen() {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const today = new Date();
  // const navigate = useNavigate();
  const { jwt, temaActual } = useContext(AuthContext);
  const { id, id_curso } = useParams();
  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dejarAvanzarSiFallido, setDejarAvanzarSiFallido] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [tipo, setTipo] = useState("");
  const [politicaDeRetroalimentacion, setPoliticaDeRetroalimentacion] =
    useState("");
  const [porcentajeEnTotalCurso, setPorcentajeEnTotalCurso] = useState(0);

  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");
  const [bloquearTiempo, setBloquearTiempo] = useState(true);

  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [mostrarFechaInicio, setMostrarFechaInicio] = useState(false);
  const [mostrarFechaFin, setMostrarFechaFin] = useState(false);
  const [datos, setDatos] = useState({
    mostrar: true,
    fecha_hora_inicio: "",
    fecha_inicio: today,
    hora_inicio: "",
    minuto_inicio: "",
    fecha_hora_fin: "",
    fecha_fin: today,
    hora_fin: "",
    minuto_fin: "",
    mostrar_fecha_inicio: false,
    mostrar_fecha_fin: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    obtenerDatosServidor();

    document.addEventListener("click", handleObjeto.hideSelects);
    return () => {
      document.removeEventListener("click", handleObjeto.hideSelects);
    };
  }, []);

  useEffect(() => {
    if (tipo == 1 || tipo == "") {
      setHora(0);
      setMinuto(0);
      setPorcentajeEnTotalCurso(0);
      setBloquearTiempo(true);
      setPoliticaDeRetroalimentacion(1);
    } else {
      setBloquearTiempo(false);
    }
  }, [tipo, porcentajeEnTotalCurso]);

  //Estados de los errores de campos
  const camposErrores = {
    nombre: [],
    descripcion: [],
    dejar_avanzar_si_fallido: [],
    tiempo: [],
    intentos: [],
    tipo: [],
    nota: [],
    porcentaje_en_total_curso: [],
    politica_retroalimentacion: [],

    fecha_hora_inicio: [],
    fecha_inicio: [],
    hora_inicio: [],
    minuto_inicio: [],
    fecha_hora_fin: [],
    fecha_fin: [],
    hora_fin: [],
    minuto_fin: [],
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
    for (let propiedad in erroresCampos) {
      if (Array.isArray(erroresCampos[propiedad])) {
        erroresCampos[propiedad] = [];
      }
    }
  };

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };
  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };
  const handleDejarAvanzarSiFallidoChange = (event) => {
    setDejarAvanzarSiFallido(event.target.value);
  };
  const handleHoraChange = (event) => {
    setHora(event.target.value);
  };
  const handleMinutoChange = (event) => {
    setMinuto(event.target.value);
  };
  const handleIntentosChange = (event) => {
    setIntentos(event.target.value);
  };
  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };
  const handlePoliticaRetroalimentacionChange = (event) => {
    setPoliticaDeRetroalimentacion(event.target.value);
  };
  const handlePorcentajeEnTotalCurso = (event) => {
    setPorcentajeEnTotalCurso(event.target.value);
  };

  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };
  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  // const handleFuncionHuecoPreguntas = () => {
  //   if (typeof id_curso !== "undefined") {
  //     navigate(`/examen/huecopreguntas/${id}/${id_curso}`);
  //   } else {
  //     navigate(`/examen/huecopreguntas/${id}`);
  //   }
  // };

  const obtenerDatosServidor = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };

      const baseUrl = `${urlBaseApi}/api/examen/${id}`;
      let url = baseUrl;

      if (id_curso) {
        url += `/${id_curso}`;
      }
      const response = await fetch(url, opciones);

      const datos = await response.json();
      if (response.ok) {
        let desc_array = datos.descripcion.split("<br />");
        let desc = "";
        desc_array.forEach((element) => {
          desc = desc != "" ? (desc += "\n" + element) : (desc = element);
        });

        setNombre(datos.nombre);
        setDescripcion(desc);
        setTipo(datos.tipo);
        setPoliticaDeRetroalimentacion(datos.politica_retroalimentacion);
        setDejarAvanzarSiFallido(datos.dejar_avanzar_si_fallido);
        setIntentos(datos.intentos);
        const tiempo = convertirSegundosAHorasMinutosSegundos(datos.tiempo);
        setHora(parseInt(tiempo.horas));
        setMinuto(parseInt(tiempo.minutos));
        if (typeof id_curso !== "undefined") {
          setPorcentajeEnTotalCurso(datos.porcentaje_en_total_curso);
        }

        const partes_inicio = datos.fecha_hora_inicio.split(" ");
        const partes_inicio2 = partes_inicio[0].split("-");
        const partes_inicio_hora = partes_inicio[1].split(":");

        const partes_fin = datos.fecha_hora_fin.split(" ");
        const partes_fin2 = partes_fin[0].split("-");
        const partes_fin_hora = partes_fin[1].split(":");

        setDatos({
          ...datos,
          fecha_inicio: new Date(
            partes_inicio2[0],
            partes_inicio2[1] - 1,
            partes_inicio2[2]
          ),
          hora_inicio: partes_inicio_hora[0],
          minuto_inicio: partes_inicio_hora[1],
          fecha_fin: new Date(
            partes_fin2[0],
            partes_fin2[1] - 1,
            partes_fin2[2]
          ),
          hora_fin: partes_fin_hora[0],
          minuto_fin: partes_fin_hora[1],
          fecha_hora_inicio: datos.fecha_hora_inicio,
          fecha_hora_fin: datos.fecha_hora_fin,
        });
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const handleEditarExamen = async (event) => {
    event.preventDefault();
    reiniciarErrorCampoGlobal();

    const tiempo = calcularSegundosDeHorasMinutos(hora, minuto);

    const raw = {
      nombre: nombre.toString(),
      descripcion: descripcion.toString(),
      tipo: tipo,
      politica_retroalimentacion: politicaDeRetroalimentacion,
      tiempo: tiempo,
      intentos: intentos,
    };

    if (typeof id_curso !== "undefined") {
      raw.id_curso = id_curso;
      raw.porcentaje_en_total_curso = porcentajeEnTotalCurso;
    }

    if (["2", "3", 2, 3].includes(tipo)) {
      raw.fecha_hora_inicio =
        format(datos.fecha_inicio, "yyyy-MM-dd") +
        " " +
        datos.hora_inicio +
        ":" +
        datos.minuto_inicio +
        ":00";
      raw.fecha_hora_fin =
        format(datos.fecha_fin, "yyyy-MM-dd") +
        " " +
        datos.hora_fin +
        ":" +
        datos.minuto_fin +
        ":00";
    }

    const opciones = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(raw),
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(`${urlBaseApi}/api/examen/${id}`, opciones);
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        if (Object.keys(datos).length > 0) {
          mensajesDeError(
            setPopup,
            response.status,
            typeof datos !== "undefined" ? datos : {},
            setErrorCampoGlobal,
            { titulo: "", contenido: "" }
          );
        } else {
          setPopup({
            mostrar: true,
            titulo: "Listo",
            contenido: "Examen editado.",
          });
        }
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          {
            titulo: "Error al editar el examen",
            contenido: "Revise los errores en el formulario.",
          }
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handleObjeto = {
    fecha_hora_inicio: (event) => {
      setDatos({ ...datos, fecha_hora_inicio: event.target.value });
    },
    fecha_inicio: (fecha_establecer) => {
      setDatos({ ...datos, fecha_inicio: fecha_establecer });
    },
    hora_inicio: (event) => {
      setDatos({ ...datos, hora_inicio: event.target.value });
    },
    minuto_inicio: (event) => {
      setDatos({ ...datos, minuto_inicio: event.target.value });
    },
    fecha_hora_fin: (event) => {
      setDatos({ ...datos, fecha_hora_fin: event.target.value });
    },
    fecha_fin: (fecha_establecer) => {
      setDatos({ ...datos, fecha_fin: fecha_establecer });
    },
    hora_fin: (event) => {
      setDatos({ ...datos, hora_fin: event.target.value });
    },
    minuto_fin: (event) => {
      setDatos({ ...datos, minuto_fin: event.target.value });
    },
    toogleMostrarFechaInicio: () => {
      setMostrarFechaInicio(!mostrarFechaInicio);
    },
    toogleMostrarFechaFin: () => {
      setMostrarFechaFin(!mostrarFechaFin);
    },
    hideSelects: (event) => {
      if (event.target.name === undefined) {
        console.log("ejecutandso");
        setMostrarFechaInicio(false);
        setMostrarFechaFin(false);
      }
    },
  };

  const horas = Array.from({ length: 6 }, (_, index) => index);
  const minutos = Array.from({ length: 60 }, (_, index) => index);
  const porcentaje_en_total_curso = Array.from(
    { length: 100 },
    (_, index) => index + 1
  );

  const horas_fechas = Array.from({ length: 24 }, (_, index) => index);

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
                <Link to={`/curso/contenido/${id_curso}`}>
                  <div
                    className="btn theme-btn btn-round mb-3"
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
            <div className="media media-card align-items-center theme-title">
              <h3 className="fs-22 font-weight-semi-bold">Editar examen</h3>
            </div>
            <div className="btn-box pt-30px"></div>
          </div>
          <form action="#">
            <div className="card-theme">
              <div className="card-body">
                <h3 className="fs-22 font-weight-semi-bold pb-2">General</h3>
                <div className="divider">
                  <span></span>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">Nombre</label>
                      <input
                        onChange={handleNombreChange}
                        value={nombre}
                        name="nombre"
                        className="form-control form--control pl-3"
                        type="text"
                        maxLength="64"
                        placeholder="Ej: Manipulación del dom"
                      />
                      {erroresCampos["nombre"].length > 0 && (
                        <SpamError mensaje={erroresCampos["nombre"]} />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">Descripción</label>
                      <textarea
                        onChange={handleDescripcionChange}
                        value={descripcion}
                        name="descripcion"
                        className="form-control form--control user-text-editor pl-3"
                      ></textarea>
                      {erroresCampos["descripcion"].length > 0 && (
                        <SpamError mensaje={erroresCampos["descripcion"]} />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">Tipo de examen</label>
                      <select
                        onChange={handleTipoChange}
                        value={tipo}
                        name="tipo"
                        className={`form-control ${
                          temaActual == 1 ? "" : "select-dark"
                        }`}
                      >
                        <option value=""> -- Seleccione --</option>
                        <option value="1">
                          Básico, o control de aprendizaje
                        </option>
                        <option value="2">
                          Nivel Medio (Ceritificación, Pago o no según
                          configuración del curso)
                        </option>
                        <option value="3">
                          Nivel Avanzado (Certificación, Pago o no según
                          configuración del curso)
                        </option>
                      </select>
                      {erroresCampos["tipo"].length > 0 && (
                        <SpamError mensaje={erroresCampos["tipo"]} />
                      )}
                    </div>
                  </div>

                  {["2", "3", 2, 3].includes(tipo) ? (
                    <>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label
                            className="label-text"
                            style={{ display: "block" }}
                          >
                            Fecha de inicio
                          </label>
                          <input
                            onClick={handleObjeto.toogleMostrarFechaInicio}
                            value={format(datos.fecha_inicio, "yyyy-MM-dd")}
                            style={{ width: "50%", float: "left" }}
                            readOnly
                            className="form-control form--control pl-3"
                            type="text"
                            name="fecha_inicio"
                            maxLength="64"
                            placeholder=""
                          />
                          <select
                            onChange={handleObjeto.hora_inicio}
                            style={{
                              width: "25%",
                              height: "50px",
                              float: "left",
                            }}
                            value={datos.hora_inicio}
                            name="hora_inicio"
                            className={`form-control ${
                              temaActual == 1 ? "" : "select-dark"
                            }`}
                          >
                            <option value=""> -- Hora --</option>
                            {horas_fechas.map((hora) => (
                              <option
                                key={`h-inicio-${hora}`}
                                value={hora.toString().padStart(2, "0")}
                              >
                                {hora.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                          <select
                            onChange={handleObjeto.minuto_inicio}
                            style={{ width: "25%", height: "50px" }}
                            value={datos.minuto_inicio}
                            name="minuto_inicio"
                            className={`form-control ${
                              temaActual == 1 ? "" : "select-dark"
                            }`}
                          >
                            <option value=""> -- Minuto --</option>
                            {minutos.map((minuto) => (
                              <option
                                key={`m-inicio-${minuto}`}
                                value={minuto.toString().padStart(2, "0")}
                              >
                                {minuto.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                          <div
                            style={{
                              position: "absolute",
                              zIndex: "999",
                              backgroundColor: temaActual
                                ? "#ffffff"
                                : "#1B1B1B",
                              display: mostrarFechaInicio ? "block" : "none",
                            }}
                          >
                            <DayPicker
                              mode="single"
                              selected={datos.fecha_inicio}
                              onSelect={handleObjeto.fecha_inicio}
                              locale={es}
                            />
                          </div>
                          {erroresCampos["fecha_hora_inicio"].length > 0 && (
                            <SpamError
                              mensaje={erroresCampos["fecha_hora_inicio"]}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label
                            className="label-text"
                            style={{ display: "block" }}
                          >
                            Fecha de finalización
                          </label>
                          <input
                            onClick={handleObjeto.toogleMostrarFechaFin}
                            value={format(datos.fecha_fin, "yyyy-MM-dd")}
                            style={{ width: "50%", float: "left" }}
                            readOnly
                            className="form-control form--control pl-3"
                            type="text"
                            name="fecha_fin"
                            maxLength="64"
                            placeholder=""
                          />
                          <select
                            onChange={handleObjeto.hora_fin}
                            style={{
                              width: "25%",
                              height: "50px",
                              float: "left",
                            }}
                            value={datos.hora_fin}
                            name="hora_fin"
                            className={`form-control ${
                              temaActual == 1 ? "" : "select-dark"
                            }`}
                          >
                            <option value=""> -- Hora --</option>
                            {horas_fechas.map((hora) => (
                              <option
                                key={`h-fin-${hora}`}
                                value={hora.toString().padStart(2, "0")}
                              >
                                {hora.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                          <select
                            onChange={handleObjeto.minuto_fin}
                            style={{ width: "25%", height: "50px" }}
                            value={datos.minuto_fin}
                            name="minuto_fin"
                            className={`form-control ${
                              temaActual == 1 ? "" : "select-dark"
                            }`}
                          >
                            <option value=""> -- Minuto --</option>
                            {minutos.map((minuto) => (
                              <option
                                key={`m-fin-${minuto}`}
                                value={minuto.toString().padStart(2, "0")}
                              >
                                {minuto.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                          <div
                            style={{
                              position: "absolute",
                              zIndex: "999",
                              backgroundColor: temaActual
                                ? "#ffffff"
                                : "#1B1B1B",
                              display: mostrarFechaFin ? "block" : "none",
                            }}
                          >
                            <DayPicker
                              mode="single"
                              selected={datos.fecha_fin}
                              onSelect={handleObjeto.fecha_fin}
                              locale={es}
                            />
                          </div>
                          {erroresCampos["fecha_hora_fin"].length > 0 && (
                            <SpamError
                              mensaje={erroresCampos["fecha_hora_fin"]}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">
                        Política de retroalimentación
                      </label>
                      <select
                        onChange={handlePoliticaRetroalimentacionChange}
                        value={politicaDeRetroalimentacion}
                        disabled={bloquearTiempo}
                        name="politica_retroalimentacion"
                        className={`form-control ${
                          temaActual == 1 ? "" : "select-dark"
                        }`}
                      >
                        <option value=""> -- Seleccione --</option>
                        <option value="0">
                          No se muestra retroalimentaciones y respuestas
                          correctas o incorrectas
                        </option>
                        <option value="1">
                          Si se muestra retroalimentaciones y respuestas
                          correctas o incorrectas en cada intento
                        </option>
                        <option value="2">
                          Se muestran las retroalimentaciones y respuestas
                          correctas o incorrectas cuando consuma todos los
                          intentos.
                        </option>
                      </select>
                      {erroresCampos["politica_retroalimentacion"].length >
                        0 && (
                        <SpamError
                          mensaje={erroresCampos["politica_retroalimentacion"]}
                        />
                      )}
                    </div>
                  </div>
                  {typeof id_curso !== "undefined" ? (
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label className="label-text">
                          Porcentaje en total del curso
                        </label>
                        <select
                          onChange={handlePorcentajeEnTotalCurso}
                          value={porcentajeEnTotalCurso}
                          disabled={bloquearTiempo}
                          name="porcentaje_en_total_curso"
                          className={`form-control ${
                            temaActual == 1 ? "" : "select-dark"
                          }`}
                        >
                          <option value={0}> -- Seleccione --</option>
                          {porcentaje_en_total_curso.map((number) => (
                            <option key={number} value={number}>
                              {number} %
                            </option>
                          ))}
                        </select>
                        {erroresCampos["porcentaje_en_total_curso"].length >
                          0 && (
                          <SpamError
                            mensaje={erroresCampos["porcentaje_en_total_curso"]}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="card-theme my-4">
              <div className="card-body">
                <h3 className="fs-22 font-weight-semi-bold pb-2">Opciones</h3>
                <div className="divider">
                  <span></span>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <label className="label-text">
                      Tiempo para resolver el examen (Si es imimitado seleccione
                      0 horas con 0 minutos)
                    </label>
                    <div className="input-box form-row">
                      <div className="form-group col-md-3">
                        <label className="label-text">Horas</label>
                        <select
                          onChange={handleHoraChange}
                          value={hora}
                          disabled={bloquearTiempo}
                          name="tiempo_horas"
                          className={`form-control ${
                            temaActual == 1 ? "" : "select-dark"
                          }`}
                        >
                          <option value=""> -- Seleccione --</option>
                          {horas.map((number) => (
                            <option key={number} value={number}>
                              {number} horas
                            </option>
                          ))}
                        </select>
                        {erroresCampos["tiempo"].length > 0 && (
                          <SpamError mensaje={erroresCampos["tiempo"]} />
                        )}
                      </div>
                      <div className="form-group col-md-3">
                        <label className="label-text">Minutos</label>
                        <select
                          onChange={handleMinutoChange}
                          value={minuto}
                          disabled={bloquearTiempo}
                          name="tiempo_minutos"
                          className={`form-control ${
                            temaActual == 1 ? "" : "select-dark"
                          }`}
                        >
                          <option value=""> -- Seleccione --</option>
                          {minutos.map((number) => (
                            <option key={number} value={number}>
                              {number} minutos
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="label-text">Intentos</label>
                      <select
                        onChange={handleIntentosChange}
                        value={intentos}
                        name="intentos"
                        className={`form-control ${
                          temaActual == 1 ? "" : "select-dark"
                        }`}
                      >
                        <option value=""> -- Seleccione --</option>
                        <option value="0">Ilimitados</option>
                        {[1, 2, 3, 4, 5, 6].map((number) => (
                          <option key={number} value={number}>
                            {number} intentos
                          </option>
                        ))}
                      </select>
                      {erroresCampos["intentos"].length > 0 && (
                        <SpamError mensaje={erroresCampos["intentos"]} />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6" style={{ display: "none" }}>
                    <div className="form-group">
                      <label className="label-text">
                        Dejar avanzar aún sin aprobar?
                      </label>
                      <select
                        onChange={handleDejarAvanzarSiFallidoChange}
                        value={dejarAvanzarSiFallido}
                        name="dejar_avanzar_si_fallido"
                        className={`form-control ${
                          temaActual == 1 ? "" : "select-dark"
                        }`}
                      >
                        <option value=""> -- Seleccione --</option>
                        <option value="0">No</option>
                        <option value="1">Si</option>
                      </select>
                      {erroresCampos["dejar_avanzar_si_fallido"].length > 0 && (
                        <SpamError
                          mensaje={erroresCampos["dejar_avanzar_si_fallido"]}
                        />
                      )}
                      {erroresCampos["nota"].length > 0 && (
                        <SpamError mensaje={erroresCampos["nota"]} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="course-submit-btn-box pb-4">
              <button
                className="btn theme-btn btn-round"
                type="submit"
                onClick={handleEditarExamen}
              >
                Guardar cambios
              </button>
            </div>
          </form>
          <DashboardFooter />
        </div>
      </div>
    </>
  );
}

export default FormularioEditarExamen;
