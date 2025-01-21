/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import FormularioPlayHeader from "./FormularioPlayHeader";
import VideoPlayerPrisma from "./VideoPlayerPrisma";
import { AuthContext } from "../AuthContext";
import Spinner from "./Spinner";
import Popup from "./Popup";
import Recurso from "./Recurso";
import Tarea from "./Tarea";
import { mensajesDeError } from "./utils";
import DropdownContenido from "./DropdownContenido";
import HiloComentarios from "./HiloComentarios";
import HiloAnuncio from "./HiloAnuncio";
import Calendario from "./Calendario";
import CountdownTimer from "./CoundDownTimer";
import CrearEditarVideollamada from "./CrearEditarVideollamada";
import { sideBarAbrirCerrar } from "./comun";
import { Skeleton } from "@mui/material";
import ReactPlayer from "react-player";
import GraficCircle from "./grafics/GraficCircle";

function FormularioPlay() {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const urlBase = import.meta.env.VITE_URL_BASE;
  const { url_amigable } = useParams();
  const navigate = useNavigate();
  const { jwt, esMovil, setCargarMisCursos } = useContext(AuthContext);
  const [popUp, setPopup] = useState({
    mostrar: false,
    tipo: 2,
    titulo: "",
    contenido: "",
    data_switch: "",
    data_id: -1,
  });
  const [popUpVideollamada, setPopupVideollamada] = useState({
    mostrar: false,
  });
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [dataCurso, setDataCurso] = useState({
    id: -1,
    nombre: "",
    desc_general: "",
    desc_general_corta: "",
    nivel: 0,
    favorito: -1,
    archivado: -1,
    porcentaje_progreso: -1,
    estudiantes_cantidad: 0,
    cantidad_examenes: 0,
    cantidad_horas_de_video: "",
    expedir_certificado: 0,
    curso_certificado_comprado_previamente: 0,
    certificado_solo_pago: 0,
    id_instructor: 0,
    instructor: "",
    instructor_imagen_pequena: "",
    docente_descripcion: "",
    personalizado_tipo_curso_data: {},
    personalizado_tipo_curso: null,
  }); //se accede por ejmplo: dataCurso.favorito
  const [cursoDescripcion, setCursoDescripcion] = useState([]);
  const [docenteDescripcion, setDocenteDescripcion] = useState([]);
  const [area_de_formacion, setArea_de_formacion] = useState([]);
  const [fines_de_aprendizaje, setFines_de_aprendizaje] = useState([]);
  const [proposito_del_curso, setProposito_del_curso] = useState([]);
  const [queAprenderas, setQueAprenderas] = useState([]);
  const [listadoRequerimientos, setListadoRequerimientos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [buscarParticipante, setBuscarParticipante] = useState("");
  const [calificaciones, setCalificaciones] = useState([]);
  const [buscarCalificacion, setBuscarCalificacion] = useState("");

  const [mostrarMasCursoDescripcion, setMostrarMasCursoDescripcion] =
    useState(false);
  const [contenido, setContenido] = useState([]);
  const [dataContenidoViendo, setDataContenidoViendo] = useState([]);
  const [tipoContenidoHilo, setTipoContenidoHilo] = useState(-1); //videos : 2, etc..

  const [contenidoActivado, setContenidoActivado] = useState(-1); //el contenido que se está viendo
  const [contenidoActivadoAnterior, setContenidoActivadoAnterior] =
    useState(-1); //el contenido anterior que estaba viendo, por si acaso hay que volver a señalarlo.
  const [pestanaActivada, setPestanaActivada] = useState(9); //pestañas que estan debajo del video
  const [cargarActividadActual, setCargarActividadActual] = useState(false);

  const [entrarVideollamada, setEntrarVideollamada] = useState({
    mostrar: false,
    url: null,
  });

  const [notas, setNotas] = useState({});

  const refBloqueDescripcion = useRef(null);
  const refHiloComentarios = useRef(null);

  const [showControls, setShowControls] = useState({});
  const handleShowControls = () => {
    setShowControls(true);
  };
  const handleHideControls = () => {
    setShowControls(false);
  };

  function Iframex({ frame }) {
    return (
      <div
        style={{
          height: "100%",
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
        }}
        dangerouslySetInnerHTML={{ __html: frame.html }}
      ></div>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    sideBarAbrirCerrar();
    obtenerDatosDelServidor();
  }, []);

  useEffect(() => {
    if (dataCurso.id != -1) {
      obtenerContenidos({ activar_actividad_actual: true });
      if (dataCurso.es_docente == 0) {
        obtenerNotas();
      }
    }
  }, [dataCurso.id]);

  useEffect(() => {
    if (cargarActividadActual) {
      //actividadActual();
    }
  }, [contenido]);

  useEffect(() => {
    if (dataCurso.id != -1) {
      switch (dataContenidoViendo.tipo_contenido) {
        case 1: //1 video
          setTipoContenidoHilo(2); //2 video
          break;
        case 3: //3 recurso
          handleActualizaEstadoConsumo();
          setTipoContenidoHilo(3); //3 recurso
          break;
        case 4: //4 etiqueta
          handleActualizaEstadoConsumo();
          setTipoContenidoHilo(4); //4 etiqueta
          break;
        case 7:
          handleActualizaEstadoConsumo();
          setTipoContenidoHilo(7); //7 URL
          break;
        default:
          setTipoContenidoHilo(-1); //Ninguno, no tiene foro
          break;
      }
    }
  }, [dataContenidoViendo]);

  //pestañas que estan debajo del video
  const handleCambiarPestana = (event, numero) => {
    event.preventDefault();
    setPestanaActivada(numero);
    setContenidoActivado(-1);
    setDataContenidoViendo([]);
    // setPestanaActivada(-1)
    // const myTimeout = setTimeout(function () {
    //   window.scrollTo({
    //     top: refHiloComentarios.current.offsetTop + 300,
    //     behavior: "smooth",
    //   });
    // }, 10);
  };

  const handleFuncionAceptarPopUp = () => {
    switch (popUp.data_switch) {
      case "abrir_examen":
        cargarContenidoEspecifico(popUp.data_id, false, true);
        break;
      case "abrir_intento":
        cargarContenidoEspecifico(popUp.data_id, false, true);
        break;
    }
    setPopup({
      ...popUp,
      mostrar: false,
      tipo: 2,
      data_switch: "",
      data_id: -1,
    });
  };
  const handleFuncionCerrarPopUp = () => {
    switch (popUp.data_switch) {
      case "abrir_examen":
        setContenidoActivado(-1);
        break;
    }
    setPopup({
      ...popUp,
      mostrar: false,
      tipo: 2,
      data_switch: "",
      data_id: -1,
    });
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
      const response = await fetch(
        `${urlBaseApi}/api/curso/verPorUrlAmigable/${url_amigable}`,
        opciones
      );
      //setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setDataCurso(datos.curso);
        setCursoDescripcion(datos?.curso?.desc_general?.split("<br />"));
        setDocenteDescripcion(
          datos?.curso?.docente_descripcion?.split("<separador>")
        );
        setQueAprenderas(
          datos?.curso?.desc_que_aprenderas?.split("<separador>")
        );
        setArea_de_formacion(
          datos?.curso?.area_de_formacion?.split("<separador>")
        );
        setFines_de_aprendizaje(
          datos?.curso?.fines_de_aprendizaje?.split("<separador>")
        );
        setProposito_del_curso(
          datos?.curso?.proposito_del_curso?.split("<separador>")
        );
        setListadoRequerimientos(
          datos?.curso?.desc_requerimientos?.split("<separador>")
        );
        console.log(
          datos?.curso?.desc_general?.split("<br />"),
          datos?.curso?.docente_descripcion?.split("<separador>"),
          datos?.curso?.desc_que_aprenderas?.split("<separador>"),
          datos?.curso?.area_de_formacion?.split("<separador>"),
          datos?.curso?.fines_de_aprendizaje?.split("<separador>"),
          datos?.curso?.proposito_del_curso?.split("<separador>"),
          datos?.curso?.desc_requerimientos?.split("<separador>")
        );

        if (datos.curso.matriculado == 0) {
          setMostrarSpinner(false);
          navigate("/");
        }
        if (dataCurso.id == datos.curso.id) {
          setMostrarSpinner(false);
        }

        if (datos.curso?.videollamadas?.length > 0) {
          if (
            datos.curso.videollamadas[0].segundos_restantes_inicio <= 0 &&
            datos.curso.videollamadas[0].segundos_restantes_fin > 0
          ) {
            setEntrarVideollamada({
              mostrar: true,
              url: datos.curso.videollamadas[0].url,
            });
          }
        }
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

  const obtenerContenidos = async ({ activar_actividad_actual = false }) => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      //setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/curso/getContenidos/${dataCurso.id}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setContenido(datos);
        if (activar_actividad_actual && !dataCurso.es_docente) {
          //setCargarActividadActual(true);
        }
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

  /*
        Determina cual es la actividad actual y la abre, segun si se es secuencial el curso o no
    */
  const actividadActual = async () => {
    let id_contenido_actual = -1;
    let nombre_contenido_actual = "";
    contenido.forEach((categoria) => {
      categoria.curso_contenido.forEach((contenido) => {
        if (contenido.estado_consumo == 0 && id_contenido_actual == -1) {
          id_contenido_actual = contenido.id_contenido;
          nombre_contenido_actual = contenido.nombre;
        }
      });
    });
    if (id_contenido_actual != -1) {
      cargarContenidoEspecifico(id_contenido_actual, true);
    } else {
      if (contenido.length > 0) {
        //ojo aqui el mensaje debe ser personalizado si gano el curso un mensaje de lo contrario mostrar que debe superar los examenes para poder dar finalizado satisfactoriamente el curso.
        setPopup({
          mostrar: true,
          titulo: "Felicitaciones",
          contenido: "Has llegado al final del curso.",
        });
      }
    }
  };

  /*
        Obtiene el recurso que intenta abrir y lo coloca en un estado
    */
  const cargarContenidoEspecifico = async (
    id_contenido,
    preguntar_abrir = false,
    ignorar_iguales = false
  ) => {
    if (
      (!ignorar_iguales && contenidoActivado != id_contenido) ||
      ignorar_iguales
    ) {
      const headers = {
        Authorization: `Bearer ${jwt}`,
      };
      try {
        setContenidoActivadoAnterior(contenidoActivado);
        setContenidoActivado(id_contenido);
        const opciones = {
          method: "GET",
          headers: headers,
        };
        setMostrarSpinner(true);
        const response = await fetch(
          `${urlBaseApi}/api/cursocontenido/${id_contenido}`,
          opciones
        );

        setMostrarSpinner(false);
        const datos = await response.json();
        if (response.ok) {
          switch (datos.tipo_contenido) {
            case 2:
              if (preguntar_abrir) {
                setPopup({
                  ...popUp,
                  mostrar: true,
                  tipo: 3,
                  titulo:
                    datos.id_examen_intento_abierto != -1
                      ? "Continuar intento?"
                      : "Abrir siguiente actividad?",
                  contenido:
                    datos.id_examen_intento_abierto != -1
                      ? `Desea continuar con el intento de <span style="font-style: italic;">${datos.nombre}</span>?`
                      : `Desea abrir la actividad: <span style="font-style: italic;">${datos.nombre}</span>?`,
                  data_switch:
                    datos.id_examen_intento_abierto != -1
                      ? "abrir_intento"
                      : "abrir_examen",
                  data_id: id_contenido,
                });
              } else {
                if (datos.id_examen_intento_abierto != -1) {
                  navigate(
                    `/examen/intento/${datos.id_examen_intento_abierto}/${dataCurso.id}`
                  );
                } else {
                  //si es de tipo 1 se crea un intento, de lo contrario se envia a la presentacion del examen.
                  if (datos.tipo != 1) {
                    navigate(
                      `/examen/presentacion/${datos.id}/${dataCurso.id}/${url_amigable}`
                    );
                  } else {
                    iniciarIntentoExamen(datos.id, dataCurso.id);
                  }
                }
              }
              break;
            default:
              setDataContenidoViendo(datos);
              if ([5, 6].includes(datos.tipo_contenido)) {
                //Si son los foros o tareas
                setPestanaActivada(-1); //No se activa ninguna para que el enfoque esté en el tema superior
              } else {
                setPestanaActivada(3); //Se activa la descripción
              }
              break;
          }
        } else {
          mensajesDeError(
            setPopup,
            response.status,
            typeof datos.datos !== "undefined" ? datos.datos : {},
            false,
            { titulo: "", contenido: "" }
          );
          setContenidoActivado(contenidoActivadoAnterior);
        }
      } catch (error) {
        // Manejar el caso de error en la solicitud
        console.error("Error en la solicitud al servidor", error);
      }
    }
  };

  /*
        Sirve para iniciar un intento automaticamente cuando se intentan abrir examenes tipo basico, el cual no requiere de que se muestre la pantalla de presentacion, pero si requiere que el intento esté habilitado.
        Esta funcion fue copiada de ExamenPresentacion.jsx "iniciarIntento".
    */
  const iniciarIntentoExamen = async (id_examen, id_curso) => {
    try {
      const formData = new FormData();
      formData.append("id_examen", id_examen);
      formData.append("id_curso", id_curso);

      const opciones = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      };
      const response = await fetch(`${urlBaseApi}/api/examenintento`, opciones);
      const datos = await response.json();
      if (response.ok) {
        navigate(`/examen/intento/${datos.id_intento}/${id_curso}`);
      } else {
        setContenidoActivado(contenidoActivado);
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

  const handleActualizaPosicionActualVideo = async (posicion_acutal) => {
    const raw = {
      puntuacion: posicion_acutal.toString(),
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
        `${urlBaseApi}/api/cursocontenidoconsumo/${contenidoActivado}`,
        opciones
      );
      const datos = await response.json();
      if (response.ok) {
        //return;
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
      console.error("Error de conexión:", error);
    }
  };

  const handleActualizaEstadoConsumo = async () => {
    if (dataContenidoViendo.consumo_estado == 0) {
      const raw = {
        estado: 1,
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
          `${urlBaseApi}/api/cursocontenidoconsumo/${contenidoActivado}`,
          opciones
        );
        const datos = await response.json();
        if (response.ok) {
          obtenerContenidos({ activar_actividad_actual: true });
          setCargarMisCursos(true);
          return;
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
        console.error("Error de conexión:", error);
      }
    }
  };

  const obtenerParticipantes = async () => {
    const opciones = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
    try {
      const response = await fetch(
        `${urlBaseApi}/api/curso/getMatriculadosLista/${
          dataCurso.id
        }/1/usuario.nombres-asc${
          buscarParticipante !== "" ? `/${buscarParticipante}` : "/"
        }`,
        opciones
      );
      const datos = await response.json();
      if (response.ok) {
        setParticipantes(datos.matriculados);
        return;
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
      console.error("Error de conexión:", error);
    }
  };

  const obtenerCalificaciones = async () => {
    const opciones = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
    try {
      const response = await fetch(
        `${urlBaseApi}/api/curso/getNotas/${dataCurso.id}`,
        opciones
      );
      const datos = await response.json();
      if (response.ok) {
        setCalificaciones(datos.datos?.usuarios);
        return;
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
      console.error("Error de conexión:", error);
    }
  };

  //manejo del acordeon
  const [activeTab, setActiveTab] = useState([]);

  /*const toggleTab = (tabIndex) => {
        setActiveTab((prevTab) => (prevTab === tabIndex ? null : tabIndex));
    };*/

  const [collapsing, setCollapsing] = useState(false);
  const toggleTab = (tabIndex) => {
    if (activeTab.includes(tabIndex)) {
      const copyActiveTabs = activeTab.filter((item) => item !== tabIndex);
      setActiveTab(copyActiveTabs);
      setCollapsing(false);
    } else {
      setCollapsing(true);
      setActiveTab([...activeTab, tabIndex]);
      setTimeout(() => {
        setCollapsing(false);
      }, 350); // Desactivar "collapsing" después de 0.35 segundos
    }
  };

  const handleMostrarMasDescripcionCurso = (event) => {
    event.preventDefault();
    setMostrarMasCursoDescripcion(!mostrarMasCursoDescripcion);
    if (refBloqueDescripcion.current) {
      refBloqueDescripcion.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGenerarCertificado = async () => {
    if (
      (parseFloat(dataCurso.nota_minima_superado) == 0 &&
        dataCurso.porcentaje_progreso == 100) ||
      (parseFloat(dataCurso.nota_minima_superado) > 0 &&
        parseFloat(dataCurso.calificacion_curso) >=
          parseFloat(dataCurso.nota_minima_superado))
    ) {
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
          `${urlBaseApi}/api/certificado/generar/${dataCurso.id}`,
          opciones
        );
        setMostrarSpinner(false);
        const datos = await response.blob();
        if (response.ok) {
          const blob = new Blob([datos], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `certificado_${dataCurso.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          setPopup({
            mostrar: true,
            titulo: "Mensaje",
            contenido:
              "El certificado está siendo descargado, por favor revise su carpeta de descargas.",
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
    } else {
      if (
        parseFloat(dataCurso.nota_minima_superado) == 0 &&
        dataCurso.porcentaje_progreso < 100
      ) {
        setPopup({
          mostrar: true,
          titulo: "Debe completar al curso al 100%",
          contenido:
            "Para descargar el certificado debes completar el curso al 100%.",
        });
      } else {
        if (
          parseFloat(dataCurso.nota_minima_superado) > 0 &&
          parseFloat(dataCurso.calificacion_curso) <
            parseFloat(dataCurso.nota_minima_superado)
        ) {
          setPopup({
            mostrar: true,
            titulo: "Debe al alcanzar una nota especifica",
            contenido: `Para descargar el certificado debes alcanzar una nota global en el curso de ${dataCurso.nota_minima_superado}, actualmente tu nota es ${dataCurso.calificacion_curso}.`,
          });
        }
      }
    }
  };

  const obtenerNotas = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      const response = await fetch(
        `${urlBaseApi}/api/curso/getNotas/${dataCurso.id}`,
        opciones
      );
      const datos = await response.json();
      if (response.ok) {
        setNotas(datos.datos);
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

  const nivelHabilidad = ["", "Básico", "Intermedio", "Avanzado"];

  const handleSetBuscarParticipante = (e) => {
    setBuscarParticipante(e.target.value);
  };

  const handleSetBuscarCalificacion = (e) => {
    setBuscarCalificacion(e.target.value);
  };

  useEffect(() => {
    if (pestanaActivada === 6) {
      obtenerParticipantes();
    }
  }, [pestanaActivada, buscarParticipante]);

  useEffect(() => {
    if (pestanaActivada === 7) {
      obtenerCalificaciones();
    }
  }, [pestanaActivada]);

  return (
    <>
      {mostrarSpinner && <Spinner />}
      <Popup
        mostrarPopup={popUp.mostrar}
        tamano="xx"
        tipo={popUp.tipo}
        titulo={popUp.titulo}
        mensaje={popUp.contenido}
        funcionAceptar={handleFuncionAceptarPopUp}
        funcionCerrar={handleFuncionCerrarPopUp}
        textoCerrar="Cerrar"
      />
      <FormularioPlayHeader
        id_curso={dataCurso.id}
        es_docente={dataCurso.es_docente}
        nombre_curso={dataCurso.nombre}
        instructor_edita_contenido={
          dataCurso.es_docente && dataCurso.instructor_edita_contenido
            ? true
            : false
        }
        curso_url_amigable={url_amigable}
        favorito={dataCurso.favorito}
        archivado={dataCurso.archivado}
        tiene_review={dataCurso.tiene_review}
        porcentaje_progreso={dataCurso.porcentaje_progreso}
        callBackFavoritoCambiado={obtenerDatosDelServidor}
      />
      {popUpVideollamada.mostrar == 1 && (
        <CrearEditarVideollamada
          id_curso={dataCurso?.id ? dataCurso.id : -1}
          es_docente={dataCurso.es_docente}
          funcionMostrarPopUp={() => {
            setPopupVideollamada({ ...popUpVideollamada, mostrar: 0 });
            obtenerDatosDelServidor();
          }}
        />
      )}
      <section className="course-dashboard" style={{ marginTop: "80px" }}>
        <div className="course-dashboard-wrap">
          <div className="course-dashboard-container d-flex">
            <div className="course-dashboard-column">
              <div className="lecture-video-detail">
                <div className="lecture-tab-body bg-gray p-4">
                  <ul
                    className="nav nav-tabs generic-tab"
                    id="myTab"
                    role="tablist"
                  >
                    <li className="nav-item" style={{ display: "none" }}>
                      <a
                        className="nav-link"
                        id="search-tab"
                        data-toggle="tab"
                        href="#search"
                        role="tab"
                        aria-controls="search"
                        aria-selected="false"
                      >
                        <i className="la la-search"></i>
                      </a>
                    </li>
                    {[2, 3, 4, 7].includes(tipoContenidoHilo) ? (
                      <li className="nav-item">
                        <a
                          onClick={(event) => {
                            handleCambiarPestana(event, 3);
                          }}
                          className={`nav-link ${
                            pestanaActivada == 3 ? "active" : ""
                          }`}
                          id="question-and-ans-tab"
                          data-toggle="tab"
                          href="#question-and-ans"
                          role="tab"
                          aria-controls="question-and-ans"
                          aria-selected="false"
                        >
                          Descripción
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    <li className="nav-item mobile-menu-nav-item">
                      <a
                        onClick={(event) => {
                          handleCambiarPestana(event, 1);
                        }}
                        className={`nav-link ${
                          pestanaActivada == 1 ? "active" : ""
                        }`}
                        id="course-content-tab"
                        data-toggle="tab"
                        href="#course-content"
                        role="tab"
                        aria-controls="course-content"
                        aria-selected="false"
                      >
                        Contenido del curso
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        onClick={(event) => {
                          handleCambiarPestana(event, 9);
                        }}
                        className={`nav-link ${
                          pestanaActivada == 9 ? "active" : ""
                        }`}
                        id="overview-tab"
                        data-toggle="tab"
                        href="#overview"
                        role="tab"
                        aria-controls="overview"
                        aria-selected="true"
                      >
                        Presentación
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        onClick={(event) => {
                          handleCambiarPestana(event, 2);
                        }}
                        className={`nav-link ${
                          pestanaActivada == 2 ? "active" : ""
                        }`}
                        id="overview-tab"
                        data-toggle="tab"
                        href="#overview"
                        role="tab"
                        aria-controls="overview"
                        aria-selected="true"
                      >
                        Vista general
                      </a>
                    </li>

                    {!dataCurso.es_docente ? (
                      <li className="nav-item">
                        <a
                          onClick={(event) => {
                            handleCambiarPestana(event, 5);
                          }}
                          className={`nav-link ${
                            pestanaActivada == 5 ? "active" : ""
                          }`}
                          id="grades-tab"
                          data-toggle="tab"
                          href="#grades"
                          role="tab"
                          aria-controls="grades"
                          aria-selected="true"
                        >
                          Mis calificaciones
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {dataCurso.es_docente ? (
                      <li className="nav-item">
                        <a
                          onClick={(event) => {
                            handleCambiarPestana(event, 6);
                          }}
                          className={`nav-link ${
                            pestanaActivada == 6 ? "active" : ""
                          }`}
                          id="grades-tab"
                          data-toggle="tab"
                          href="#grades"
                          role="tab"
                          aria-controls="grades"
                          aria-selected="true"
                        >
                          Participantes
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {dataCurso.es_docente ? (
                      <li className="nav-item">
                        <a
                          onClick={(event) => {
                            handleCambiarPestana(event, 7);
                          }}
                          className={`nav-link ${
                            pestanaActivada == 7 ? "active" : ""
                          }`}
                          id="grades-tab"
                          data-toggle="tab"
                          href="#grades"
                          role="tab"
                          aria-controls="grades"
                          aria-selected="true"
                        >
                          Calificaciones
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    <li className="nav-item">
                      <a
                        onClick={(event) => {
                          handleCambiarPestana(event, 8);
                        }}
                        className={`nav-link ${
                          pestanaActivada == 8 ? "active" : ""
                        }`}
                        id="calendar-tab"
                        data-toggle="tab"
                        href="#calendar"
                        role="tab"
                        aria-controls="calendar"
                        aria-selected="true"
                      >
                        Calendario
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        onClick={(event) => {
                          handleCambiarPestana(event, 4);
                        }}
                        className={`nav-link ${
                          pestanaActivada == 4 ? "active" : ""
                        }`}
                        id="announcements-tab"
                        data-toggle="tab"
                        href="#announcements"
                        role="tab"
                        aria-controls="announcements"
                        aria-selected="false"
                      >
                        Anuncios
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="lecture-viewer-container">
                <div
                  className="lecture-video-item"
                  style={{
                    position: "relative",
                    paddingTop:
                      dataContenidoViendo.tipo_contenido == 1 ||
                      dataContenidoViendo.tipo_contenido == 4 ||
                      (dataContenidoViendo.tipo_contenido == 3 &&
                        dataContenidoViendo.ruta_archivo
                          .split(".")
                          .pop()
                          .split("?")[0]
                          .split("#")[0] == "pdf")
                        ? "56.25%"
                        : "0%",
                  }}
                >
                  {" "}
                  {/* (9 / 16) * 100 = 56.25 */}
                  {dataContenidoViendo.tipo_contenido == 1 ? (
                    <VideoPlayerPrisma
                      url_video={`${urlBaseApi}/${
                        esMovil
                          ? dataContenidoViendo.video_pequeno != null
                            ? dataContenidoViendo.video_pequeno
                            : dataContenidoViendo.video_grande
                          : dataContenidoViendo.video_grande
                      }`}
                      url_imagen_preview={`${urlBaseApi}/${dataContenidoViendo.imagen_preview_grande}`}
                      posision_actual={parseInt(
                        dataContenidoViendo.consumo_puntuacion
                      )}
                      estado_consumo={dataContenidoViendo.consumo_estado}
                      funcion_reportar_posicion_actual={
                        handleActualizaPosicionActualVideo
                      }
                      funcion_reportar_visto_completo={
                        handleActualizaEstadoConsumo
                      }
                    />
                  ) : dataContenidoViendo.tipo_contenido == 3 ? (
                    <Recurso id_contenido={contenidoActivado} />
                  ) : dataContenidoViendo.tipo_contenido == 4 ? (
                    <Iframex frame={dataContenidoViendo} />
                  ) : dataContenidoViendo.tipo_contenido == 6 ? (
                    <>
                      <div className="pt-60px pb-60px">
                        <div className="container">
                          <div className="breadcrumb-content pt-40px ">
                            <div className="section-heading">
                              <h2 className="section__title fs-30 pb-2">
                                <i className="la la-comments mr-2"></i>
                                {dataContenidoViendo.nombre}
                              </h2>
                              {dataContenidoViendo.descripcion == "" ? (
                                <>
                                  <Skeleton width={"60%"} height={20} />
                                  <Skeleton width={"55%"} height={20} />
                                  <Skeleton width={"45%"} height={20} />
                                </>
                              ) : (
                                <p className="section__desc">
                                  {dataContenidoViendo.descripcion
                                    .split("<br />")
                                    .map((line, index) => (
                                      <span
                                        key={`desc-general-larga-top-${index}`}
                                      >
                                        {line}
                                        <br />
                                      </span>
                                    ))}
                                </p>
                              )}
                            </div>
                          </div>
                          <HiloComentarios
                            id_hilo={dataContenidoViendo.id_comentario_hilo}
                            id_objeto_enlace={dataContenidoViendo.id}
                            tipo_objeto_enlace={
                              dataContenidoViendo.tipo_contenido
                            }
                            id_curso={dataCurso.id}
                            es_docente={dataCurso.es_docente}
                            funcionRecargarContenidosCurso={() => {
                              obtenerContenidos({
                                activar_actividad_actual: true,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="lecture-viewer-text-wrap">
                  <div className="lecture-viewer-text-content custom-scrollbar-styled">
                    <div className="lecture-viewer-text-body">
                      <h2 className="fs-24 font-weight-semi-bold pb-4">
                        Download your Footage for your Quick Start
                      </h2>
                      <div className="lecture-viewer-content-detail">
                        <ul className="generic-list-item pb-4">
                          <li>Hi</li>
                          <li>Welcome to Motion Graphics in After Effects. </li>
                          <li>
                            In the next lectures you will start creating your
                            first animation and animate imported footage.
                          </li>
                          <li>
                            But I must explain to you how all this mistaken idea
                            of denouncing pleasure and praising pain was born
                            and I will give you a complete account of the
                            system, and expound the actual teachings of the
                            great explorer of the truth, the master-builder of
                            human happiness. No one rejects, dislikes,
                          </li>
                          <li>
                            At vero eos et accusamus et iusto odio dignissimos
                            ducimus qui blanditiis praesentium voluptatum
                            deleniti atque corrupti quos dolores et quas
                            molestias excepturi sint occaecati cupiditate non
                            provident, similique sunt in culpa qui officia
                            deserunt mollitia animi, id est laborum et dolorum
                            fuga.{" "}
                          </li>
                          <li>
                            Occaecati cupiditate non provident, similique sunt
                            in culpa qui officia deserunt mollitia animi, id est
                            laborum et dolorum fuga.{" "}
                          </li>
                          <li>
                            Et harum quidem rerum facilis est et expedita
                            distinctio. Nam libero tempore, cum soluta nobis est
                            eligendi optio cumque nihil impedit quo minus id
                            quod maxime placeat facere possimus,
                          </li>
                          <li>
                            On the other hand, we denounce with righteous
                            indignation and dislike men who are so beguiled and
                            demoralized by the charms of pleasure of the moment,
                            so blinded by desire, that they cannot foresee the
                            pain and trouble that are bound to ensue; and equal
                            blame belongs to those who fail in their duty
                            through weakness of will, which is the same as
                            saying through shrinking from toil and pain. These
                            cases are perfectly simple and easy to distinguish.{" "}
                          </li>
                          <li>
                            <strong className="font-weight-semi-bold">
                              Download your footage Now, Click on the Link
                              Below.
                            </strong>
                          </li>
                        </ul>
                        <div className="btn-box">
                          <h3 className="fs-18 font-weight-semi-bold pb-3">
                            Resources for this lecture
                          </h3>
                          <a
                            href="#"
                            className="btn theme-btn theme-btn-transparent"
                          >
                            <i className="la la-file-zip-o mr-1"></i>
                            Quick-start.zip
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lecture-video-detail">
                {/* Vista para actividades de tipo tarea */}
                {dataContenidoViendo.tipo_contenido == 5 && (
                  <Tarea
                    id_contenido={contenidoActivado}
                    id_curso={dataCurso.id}
                    es_docente={dataCurso.es_docente}
                  />
                )}
                <div
                  className="lecture-video-detail-body"
                  style={
                    pestanaActivada == 1
                      ? { padding: "0" }
                      : pestanaActivada == 3
                      ? { padding: "15px" }
                      : {}
                  }
                >
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade"
                      id="search"
                      role="tabpanel"
                      aria-labelledby="search-tab"
                    >
                      <div className="search-course-wrap pt-40px">
                        <form action="#" className="pb-5">
                          <div className="input-group">
                            <input
                              className="form-control form--control form--control-gray pl-3"
                              type="text"
                              name="search"
                              placeholder="Search course content"
                            />
                            <div className="input-group-append">
                              <button className="btn theme-btn">
                                <span className="la la-search"></span>
                              </button>
                            </div>
                          </div>
                        </form>
                        <div className="search-results-message text-center">
                          <h3 className="fs-24 font-weight-semi-bold pb-1">
                            Start a new search
                          </h3>
                          <p>To find captions, lectures or resources</p>
                        </div>
                      </div>
                    </div>
                    <div ref={refHiloComentarios}></div>

                    <div
                      className={`tab-pane fade show ${
                        pestanaActivada == 1 ? "active" : ""
                      }`}
                      id="course-content"
                      role="tabpanel"
                      aria-labelledby="course-content-tab"
                    >
                      <div className="mobile-course-menu pt-4">
                        <div
                          className="accordion generic-accordion generic--accordion"
                          id="mobileCourseAccordionCourseExample"
                        >
                          {dataCurso?.videollamadas?.length > 0 ? (
                            <div
                              className="course-dashboard-side-heading"
                              style={{ backgroundColor: "#8547FF" }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ width: "100%" }}
                              >
                                <h3
                                  className="fs-18 font-weight-semi-bold"
                                  style={{ color: "#ffffff" }}
                                >
                                  Siguiente Videoclase
                                </h3>
                                <div className="courser-item-meta-wrap">
                                  <p
                                    className="course-item-meta"
                                    style={{ color: "#ffffff" }}
                                  >
                                    {
                                      dataCurso?.videollamadas[0]
                                        .fecha_hora_inicio_esp
                                    }
                                  </p>
                                </div>
                              </div>
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ width: "100%" }}
                              >
                                {dataCurso.videollamadas[0]
                                  .segundos_restantes_inicio < 172800 ? (
                                  <CountdownTimer
                                    segundosRestantesInicio={
                                      dataCurso.videollamadas[0]
                                        .segundos_restantes_inicio
                                    }
                                    segundosRestantesFin={
                                      dataCurso.videollamadas[0]
                                        .segundos_restantes_fin
                                    }
                                    functionTimeUp={() => {
                                      setEntrarVideollamada({
                                        mostrar: true,
                                        url: dataCurso.videollamadas[0].url,
                                      });
                                    }}
                                  />
                                ) : (
                                  ""
                                )}
                                {entrarVideollamada.mostrar == true ? (
                                  <button
                                    type="button"
                                    className="btn theme-btn theme-btn-white mb-2"
                                    onClick={() =>
                                      window.open(
                                        entrarVideollamada.url,
                                        "_blank"
                                      )
                                    }
                                  >
                                    {" "}
                                    Entrar{" "}
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}

                          {contenido.map((categoria, index) => (
                            <div
                              key={`seccion-contenidos-movil-${index}`}
                              className="card"
                            >
                              <div
                                className="card-header"
                                id={`mobileCourseHeading${parseInt(index) + 1}`}
                              >
                                <button
                                  onClick={() => toggleTab(index)}
                                  aria-expanded={activeTab.includes(index)}
                                  className="btn btn-link"
                                  type="button"
                                  data-toggle="collapse"
                                  data-target={`#mobileCourseCollapse${
                                    parseInt(index) + 1
                                  }`}
                                  aria-controls={`mobileCourseCollapse${
                                    parseInt(index) + 1
                                  }`}
                                >
                                  <i
                                    className="la la-angle-down"
                                    style={{ display: "none" }}
                                  ></i>
                                  <i
                                    className="la la-angle-up"
                                    style={{ display: "none" }}
                                  ></i>
                                  <span className="fs-15">
                                    {" "}
                                    {dataCurso.personalizado_tipo_curso ===
                                    "diplomado"
                                      ? "Modulo"
                                      : "Unidad"}{" "}
                                    {parseInt(index) + 1}: {categoria.nombre}{" "}
                                  </span>
                                  <span className="course-duration">
                                    <span>
                                      &nbsp;{categoria.cantidad_consumidos}/
                                      {categoria.cantidad_contenidos}
                                    </span>
                                    <span style={{ display: "none" }}>
                                      21min
                                    </span>
                                  </span>
                                </button>
                              </div>
                              <div
                                id={`mobileCourseCollapse${
                                  parseInt(index) + 1
                                }`}
                                className="show"
                                aria-labelledby={`mobileCourseHeading${
                                  parseInt(index) + 1
                                }`}
                                data-parent="#mobileCourseAccordionCourseExample"
                              >
                                <div className="card-body p-0">
                                  <ul className="curriculum-sidebar-list">
                                    {Object.keys(categoria.curso_contenido).map(
                                      (key, index2) => (
                                        <li
                                          key={`contenido-mobil-${key}`}
                                          className={`course-item-link ${
                                            categoria.curso_contenido[key]
                                              .id_contenido == contenidoActivado
                                              ? "active"
                                              : ""
                                          }`}
                                        >
                                          <div className="course-item-content-wrap">
                                            <div className="custom-control custom-checkbox">
                                              {categoria.curso_contenido[key]
                                                .cantidad_notificaciones > 0 ? (
                                                <span
                                                  className="product-count"
                                                  style={{
                                                    position: "relative",
                                                    marginLeft: "-1.5rem",
                                                    verticalAlign: "top",
                                                  }}
                                                >
                                                  {
                                                    categoria.curso_contenido[
                                                      key
                                                    ].cantidad_notificaciones
                                                  }
                                                </span>
                                              ) : (
                                                <>
                                                  <input
                                                    onChange={() => {}}
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id={`mobileCourseCheckbox${
                                                      parseInt(key) + 1
                                                    }`}
                                                    checked={`${
                                                      categoria.curso_contenido[
                                                        key
                                                      ].estado_consumo == 1
                                                        ? "checked"
                                                        : ""
                                                    }`}
                                                  />
                                                  <label
                                                    className="custom-control-label custom--control-label"
                                                    htmlFor={`mobileCourseCheckbox${
                                                      parseInt(key) + 1
                                                    }`}
                                                  ></label>
                                                </>
                                              )}
                                            </div>
                                            <div
                                              className="course-item-content"
                                              onClick={() => {
                                                cargarContenidoEspecifico(
                                                  categoria.curso_contenido[key]
                                                    .id_contenido,
                                                  false
                                                );
                                              }}
                                            >
                                              <div
                                                className="custom-control custom-checkbox media media-card"
                                                style={{ float: "left" }}
                                              >
                                                {categoria.curso_contenido[key]
                                                  .tipo_contenido == 1 ? (
                                                  <div
                                                    className="media-img"
                                                    style={{
                                                      height: "auto",
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {categoria.curso_contenido[
                                                      key
                                                    ].imagen_preview_pequena &&
                                                    categoria.curso_contenido[
                                                      key
                                                    ].imagen_preview_pequena !=
                                                      null ? (
                                                      <img
                                                        src={`${urlBaseApi}/${categoria.curso_contenido[key].imagen_preview_pequena}`}
                                                        alt={
                                                          categoria
                                                            .curso_contenido[
                                                            key
                                                          ].nombre
                                                        }
                                                      />
                                                    ) : (
                                                      <img
                                                        src={`${urlBase}/images/course-no-image.png`}
                                                        alt={
                                                          categoria
                                                            .curso_contenido[
                                                            key
                                                          ].nombre
                                                        }
                                                      />
                                                    )}
                                                  </div>
                                                ) : categoria.curso_contenido[
                                                    key
                                                  ].tipo_contenido == 3 ? (
                                                  <div
                                                    className="media-img"
                                                    style={{
                                                      height: "auto",
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {categoria.curso_contenido[
                                                      key
                                                    ]
                                                      .ruta_imagen_preview_small &&
                                                    categoria.curso_contenido[
                                                      key
                                                    ]
                                                      .ruta_imagen_preview_small !=
                                                      null ? (
                                                      <img
                                                        src={`${urlBaseApi}/${categoria.curso_contenido[key].ruta_imagen_preview_small}`}
                                                        alt={
                                                          categoria
                                                            .curso_contenido[
                                                            key
                                                          ].nombre
                                                        }
                                                      />
                                                    ) : (
                                                      <img
                                                        src={`${urlBase}/images/course-no-image.png`}
                                                        alt={
                                                          categoria
                                                            .curso_contenido[
                                                            key
                                                          ].nombre
                                                        }
                                                      />
                                                    )}
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>

                                              <h4 className="fs-15">
                                                {parseInt(key) + 1}.{" "}
                                                {
                                                  categoria.curso_contenido[key]
                                                    .nombre
                                                }
                                              </h4>
                                              <div className="courser-item-meta-wrap">
                                                <p className="course-item-meta">
                                                  {categoria.curso_contenido[
                                                    key
                                                  ].tipo_contenido == 1 ? (
                                                    <i className="la la-play-circle"></i>
                                                  ) : categoria.curso_contenido[
                                                      key
                                                    ].tipo_contenido === 2 ? (
                                                    categoria.curso_contenido[
                                                      key
                                                    ].tipo == 1 ? (
                                                      <span>
                                                        <i className="la la-gamepad"></i>{" "}
                                                        Actividad
                                                      </span>
                                                    ) : (
                                                      <span>
                                                        <i className="la la-pencil"></i>{" "}
                                                        Examen
                                                      </span>
                                                    )
                                                  ) : categoria.curso_contenido[
                                                      key
                                                    ].tipo_contenido === 3 ? (
                                                    <span>
                                                      <i className="la la-file"></i>{" "}
                                                      Recurso
                                                    </span>
                                                  ) : categoria.curso_contenido[
                                                      key
                                                    ].tipo_contenido === 4 ? (
                                                    <span>
                                                      <i className="la la-paperclip"></i>{" "}
                                                      Etiqueta
                                                    </span>
                                                  ) : categoria.curso_contenido[
                                                      key
                                                    ].tipo_contenido === 5 ? (
                                                    <span>
                                                      <i className="la la-home"></i>{" "}
                                                      Tarea
                                                    </span>
                                                  ) : categoria.curso_contenido[
                                                      key
                                                    ].tipo_contenido === 6 ? (
                                                    <span>
                                                      <i className="la la-comments"></i>{" "}
                                                      Foro
                                                    </span>
                                                  ) : categoria.curso_contenido[
                                                      key
                                                    ].tipo_contenido === 7 ? (
                                                    <span>
                                                      <i className="la la-external-link"></i>{" "}
                                                      Url
                                                    </span>
                                                  ) : (
                                                    ""
                                                  )}

                                                  {categoria.curso_contenido[
                                                    key
                                                  ].tipo_contenido == 1
                                                    ? categoria.curso_contenido[
                                                        key
                                                      ]
                                                        .cantidad_horas_de_video_resumida
                                                    : categoria.curso_contenido[
                                                        key
                                                      ].tipo_contenido === 2
                                                    ? categoria.curso_contenido[
                                                        key
                                                      ].tipo == 1
                                                      ? ""
                                                      : categoria
                                                          .curso_contenido[key]
                                                          .cantidad_horas_de_video !=
                                                        "00:00:00"
                                                      ? " de duración " +
                                                        categoria
                                                          .curso_contenido[key]
                                                          .tiempo_resumido
                                                      : ""
                                                    : categoria.curso_contenido[
                                                        key
                                                      ].tipo_contenido === 3
                                                    ? ""
                                                    : categoria.curso_contenido[
                                                        key
                                                      ].tipo_contenido === 4
                                                    ? ""
                                                    : categoria.curso_contenido[
                                                        key
                                                      ].tipo_contenido === 5
                                                    ? ` desde ${categoria.curso_contenido[key].fecha_hora_inicio_esp} hasta ${categoria.curso_contenido[key].fecha_hora_fin_esp}`
                                                    : categoria.curso_contenido[
                                                        key
                                                      ].tipo_contenido === 6
                                                    ? ` desde ${categoria.curso_contenido[key].fecha_hora_inicio_esp} hasta ${categoria.curso_contenido[key].fecha_hora_fin_esp}`
                                                    : categoria.curso_contenido[
                                                        key
                                                      ].tipo_contenido === 7
                                                    ? ` Link externo`
                                                    : ""}
                                                </p>
                                                {Object.keys(
                                                  categoria.curso_contenido[key]
                                                    .descargables
                                                ).length > 0 && (
                                                  <div
                                                    key={`drop-contenido-mobil-${categoria.curso_contenido[key].id_contenido}-${key}`}
                                                    className="generic-action-wrap"
                                                  >
                                                    <DropdownContenido
                                                      id_curso_contenido={
                                                        categoria
                                                          .curso_contenido[key]
                                                          .id_contenido
                                                      }
                                                      data={
                                                        categoria
                                                          .curso_contenido[key]
                                                          .descargables
                                                      }
                                                      mostrarHaciaArriba={
                                                        index2 ===
                                                        Object.keys(
                                                          categoria.curso_contenido
                                                        ).length -
                                                          1
                                                      }
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`tab-pane fade show ${
                        pestanaActivada == 2 ? "active" : ""
                      }`}
                      id="overview"
                      role="tabpanel"
                      aria-labelledby="overview-tab"
                    >
                      <div className="lecture-overview-wrap">
                        <div className="lecture-overview-item">
                          <h3 className="fs-24 font-weight-semi-bold pb-2">
                            {dataCurso.nombre}
                          </h3>
                          <p>
                            {dataCurso.desc_general_corta
                              .split("<br />")
                              .map((line, index2) => (
                                <span key={`desc-general-corta-${index2}`}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                          </p>
                        </div>
                        <div className="section-block"></div>

                        <div className="lecture-overview-item">
                          <div className="lecture-overview-stats-wrap d-flex">
                            <div className="lecture-overview-stats-item">
                              <h3 className="fs-16 font-weight-semi-bold pb-2">
                                Clave de la asignatura
                              </h3>
                            </div>
                            <div className="lecture-overview-stats-item col">
                              <p>{dataCurso.codigo}</p>
                            </div>
                          </div>
                        </div>

                        {dataCurso.id_instructor != 0 ? (
                          <>
                            <div className="section-block"></div>
                            <div className="lecture-overview-item">
                              <div className="lecture-overview-stats-wrap d-flex ">
                                <div className="lecture-overview-stats-item">
                                  <h3 className="fs-16 font-weight-semi-bold pb-2">
                                    Presentación docente
                                  </h3>
                                </div>
                                <div className="lecture-overview-stats-item lecture-overview-stats-wide-item col">
                                  <div className="media media-card align-items-center">
                                    <Link
                                      to={`/usuario/${dataCurso.id_instructor}`}
                                      className="media-img d-block rounded-full avatar-md"
                                    >
                                      <img
                                        className="rounded-full"
                                        src={
                                          dataCurso.instructor_imagen_pequena ==
                                          null
                                            ? `${urlBase}/images/avatar_docente.jpg`
                                            : `${urlBaseApi}/${dataCurso.instructor_imagen_pequena}`
                                        }
                                        data-src={`${urlBase}/images/avatar_docente.jpg`}
                                        alt="Foto del instructor"
                                      />
                                    </Link>
                                    <div className="media-body">
                                      <h5>
                                        <Link
                                          to={`/usuario/${dataCurso.id_instructor}`}
                                        >
                                          {dataCurso.instructor}
                                        </Link>
                                      </h5>
                                      <span className="d-block lh-18 pt-2">
                                        Docente
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    className="lecture-owner-profile pt-4"
                                    style={{ display: "none" }}
                                  >
                                    <ul className="social-icons social-icons-styled">
                                      <li>
                                        <a href="#" className="facebook-bg">
                                          <i className="la la-facebook"></i>
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#" className="twitter-bg">
                                          <i className="la la-twitter"></i>
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#" className="instagram-bg">
                                          <i className="la la-instagram"></i>
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#" className="linkedin-bg">
                                          <i className="la la-linkedin"></i>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                  <div className="lecture-owner-decription pt-4">
                                    {Object.keys(docenteDescripcion)
                                      .slice(0, 1)
                                      .map((key) => (
                                        <p
                                          key={`desc_docente_${key}`}
                                          className="pb-3"
                                        >
                                          {docenteDescripcion[key]}
                                        </p>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}

                        {(dataCurso?.personalizado_tipo_curso_data?.text_areas_mostrados?.includes(
                          "area_de_formacion"
                        ) ||
                          dataCurso.personalizado_tipo_curso === null) && (
                          <div className="lecture-overview-item">
                            <div className="lecture-overview-stats-wrap d-flex">
                              <div className="lecture-overview-stats-item">
                                <h3 className="fs-16 font-weight-semi-bold pb-2">
                                  Área de formación
                                </h3>
                              </div>
                              <div className="lecture-overview-stats-item lecture-overview-stats-wide-item col">
                                <ul className="generic-list-item generic-list-item-bullet fs-15">
                                  {area_de_formacion?.map((key) => (
                                    <li key={`area_de_formacion${key}`}>
                                      {key}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                        {(dataCurso.personalizado_tipo_curso_data?.text_areas_mostrados?.includes(
                          "fines_de_aprendizaje"
                        ) ||
                          dataCurso.personalizado_tipo_curso === null) && (
                          <div className="lecture-overview-item">
                            <div className="lecture-overview-stats-wrap d-flex">
                              <div className="lecture-overview-stats-item">
                                <h3 className="fs-16 font-weight-semi-bold pb-2">
                                  Fines de aprendizaje
                                </h3>
                              </div>
                              <div className="lecture-overview-stats-item lecture-overview-stats-wide-item col">
                                <ul className="generic-list-item generic-list-item-bullet fs-15">
                                  {fines_de_aprendizaje?.map((key) => (
                                    <li key={`fines_de_aprendizaje${key}`}>
                                      {key}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {(dataCurso.personalizado_tipo_curso_data?.text_areas_mostrados?.includes(
                          "proposito_del_curso"
                        ) ||
                          dataCurso.personalizado_tipo_curso === null) && (
                          <div className="lecture-overview-item">
                            <div className="lecture-overview-stats-wrap d-flex">
                              <div className="lecture-overview-stats-item">
                                <h3 className="fs-16 font-weight-semi-bold pb-2">
                                  Propósito del curso
                                </h3>
                              </div>
                              <div className="lecture-overview-stats-item lecture-overview-stats-wide-item col">
                                <ul className="generic-list-item generic-list-item-bullet fs-15">
                                  {proposito_del_curso?.map((key) => (
                                    <li key={`proposito_del_curso${key}`}>
                                      {key}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {(dataCurso.personalizado_tipo_curso_data?.text_areas_mostrados?.includes(
                          "queAprenderas"
                        ) ||
                          dataCurso.personalizado_tipo_curso === null) && (
                          <div className="lecture-overview-item">
                            <div className="lecture-overview-stats-wrap d-flex">
                              <div className="lecture-overview-stats-item">
                                <h3 className="fs-16 font-weight-semi-bold pb-2">
                                  Que aprenderás?
                                </h3>
                              </div>
                              <div className="lecture-overview-stats-item lecture-overview-stats-wide-item col">
                                <ul className="generic-list-item overview-list-item">
                                  {queAprenderas?.map((key) => (
                                    <li key={`queAprenderas${key}`}>
                                      <i className="la la-check mr-1 text-black"></i>
                                      {key}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {(dataCurso.personalizado_tipo_curso_data?.text_areas_mostrados?.includes(
                          "requerimientos"
                        ) ||
                          dataCurso.personalizado_tipo_curso === null) && (
                          <div className="lecture-overview-item">
                            <div className="lecture-overview-stats-wrap d-flex">
                              <div className="lecture-overview-stats-item">
                                <h3 className="fs-16 font-weight-semi-bold pb-2">
                                  Requerimientos
                                </h3>
                              </div>
                              <div className="lecture-overview-stats-item lecture-overview-stats-wide-item col">
                                <ul className="generic-list-item generic-list-item-bullet fs-15">
                                  {listadoRequerimientos?.map((key) => (
                                    <li key={`requerimientos${key}`}>{key}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="section-block"></div>
                        <div
                          className="section-block"
                          ref={refBloqueDescripcion}
                          id="bloqueDescripcion"
                        ></div>
                        {(dataCurso.personalizado_tipo_curso_data?.text_areas_mostrados?.includes(
                          "desc_general"
                        ) ||
                          dataCurso.personalizado_tipo_curso === null) && (
                          <div className="lecture-overview-item">
                            <div className="lecture-overview-stats-wrap d-flex">
                              <div className="lecture-overview-stats-item">
                                <h3 className="fs-16 font-weight-semi-bold pb-2">
                                  Descripción
                                </h3>
                              </div>
                              <div className="lecture-overview-stats-item lecture-overview-stats-wide-item lecture-description col">
                                {Object.keys(cursoDescripcion)
                                  .slice(0, 1)
                                  .map((key) => (
                                    <p
                                      key={`desc_curso_${key}`}
                                      className="pb-3"
                                    >
                                      {cursoDescripcion[key]}
                                    </p>
                                  ))}
                                {Object.keys(cursoDescripcion).length > 1 && (
                                  <div
                                    className={
                                      mostrarMasCursoDescripcion == 0
                                        ? "collapse"
                                        : ""
                                    }
                                    id="collapseMoreTwo"
                                  >
                                    {Object.keys(cursoDescripcion)
                                      .slice(1, cursoDescripcion.length)
                                      .map((key) => (
                                        <p
                                          key={`desc_curso_${key}`}
                                          className="pb-3"
                                        >
                                          {cursoDescripcion[key]}
                                        </p>
                                      ))}
                                  </div>
                                )}
                                {Object.keys(cursoDescripcion).length > 1 && (
                                  <a
                                    className="collapse-btn collapse--btn fs-15"
                                    data-toggle="collapse"
                                    href="#collapseMoreTwo"
                                    role="button"
                                    aria-expanded={
                                      mostrarMasCursoDescripcion == 0
                                        ? "false"
                                        : "true"
                                    }
                                    aria-controls="collapseMoreTwo"
                                  >
                                    <span
                                      className="collapse-btn-hide"
                                      onClick={handleMostrarMasDescripcionCurso}
                                    >
                                      Mostrar más
                                      <i className="la la-angle-down ml-1 fs-14"></i>
                                    </span>
                                    <span
                                      className="collapse-btn-show"
                                      onClick={handleMostrarMasDescripcionCurso}
                                    >
                                      Mostrar menos
                                      <i className="la la-angle-up ml-1 fs-14"></i>
                                    </span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="lecture-overview-item">
                          <div className="lecture-overview-stats-wrap d-flex">
                            <div className="lecture-overview-stats-item">
                              <h3 className="fs-16 font-weight-semi-bold pb-2">
                                La asignatura en números
                              </h3>
                            </div>
                            <div className="lecture-overview-stats-item col">
                              <ul className="generic-list-item">
                                <li>
                                  <span>Nivel de habilidad:</span>
                                  {nivelHabilidad[dataCurso.nivel]}
                                </li>
                                <li>
                                  <span>Estudiantes:</span>
                                  {dataCurso.estudiantes_cantidad}
                                </li>
                                <li>
                                  <span>Idiomas:</span>Español
                                </li>
                              </ul>
                            </div>
                            <div className="lecture-overview-stats-item col">
                              <ul className="generic-list-item">
                                <li>
                                  <span>Exámenes:</span>
                                  {dataCurso.cantidad_examenes}
                                </li>
                                <li>
                                  <span>Horas de video producidas:</span>
                                  {dataCurso.cantidad_horas_de_video}
                                </li>
                                {/*<li><span>Certificado:</span>{dataCurso.expedir_certificado==1 ? 'Si' : 'No'}</li>*/}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {dataCurso.expedir_certificado == 1 &&
                        ((dataCurso.certificado_solo_pago == 1 &&
                          dataCurso.curso_certificado_comprado_previamente ==
                            1) ||
                          dataCurso.certificado_solo_pago == 0) ? (
                          <>
                            <div className="section-block"></div>
                            <div className="lecture-overview-item">
                              <div className="lecture-overview-stats-wrap d-flex">
                                <div className="lecture-overview-stats-item">
                                  <h3 className="fs-16 font-weight-semi-bold pb-2">
                                    Certificado
                                  </h3>
                                </div>
                                <div className="lecture-overview-stats-item lecture-overview-stats-wide-item">
                                  <p className="pb-3">
                                    Obtén el certificado de Glomind completando
                                    el curso
                                  </p>
                                  <button
                                    type="button"
                                    onClick={handleGenerarCertificado}
                                    className="btn theme-btn theme-btn-transparent"
                                  >
                                    Descargar certificado
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div
                      className={`tab-pane fade show ${
                        pestanaActivada == 3 ? "active" : ""
                      }`}
                      id="question-and-ans"
                      role="tabpanel"
                      aria-labelledby="question-and-ans-tab"
                    >
                      <div className="lecture-overview-wrap lecture-quest-wrap">
                        <div className="lecture-overview-item">
                          <h3 className="fs-24 font-weight-semi-bold pb-2">
                            {dataContenidoViendo.nombre
                              ? dataContenidoViendo.nombre
                              : ""}
                          </h3>
                          {dataContenidoViendo.descripcion != null ? (
                            <p>
                              {dataContenidoViendo.descripcion
                                .split("<br />")
                                .map((line, index2) => (
                                  <span key={`desc-general-larga-${index2}`}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                            </p>
                          ) : (
                            ""
                          )}

                          {dataContenidoViendo.tipo_contenido == 7 ? (
                            <div className="col-lg-7 mx-auto">
                              <div className="error-content text-center">
                                <div
                                  className="section-heading"
                                  style={{
                                    marginBottom: "100px",
                                    marginTop: "50px",
                                  }}
                                >
                                  <p className="section__desc">
                                    <button
                                      onClick={() =>
                                        window.open(
                                          dataContenidoViendo.url,
                                          "_blank"
                                        )
                                      }
                                      href="#"
                                      className="btn theme-btn"
                                    >
                                      Ir al sitio externo
                                    </button>
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      {dataCurso.id != -1 && tipoContenidoHilo != -1 ? (
                        <HiloComentarios
                          id_hilo={dataContenidoViendo.id_comentario_hilo}
                          id_objeto_enlace={
                            [2, 3].includes(tipoContenidoHilo)
                              ? contenidoActivado
                              : dataContenidoViendo.id
                          }
                          tipo_objeto_enlace={
                            [2, 3].includes(tipoContenidoHilo)
                              ? 99
                              : tipoContenidoHilo
                          }
                          funcionRecargarContenidosCurso={() => {
                            obtenerContenidos({
                              activar_actividad_actual: true,
                            });
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </div>

                    <div
                      className={`tab-pane fade show ${
                        pestanaActivada == 4 ? "active" : ""
                      }`}
                      id="announcements"
                      role="tabpanel"
                      aria-labelledby="announcements-tab"
                    >
                      {dataCurso.id != -1 ? (
                        <HiloAnuncio
                          id_hilo={dataCurso.id_anuncios_hilo}
                          id_objeto_enlace={dataCurso.id}
                          tipo_objeto_enlace={1}
                          es_creador={dataCurso.es_docente}
                        />
                      ) : (
                        ""
                      )}
                    </div>

                    <div
                      className={`tab-pane fade show ${
                        pestanaActivada == 5 ? "active" : ""
                      }`}
                      id="grades"
                      role="tabpanel"
                      aria-labelledby="grades"
                    >
                      <div className="lecture-overview-wrap">
                        <div className="lecture-overview-item">
                          <h3 className="fs-24 font-weight-semi-bold pb-2">
                            Mis calificaciones
                          </h3>
                          <p>
                            En este espacio encontrarás las calificaciones,
                            acompañadas de el nombre de la actividad, y el
                            porcentaje en el total del curso de la actividad.
                          </p>
                        </div>
                        <div className="section-block"></div>
                        <div className="custom-table centered">
                          <div className="thead">
                            <div className="row">
                              <div className="col">Nombre de la actividad</div>
                              <div className="col">Porcentaje del curso</div>
                              <div className="col">Calificación</div>
                            </div>
                          </div>
                          <div className="tbody">
                            {notas.usuarios && (
                              <>
                                {notas.usuarios.map((usuario, index) => (
                                  <div className="row" key={`u-${index}`}>
                                    <div className="col">
                                      Calificación del curso
                                    </div>
                                    <div className="col"></div>
                                    <div className="col">
                                      <GraficCircle
                                        value={usuario.calificacion_curso}
                                        maxValue={10}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}

                            {notas.categorias && (
                              <>
                                {notas.categorias.map((categoria) =>
                                  categoria.curso_contenido.map(
                                    (curso_contenido, index) => (
                                      <div className="row" key={`a-${index}`}>
                                        <div className="col">
                                          {curso_contenido.nombre}
                                        </div>
                                        <div className="col">
                                          {
                                            curso_contenido.porcentaje_en_total_curso
                                          }
                                        </div>
                                        <div className="col">
                                          <GraficCircle
                                            value={notas.usuarios.map(
                                              (usuario) => {
                                                const notaUsuario =
                                                  usuario.notas.find(
                                                    (nota) =>
                                                      nota.tipo_contenido ===
                                                        curso_contenido.tipo_contenido &&
                                                      nota.id_tipo_contenido ===
                                                        curso_contenido.id_tipo_contenido
                                                  );
                                                return (
                                                  <span
                                                    key={`usuario_nota_${usuario.id_usuario}_${curso_contenido.tipo_contenido}_${curso_contenido.id_tipo_contenido}`}
                                                  >
                                                    {notaUsuario
                                                      ? notaUsuario.puntuacion_fija !=
                                                        null
                                                        ? notaUsuario.puntuacion_fija
                                                        : notaUsuario.puntuacion
                                                      : "0.00"}
                                                  </span>
                                                );
                                              }
                                            )}
                                            maxValue={10}
                                          />
                                        </div>
                                      </div>
                                    )
                                  )
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade show ${
                        pestanaActivada == 6 ? "active" : ""
                      }`}
                      id="grades"
                      role="tabpanel"
                      aria-labelledby="grades"
                    >
                      <div className="lecture-overview-wrap">
                        <div className="lecture-overview-item">
                          <h3 className="fs-24 font-weight-semi-bold pb-2">
                            Participantes
                          </h3>
                          <p>
                            En este espacio encontrarás a los usuarios
                            participantes del curso con su información básica de
                            cada uno de ellos.
                          </p>
                        </div>
                        <div className="section-block"></div>
                        <div className="lecture-overview-item">
                          <div className="row mt-5">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <input
                                  onChange={handleSetBuscarParticipante}
                                  className="form-control form--control pl-3"
                                  type="text"
                                  name="buscar_video"
                                  maxLength="32"
                                  placeholder="Buscar participante"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="custom-table">
                            <div className="thead">
                              <div className="row">
                                <div className="col">Nombre / Apellido(s) </div>
                                <div className="col">Numero ID</div>
                                <div className="col">Correo electronico</div>
                                <div className="col">Ultimo acceso</div>
                                <div className="col">Estatus</div>
                              </div>
                            </div>
                            <div className="tbody">
                              {participantes.map((item, index) => (
                                <div className="row" key={`c-${index}`}>
                                  <div className="col">{item.nombres}</div>
                                  <div className="col">
                                    {item.identificacion}
                                  </div>
                                  <div className="col">{item.email}</div>
                                  <div className="col">
                                    {item.ultima_visita}
                                  </div>
                                  <div className="col">{item.estado}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade show ${
                        pestanaActivada == 7 ? "active" : ""
                      }`}
                      id="grades"
                      role="tabpanel"
                      aria-labelledby="grades"
                    >
                      <div className="lecture-overview-wrap">
                        <div className="lecture-overview-item">
                          <h3 className="fs-24 font-weight-semi-bold pb-2">
                            Calificaciones
                          </h3>
                          <p>
                            En este espacio encontrarás las calificaciones de
                            los participantes de este curso.
                          </p>
                        </div>
                        <div className="section-block"></div>
                        <div className="lecture-overview-item">
                          <div className="row mt-5">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <input
                                  onChange={handleSetBuscarCalificacion}
                                  className="form-control form--control pl-3"
                                  type="text"
                                  name="buscar_video"
                                  placeholder="Buscar participante"
                                  maxLength="32"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="custom-table">
                            <div className="thead">
                              <div className="row">
                                <div className="col">Nombre / Apellido(s)</div>
                                <div className="col">Correo electronico</div>
                                <div className="col">Nota final </div>
                              </div>
                            </div>
                            <div className="tbody">
                              {calificaciones
                                .filter((item) =>
                                  item.nombres
                                    ?.toLowerCase()
                                    ?.includes(buscarCalificacion)
                                )
                                .map((item, index) => (
                                  <div className="row" key={`a-${index}`}>
                                    <div className="col">{item.nombres}</div>
                                    <div className="col">{item.email}</div>
                                    <div className="col">
                                      <GraficCircle
                                        value={item.calificacion_curso}
                                        maxValue={10}
                                      />
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`tab-pane fade show ${
                        pestanaActivada == 8 ? "active" : ""
                      }`}
                      id="calendar"
                      role="tabpanel-calendar"
                      aria-labelledby="calendar"
                    >
                      <div className="lecture-overview-wrap">
                        <div className="lecture-overview-item">
                          <h3 className="fs-24 font-weight-semi-bold pb-2">
                            Calendario
                          </h3>
                          <p>
                            En este espacio encontrarás toda las actividades de
                            tareas y foros y las fechas y horas en las cuales se
                            deben entregar o participar.
                          </p>
                        </div>
                        <div className="section-block"></div>
                        <div
                          className="d-flex align-items-center justify-content-end"
                          style={{ width: "100%" }}
                        >
                          <button
                            type="button"
                            className="btn theme-btn theme-btn-white mb-2"
                            onClick={() => {
                              setPopupVideollamada({
                                ...popUpVideollamada,
                                mostrar: 1,
                              });
                            }}
                          >
                            {dataCurso?.es_docente == true
                              ? `Programar videoclases`
                              : `Ver videoclases programadas`}
                          </button>
                        </div>
                        <div className="lecture-overview-item">
                          <Calendario
                            id_curso={dataCurso.id}
                            funcionCargarContenido={cargarContenidoEspecifico}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade show ${
                        pestanaActivada == 9 ? "active" : ""
                      }`}
                      id="calendar"
                      role="tabpanel-calendar"
                      aria-labelledby="calendar"
                    >
                      <div className="lecture-overview-wrap">
                        <div className="lecture-overview-item">
                          <h3 className="fs-24 font-weight-semi-bold pb-2">
                            Presentación
                          </h3>
                          <p>{dataCurso.desc_general ?? ""}</p>
                        </div>
                        <div className="section-block"></div>
                        <div className="lecture-overview-item">
                          <div
                            className="frame-container"
                            onMouseMove={handleShowControls}
                          >
                            <ReactPlayer
                              url={`${urlBaseApi}/${dataCurso.video_vista_previa}`}
                              controls={showControls}
                              width={"100%"}
                              height={"auto"}
                              onPlay={handleHideControls}
                              config={{
                                file: {
                                  attributes: {
                                    onContextMenu: (e) => e.preventDefault(),
                                    controlsList: "nodownload",
                                  },
                                },
                              }}
                            />{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="course-dashboard-sidebar-column">
              <button className="sidebar-open" type="button">
                <i className="la la-angle-left"></i>{" "}
                Contenido&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </button>
              <div className="course-dashboard-sidebar-wrap custom-scrollbar-styled">
                {dataCurso?.videollamadas?.length > 0 ? (
                  <div
                    className="course-dashboard-side-heading"
                    style={{ backgroundColor: "#8547FF" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "100%" }}
                    >
                      <h3
                        className="fs-18 font-weight-semi-bold"
                        style={{ color: "#ffffff" }}
                      >
                        Siguiente Videoclase
                      </h3>
                      <div className="courser-item-meta-wrap">
                        <p
                          className="course-item-meta"
                          style={{ color: "#ffffff" }}
                        >
                          {dataCurso?.videollamadas[0].fecha_hora_inicio_esp}
                        </p>
                      </div>
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "100%" }}
                    >
                      {dataCurso.videollamadas[0].segundos_restantes_inicio <
                      172800 ? (
                        <CountdownTimer
                          segundosRestantesInicio={
                            dataCurso.videollamadas[0].segundos_restantes_inicio
                          }
                          segundosRestantesFin={
                            dataCurso.videollamadas[0].segundos_restantes_fin
                          }
                          functionTimeUp={() => {
                            setEntrarVideollamada({
                              mostrar: true,
                              url: dataCurso.videollamadas[0].url,
                            });
                          }}
                        />
                      ) : (
                        ""
                      )}
                      {entrarVideollamada.mostrar == true ? (
                        <button
                          type="button"
                          className="btn theme-btn theme-btn-white mb-2"
                          onClick={() =>
                            window.open(entrarVideollamada.url, "_blank")
                          }
                        >
                          {" "}
                          Entrar{" "}
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="course-dashboard-side-heading d-flex align-items-center justify-content-between">
                  <h3 className="fs-18 font-weight-semi-bold">
                    Contenido del{" "}
                    {dataCurso.personalizado_tipo_curso ?? "curso"}
                  </h3>
                  <button className="sidebar-close" type="button">
                    <i className="la la-times"></i>
                  </button>
                </div>
                <div className="course-dashboard-side-content">
                  <div
                    className="accordion generic-accordion generic--accordion"
                    id="accordionCourseExample"
                  >
                    {contenido.map((categoria, index) => (
                      <div
                        key={`seccion-contenidos-desktop-${index}`}
                        className="card"
                      >
                        <div
                          className="card-header"
                          id={`heading${parseInt(index) + 1}`}
                          style={{ backgroundColor: "var(--Azul-petroleo)" }}
                        >
                          <button
                            aria-expanded={activeTab.includes(index)}
                            onClick={() => toggleTab(index)}
                            className={`btn btn-link`}
                            type="button"
                            data-toggle="collapse"
                            data-target={`#collapse${parseInt(index) + 1}`}
                            aria-controls={`collapse${parseInt(index) + 1}`}
                            style={{ color: "#fff" }}
                          >
                            <i className="la la-angle-down"></i>
                            <i className="la la-angle-up"></i>
                            <span className="fs-15">
                              {dataCurso.personalizado_tipo_curso ===
                              "diplomado"
                                ? "Modulo"
                                : "Unidad"}{" "}
                              {parseInt(index) + 1}: {categoria.nombre}{" "}
                            </span>
                            <span className="course-duration">
                              <span>
                                &nbsp;{categoria.cantidad_consumidos}/
                                {categoria.cantidad_contenidos}
                              </span>
                              <span style={{ display: "none" }}>21min</span>
                            </span>
                          </button>
                        </div>
                        <div
                          id={`collapse${parseInt(index) + 1}`}
                          className={`collapse ${
                            activeTab.includes(index) ? "show" : ""
                          }`}
                          aria-labelledby={`heading${parseInt(index) + 1}`}
                          data-parent="#accordionCourseExample"
                        >
                          <div className="card-body p-0">
                            <ul className="curriculum-sidebar-list">
                              {Object.keys(categoria.curso_contenido).map(
                                (key, index22) => (
                                  <li
                                    key={`contenido-desktop-${key}`}
                                    className={`course-item-link ${
                                      categoria.curso_contenido[key]
                                        .id_contenido == contenidoActivado
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    <div className="course-item-content-wrap">
                                      <div className="custom-control custom-checkbox">
                                        {categoria.curso_contenido[key]
                                          .cantidad_notificaciones > 0 ? (
                                          <span
                                            className="product-count"
                                            style={{
                                              position: "relative",
                                              marginLeft: "-1.5rem",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            {
                                              categoria.curso_contenido[key]
                                                .cantidad_notificaciones
                                            }
                                          </span>
                                        ) : (
                                          <>
                                            <input
                                              onChange={() => {}}
                                              type="checkbox"
                                              className="custom-control-input"
                                              id={`courseCheckbox${
                                                parseInt(key) + 1
                                              }`}
                                              checked={`${
                                                categoria.curso_contenido[key]
                                                  .estado_consumo == 1
                                                  ? "checked"
                                                  : ""
                                              }`}
                                              required
                                            />
                                            <label
                                              className="custom-control-label custom--control-label"
                                              htmlFor={`courseCheckbox${
                                                parseInt(key) + 1
                                              }`}
                                            ></label>
                                          </>
                                        )}
                                      </div>
                                      <div
                                        className="course-item-content"
                                        onClick={() => {
                                          cargarContenidoEspecifico(
                                            categoria.curso_contenido[key]
                                              .id_contenido
                                          );
                                        }}
                                      >
                                        <div
                                          className="custom-control custom-checkbox media media-card"
                                          style={{ float: "left" }}
                                        >
                                          {categoria.curso_contenido[key]
                                            .tipo_contenido == 1 ? (
                                            <div
                                              className="media-img"
                                              style={{
                                                height: "auto",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {categoria.curso_contenido[key]
                                                .imagen_preview_pequena &&
                                              categoria.curso_contenido[key]
                                                .imagen_preview_pequena !=
                                                null ? (
                                                <img
                                                  src={`${urlBaseApi}/${categoria.curso_contenido[key].imagen_preview_pequena}`}
                                                  alt={
                                                    categoria.curso_contenido[
                                                      key
                                                    ].nombre
                                                  }
                                                />
                                              ) : (
                                                <img
                                                  src={`${urlBase}/images/course-no-image.png`}
                                                  alt={
                                                    categoria.curso_contenido[
                                                      key
                                                    ].nombre
                                                  }
                                                />
                                              )}
                                            </div>
                                          ) : categoria.curso_contenido[key]
                                              .tipo_contenido == 3 ? (
                                            <div
                                              className="media-img"
                                              style={{
                                                height: "auto",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {categoria.curso_contenido[key]
                                                .ruta_imagen_preview_small &&
                                              categoria.curso_contenido[key]
                                                .ruta_imagen_preview_small !=
                                                null ? (
                                                <img
                                                  src={`${urlBaseApi}/${categoria.curso_contenido[key].ruta_imagen_preview_small}`}
                                                  alt={
                                                    categoria.curso_contenido[
                                                      key
                                                    ].nombre
                                                  }
                                                />
                                              ) : (
                                                <img
                                                  src={`${urlBase}/images/course-no-image.png`}
                                                  alt={
                                                    categoria.curso_contenido[
                                                      key
                                                    ].nombre
                                                  }
                                                />
                                              )}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>

                                        <h4 className="fs-15">
                                          {parseInt(key) + 1}.{" "}
                                          {
                                            categoria.curso_contenido[key]
                                              .nombre
                                          }
                                        </h4>
                                        <div className="courser-item-meta-wrap">
                                          <p className="course-item-meta">
                                            {categoria.curso_contenido[key]
                                              .tipo_contenido == 1 ? (
                                              <i className="la la-play-circle"></i>
                                            ) : categoria.curso_contenido[key]
                                                .tipo_contenido === 2 ? (
                                              categoria.curso_contenido[key]
                                                .tipo == 1 ? (
                                                <span>
                                                  <i className="la la-gamepad"></i>{" "}
                                                  Actividad
                                                </span>
                                              ) : (
                                                <span>
                                                  <i className="la la-pencil"></i>{" "}
                                                  Examen
                                                </span>
                                              )
                                            ) : categoria.curso_contenido[key]
                                                .tipo_contenido === 3 ? (
                                              <span>
                                                <i className="la la-file"></i>{" "}
                                                Recurso
                                              </span>
                                            ) : categoria.curso_contenido[key]
                                                .tipo_contenido === 4 ? (
                                              <span>
                                                <i className="la la-paperclip"></i>{" "}
                                                Etiqueta
                                              </span>
                                            ) : categoria.curso_contenido[key]
                                                .tipo_contenido === 5 ? (
                                              <span>
                                                <i className="la la-home"></i>{" "}
                                                Tarea
                                              </span>
                                            ) : categoria.curso_contenido[key]
                                                .tipo_contenido === 6 ? (
                                              <span>
                                                <i className="la la-comments"></i>{" "}
                                                Foro
                                              </span>
                                            ) : categoria.curso_contenido[key]
                                                .tipo_contenido === 7 ? (
                                              <span>
                                                <i className="la la-external-link"></i>{" "}
                                                Url
                                              </span>
                                            ) : (
                                              ""
                                            )}

                                            {categoria.curso_contenido[key]
                                              .tipo_contenido == 1
                                              ? categoria.curso_contenido[key]
                                                  .cantidad_horas_de_video_resumida
                                              : categoria.curso_contenido[key]
                                                  .tipo_contenido === 2
                                              ? categoria.curso_contenido[key]
                                                  .tipo == 1
                                                ? ""
                                                : categoria.curso_contenido[key]
                                                    .cantidad_horas_de_video !=
                                                  "00:00:00"
                                                ? " de duración: " +
                                                  categoria.curso_contenido[key]
                                                    .tiempo_resumido
                                                : ""
                                              : categoria.curso_contenido[key]
                                                  .tipo_contenido === 3
                                              ? ""
                                              : categoria.curso_contenido[key]
                                                  .tipo_contenido === 4
                                              ? ""
                                              : categoria.curso_contenido[key]
                                                  .tipo_contenido === 5
                                              ? ` desde ${categoria.curso_contenido[key].fecha_hora_inicio_esp} hasta ${categoria.curso_contenido[key].fecha_hora_fin_esp}`
                                              : categoria.curso_contenido[key]
                                                  .tipo_contenido === 6
                                              ? ` desde ${categoria.curso_contenido[key].fecha_hora_inicio_esp} hasta ${categoria.curso_contenido[key].fecha_hora_fin_esp}`
                                              : categoria.curso_contenido[key]
                                                  .tipo_contenido === 7
                                              ? ` Link externo`
                                              : ""}
                                          </p>
                                          {Object.keys(
                                            categoria.curso_contenido[key]
                                              .descargables
                                          ).length > 0 && (
                                            <div
                                              key={`drop-contenido-desktop-${categoria.curso_contenido[key].id_contenido}-${key}`}
                                              className="generic-action-wrap"
                                            >
                                              <DropdownContenido
                                                id_curso_contenido={
                                                  categoria.curso_contenido[key]
                                                    .id_contenido
                                                }
                                                data={
                                                  categoria.curso_contenido[key]
                                                    .descargables
                                                }
                                                mostrarHaciaArriba={
                                                  index22 ===
                                                  Object.keys(
                                                    categoria.curso_contenido
                                                  ).length -
                                                    1
                                                }
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default FormularioPlay;
