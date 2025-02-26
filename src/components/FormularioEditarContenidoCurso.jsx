/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { AuthContext } from "../AuthContext";
import { mensajesDeError, cortarCadenaPorCaracter } from "./utils";
import Spinner from "./Spinner";
import SpamError from "./SpamError";
import Popup from "./Popup";
import VideoPicker from "./VideoPicker";
import CrearEditarRecurso from "./CrearEditarRecurso";
import CrearEditarEtiqueta from "./CrearEditarEtiqueta";
import CrearEditarForo from "./CrearEditarForo";
import CrearEditarTarea from "./CrearEditarTarea";
import CrearEditarUrl from "./CrearEditarUrl";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import GraficCircle from "./grafics/GraficCircle";
import { clickOutsideHandler } from "ckeditor5";
import { useSelector } from "react-redux";

function FormularioEditarContenidoCurso() {
  const urlBase = import.meta.env.VITE_URL_BASE;
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const navigate = useNavigate();
  const location = useLocation();
  const { camposPersonalizablesCursos } = useSelector((state) => state.config);
  const { id, url_amigable_volver } = useParams();
  const { jwt, permissions, urlAmigableVolver, setUrlAmigableVolver } =
    useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [examenesSoloPago, setExamenesSoloPago] = useState(0);
  const [esDocente, setEsDocente] = useState(0);
  const [tipoCurso, setTipoCurso] = useState(0);
  const [instructorEditaContenido, setInstructorEditaContenido] = useState(0);
  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const [popUpConfirmarBorrarSeccion, setPopupConfirmarBorrarSeccion] =
    useState({ mostrar: false, titulo: "", contenido: "", id_categoria: "" });
  const [popUpConfirmarBorrarContenido, setPopupConfirmarBorrarContenido] =
    useState({ mostrar: false, titulo: "", contenido: "", id_contenido: "" });
  const [popUpConfirmarBorrarDescargable, setPopupConfirmarBorrarDescargable] =
    useState({ mostrar: false, titulo: "", contenido: "", id_descargable: "" });
  const [popUpVideo, setPopupVideo] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const [popUpDescargable, setPopupDescargable] = useState({
    mostrar: false,
    id_descargable: -1,
    nombre: "",
    descripcion: "",
    archivo_seleccionado: "",
  });
  const [popUpListaDescargable, setPopupListaDescargable] = useState({
    mostrar: false,
    id_tipo_contenido: -1,
    tipo_contenido: -1,
  });
  const [posterVistaPrevia, setPosterVistaPrevia] = useState("");
  const [popUpRecurso, setPopupRecurso] = useState({
    mostrar: false,
    id_categoria: -1,
    id_recurso: -1,
  });
  const [popUpEtiqueta, setPopupEtiqueta] = useState({
    mostrar: false,
    id_categoria: -1,
    id_etiqueta: -1,
  });
  const [popUpForo, setPopupForo] = useState({
    mostrar: false,
    id_categoria: -1,
    id_foro: -1,
  });
  const [popUpTarea, setPopupTarea] = useState({
    mostrar: false,
    id_categoria: -1,
    id_tarea: -1,
  });
  const [popUpUrl, setPopupUrl] = useState({
    mostrar: false,
    id_categoria: -1,
    id_url: -1,
  });
  const [contenido, setContenido] = useState({});
  const [mostrarPopUpCrearSeccion, setMostrarPopUpCrearSeccion] =
    useState(false);
  const [mostrarPopUpEditarSeccion, setMostrarPopUpEditarSeccion] =
    useState(false);
  const [mostrarPopUpAgregarContenido, setMostrarPopUpAgregarContenido] =
    useState(false);
  const [mostrarPopUpAgregarVideo, setMostrarPopUpAgregarVideo] =
    useState(false);
  const [nombreSeccion, setNombreSeccion] = useState("");
  const [descripcionSeccion, setDescripcionSeccion] = useState("");
  const [imagenesSeccion, setImagenesSeccion] = useState([]);
  const [idSeccionEditando, setIdSeccionEditando] = useState(-1);
  const [idSeccionAgregarContenido, setIdSeccionAgregarContenido] =
    useState(-1);
  const [listaDescargables, setListaDescargables] = useState([]);

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (url_amigable_volver) {
      setUrlAmigableVolver(url_amigable_volver);
    }
    obtenerDatosServidor();
  }, []);

  useEffect(() => {
    if (popUpListaDescargable.id_tipo_contenido != -1) {
      obtenerDatosListaDescargables();
    }
  }, [popUpListaDescargable.id_tipo_contenido]);

  // const handleNombreChange = (event) => { setNombre(event.target.value);    };

  //Estados de los errores de campos
  const camposErrores = {
    imagen: [],
    nombre: [],
    descripcion: [],
    archivo: [],
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

  const handleNombreSeccionChange = (event) => {
    setNombreSeccion(event.target.value);
  };
  const handleDescripcionSeccionChange = (event) => {
    setDescripcionSeccion(event.target.value);
  };
  const handleImagenSeccionChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagenesSeccion([
        ...imagenesSeccion,
        { obj: file, url: imageUrl, new: true },
      ]);
    }
    event.target.value = "";
  };

  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };
  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  // const handleFuncionAceptarPopUpVideo = () => {
  //     setPopupVideo({...popUp, mostrar:false});
  // };
  const handleFuncionCerrarPopUpVideo = () => {
    setPopupVideo({ ...popUp, mostrar: false });
  };

  const handleAbrirCrearSeccion = (event) => {
    event.preventDefault();
    setNombreSeccion("");
    setDescripcionSeccion("");
    setImagenesSeccion([]);
    setMostrarPopUpCrearSeccion(true);
  };
  const handleCerrarCrearSeccion = () => {
    setMostrarPopUpCrearSeccion(!mostrarPopUpCrearSeccion);
  };

  const handleAbrirListaDescargable = (event, props) => {
    event.preventDefault();
    setPopupListaDescargable({
      ...popUpListaDescargable,
      mostrar: true,
      id_tipo_contenido: props.id_tipo_contenido,
      tipo_contenido: props.tipo_contenido,
    });
  };
  const handleCerrarListaDescargable = () => {
    setPopupListaDescargable({
      ...popUpListaDescargable,
      mostrar: false,
      id_tipo_contenido: -1,
      tipo_contenido: -1,
    });
  };
  const handleCrearDescargable = () => {
    setPopupListaDescargable({ ...popUpListaDescargable, mostrar: false }); //aqui estan los datos de hacia donde va el nuevo descargable
    setPopupDescargable({
      ...popUpDescargable,
      mostrar: true,
      id_descargable: -1,
      nombre: "",
      descripcion: "",
    });
  };
  const handleCerrarDescargable = (event, props) => {
    event.preventDefault();
    setPopupDescargable({
      ...popUpDescargable,
      mostrar: false,
      id_descargable: -1,
      nombre: "",
      descripcion: "",
      archivo_seleccionado: "",
    });
  };
  const handleEditarDescargable = (event, props) => {
    setPopupListaDescargable({ ...popUpListaDescargable, mostrar: false }); //aqui estan los datos de hacia donde va el nuevo descargable
    setPopupDescargable({
      ...popUpDescargable,
      mostrar: true,
      id_descargable: props.id_descargable,
      nombre: props.nombre,
      descripcion: props.descripcion,
    });
  };
  const handleNombreDescargableChange = (event) => {
    setPopupDescargable({ ...popUpDescargable, nombre: event.target.value });
  };
  const handleDescripcionDescargableChange = (event) => {
    setPopupDescargable({
      ...popUpDescargable,
      descripcion: event.target.value,
    });
  };
  const onDrop = (acceptedFiles) => {
    // Lógica para procesar los archivos aceptados
    setPopupDescargable({
      ...popUpDescargable,
      archivo_seleccionado: acceptedFiles[0],
    });
  };
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/zip": [".zip"],
      "application/vnd.rar": [".rar"],
      "application/vnd.ms-excel": [".xls"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });
  /*const fileList = acceptedFiles.map((file, index) => (
        <li key={`archivo-ajuntado-${index}`}>{file.name}</li>
    ));*/

  const obtenerDatosServidor = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };

      const response = await fetch(
        `${urlBaseApi}/api/curso/getcontenidos/${id}`,
        opciones
      );
      if (response.ok) {
        const datos = await response.json();
        setContenido(datos);
      } else {
        const datos = await response.json();
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {}
        );
      }

      const response2 = await fetch(`${urlBaseApi}/api/curso/${id}`, opciones);
      if (response2.ok) {
        const datos2 = await response2.json();
        setNombre(datos2?.curso?.nombre);
        setExamenesSoloPago(datos2?.curso?.examenes_solo_pago);
        setEsDocente(datos2?.curso?.es_docente);
        setTipoCurso(datos2?.curso?.personalizado_tipo_curso);
        if (datos2?.curso?.instructor_edita_contenido) {
          setInstructorEditaContenido(
            datos2?.curso?.instructor_edita_contenido
          );
        }
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

  const obtenerDatosListaDescargables = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      setMostrarSpinner(true);

      let url = "";
      switch (popUpListaDescargable.tipo_contenido) {
        case 1:
          url = `${urlBaseApi}/api/video/getDescargables/${popUpListaDescargable.id_tipo_contenido}`;
          break;
        case 2:
          url = `${urlBaseApi}/api/examen/getDescargables/${popUpListaDescargable.id_tipo_contenido}`;
          break;
        case 5:
          url = `${urlBaseApi}/api/tarea/getDescargables/${popUpListaDescargable.id_tipo_contenido}`;
          break;
        case 6:
          url = `${urlBaseApi}/api/foro/getDescargables/${popUpListaDescargable.id_tipo_contenido}`;
          break;
      }
      const response = await fetch(url, opciones);
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setListaDescargables(datos);
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

  const handleMoverContenido = async (event, id_contenido, direccion) => {
    event.preventDefault();
    const raw = {
      direccion: direccion,
    };
    const opciones = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(raw),
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/cursocontenido/mover/${id_contenido}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        obtenerDatosServidor();
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          { titulo: "No es posible", contenido: "Realizar este movimiento." }
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const guardarImagenes = async (idSeccion) => {
    const errores = [];
    const completados = [];
    for (let index = 0; index < imagenesSeccion.length; index++) {
      const element = imagenesSeccion[index];
      if (element.new) {
        const formData = new FormData();
        formData.append("id_curso_categoria", idSeccion);
        formData.append("archivo", element.obj);

        try {
          const opciones = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            body: formData,
          };
          const response = await fetch(
            `${urlBaseApi}/api/cursocategoriamedia`,
            opciones
          );
          const datos = await response.json();

          if (response.ok) {
            completados.push({
              index,
              mostrar: true,
              titulo: "Listo",
              contenido: "Sección creada correctamente.",
            });
          } else {
            errores.push({
              mensaje: datos.mensaje,
              nameImage: element.obj?.name,
            });
          }
        } catch (error) {
          console.error("Error de conexión:", error);
        }
      }
    }
    return { errores, completados };
  };

  const handleCrearSeccion = async (event) => {
    event.preventDefault();
    reiniciarErrorCampoGlobal();

    const formData = new FormData();
    formData.append("nombre", nombreSeccion);
    formData.append("descripcion", descripcionSeccion);
    formData.append("id_curso", id);

    const opciones = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/cursocategoria`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        //se guardó satisfactoriamente el curso
        const result = await guardarImagenes(datos.id_curso_categoria);
        if (result.errores?.length === 0) {
          setNombreSeccion("");
          setDescripcionSeccion("");
          setImagenesSeccion([]);
          setMostrarPopUpCrearSeccion(false);
          setPopup({
            mostrar: true,
            titulo: "Listo",
            contenido: "Sección creada correctamente.",
          });
        } else {
          console.log(1);
          setPopup({
            mostrar: true,
            titulo: "Error en el cargue de imagenes",
            contenido: `${result.errores[0]?.mensaje} -- ${result.errores[0]?.nameImage}`,
          });
        }
        obtenerDatosServidor();
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

  const handleBorrarCategoria = (event, id_categoria) => {
    event.preventDefault();
    setPopupConfirmarBorrarSeccion({
      mostrar: true,
      titulo: "Confirmar",
      contenido: "Confirma que desea borrar la sección?",
      id_categoria: id_categoria,
    });
  };
  const handleFuncionAceptarPopUpConfirmarBorrarSeccion = () => {
    setPopupConfirmarBorrarSeccion({
      ...popUpConfirmarBorrarSeccion,
      mostrar: false,
    });
    borrarCategoria(popUpConfirmarBorrarSeccion.id_categoria);
  };
  const handleFuncionCerrarPopUpConfirmarBorrarSeccion = () => {
    setPopupConfirmarBorrarSeccion({
      ...popUpConfirmarBorrarSeccion,
      mostrar: false,
    });
  };
  const borrarCategoria = async (id_categoria) => {
    const opciones = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/cursocategoria/${id_categoria}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        obtenerDatosServidor();
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

  const handleBorrarContenido = (event, id_contenido) => {
    event.preventDefault();
    setPopupConfirmarBorrarContenido({
      mostrar: true,
      titulo: "Confirmar",
      contenido:
        "Confirma que desea borrar el contenido? Se borrarán también la guía de consumos realizados para todos los usuarios.",
      id_contenido: id_contenido,
    });
  };
  const handleFuncionAceptarPopUpConfirmarBorrarContenido = () => {
    setPopupConfirmarBorrarContenido({
      ...popUpConfirmarBorrarContenido,
      mostrar: false,
    });
    borrarContenido(popUpConfirmarBorrarContenido.id_contenido);
  };
  const handleFuncionCerrarPopUpConfirmarBorrarContenido = () => {
    setPopupConfirmarBorrarContenido({
      ...popUpConfirmarBorrarContenido,
      mostrar: false,
    });
  };
  const borrarContenido = async (id_contenido) => {
    const opciones = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/cursocontenido/${id_contenido}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        obtenerDatosServidor();
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          false,
          { titulo: "", contenido: "" }
        );
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

  const handleEditarSeccion = async (event, id_categoria, values) => {
    event.preventDefault();

    const opciones = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
    const response = await fetch(
      `${urlBaseApi}/api/cursocategoria/media/${id_categoria}`,
      opciones
    );
    const datos = await response.json();
    if (response.ok) {
      setNombreSeccion(values.nombre);
      setDescripcionSeccion(values.descripcion);
      setIdSeccionEditando(id_categoria);
      setMostrarPopUpEditarSeccion(true);
      setImagenesSeccion(
        datos.map((item) => {
          return { url: `${urlBaseApi}/${item.media}`, id: item.id };
        })
      );
    }
  };

  const eliminarImagenSeccion = async (id, isNew, img) => {
    if (isNew) {
      setImagenesSeccion((current) => current.filter((_, i) => i !== id));
    } else {
      const opciones = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/cursocategoriamedia/${id}`,
        opciones
      );
      setMostrarSpinner(false);
      if (response.ok) {
        setImagenesSeccion((current) =>
          current.filter((item) => item.id !== id)
        );
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "Imagen eliminada correctamente.",
        });
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          { titulo: "", contenido: "" }
        );
      }
    }
  };

  const editarSeccion = async (event) => {
    const raw = {
      nombre: nombreSeccion,
      descripcion: descripcionSeccion,
    };
    const opciones = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(raw),
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/cursocategoria/${idSeccionEditando}`,
        opciones
      );
      const datos = await response.json();
      if (response.ok) {
        const result = await guardarImagenes(idSeccionEditando);
        console.log(result);
        if (result.errores?.length === 0) {
          setMostrarPopUpEditarSeccion(false);
          setPopup({
            mostrar: true,
            titulo: "Listo",
            contenido: "Sección editada correctamente.",
          });
        } else {
          setPopup({
            mostrar: true,
            titulo: "Error en el cargue de imagenes",
            contenido: `${result.errores[0]?.mensaje} -- ${result.errores[0]?.nameImage}`,
          });
        }
        obtenerDatosServidor();
        setMostrarSpinner(false);
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

  const handleAgregarContenido = (event, id_categoria) => {
    event.preventDefault();
    setIdSeccionAgregarContenido(id_categoria);
    setMostrarPopUpAgregarContenido(true);
  };

  const handleAgregarVideo = (event) => {
    event.preventDefault();
    if (urlAmigableVolver == "") {
      setMostrarPopUpAgregarContenido(false);
      setMostrarPopUpAgregarVideo(true);
    } else {
      navigate(`/video/crear/${id}/${idSeccionAgregarContenido}`);
    }
  };

  const handleSeleccionarVideo = async (id_video) => {
    const formData = new FormData();
    formData.append("id_curso", id);
    formData.append("id_categoria", idSeccionAgregarContenido);
    formData.append("tipo_contenido", 1);
    formData.append("id_tipo_contenido", id_video);
    formData.append("porcentaje_en_total_curso", 0);

    const opciones = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/cursocontenido`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        obtenerDatosServidor();
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

  const handleSubirDescargable = async (event) => {
    event.preventDefault();
    reiniciarErrorCampoGlobal();

    if (popUpDescargable.archivo_seleccionado != null) {
      setMostrarSpinner(true);
      const formData = new FormData();
      formData.append("id_tipopadre", popUpListaDescargable.tipo_contenido);
      formData.append("id_padre", popUpListaDescargable.id_tipo_contenido);
      formData.append("nombre", popUpDescargable.nombre);
      formData.append("descripcion", popUpDescargable.descripcion);
      formData.append("archivo", popUpDescargable.archivo_seleccionado);

      const xhr = new XMLHttpRequest();

      // Escuchamos el evento de progreso para actualizar el estado del progreso.
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentage = (event.loaded / event.total) * 100;
          //setProgress(percentage.toFixed(0));
        }
      });

      // Evento de finalización de la carga.
      xhr.onload = () => {
        setMostrarSpinner(false);
        const status = xhr.status;
        const datos = JSON.parse(xhr.responseText);
        if (status >= 200 && status < 300) {
          setPopup({
            mostrar: true,
            titulo: "Listo",
            contenido: "Descargable subido correctamente.",
          });
          setPopupDescargable({
            ...popUpDescargable,
            mostrar: false,
            nombre: "",
            descripcion: "",
            archivo_seleccionado: "",
          });
          handleCerrarListaDescargable();
          obtenerDatosServidor();
        } else {
          mensajesDeError(
            setPopup,
            status,
            typeof datos.datos !== "undefined" ? datos.datos : {},
            setErrorCampoGlobal,
            {
              titulo: "Error",
              contenido:
                "Hubo un error al subir el descargable, revise el formulario.",
            }
          );
        }
        return;
      };

      // Evento de error de la carga.
      xhr.onerror = () => {
        setMostrarSpinner(false);
        const status = xhr.status;
        const datos = JSON.parse(xhr.responseText);
        mensajesDeError(
          setPopup,
          status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          {
            titulo: "Error",
            contenido:
              "Hubo un error al subir el descargable, revise el formulario.",
          }
        );
        return;
      };

      // Enviamos la solicitud POST con el archivo.
      xhr.open("POST", `${urlBaseApi}/api/descargable`, true);
      xhr.setRequestHeader("Authorization", `Bearer ${jwt}`);
      xhr.send(formData);
    }
  };
  const handleEditarDescargableServidor = async () => {
    if (popUpDescargable.id_descargable != -1) {
      reiniciarErrorCampoGlobal();
      setMostrarSpinner(true);
      const raw = {
        nombre: popUpDescargable.nombre.toString(),
        descripcion: popUpDescargable.descripcion.toString(),
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
          `${urlBaseApi}/api/descargable/${popUpDescargable.id_descargable}`,
          opciones
        );
        const datos = await response.json();
        if (response.ok) {
          if (popUpDescargable.archivo_seleccionado != "") {
            handleSubirArchivoDescargable();
          } else {
            handleFinalizarEdicionDescargable();
          }
          handleCerrarListaDescargable();
          obtenerDatosServidor();
          return;
        } else {
          mensajesDeError(
            setPopup,
            response.status,
            typeof datos.datos !== "undefined" ? datos.datos : {},
            setErrorCampoGlobal,
            {
              titulo: "Revisar formulario",
              contenido:
                "Por favor rellene todos los campos del formulario correctamente.",
            }
          );
        }
      } catch (error) {
        setPopupSubida({ ...popUpSubida, mostrar: false });
        console.error("Error de conexión:", error);
      }
    }
  };
  const handleSubirArchivoDescargable = async () => {
    reiniciarErrorCampoGlobal();
    if (popUpDescargable.archivo_seleccionado != "") {
      const formData = new FormData();
      formData.append("archivo", popUpDescargable.archivo_seleccionado);

      const xhr = new XMLHttpRequest();

      // Escuchamos el evento de progreso para actualizar el estado del progreso.
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentage = (event.loaded / event.total) * 100;
        }
      });

      // Evento de finalización de la carga.
      xhr.onload = () => {
        const status = xhr.status;
        const datos = JSON.parse(xhr.responseText);
        if (status >= 200 && status < 300) {
          handleFinalizarEdicionDescargable();
        } else {
          mensajesDeError(
            setPopup,
            status,
            typeof datos.datos !== "undefined" ? datos.datos : {},
            false,
            { titulo: "", contenido: "" }
          );
        }
        return;
      };

      // Evento de error de la carga.
      xhr.onerror = () => {
        const status = xhr.status;
        const datos = JSON.parse(xhr.responseText);
        mensajesDeError(
          setPopup,
          status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          false,
          { titulo: "", contenido: "" }
        );
        return;
      };

      // Enviamos la solicitud POST con el archivo.
      xhr.open(
        "POST",
        `${urlBaseApi}/api/descargable/actualizarArchivo/${popUpDescargable.id_descargable}`,
        true
      );
      xhr.setRequestHeader("Authorization", `Bearer ${jwt}`);
      xhr.send(formData);
    } else {
      return;
    }
  };
  const borrarDescargable = async (id_descargable) => {
    const opciones = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/descargable/${id_descargable}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        //setPopupListaDescargable({...popUpListaDescargable, id_tipo_contenido:-1});
        obtenerDatosListaDescargables();
        obtenerDatosServidor();
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
  const handleFinalizarEdicionDescargable = () => {
    setMostrarSpinner(false);
    setPopupDescargable({
      ...popUpDescargable,
      mostrar: false,
      id_descargable: -1,
      nombre: "",
      descripcion: "",
      archivo_seleccionado: "",
    });
    setPopup({
      mostrar: true,
      titulo: "Listo",
      contenido: "Descargable guardado correctamente.",
    });
    setPopupListaDescargable({
      ...popUpListaDescargable,
      id_tipo_contenido: -1,
    });
    obtenerDatosServidor();
  };
  const handleBorrarDescargable = (event, id_descargable) => {
    event.preventDefault();
    setPopupConfirmarBorrarDescargable({
      mostrar: true,
      titulo: "Confirmar",
      contenido: "Confirma que desea borrar el descargable.",
      id_descargable: id_descargable,
    });
  };
  const handleFuncionCerrarPopUpConfirmarBorrarDescargable = () => {
    setPopupConfirmarBorrarDescargable({
      ...popUpConfirmarBorrarDescargable,
      mostrar: false,
    });
  };
  const handleFuncionAceptarPopUpConfirmarBorrarDescargable = () => {
    setPopupConfirmarBorrarDescargable({
      ...popUpConfirmarBorrarDescargable,
      mostrar: false,
    });
    borrarDescargable(popUpConfirmarBorrarDescargable.id_descargable);
  };

  const handleFuncionHuecoPreguntas = (id_examen) => {
    if (typeof id !== "undefined") {
      navigate(`/examen/huecopreguntas/${id_examen}/${id}`);
    } else {
      navigate(`/examen/huecopreguntas/${id_examen}`);
    }
  };

  const handleDownload = ({ ruta_archivo, nombre_archivo }) => {
    const link = document.createElement("a");
    link.href = ruta_archivo;
    link.target = "_blank"; // Para abrir en una nueva pestaña
    link.download = nombre_archivo; // Nombre con el que se descargará el archivo
    link.click();
  };

  const tiposDeContenido = [
    { id: 1, nombre: "Video", fontIcon: "la-file-video" },
    { id: 2, nombre: "Examen", fontIcon: "la-file-alt" },
    { id: 3, nombre: "Recurso", fontIcon: "la-folder" },
    { id: 4, nombre: "Etiqueta", fontIcon: "la-tag" },
    { id: 5, nombre: "Tarea", fontIcon: "la-file-invoice" },
    { id: 6, nombre: "Foro", fontIcon: "la-users" },
    { id: 7, nombre: "Url", fontIcon: "la-link" },
  ];

  const obtenerNombreContenido = (tipoContenido) => {
    const contenido = tiposDeContenido.find((c) => c.id === tipoContenido);
    return {
      nombre: contenido ? contenido.nombre : "Desconocido",
      icon: contenido ? contenido.fontIcon : "la-none",
    };
  };

  const [filters, setFilters] = useState([]);

  const handleClickFilter = (value) => {
    if (filters.includes(value)) {
      const newFilters = filters.filter((val) => val !== value);
      setFilters(newFilters);
    } else {
      setFilters([...filters, value]);
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
      <Popup
        mostrarPopup={popUpConfirmarBorrarSeccion.mostrar}
        tamano="xx"
        tipo={3}
        titulo={popUpConfirmarBorrarSeccion.titulo}
        mensaje={popUpConfirmarBorrarSeccion.contenido}
        funcionAceptar={handleFuncionAceptarPopUpConfirmarBorrarSeccion}
        funcionCerrar={handleFuncionCerrarPopUpConfirmarBorrarSeccion}
        textoCerrar="Cancelar"
      />
      <Popup
        mostrarPopup={popUpConfirmarBorrarContenido.mostrar}
        tamano="xx"
        tipo={3}
        titulo={popUpConfirmarBorrarContenido.titulo}
        mensaje={popUpConfirmarBorrarContenido.contenido}
        funcionAceptar={handleFuncionAceptarPopUpConfirmarBorrarContenido}
        funcionCerrar={handleFuncionCerrarPopUpConfirmarBorrarContenido}
        textoCerrar="Cancelar"
      />
      <Popup
        mostrarPopup={popUpConfirmarBorrarDescargable.mostrar}
        tamano="xx"
        tipo={3}
        titulo={popUpConfirmarBorrarDescargable.titulo}
        mensaje={popUpConfirmarBorrarDescargable.contenido}
        funcionAceptar={handleFuncionAceptarPopUpConfirmarBorrarDescargable}
        funcionCerrar={handleFuncionCerrarPopUpConfirmarBorrarDescargable}
        textoCerrar="Cancelar"
      />
      <Modal
        show={popUpVideo.mostrar}
        size="xx"
        onHide={handleFuncionCerrarPopUpVideo}
        backdrop="static"
        keyboard={false}
        animation={false}
        centered
        className="modal-theme"
      >
        {popUpVideo.titulo != "" && (
          <Modal.Header>
            <Modal.Title>{popUpVideo.titulo}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body>
          <video
            controls
            crossOrigin="true"
            playsInline
            poster={`${
              posterVistaPrevia != ""
                ? `${urlBaseApi}/${posterVistaPrevia}`
                : `${urlBase}/images/pattern.png`
            }`}
            id="player"
            style={{ width: "100%" }}
          >
            <source
              src={`${urlBaseApi}/${popUpVideo.contenido}`}
              type="video/mp4"
            />
          </video>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFuncionCerrarPopUpVideo}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {popUpRecurso.mostrar == 1 && (
        <CrearEditarRecurso
          id_curso={id}
          id_categoria={popUpRecurso.id_categoria}
          id_recurso={popUpRecurso.id_recurso}
          funcionMostrarPopUp={() => {
            setPopupRecurso({ ...popUpRecurso, mostrar: 0 });
            obtenerDatosServidor();
          }}
        />
      )}
      {popUpEtiqueta.mostrar == 1 && (
        <CrearEditarEtiqueta
          id_curso={id}
          id_categoria={popUpEtiqueta.id_categoria}
          id_etiqueta={popUpEtiqueta.id_etiqueta}
          funcionMostrarPopUp={() => {
            setPopupEtiqueta({ ...popUpEtiqueta, mostrar: 0 });
            obtenerDatosServidor();
          }}
        />
      )}
      {popUpForo.mostrar == 1 && (
        <CrearEditarForo
          id_curso={id}
          id_categoria={popUpForo.id_categoria}
          id_foro={popUpForo.id_foro}
          funcionMostrarPopUp={() => {
            setPopupForo({ ...popUpForo, mostrar: 0 });
            obtenerDatosServidor();
          }}
        />
      )}
      {popUpTarea.mostrar == 1 && (
        <CrearEditarTarea
          id_curso={id}
          id_categoria={popUpTarea.id_categoria}
          id_tarea={popUpTarea.id_tarea}
          funcionMostrarPopUp={() => {
            setPopupTarea({ ...popUpTarea, mostrar: 0 });
            obtenerDatosServidor();
          }}
        />
      )}
      {popUpUrl.mostrar == 1 && (
        <CrearEditarUrl
          id_curso={id}
          id_categoria={popUpUrl.id_categoria}
          id_url={popUpUrl.id_url}
          funcionMostrarPopUp={() => {
            setPopupUrl({ ...popUpUrl, mostrar: 0 });
            obtenerDatosServidor();
          }}
        />
      )}

      {popUpListaDescargable.mostrar == 1 && (
        <div
          className="modal fade modal-container show"
          style={{ background: "rgba(0, 0, 0, 0.7)" }}
          id="decargableModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="decargableModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-theme"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header border-bottom-gray">
                <div className="pr-2">
                  <h5
                    className="modal-title fs-19 font-weight-semi-bold lh-24"
                    id="decargableModalTitle"
                  >
                    Descargables
                  </h5>
                </div>
              </div>
              <div className="modal-body">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table generic-table">
                      <thead>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col">Nombre</th>
                          <th scope="col">Descripción</th>
                          {permissions[36] || esDocente == 1 ? (
                            <th scope="col"></th>
                          ) : (
                            ""
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {listaDescargables.map((item, index) => (
                          <tr key={`descargable-x-${index}`}>
                            <th scope="row">
                              <div
                                onClick={() => {
                                  handleDownload({
                                    ruta_archivo: `${urlBaseApi}/${item.ruta_archivo.replace(
                                      "public/",
                                      ""
                                    )}`,
                                    nombre_archivo: "descargable.pdf",
                                  });
                                }}
                                // className="icon-element icon-element-sm flex-shrink-0 bg-7 mr-3 text-white"
                                style={{
                                  cursor: "pointer",
                                  color: "var(--Lavander)",
                                  fontSize: "30px",
                                }}
                              >
                                <i className="la la-download"></i>
                              </div>
                            </th>
                            <th scope="row">{item.nombre}</th>
                            <th scope="row">
                              {cortarCadenaPorCaracter(
                                item.descripcion,
                                ".",
                                10
                              )
                                .split("<br />")
                                .map((line, index) => (
                                  <span style={{ fontStyle: "italic" }}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                            </th>
                            {permissions[36] || esDocente == 1 ? (
                              <th scope="row">
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div
                                    onClick={(event) => {
                                      handleEditarDescargable(event, {
                                        id_descargable: item.id,
                                        nombre: item.nombre,
                                        descripcion: item.descripcion,
                                      });
                                    }}
                                    // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    data-title="Editar configuración"
                                    title="Editar configuración"
                                    style={{
                                      color: "var(--Lavander)",
                                      fontSize: "30px",
                                    }}
                                  >
                                    <i className="la la-gear"></i>
                                  </div>
                                  <div
                                    onClick={(event) => {
                                      handleBorrarDescargable(event, item.id);
                                    }}
                                    // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Borrar"
                                    style={{
                                      color: "var(--Lavander)",
                                      fontSize: "30px",
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
                              </th>
                            ) : (
                              ""
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div
                className="modal-footer border-top-gray"
                style={{ justifyContent: "space-between" }}
              >
                <button
                  type="button"
                  className="btn theme-btn mb-2"
                  onClick={(event) => {
                    handleCrearDescargable(event);
                  }}
                >
                  <i className="la la-plus mr-2"></i>
                  Nuevo descargable
                </button>
                <button
                  type="button"
                  className="btn theme-btn theme-btn-dark mb-2"
                  onClick={handleCerrarListaDescargable}
                >
                  {" "}
                  Cerrar{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {popUpDescargable.mostrar == 1 && (
        <div
          className="modal fade modal-container show"
          style={{ background: "rgba(0, 0, 0, 0.7)" }}
          id="decargableModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="decargableModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-theme"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header border-bottom-gray">
                <div className="pr-2">
                  <h5
                    className="modal-title fs-19 font-weight-semi-bold lh-24"
                    id="decargableModalTitle"
                  >
                    {popUpDescargable.id_descargable != -1
                      ? "Editar descargable"
                      : "Crear descargable"}
                  </h5>
                </div>
              </div>
              <div className="modal-body">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="label-text">Nombre del descargable</label>
                    <input
                      value={popUpDescargable.nombre}
                      onChange={handleNombreDescargableChange}
                      className="form-control form--control pl-3"
                      type="text"
                      name="nombre_descargable"
                      maxLength="64"
                      placeholder="Ej: Plantilla para cálculos"
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
                      value={popUpDescargable.descripcion.replace(
                        /<br\s*\/?>/g,
                        "\n"
                      )}
                      onChange={handleDescripcionDescargableChange}
                      className="form-control form--control user-text-editor pl-3"
                      name="desc_descargable"
                    ></textarea>
                    {erroresCampos["descripcion"].length > 0 && (
                      <SpamError mensaje={erroresCampos["descripcion"]} />
                    )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="label-text">Archivo</label>
                    <div {...getRootProps()}>
                      <input
                        {...getInputProps()}
                        className="multi file-upload-input"
                      />
                      <span className="file-upload-text">
                        <i className="la la-cloud-upload mr-2"></i>
                        Selecciona o arrastra el nuevo video que reemplaza a
                        este aquí (opcional).
                      </span>
                    </div>
                    <span>{popUpDescargable.archivo_seleccionado.name}</span>
                    {erroresCampos["archivo"].length > 0 && (
                      <SpamError mensaje={erroresCampos["archivo"]} />
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-gray">
                <button
                  type="button"
                  className="btn theme-btn mb-2"
                  onClick={(event) => {
                    popUpDescargable.id_descargable != -1
                      ? handleEditarDescargableServidor(event)
                      : handleSubirDescargable(event);
                  }}
                >
                  {popUpDescargable.id_descargable != -1 ? "Guardar" : "Crear"}
                </button>
                <button
                  type="button"
                  className="btn theme-btn theme-btn-dark mb-2"
                  onClick={handleCerrarDescargable}
                >
                  {" "}
                  Cancelar{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarPopUpCrearSeccion && (
        <div
          className="modal fade modal-container show"
          style={{ background: "rgba(0, 0, 0, 0.7)" }}
          id="comprarModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="comprarModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-theme"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header border-bottom-gray">
                <div className="pr-2">
                  <h5
                    className="modal-title fs-19 font-weight-semi-bold lh-24"
                    id="comprarModalTitle"
                  >
                    Crear sección
                  </h5>
                </div>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="label-text">Nombre</label>
                  <input
                    onChange={handleNombreSeccionChange}
                    className="form-control form--control pl-3"
                    type="text"
                    name="nombre"
                    maxLength="128"
                    value={nombreSeccion}
                    placeholder=""
                  />
                  {erroresCampos["nombre"].length > 0 && (
                    <SpamError mensaje={erroresCampos["nombre"]} />
                  )}
                </div>
                {camposPersonalizablesCursos.tipos_curso[tipoCurso]
                  ?.editar_seccion_descripcion && (
                  <div className="form-group">
                    <label className="label-text">Descripcion</label>
                    <textarea
                      onChange={handleDescripcionSeccionChange}
                      className="form-control form--control pl-3"
                      type="text"
                      name="descripcion"
                      value={descripcionSeccion}
                    />
                    {erroresCampos["descripcion"].length > 0 && (
                      <SpamError mensaje={erroresCampos["descripcion"]} />
                    )}
                  </div>
                )}
                {camposPersonalizablesCursos.tipos_curso[tipoCurso]
                  ?.editar_seccion_media && (
                  <div className="form-group">
                    <label className="label-text">Cargar una imagen</label>
                    <input
                      onChange={handleImagenSeccionChange}
                      className="form-control form--control pl-3"
                      type="file"
                      name="imagen"
                    />
                  </div>
                )}
                <div className="row">
                  {imagenesSeccion.length > 0 && (
                    <h4 className="col-12">Imagenes Cargadas</h4>
                  )}
                  {imagenesSeccion.map((img, indexImage) => (
                    <div
                      style={{
                        position: "relative",
                        width: "200px",
                        height: "200px",
                        margin: "10px",
                      }}
                    >
                      <i
                        onClick={() =>
                          eliminarImagenSeccion(
                            img.new ? indexImage : img.id,
                            img.new
                          )
                        }
                        className="la la-times"
                        style={{
                          color: "var(--Lavander)",
                          position: "absolute",
                          top: 0,
                          right: 0,
                          margin: "10px",
                          background: "var(--Blanco-fondo)",
                          padding: "5px",
                          borderRadius: "10px",
                        }}
                      ></i>
                      <img
                        src={img.url}
                        alt="imagen de seccion"
                        style={{
                          width: "200px",
                          height: "200px",
                          borderRadius: "20px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                      {erroresCampos["imagen"].length > 0 && (
                        <SpamError mensaje={erroresCampos["imagen"]} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-top-gray">
                <button
                  type="button"
                  className="btn theme-btn mb-2"
                  onClick={(event) => {
                    handleCrearSeccion(event);
                  }}
                >
                  Crear
                </button>
                <button
                  type="button"
                  className="btn theme-btn theme-btn-dark"
                  onClick={handleCerrarCrearSeccion}
                >
                  {" "}
                  Cancelar{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarPopUpEditarSeccion && (
        <div
          className="modal fade modal-container show"
          style={{ background: "rgba(0, 0, 0, 0.7)" }}
          id="comprarModal2"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="comprarModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-theme"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header border-bottom-gray">
                <div className="pr-2">
                  <h5
                    className="modal-title fs-19 font-weight-semi-bold lh-24"
                    id="comprarModalTitle"
                  >
                    Editar sección
                  </h5>
                </div>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="label-text">Nombre</label>
                  <input
                    onChange={handleNombreSeccionChange}
                    className="form-control form--control pl-3"
                    type="text"
                    name="nombre"
                    maxLength="128"
                    value={nombreSeccion}
                    placeholder=""
                  />
                  {erroresCampos["nombre"].length > 0 && (
                    <SpamError mensaje={erroresCampos["nombre"]} />
                  )}
                </div>
                {camposPersonalizablesCursos.tipos_curso[tipoCurso]
                  ?.editar_seccion_descripcion && (
                  <div className="form-group">
                    <label className="label-text">Descripcion</label>
                    <textarea
                      onChange={handleDescripcionSeccionChange}
                      className="form-control form--control pl-3"
                      type="text"
                      name="descripcion"
                      value={descripcionSeccion}
                    />
                    {erroresCampos["descripcion"].length > 0 && (
                      <SpamError mensaje={erroresCampos["descripcion"]} />
                    )}
                  </div>
                )}
                {camposPersonalizablesCursos.tipos_curso[tipoCurso]
                  ?.editar_seccion_media && (
                  <div className="form-group">
                    <label className="label-text">Cargar una imagen</label>
                    <input
                      onChange={handleImagenSeccionChange}
                      className="form-control form--control pl-3"
                      type="file"
                      name="imagen"
                    />
                  </div>
                )}
                <div className="row">
                  {imagenesSeccion.length > 0 && (
                    <h4 className="col-12">Imagenes Cargadas</h4>
                  )}
                  {imagenesSeccion.map((img, indexImage) => (
                    <div
                      style={{
                        position: "relative",
                        width: "200px",
                        height: "200px",
                        margin: "10px",
                      }}
                    >
                      <i
                        onClick={() =>
                          eliminarImagenSeccion(
                            img.new ? indexImage : img.id,
                            img.new,
                            img
                          )
                        }
                        className="la la-times"
                        style={{
                          color: "var(--Lavander)",
                          position: "absolute",
                          top: 0,
                          right: 0,
                          margin: "10px",
                          background: "var(--Blanco-fondo)",
                          padding: "5px",
                          borderRadius: "10px",
                        }}
                      ></i>
                      <img
                        src={img.url}
                        alt="imagen de seccion"
                        style={{
                          width: "200px",
                          height: "200px",
                          borderRadius: "20px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                      {erroresCampos["imagen"].length > 0 && (
                        <SpamError mensaje={erroresCampos["imagen"]} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-top-gray">
                <button
                  type="button"
                  className="btn theme-btn mb-2"
                  onClick={(event) => {
                    editarSeccion(event);
                  }}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn theme-btn theme-btn-dark mb-2"
                  onClick={() => {
                    setMostrarPopUpEditarSeccion(false);
                  }}
                >
                  {" "}
                  Cancelar{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarPopUpAgregarContenido && (
        <div
          className="modal fade modal-container show"
          style={{ background: "rgba(0, 0, 0, 0.7)" }}
          id="comprarModal3"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="comprarModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-theme"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header border-bottom-gray">
                <div className="pr-2">
                  <h5
                    className="modal-title fs-19 font-weight-semi-bold lh-24"
                    id="comprarModalTitle"
                  >
                    Agregar contenido
                  </h5>
                </div>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="label-text">Qué deseas agregar?</label>{" "}
                  <br />
                  <button
                    className="btn theme-btn btn-round mt-2 ml-2"
                    type="button"
                    onClick={handleAgregarVideo}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <i className="la la-file-video fs-18 mr-2"></i>Video
                  </button>
                  {permissions[46] || esDocente == 1 ? (
                    <Link
                      to={`${urlBase}/examen/crear/${id}/${idSeccionAgregarContenido}`}
                      className="btn theme-btn btn-round mt-2 ml-2"
                      type="button"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      <i className="la la-file-alt fs-18 mr-2"></i>Examen
                    </Link>
                  ) : (
                    ""
                  )}
                  {permissions[89] || esDocente == 1 ? (
                    <button
                      className="btn theme-btn btn-round mt-2 ml-2"
                      type="button"
                      onClick={() => {
                        setPopupEtiqueta({
                          ...popUpEtiqueta,
                          mostrar: 1,
                          id_etiqueta: -1,
                          id_categoria: idSeccionAgregarContenido,
                        });
                        setMostrarPopUpAgregarContenido(false);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <i className="la la-tag fs-18 mr-2"></i> Etiqueta
                    </button>
                  ) : (
                    ""
                  )}
                  {permissions[86] || esDocente == 1 ? (
                    <button
                      className="btn theme-btn btn-round mt-2 ml-2"
                      type="button"
                      onClick={() => {
                        setPopupRecurso({
                          ...popUpRecurso,
                          mostrar: 1,
                          id_recurso: -1,
                          id_categoria: idSeccionAgregarContenido,
                        });
                        setMostrarPopUpAgregarContenido(false);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <i className="la la-folder fs-18 mr-2"></i> Recurso
                    </button>
                  ) : (
                    ""
                  )}
                  {permissions[95] || esDocente == 1 ? (
                    <button
                      className="btn theme-btn btn-round mt-2 ml-2"
                      type="button"
                      onClick={() => {
                        setPopupForo({
                          ...popUpForo,
                          mostrar: 1,
                          id_foro: -1,
                          id_categoria: idSeccionAgregarContenido,
                        });
                        setMostrarPopUpAgregarContenido(false);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <i className="la la-users fs-18 mr-2"></i> Foro
                    </button>
                  ) : (
                    ""
                  )}
                  {permissions[92] || esDocente == 1 ? (
                    <button
                      className="btn theme-btn btn-round mt-2 ml-2"
                      type="button"
                      onClick={() => {
                        setPopupTarea({
                          ...popUpTarea,
                          mostrar: 1,
                          id_tarea: -1,
                          id_categoria: idSeccionAgregarContenido,
                        });
                        setMostrarPopUpAgregarContenido(false);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <i className="la la-file-invoice fs-18 mr-2"></i> Tarea
                    </button>
                  ) : (
                    ""
                  )}
                  {permissions[99] || esDocente == 1 ? (
                    <button
                      className="btn theme-btn btn-round mt-2 ml-2"
                      type="button"
                      onClick={() => {
                        setPopupUrl({
                          ...popUpUrl,
                          mostrar: 1,
                          id_url: -1,
                          id_categoria: idSeccionAgregarContenido,
                        });
                        setMostrarPopUpAgregarContenido(false);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <i className="la la-link fs-18 mr-2"></i> Url
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="modal-footer border-top-gray">
                <button
                  type="button"
                  className="btn theme-btn btn-round mt-2 theme-btn-dark mb-2"
                  onClick={() => {
                    setMostrarPopUpAgregarContenido(false);
                  }}
                >
                  {" "}
                  Cancelar{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarPopUpAgregarVideo && (
        <VideoPicker
          funcionMostrarPopUp={setMostrarPopUpAgregarVideo}
          funcionSetVideoSeleccionado={handleSeleccionarVideo}
        />
      )}

      <div className="dashboard-content-wrap">
        <div className="container-fluid">
          <button
            className="btn theme-btn btn-round mb-4"
            onClick={() =>
              navigate(
                `${
                  urlAmigableVolver != ""
                    ? "/play/" + urlAmigableVolver
                    : location?.state?.urlFrom ?? "/cursos"
                }`
              )
            }
          >
            <i className="la la-arrow-left"></i>
            Atrás
          </button>
          <div
            className="dashboard-heading mb-4 btn-round"
            style={{
              background: "var(--Lavander-100)",
              padding: "10px 25px",
              lineHeight: "1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 className="fs-18 font-weight-bold p-0 m-0">
                {nombre != "" ? nombre : <Skeleton width={"30%"} />}
              </h3>
              <span
                className="fs-15"
                style={{
                  color: "var(--Gris-oscuro)",
                }}
              >
                {nombre != "" ? (
                  "Editar contenido del curso"
                ) : (
                  <Skeleton width={"20%"} />
                )}
              </span>
            </div>
            <div>
              {tiposDeContenido.map((tipo) => (
                <button
                  className="btn theme-btn btn-round mx-1"
                  style={{
                    padding: "5px 8px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onClick={() => handleClickFilter(tipo.id)}
                >
                  <i
                    className={`la ${
                      filters.includes(tipo.id)
                        ? "la-check-circle"
                        : "la-circle"
                    }`}
                    style={{
                      fontSize: "20px",
                    }}
                  ></i>
                  <span className="mx-1">{tipo.nombre}</span>
                  <i
                    className={`la ${tipo.fontIcon}`}
                    style={{
                      fontSize: "20px",
                    }}
                  ></i>
                </button>
              ))}
            </div>
          </div>
          <form action="#">
            {Object.keys(contenido).map((key) => (
              <div
                className="card card-item "
                key={`contenido-cat-${contenido[key].id_categoria}`}
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body">
                  <h3
                    className="fs-22 font-weight-semi-bold pb-2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {contenido[key].nombre}{" "}
                    {permissions[25] || esDocente ? (
                      <i
                        className="la la-pen"
                        style={{ color: "var(--Lavander)", fontSize: "25px" }}
                        onClick={(event) => {
                          handleEditarSeccion(
                            event,
                            contenido[key].id_categoria,
                            contenido[key]
                          );
                        }}
                        data-toggle="tooltip"
                        data-placement="top"
                        data-title="Editar sección"
                      ></i>
                    ) : (
                      ""
                    )}{" "}
                    {contenido[key].curso_contenido.length == 0 &&
                    (permissions[25] || esDocente) ? (
                      <div
                        onClick={(event) => {
                          handleBorrarCategoria(
                            event,
                            contenido[key].id_categoria
                          );
                        }}
                        // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Borrar"
                        style={{ color: "var(--Lavander)", fontSize: "25px" }}
                      >
                        <span
                          data-toggle="modal"
                          data-target="#itemDeleteModal"
                          className="w-100 h-100 d-inline-block"
                        >
                          <i className="la la-trash"></i>
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table generic-table">
                          <thead style={{ borderRadius: "10px" }}>
                            <tr>
                              <th
                                scope="col"
                                style={{ borderRadius: "10px 0 0 10px" }}
                              >
                                Vista Previa
                              </th>
                              <th scope="col">Tipo</th>
                              <th scope="col">Nombre</th>
                              {permissions[34] || esDocente ? (
                                <th scope="col" style={{ textAlign: "center" }}>
                                  Descargable
                                </th>
                              ) : (
                                ""
                              )}
                              <th scope="col" style={{ textAlign: "center" }}>
                                Porcentaje en curso
                              </th>
                              <th scope="col">Detalle</th>
                              <th
                                scope="col"
                                style={{ borderRadius: "0 10px 10px 0" }}
                              ></th>
                            </tr>
                          </thead>
                          <tbody>
                            {contenido[key].curso_contenido
                              ?.filter((item) => {
                                if (filters.length > 0) {
                                  return filters.includes(item.tipo_contenido);
                                } else {
                                  return true;
                                }
                              })
                              .map((tema) => (
                                <tr
                                  key={`contenido-x-${key}-${tema.id_contenido}`}
                                >
                                  <th scope="row">
                                    <div className="custom-control custom-checkbox media media-card">
                                      {tema.tipo_contenido == 1 ? (
                                        <div
                                          className="media-img"
                                          style={{
                                            height: "auto",
                                            cursor: "pointer",
                                          }}
                                        >
                                          {tema.imagen_preview_pequena &&
                                          tema.imagen_preview_pequena !=
                                            null ? (
                                            <img
                                              src={`${urlBaseApi}/${tema.imagen_preview_pequena}`}
                                              alt={tema.nombre}
                                              onClick={() => {
                                                setPosterVistaPrevia(
                                                  tema.imagen_preview_pequena
                                                );
                                                setPopupVideo({
                                                  ...popUpVideo,
                                                  mostrar: true,
                                                  contenido: tema.video_grande,
                                                });
                                              }}
                                            />
                                          ) : (
                                            <img
                                              src={`${urlBase}/images/course-no-image.png`}
                                              alt={tema.nombre}
                                            />
                                          )}
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {tema.tipo_contenido == 3 ||
                                      tema.tipo_contenido == 7 ? (
                                        <div className="media-img">
                                          {tema.ruta_imagen_preview_small &&
                                          tema.ruta_imagen_preview_small !=
                                            null ? (
                                            <img
                                              src={`${urlBaseApi}/${tema.ruta_imagen_preview_small}`}
                                            />
                                          ) : (
                                            <img
                                              src={`${urlBase}/images/course-no-image.png`}
                                            />
                                          )}
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </th>
                                  <td>
                                    <i
                                      className={`la ${
                                        obtenerNombreContenido(
                                          tema.tipo_contenido
                                        ).icon
                                      }`}
                                      style={{
                                        fontSize: "30px",
                                        color: "var(--Azul-petroleo)",
                                      }}
                                      title={
                                        obtenerNombreContenido(
                                          tema.tipo_contenido
                                        ).nombre
                                      }
                                    ></i>
                                  </td>
                                  <td>{tema.nombre}</td>
                                  {permissions[34] || esDocente == 1 ? (
                                    <td className="text-center">
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {tema.descargables.map(
                                          (descargable) => (
                                            <div
                                              key={`descargable-${descargable.id}`}
                                              onClick={() => {
                                                handleDownload({
                                                  ruta_archivo: `${urlBaseApi}/${descargable.ruta_archivo.replace(
                                                    "public/",
                                                    ""
                                                  )}`,
                                                  nombre_archivo: `descargable.${descargable.extension}`,
                                                });
                                              }}
                                              // className="icon-element icon-element-sm flex-shrink-0 bg-7 mr-3 text-white"
                                              style={{ cursor: "pointer" }}
                                            >
                                              <i
                                                className={`la la-file-${
                                                  descargable.extension ===
                                                  "docx"
                                                    ? "word"
                                                    : "pdf"
                                                }`}
                                                style={{
                                                  color: "var(--Lavander)",
                                                  fontSize: "40px",
                                                }}
                                              ></i>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </td>
                                  ) : (
                                    ""
                                  )}
                                  <td className="text-center">
                                    {tema.porcentaje_en_total_curso &&
                                    tema.porcentaje_en_total_curso != 0 ? (
                                      <GraficCircle
                                        value={
                                          tema.porcentaje_en_total_curso ??
                                          "0.00"
                                        }
                                        isPercentaje
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                  <td>
                                    <div className="courser-item-meta-wrap">
                                      {tema.tipo_contenido == 1 ? (
                                        <p className="course-item-meta">
                                          <i className="la la-play-circle"></i>
                                          {tema.cantidad_horas_de_video}
                                        </p>
                                      ) : (
                                        ""
                                      )}
                                      {tema.tipo_contenido == 2 &&
                                      tema.tipo == 1
                                        ? "Básico, o control de aprendizaje"
                                        : ""}
                                      {tema.tipo_contenido == 2 &&
                                      tema.tipo == 2
                                        ? "Nivel medio"
                                        : ""}
                                      {tema.tipo_contenido == 2 &&
                                      tema.tipo == 3
                                        ? "Nivel Avanzado"
                                        : ""}
                                      {tema.tipo_contenido == 2 &&
                                      examenesSoloPago == 1
                                        ? " (Pago)"
                                        : ""}
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ display: "flex" }}>
                                      {permissions[29] || esDocente == 1 ? (
                                        <a
                                          href="#"
                                          // className="icon-element icon-element-sm cursor-pointer ml-1"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          data-title="Subir"
                                          onClick={(event) =>
                                            handleMoverContenido(
                                              event,
                                              tema.id_contenido,
                                              "1"
                                            )
                                          }
                                          title="Subir"
                                          style={{
                                            fontSize: "30px",
                                            color: "var(--Lavander)",
                                          }}
                                        >
                                          <i className="la la-arrow-circle-up"></i>
                                        </a>
                                      ) : (
                                        ""
                                      )}
                                      {permissions[29] || esDocente == 1 ? (
                                        <a
                                          href="#"
                                          // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-success"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          data-title="Bajar"
                                          onClick={(event) =>
                                            handleMoverContenido(
                                              event,
                                              tema.id_contenido,
                                              "2"
                                            )
                                          }
                                          title="Bajar"
                                          style={{
                                            fontSize: "30px",
                                            color: "var(--Lavander)",
                                          }}
                                        >
                                          <i className="la la-arrow-circle-down"></i>
                                        </a>
                                      ) : (
                                        ""
                                      )}

                                      {tema.tipo_contenido == 4 &&
                                      (permissions[90] || esDocente == 1) ? (
                                        <div
                                          onClick={() => {
                                            setPopupEtiqueta({
                                              ...popUpEtiqueta,
                                              mostrar: 1,
                                              id_etiqueta:
                                                tema.id_tipo_contenido,
                                              id_categoria: -1,
                                            });
                                          }}
                                          // className="icon-element icon-element-sm shadow-sm cursor-pointer m-1 text-secondary"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title="Editar Etiqueta"
                                          style={{
                                            fontSize: "30px",
                                            color: "var(--Lavander)",
                                          }}
                                        >
                                          <span
                                            data-toggle="modal"
                                            data-target="#tagModal"
                                            className="w-100 h-100 d-inline-block"
                                          >
                                            <i className="la la-cog"></i>
                                          </span>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {tema.tipo_contenido == 3 &&
                                      (permissions[87] || esDocente == 1) ? (
                                        <div
                                          onClick={() => {
                                            setPopupRecurso({
                                              ...popUpRecurso,
                                              mostrar: 1,
                                              id_recurso:
                                                tema.id_tipo_contenido,
                                              id_categoria: -1,
                                            });
                                          }}
                                          // className="icon-element icon-element-sm shadow-sm cursor-pointer m-1 text-secondary"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title="Editar Recurso"
                                          style={{
                                            fontSize: "30px",
                                            color: "var(--Lavander)",
                                          }}
                                        >
                                          <span
                                            data-toggle="modal"
                                            data-target="#resourceModal"
                                            className="w-100 h-100 d-inline-block"
                                          >
                                            <i className="la la-cog"></i>
                                          </span>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {tema.tipo_contenido == 5 &&
                                      (permissions[93] || esDocente == 1) ? (
                                        <div
                                          onClick={() => {
                                            setPopupTarea({
                                              ...popUpTarea,
                                              mostrar: 1,
                                              id_tarea: tema.id_tipo_contenido,
                                              id_categoria: -1,
                                            });
                                          }}
                                          // className="icon-element icon-element-sm shadow-sm cursor-pointer m-1 text-secondary"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title="Editar Tarea"
                                          style={{
                                            fontSize: "30px",
                                            color: "var(--Lavander)",
                                          }}
                                        >
                                          <span
                                            data-toggle="modal"
                                            data-target="#resourceEditTarea"
                                            className="w-100 h-100 d-inline-block"
                                          >
                                            <i className="la la-cog"></i>
                                          </span>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {tema.tipo_contenido == 6 &&
                                      (permissions[96] || esDocente == 1) ? (
                                        <div
                                          onClick={() => {
                                            setPopupForo({
                                              ...popUpForo,
                                              mostrar: 1,
                                              id_foro: tema.id_tipo_contenido,
                                              id_categoria: -1,
                                            });
                                          }}
                                          // className="icon-element icon-element-sm shadow-sm cursor-pointer m-1 text-secondary"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title="Editar Foro"
                                          style={{
                                            fontSize: "30px",
                                            color: "var(--Lavander)",
                                          }}
                                        >
                                          <span
                                            data-toggle="modal"
                                            data-target="#resourceEditForo"
                                            className="w-100 h-100 d-inline-block"
                                          >
                                            <i className="la la-cog"></i>
                                          </span>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {tema.tipo_contenido == 7 &&
                                      (permissions[100] || esDocente == 1) ? (
                                        <div
                                          onClick={() => {
                                            setPopupUrl({
                                              ...popUpUrl,
                                              mostrar: 1,
                                              id_url: tema.id_tipo_contenido,
                                              id_categoria: -1,
                                            });
                                          }}
                                          // className="icon-element icon-element-sm shadow-sm cursor-pointer m-1 text-secondary"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title="Editar url"
                                          style={{
                                            fontSize: "30px",
                                            color: "var(--Lavander)",
                                          }}
                                        >
                                          <span
                                            data-toggle="modal"
                                            data-target="#resourceEditForo"
                                            className="w-100 h-100 d-inline-block"
                                          >
                                            <i className="la la-cog"></i>
                                          </span>
                                        </div>
                                      ) : (
                                        ""
                                      )}

                                      {/* {tema.tipo_contenido == 1 &&
                                      esDocente == 1 &&
                                      instructorEditaContenido == 1 ? (
                                        <Link
                                          to={`/video/editar/${tema.id_tipo_contenido}/${id}`}
                                        >
                                          <div
                                            // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            data-title="Editar configuración"
                                            title="Editar configuración"
                                            style={{
                                              fontSize: "30px",
                                              color: "var(--Lavander)",
                                            }}
                                          >
                                            <i className="la la-gear"></i>
                                          </div>
                                        </Link>
                                      ) : (
                                        ""
                                      )} */}
                                      {tema.tipo_contenido == 2 &&
                                      (permissions[47] || esDocente == 1) ? (
                                        <Link
                                          to={`/examen/editar/${tema.id_tipo_contenido}/${id}`}
                                        >
                                          <div
                                            // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            data-title="Editar configuración"
                                            title="Editar configuración"
                                            style={{
                                              fontSize: "30px",
                                              color: "var(--Lavander)",
                                            }}
                                          >
                                            <i className="la la-gear"></i>
                                          </div>
                                        </Link>
                                      ) : (
                                        ""
                                      )}
                                      {tema.tipo_contenido == 2 &&
                                      (permissions[47] || esDocente == 1) ? (
                                        <div
                                          onClick={() => {
                                            handleFuncionHuecoPreguntas(
                                              tema.id_tipo_contenido
                                            );
                                          }}
                                          // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          data-title="Editar preguntas"
                                          style={{
                                            fontSize: "30px",
                                            color: "var(--Lavander)",
                                          }}
                                        >
                                          <i className="la la-list-ol"></i>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {(permissions[35] ||
                                        permissions[36] ||
                                        esDocente == 1) &&
                                      [1, 2, 5, 6].includes(
                                        tema.tipo_contenido
                                      ) ? (
                                        <a
                                          onClick={(event) => {
                                            handleAbrirListaDescargable(event, {
                                              id_tipo_contenido:
                                                tema.id_tipo_contenido,
                                              tipo_contenido:
                                                tema.tipo_contenido,
                                            });
                                          }}
                                          href="#"
                                          // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-success"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          data-title="Editar descargable"
                                          title="Editar descargable"
                                          style={{
                                            fontSize: "30px",
                                            color: "var(--Lavander)",
                                          }}
                                        >
                                          <i className="la la-upload"></i>
                                        </a>
                                      ) : (
                                        ""
                                      )}
                                      {permissions[29] || esDocente == 1 ? (
                                        <div
                                          onClick={(event) => {
                                            handleBorrarContenido(
                                              event,
                                              tema.id_contenido
                                            );
                                          }}
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
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      {permissions[29] || esDocente == 1 ? (
                        <div className="course-submit-btn-box pb-4">
                          <button
                            className="btn theme-btn mt-3 btn-round"
                            type="submit"
                            onClick={(event) => {
                              handleAgregarContenido(
                                event,
                                contenido[key].id_categoria
                              );
                            }}
                          >
                            <i className="la la-plus mr-2"></i>Agregar contenido
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {permissions[24] || esDocente == 1 ? (
              <div className="course-submit-btn-box pb-4">
                <button
                  className="btn theme-btn btn-round"
                  type="submit"
                  onClick={(event) => handleAbrirCrearSeccion(event)}
                >
                  <i className="la la-plus mr-2"></i>Agregar sección
                </button>
              </div>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default FormularioEditarContenidoCurso;
