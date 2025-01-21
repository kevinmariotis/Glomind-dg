/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { AuthContext } from "../AuthContext";
import { mensajesDeError } from "./utils";
import Spinner from "./Spinner";
import SpamError from "./SpamError";
import Popup from "./Popup";
import Paginador from "./Paginador";
import BotonDashboardNavegacionMovil from "./BotonDashboardNavegacionMovil";
import DashboardFooter from "./DashboardFooter";
import VideoPicker from "./VideoPicker";

/*Import para el arbol de categorias*/
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { useSelector } from "react-redux";
import Fields from "./forms/Fields";
/*Fin de los imports para el arbol de categorias*/

export default function FormularioCategoriasSistema() {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { jwt, permissions, esMovil, temaActual } = useContext(AuthContext);
  const { camposPersonalizablesCategorias } = useSelector(
    (state) => state.config
  );
  const [popUp, setPopup] = useState({
    mostrar: false,
    tipo: 2,
    titulo: "",
    contenido: "",
    data_switch: "",
    data_id: -1,
    data_id_2: -1,
  });
  const [verPopUpCrearCategoria, setVerPopUpCrearCategoria] = useState(false);
  const [verPopUpEditarCategoria, setVerPopUpEditarCategoria] = useState(false);
  const [verPopUpEditarImagenCategoria, setVerPopUpEditarImagenCategoria] =
    useState(false);
  const [verPopUpEditarImagenTag, setVerPopUpEditarImagenTag] = useState(false);
  const [verPopUpEditarTagAgrupacion, setVerPopUpEditarTagAgrupacion] =
    useState(false);
  const [verPopUpEditarTag, setVerPopUpEditarTag] = useState(false);
  const [verPopUpCrearTagAgrupacion, setVerPopUpCrearTagAgrupacion] =
    useState(false);
  const [verPopUpCrearTag, setVerPopUpCrearTag] = useState(false);
  const [verPopUpBuscarCurso, setVerPopUpBuscarCurso] = useState(false);
  const [pestanaActivada, setPestanaActivada] = useState(1);

  const [formFileds, setFormFields] = useState({});
  const [formNombre, setFormNombre] = useState("");
  const [formIdCategoriaPadre, setFormIdCategoriaPadre] = useState(0);
  const [formIdCategoriaEditando, setFormIdCategoriaEditando] = useState(0);
  const [formEstado, setFormEstado] = useState(1);
  const [formNombreCategoriaPadre, setFormNombreCategoriaPadre] = useState("");
  const [imagenPequenaCategoriaSistema, setImagenPequenaCategoriaSistema] =
    useState("");
  const [imagenPequenaTag, setImagenPequenaTag] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [treeData, setTreeData] = useState([]);

  const [tagsAgrupaciones, setTagsAgrupaciones] = useState({});
  const [tags, setTags] = useState({});

  const [palabraBuscarCurso, setPalabraBuscarCurso] = useState("");
  const [opcionesCurso, setOpcionesCurso] = useState({});

  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [mostrarPopUpAgregarVideo, setMostrarPopUpAgregarVideo] =
    useState(false);
  const [vistaPreviaVideo, setVistaPreviaVideo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    switch (pestanaActivada) {
      case 1:
        obtenerCategoriasSistema();
        break;
      case 2:
        obtenerTagsAgrupacion();
        break;
      case 3:
        obtenerTags();
        break;
    }
  }, [pestanaActivada]);

  useEffect(() => {
    if (palabraBuscarCurso != "") {
      buscarCursos(formIdCategoriaEditando, 0);
    } else {
      if (formIdCategoriaEditando != 0) {
        buscarCursos(formIdCategoriaEditando, 1);
      }
    }
  }, [palabraBuscarCurso]);

  //Estados de los errores de campos
  const camposErrores = {
    nombre: [],
    estado: [],
    imagen: [],

    buscador: [],
    id_tag_agrupacion: [],
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

  const handleCambiarPestana = (event, numero) => {
    event.preventDefault();
    setPestanaActivada(numero);
  };

  const handleFuncionAceptarPopUp = () => {
    switch (popUp.data_switch) {
      case "borrar-categoria":
        borrarCategoriaSistema(popUp.data_id);
        break;
      case "borrar-tag-agrupacion":
        borrarTagAgrupacion(popUp.data_id);
        break;
      case "borrar-tag":
        borrarTag(popUp.data_id);
        break;
    }
    setPopup({
      ...popUp,
      mostrar: false,
      tipo: 2,
      data_switch: "",
      data_id: -1,
      data_id_2: -1,
    });
  };

  const handleFuncionCerrarPopUp = () => {
    setPopup({
      ...popUp,
      mostrar: false,
      tipo: 2,
      data_switch: "",
      data_id: -1,
      data_id_2: -1,
    });
  };

  const handleDrop = (
    newTree,
    { dragSourceId, dropTargetId, dragSource, dropTarget }
  ) => {
    setTreeData(newTree);
    if (
      dragSource.data.tipo == "curso" &&
      dropTarget.data.tipo == "categoria"
    ) {
      moverCurso(dragSource.data.id_real, dropTarget.data.id_real);
    } else {
      if (
        dragSource.data.tipo == "categoria" &&
        dropTarget.data.tipo == "categoria"
      ) {
        moverCategoria(dragSource.data.id_real, dropTarget.data.id_real);
      }
    }
  };

  const handleNombreChange = (event) => {
    setFormNombre(event.target.value);
  };
  const handleEstadoChange = (event) => {
    setFormEstado(event.target.value);
  };
  const handleChangeFields = (event) => {
    let value = event.target.value;
    if (event.target.type === "datetime-local") {
      value = `${event.target.value.split("T")[0]} ${
        event.target.value.split("T")[1]
      }:00`;
    }
    setFormFields({ ...formFileds, [event.target.name]: value });
  };

  const handleClickCrear = (id_categoria_padre, nombre_categoria_padre) => {
    reiniciarErrorCampoGlobal();
    setFormNombreCategoriaPadre(nombre_categoria_padre);
    setVerPopUpCrearCategoria(true);
    setFormNombre("");
    setFormEstado(-1);
    setFormIdCategoriaPadre(id_categoria_padre);
  };
  console.log(formFileds);
  const handleClickEditar = (
    tipo_elemento,
    id,
    nombre,
    estado,
    camposExtras
  ) => {
    reiniciarErrorCampoGlobal();
    switch (tipo_elemento) {
      case "categoria":
        setVerPopUpEditarCategoria(true);
        setFormNombre(nombre);
        setFormIdCategoriaEditando(id);
        setFormEstado(estado);
        setFormFields(camposExtras);
        break;
      case "tag-agrupacion":
        setVerPopUpEditarTagAgrupacion(true);
        setFormNombre(nombre);
        setFormIdCategoriaEditando(id);
        setFormEstado(estado);
        break;
      case "tag":
        setVerPopUpEditarTag(true);
        setFormNombre(nombre);
        setFormIdCategoriaEditando(id);
        setFormEstado(estado);
        break;
      case "tag-asignacion":
        setVerPopUpBuscarCurso(true);
        setFormNombre(nombre);
        setFormIdCategoriaEditando(id);
        buscarCursos(id, 1);
        break;
      case "tag-imagen":
        setVerPopUpEditarImagenTag(true);
        setImagenPequenaTag(nombre);
        setFormIdCategoriaEditando(id);
        break;
    }
  };

  const handleClickEditarImagen = (id, imagen_pequena) => {
    reiniciarErrorCampoGlobal();
    setFormIdCategoriaEditando(id);
    setVerPopUpEditarImagenCategoria(true);
    setImagenPequenaCategoriaSistema(imagen_pequena);
  };

  const handleClickBorrarCategoriaSistema = async (id, nombre) => {
    reiniciarErrorCampoGlobal();
    setPopup({
      mostrar: true,
      tipo: 3,
      titulo: "Confirmar",
      contenido: "Confirma que desea borrar la categorpia " + nombre + "?",
      data_switch: "borrar-categoria",
      data_id: id,
    });
  };

  const handleClickBorrarTagAgrupacion = async (id, nombre) => {
    reiniciarErrorCampoGlobal();
    setPopup({
      mostrar: true,
      tipo: 3,
      titulo: "Confirmar",
      contenido: "Confirma que desea el tag agrupación " + nombre + "?",
      data_switch: "borrar-tag-agrupacion",
      data_id: id,
    });
  };

  const handleClickBorrarTag = async (id, nombre) => {
    reiniciarErrorCampoGlobal();
    setPopup({
      mostrar: true,
      tipo: 3,
      titulo: "Confirmar",
      contenido: "Confirma que desea el tag " + nombre + "?",
      data_switch: "borrar-tag",
      data_id: id,
    });
  };

  const handleSetPalabraBuscarCurso = (event) => {
    event.preventDefault();
    setPalabraBuscarCurso(event.target.value);
  };

  const handleAgregarVideo = (id_categoria, video_pequeno) => {
    setMostrarPopUpAgregarVideo(true);
    setVistaPreviaVideo(video_pequeno);
    setFormIdCategoriaEditando(id_categoria);
  };

  const onDrop = (acceptedFiles) => {
    // Lógica para procesar los archivos aceptados
    setSelectedImage(acceptedFiles[0]);
  };
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
  });
  const fileList = acceptedFiles.map((file, index) => (
    <li key={`imagen-ajunta${index}`}>{file.name}</li>
  ));

  const obtenerCategoriasSistema = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      if (permissions[14] || permissions[15] || permissions[16]) {
        const opciones = {
          method: "GET",
          headers: headers,
        };
        setMostrarSpinner(true);
        const response = await fetch(
          `${urlBaseApi}/api/categoriasistema/getTodas/1`,
          opciones
        );
        setMostrarSpinner(false);
        if (response.ok) {
          const datos = await response.json();
          //setCategoriaaSistema(datos);
          setTreeData(datos);
        } else {
          const data = await response.json();
          mensajesDeError(
            setPopup,
            response.status,
            typeof data.datos !== "undefined" ? data.datos : {}
          );
        }
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const crearCategoria = async (event) => {
    event.preventDefault();
    reiniciarErrorCampoGlobal();

    const formData = new FormData();
    formData.append("id_padre", formIdCategoriaPadre);
    formData.append("nombre", formNombre);
    formData.append("estado", formEstado);
    if (Object.keys(formFileds)?.length > 0) {
      Object.keys(formFileds)?.forEach((element) => {
        if (formFileds[element] != null) {
          formData.append(element, formFileds[element]);
        }
      });
    }

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
        `${urlBaseApi}/api/categoriasistema`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setFormNombre("");
        setFormEstado(1);
        setFormIdCategoriaPadre(0);
        setVerPopUpCrearCategoria(false);
        obtenerCategoriasSistema();
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "Categoría creada.",
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

  const editarCategoria = async () => {
    let raw = {
      nombre: formNombre,
      estado: formEstado.toString(),
    };
    if (Object.keys(formFileds)?.length > 0) {
      Object.keys(formFileds)?.forEach((element) => {
        if (formFileds[element] != null) {
          raw[element] = formFileds[element];
        }
      });
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
      const response = await fetch(
        `${urlBaseApi}/api/categoriasistema/${formIdCategoriaEditando}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setFormNombre("");
        setFormEstado(1);
        setVerPopUpEditarCategoria(false);
        obtenerCategoriasSistema();
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
  const editarImagenCategoria = async () => {
    reiniciarErrorCampoGlobal();
    if (selectedImage != null) {
      setMostrarSpinner(true);
      try {
        const formData = new FormData();
        formData.append("imagen", selectedImage);
        const opciones = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        };
        const response = await fetch(
          `${urlBaseApi}/api/categoriasistema/actualizarImagen/${formIdCategoriaEditando}`,
          opciones
        );
        const datos = await response.json();
        setMostrarSpinner(false);
        if (response.ok) {
          setVerPopUpEditarImagenCategoria(false);
          obtenerCategoriasSistema();
          setPopup({
            mostrar: true,
            titulo: "Listo",
            contenido: "Imagen actualizada.",
          });
          return;
        } else {
          if (datos.codigo == "no-puede-ser-redimensioada-a-370-247") {
            setPopup({
              mostrar: true,
              titulo: "Error",
              contenido:
                "La imagen no es de 370 x 247 o no puede ser redimensionada equitativamente a este tamaño.",
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
      } catch (error) {
        // Manejar el caso de error en la solicitud
        console.error("Error en la solicitud al servidor", error);
      }
    } else {
      setPopup({
        mostrar: true,
        titulo: "Mensaje",
        contenido: "Seleccione una imagen de su dispositivo.",
      });
    }
  };

  const editarImagenTag = async () => {
    reiniciarErrorCampoGlobal();
    if (selectedImage != null) {
      setMostrarSpinner(true);
      try {
        const formData = new FormData();
        formData.append("imagen", selectedImage);
        const opciones = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        };
        const response = await fetch(
          `${urlBaseApi}/api/cursotag/actualizarImagen/${formIdCategoriaEditando}`,
          opciones
        );
        const datos = await response.json();
        setMostrarSpinner(false);
        if (response.ok) {
          setVerPopUpEditarImagenTag(false);
          obtenerTags();
          setPopup({
            mostrar: true,
            titulo: "Listo",
            contenido: "Imagen actualizada.",
          });
          return;
        } else {
          if (datos.codigo == "no-puede-ser-redimensioada-a-370-247") {
            setPopup({
              mostrar: true,
              titulo: "Error",
              contenido:
                "La imagen no es de 370 x 247 o no puede ser redimensionada equitativamente a este tamaño.",
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
      } catch (error) {
        // Manejar el caso de error en la solicitud
        console.error("Error en la solicitud al servidor", error);
      }
    } else {
      setPopup({
        mostrar: true,
        titulo: "Mensaje",
        contenido: "Seleccione una imagen de su dispositivo.",
      });
    }
  };

  const borrarCategoriaSistema = async (id_categoria) => {
    setMostrarSpinner(true);
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "DELETE",
        headers: headers,
      };
      const response = await fetch(
        `${urlBaseApi}/api/categoriasistema/${id_categoria}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        obtenerCategoriasSistema();
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "Categoría borrada.",
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

  const handleSeleccionarVideo = async (id_video) => {
    //event.preventDefault();
    reiniciarErrorCampoGlobal();

    const raw = {
      id_video_preview: id_video + "",
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
        `${urlBaseApi}/api/categoriasistema/editarVideoPreview/${formIdCategoriaEditando}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "Video asignado correctamente.",
        });
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
      console.error("Error de conexión:", error);
    }
  };

  /*
        Mueve un curso de una categoria a otra
    */
  const moverCurso = async (id_curso, id_categoria_destino) => {
    const raw = {
      id_categoria: id_categoria_destino.toString(),
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
        `${urlBaseApi}/api/curso/editarCursoCategoria/${id_curso}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        //obtenerDatosServidor();
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          { titulo: "No es posible", contenido: "Realizar este movimiento." }
        );
        obtenerCategoriasSistema(); //se vuelve a cargar para deshacer el ultimo movimiento.
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  /*
        Mueve un curso de una categoria a otra
    */
  const moverCategoria = async (id_categoria, id_categoria_destino) => {
    const raw = {
      id_categoria_padre: id_categoria_destino.toString(),
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
        `${urlBaseApi}/api/categoriasistema/editarPadre/${id_categoria}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        //obtenerDatosServidor();
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          { titulo: "No es posible", contenido: "Realizar este movimiento." }
        );
        obtenerCategoriasSistema(); //se vuelve a cargar para deshacer el ultimo movimiento.
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const obtenerTagsAgrupacion = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      if (permissions[50] || permissions[51] || permissions[52]) {
        const opciones = {
          method: "GET",
          headers: headers,
        };
        setMostrarSpinner(true);
        const response = await fetch(
          `${urlBaseApi}/api/cursotagagrupacion/getTodos/1`,
          opciones
        );
        setMostrarSpinner(false);
        if (response.ok) {
          const datos = await response.json();
          setTagsAgrupaciones(datos);
        } else {
          const data = await response.json();
          mensajesDeError(
            setPopup,
            response.status,
            typeof data.datos !== "undefined" ? data.datos : {}
          );
        }
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };
  const crearTagAgrupacion = async (event) => {
    event.preventDefault();
    reiniciarErrorCampoGlobal();

    const formData = new FormData();
    formData.append("nombre", formNombre);
    formData.append("buscador", formEstado);

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
        `${urlBaseApi}/api/cursotagagrupacion`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setFormNombre("");
        setFormEstado(1);
        setVerPopUpCrearTagAgrupacion(false);
        obtenerTagsAgrupacion();
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "Tag Agrupación creado.",
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
  const editarTagAgrupacion = async () => {
    const raw = {
      nombre: formNombre,
      buscador: formEstado.toString(),
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
        `${urlBaseApi}/api/cursotagagrupacion/${formIdCategoriaEditando}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setFormNombre("");
        setFormEstado(1);
        setVerPopUpEditarTagAgrupacion(false);
        obtenerTagsAgrupacion();
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
  const borrarTagAgrupacion = async (id_tag_agrupacion) => {
    setMostrarSpinner(true);
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "DELETE",
        headers: headers,
      };
      const response = await fetch(
        `${urlBaseApi}/api/cursotagagrupacion/${id_tag_agrupacion}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        obtenerTagsAgrupacion();
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "Tag agupación borrado.",
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

  const obtenerTags = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      if (permissions[53] || permissions[54] || permissions[55]) {
        const opciones = {
          method: "GET",
          headers: headers,
        };
        setMostrarSpinner(true);
        const response = await fetch(
          `${urlBaseApi}/api/cursotag/getTodos/1`,
          opciones
        );
        setMostrarSpinner(false);
        if (response.ok) {
          const datos = await response.json();
          setTags(datos);
        } else {
          const data = await response.json();
          mensajesDeError(
            setPopup,
            response.status,
            typeof data.datos !== "undefined" ? data.datos : {}
          );
        }
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };
  const crearTag = async (event) => {
    event.preventDefault();
    reiniciarErrorCampoGlobal();

    const formData = new FormData();
    formData.append("nombre", formNombre);
    formData.append("id_tag_agrupacion", formEstado);

    const opciones = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(`${urlBaseApi}/api/cursotag`, opciones);
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setFormNombre("");
        setFormEstado(1);
        setVerPopUpCrearTag(false);
        obtenerTags();
        setPopup({ mostrar: true, titulo: "Listo", contenido: "Tag creado." });
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
  const editarTag = async () => {
    const raw = {
      nombre: formNombre,
      id_tag_agrupacion: formEstado.toString(),
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
        `${urlBaseApi}/api/cursotag/${formIdCategoriaEditando}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setFormNombre("");
        setFormEstado(1);
        setVerPopUpEditarTag(false);
        obtenerTags();
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
  const borrarTag = async (id_tag) => {
    setMostrarSpinner(true);
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "DELETE",
        headers: headers,
      };
      const response = await fetch(
        `${urlBaseApi}/api/cursotag/${id_tag}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        obtenerTags();
        setPopup({ mostrar: true, titulo: "Listo", contenido: "Tag borrado." });
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
  const buscarCursos = async (id_tag, todos_los_cursos) => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      const response = await fetch(
        `${urlBaseApi}/api/cursotag/buscarCursos/${id_tag}/${todos_los_cursos}/${palabraBuscarCurso}/1`,
        opciones
      );
      if (response.ok) {
        const datos = await response.json();
        setOpcionesCurso(datos);
      } else {
        const datos = await response.json();
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

  const agregarCursoTag = async (id_tag, id_curso) => {
    //event.preventDefault();
    reiniciarErrorCampoGlobal();

    const formData = new FormData();
    formData.append("id_tag", id_tag);
    formData.append("id_curso", id_curso);

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
        `${urlBaseApi}/api/cursotagasignacion`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (palabraBuscarCurso != "") {
        buscarCursos(formIdCategoriaEditando, 0);
      } else {
        buscarCursos(formIdCategoriaEditando, 1);
      }
      if (response.ok) {
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

  const quitarCursoTag = async (id_tag, id_curso) => {
    const opciones = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/cursotagasignacion/${id_tag}/${id_curso}`,
        opciones
      );
      const data = await response.json();
      setMostrarSpinner(false); //al quitar el spinner se recargan los datos
      if (palabraBuscarCurso != "") {
        buscarCursos(formIdCategoriaEditando, 0);
      } else {
        buscarCursos(formIdCategoriaEditando, 1);
      }
      if (response.ok) {
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof data.datos !== "undefined" ? data.datos : {}
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handleAsignacionTag = (event, key_curso) => {
    const newOpcionesCurso = [...opcionesCurso];
    newOpcionesCurso[key_curso].id_tag = !newOpcionesCurso[key_curso].id_tag;
    setOpcionesCurso(newOpcionesCurso);
    //console.log("Editando tag "+formIdCategoriaEditando+" en el curso "+newOpcionesCurso[key_curso].id+" a:"+newOpcionesCurso[key_curso].id_tag);
    if (event.target.checked) {
      if (permissions[57]) {
        agregarCursoTag(
          formIdCategoriaEditando,
          newOpcionesCurso[key_curso].id
        );
      }
    } else {
      if (permissions[58]) {
        quitarCursoTag(formIdCategoriaEditando, newOpcionesCurso[key_curso].id);
      }
    }
  };

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
      {mostrarPopUpAgregarVideo && (
        <VideoPicker
          funcionMostrarPopUp={setMostrarPopUpAgregarVideo}
          funcionSetVideoSeleccionado={handleSeleccionarVideo}
        />
      )}
      <div
        className={`modal fade modal-container ${
          verPopUpBuscarCurso == true ? "show" : ""
        }`}
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
        id="comprarModal3"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="comprarModalTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="comprarModalTitle"
                >
                  Selecciona los cursos del tag {formNombre}
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-text">Buscar curso por nombre</label>
                <input
                  onChange={handleSetPalabraBuscarCurso}
                  className="form-control form--control pl-3"
                  type="text"
                  name="buscar_curso"
                  maxLength="128"
                  placeholder="Ej: React Avanzazo"
                />
              </div>

              <div
                className="table-responsive"
                style={{ maxHeight: "250px", overflowY: "scroll" }}
              >
                <table className="table generic-table">
                  <thead>
                    <tr>
                      <th scope="col">Sel</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(opcionesCurso).map((key) => (
                      <tr key={`curso-seleccion-${opcionesCurso[key].id}`}>
                        <td>
                          <div className="custom-control custom-checkbox mb-4 fs-15">
                            <input
                              type="checkbox"
                              onClick={(event) =>
                                handleAsignacionTag(event, key)
                              }
                              checked={
                                (opcionesCurso[key].id_tag !== null &&
                                  opcionesCurso[key].id_tag !== false) ||
                                opcionesCurso[key].id_tag === true
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        </td>
                        <td>{opcionesCurso[key].nombre}</td>
                        <td>
                          {opcionesCurso[key].estado ? (
                            <span className="badge badge-success text-white">
                              Publicado
                            </span>
                          ) : (
                            <span className="badge badge-danger text-white">
                              No publicado
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn theme-btn-white mb-2"
                onClick={() => {
                  setVerPopUpBuscarCurso(false);
                  setPalabraBuscarCurso("");
                }}
              >
                {" "}
                Cerrar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal fade modal-container ${
          verPopUpCrearCategoria == true ? "show" : ""
        }`}
        style={{ background: "rgba(0, 0, 0, 0.7)", overflow: "auto" }}
        id="asignarPerfil"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="asignarPerfilTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="asignarPerfilTitle"
                >
                  Crear categoría{" "}
                  {formNombreCategoriaPadre != "" &&
                    `en ${formNombreCategoriaPadre}`}
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-text">Nombre</label>
                <input
                  onChange={handleNombreChange}
                  value={formNombre}
                  className="form-control form--control pl-3"
                  type="text"
                  name="nombre"
                  maxLength="64"
                  placeholder=""
                />
                {erroresCampos["nombre"].length > 0 && (
                  <SpamError mensaje={erroresCampos["nombre"]} />
                )}
              </div>
              <div className="form-group">
                <label className="label-text">Estado</label>
                <select
                  onChange={handleEstadoChange}
                  value={formEstado}
                  name="estado"
                  className={`form-control ${
                    temaActual == 1 ? "" : "select-dark"
                  }`}
                >
                  <option value=""> -- Seleccione --</option>
                  <option value="1">Visible</option>
                  <option value="0">Oculta</option>
                </select>
                {erroresCampos["estado"].length > 0 && (
                  <SpamError mensaje={erroresCampos["estado"]} />
                )}
              </div>
              <div className="form-group">
                <label className="label-text">Descripcion</label>
                <textarea
                  onChange={handleChangeFields}
                  value={formFileds["descripcion"] ?? ""}
                  className="form-control form--control pl-3"
                  type="text"
                  name="descripcion"
                  maxLength="64"
                  placeholder=""
                  rows={5}
                  style={{ resize: "none" }}
                />
                {erroresCampos["descripcion"]?.length > 0 && (
                  <SpamError mensaje={erroresCampos["descripcion"]} />
                )}
              </div>
              <Fields
                fieldsList={camposPersonalizablesCategorias}
                handleChange={handleChangeFields}
                values={formFileds}
                errors={erroresCampos ?? []}
              />
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn mb-2"
                onClick={crearCategoria}
              >
                {" "}
                Crear{" "}
              </button>
              <button
                type="button"
                className="btn theme-btn theme-btn-white mb-2"
                onClick={() => {
                  setVerPopUpCrearCategoria(false);
                }}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade modal-container ${
          verPopUpEditarCategoria == true ? "show" : ""
        }`}
        style={{ background: "rgba(0, 0, 0, 0.7)", overflow: "auto" }}
        id="asignarPerfil"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="asignarPerfilTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="asignarPerfilTitle"
                >
                  Editar categoría
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-text">Nombre</label>
                <input
                  onChange={handleNombreChange}
                  value={formNombre}
                  className="form-control form--control pl-3"
                  type="text"
                  name="nombre"
                  maxLength="64"
                  placeholder=""
                />
                {erroresCampos["nombre"].length > 0 && (
                  <SpamError mensaje={erroresCampos["nombre"]} />
                )}
              </div>
              <div className="form-group">
                <label className="label-text">Estado</label>
                <select
                  onChange={handleEstadoChange}
                  value={formEstado}
                  name="estado"
                  className={`form-control ${
                    temaActual == 1 ? "" : "select-dark"
                  }`}
                >
                  <option value=""> -- Seleccione --</option>
                  <option value="1">Visible</option>
                  <option value="0">Oculta</option>
                </select>
                {erroresCampos["estado"].length > 0 && (
                  <SpamError mensaje={erroresCampos["estado"]} />
                )}
              </div>
              <div className="form-group">
                <label className="label-text">Descripcion</label>
                <textarea
                  onChange={handleChangeFields}
                  value={formFileds["descripcion"] ?? ""}
                  className="form-control form--control pl-3"
                  type="text"
                  name="descripcion"
                  maxLength="64"
                  placeholder=""
                  rows={5}
                  style={{ resize: "none" }}
                />
                {erroresCampos["descripcion"]?.length > 0 && (
                  <SpamError mensaje={erroresCampos["descripcion"]} />
                )}
              </div>
              <Fields
                fieldsList={camposPersonalizablesCategorias}
                handleChange={handleChangeFields}
                values={formFileds}
                errors={erroresCampos ?? []}
              />
            </div>

            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn mb-2"
                onClick={editarCategoria}
              >
                {" "}
                Guardar{" "}
              </button>
              <button
                type="button"
                className="btn theme-btn theme-btn-white mb-2"
                onClick={() => {
                  setVerPopUpEditarCategoria(false);
                }}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade modal-container ${
          verPopUpEditarImagenCategoria == true ? "show" : ""
        }`}
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
        id="asignarPerfil"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="asignarPerfilTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="asignarPerfilTitle"
                >
                  Editar imagen de categoría
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-text">Imágen (Solo 370x247)</label>

                <div {...getRootProps()}>
                  {imagenPequenaCategoriaSistema != null && (
                    <>
                      <img
                        className="mr-3"
                        src={`${urlBaseApi}/${imagenPequenaCategoriaSistema}`}
                        style={{ width: "100%" }}
                        alt="Imagen de la categoría sistema"
                      />
                      <br />
                    </>
                  )}
                  <input
                    {...getInputProps()}
                    className="multi file-upload-input"
                  />
                  <span className="file-upload-text">
                    <i className="la la-cloud-upload mr-2 fs-18"></i>Selecciona
                    o arrastra la imagen aquí.
                  </span>
                </div>
                <ul>{fileList}</ul>
                {erroresCampos["imagen"].length > 0 && (
                  <SpamError mensaje={erroresCampos["imagen"]} />
                )}
              </div>
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn mb-2"
                onClick={editarImagenCategoria}
              >
                {" "}
                Guardar{" "}
              </button>
              <button
                type="button"
                className="btn theme-btn theme-btn-white mb-2"
                onClick={() => {
                  setVerPopUpEditarImagenCategoria(false);
                }}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade modal-container ${
          verPopUpEditarImagenTag == true ? "show" : ""
        }`}
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
        id="modalEditarImagenTag"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalEditarImagenTag"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="asignarPerfilTitle"
                >
                  Editar imagen de tag
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-text">Imágen (Solo 370x247)</label>
                <div {...getRootProps()}>
                  {imagenPequenaTag != null && (
                    <>
                      <img
                        className="mr-3"
                        src={`${urlBaseApi}/${imagenPequenaTag}`}
                        style={{ width: "100%" }}
                        alt="Imagen del tag"
                      />
                      <br />
                    </>
                  )}
                  <input
                    {...getInputProps()}
                    className="multi file-upload-input"
                  />
                  <span className="file-upload-text">
                    <i className="la la-cloud-upload mr-2 fs-18"></i>Selecciona
                    o arrastra la imagen aquí.
                  </span>
                </div>
                <ul>{fileList}</ul>
                {erroresCampos["imagen"].length > 0 && (
                  <SpamError mensaje={erroresCampos["imagen"]} />
                )}
              </div>
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn mb-2"
                onClick={editarImagenTag}
              >
                {" "}
                Guardar{" "}
              </button>
              <button
                type="button"
                className="btn theme-btn theme-btn-white mb-2"
                onClick={() => {
                  setVerPopUpEditarImagenTag(false);
                }}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade modal-container ${
          verPopUpCrearTagAgrupacion == true ? "show" : ""
        }`}
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
        id="crearTagAgrupacion"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="asignarPerfilTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="asignarPerfilTitle"
                >
                  Crear Tag Agrupación
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-text">Nombre</label>
                <input
                  onChange={handleNombreChange}
                  value={formNombre}
                  className="form-control form--control pl-3"
                  type="text"
                  name="nombre"
                  maxLength="32"
                  placeholder=""
                />
                {erroresCampos["nombre"].length > 0 && (
                  <SpamError mensaje={erroresCampos["nombre"]} />
                )}
              </div>
              <div className="form-group">
                <label className="label-text">Buscador</label>
                <select
                  onChange={handleEstadoChange}
                  value={formEstado}
                  name="estado"
                  className={`form-control ${
                    temaActual == 1 ? "" : "select-dark"
                  }`}
                >
                  <option value=""> -- Seleccione --</option>
                  <option value="1">Si</option>
                  <option value="0">No</option>
                </select>
                {erroresCampos["estado"].length > 0 && (
                  <SpamError mensaje={erroresCampos["estado"]} />
                )}
              </div>
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn mb-2"
                onClick={crearTagAgrupacion}
              >
                {" "}
                Crear{" "}
              </button>
              <button
                type="button"
                className="btn theme-btn theme-btn-white mb-2"
                onClick={() => {
                  setVerPopUpCrearTagAgrupacion(false);
                }}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade modal-container ${
          verPopUpEditarTagAgrupacion == true ? "show" : ""
        }`}
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
        id="asignarPerfil"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="asignarPerfilTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="asignarPerfilTitle"
                >
                  Editar Tag Agrupación
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-text">Nombre</label>
                <input
                  onChange={handleNombreChange}
                  value={formNombre}
                  className="form-control form--control pl-3"
                  type="text"
                  name="nombre"
                  maxLength="32"
                  placeholder=""
                />
                {erroresCampos["nombre"].length > 0 && (
                  <SpamError mensaje={erroresCampos["nombre"]} />
                )}
              </div>
              <div className="form-group">
                <label className="label-text">Mostrar en buscador</label>
                <select
                  onChange={handleEstadoChange}
                  value={formEstado}
                  name="buscador"
                  className={`form-control ${
                    temaActual == 1 ? "" : "select-dark"
                  }`}
                >
                  <option value=""> -- Seleccione --</option>
                  <option value="1">Si</option>
                  <option value="0">No</option>
                </select>
                {erroresCampos["buscador"].length > 0 && (
                  <SpamError mensaje={erroresCampos["buscador"]} />
                )}
              </div>
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn mb-2"
                onClick={editarTagAgrupacion}
              >
                {" "}
                Guardar{" "}
              </button>
              <button
                type="button"
                className="btn theme-btn theme-btn-white mb-2"
                onClick={() => {
                  setVerPopUpEditarTagAgrupacion(false);
                }}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade modal-container ${
          verPopUpCrearTag == true ? "show" : ""
        }`}
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
        id="crearTag"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="crearTag"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="crearTagTitle"
                >
                  Crear Tag
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-text">Nombre</label>
                <input
                  onChange={handleNombreChange}
                  value={formNombre}
                  className="form-control form--control pl-3"
                  type="text"
                  name="nombre"
                  maxLength="32"
                  placeholder=""
                />
                {erroresCampos["nombre"].length > 0 && (
                  <SpamError mensaje={erroresCampos["nombre"]} />
                )}
              </div>
              <div className="form-group">
                <label className="label-text">Agrupación</label>
                <select
                  onChange={handleEstadoChange}
                  value={formEstado}
                  name="estado"
                  className={`form-control ${
                    temaActual == 1 ? "" : "select-dark"
                  }`}
                >
                  <option value=""> -- Seleccione --</option>
                  {Object.keys(tagsAgrupaciones).map((key) => (
                    <option value={tagsAgrupaciones[key].id} key={key}>
                      {tagsAgrupaciones[key].nombre}
                    </option>
                  ))}
                </select>
                {erroresCampos["id_tag_agrupacion"].length > 0 && (
                  <SpamError mensaje={erroresCampos["id_tag_agrupacion"]} />
                )}
              </div>
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn mb-2"
                onClick={crearTag}
              >
                {" "}
                Crear{" "}
              </button>
              <button
                type="button"
                className="btn theme-btn theme-btn-white mb-2"
                onClick={() => {
                  setVerPopUpCrearTag(false);
                }}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade modal-container ${
          verPopUpEditarTag == true ? "show" : ""
        }`}
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
        id="asignarPerfil"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="asignarPerfilTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="asignarPerfilTitle"
                >
                  Editar Tag
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-text">Nombre</label>
                <input
                  onChange={handleNombreChange}
                  value={formNombre}
                  className="form-control form--control pl-3"
                  type="text"
                  name="nombre"
                  maxLength="32"
                  placeholder=""
                />
                {erroresCampos["nombre"].length > 0 && (
                  <SpamError mensaje={erroresCampos["nombre"]} />
                )}
              </div>
              <div className="form-group">
                <label className="label-text">Agrupación</label>
                <select
                  onChange={handleEstadoChange}
                  value={formEstado}
                  name="id_tag_agrupacion"
                  className={`form-control ${
                    temaActual == 1 ? "" : "select-dark"
                  }`}
                >
                  <option value=""> -- Seleccione --</option>
                  {Object.keys(tagsAgrupaciones).map((key) => (
                    <option value={tagsAgrupaciones[key].id} key={key}>
                      {tagsAgrupaciones[key].nombre}
                    </option>
                  ))}
                </select>
                {erroresCampos["id_tag_agrupacion"].length > 0 && (
                  <SpamError mensaje={erroresCampos["id_tag_agrupacion"]} />
                )}
              </div>
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn mb-2"
                onClick={editarTag}
              >
                {" "}
                Guardar{" "}
              </button>
              <button
                type="button"
                className="btn theme-btn theme-btn-white mb-2"
                onClick={() => {
                  setVerPopUpEditarTag(false);
                }}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-content-wrap">
        {esMovil && <BotonDashboardNavegacionMovil />}
        <div className="container-fluid">
          <div className="dashboard-heading mb-5">
            <h3 className="fs-22 font-weight-semi-bold">Categorías y tags</h3>
          </div>
          <ul
            className="nav nav-tabs generic-tab pb-30px"
            id="myTab"
            role="tablist"
          >
            {(permissions[14] || permissions[15] || permissions[16]) && (
              <li className="nav-item">
                <a
                  className={`nav-link ${pestanaActivada == 1 ? "active" : ""}`}
                  onClick={(event) => {
                    handleCambiarPestana(event, 1);
                  }}
                  id="edit-profile-tab"
                  data-toggle="tab"
                  href="#edit-profile"
                  role="tab"
                  aria-controls="edit-profile"
                  aria-selected="false"
                >
                  Categorías
                </a>
              </li>
            )}
            {(permissions[50] || permissions[51] || permissions[52]) && (
              <li className="nav-item">
                <a
                  className={`nav-link ${pestanaActivada == 2 ? "active" : ""}`}
                  onClick={(event) => handleCambiarPestana(event, 2)}
                  id="tags-agrupacion-tab"
                  data-toggle="tab"
                  href="#tags_agrupacion"
                  role="tab"
                  aria-controls="tags_agrupacion"
                  aria-selected="true"
                >
                  Tags agrupación
                </a>
              </li>
            )}
            {(permissions[53] || permissions[54] || permissions[55]) && (
              <li className="nav-item">
                <a
                  className={`nav-link ${pestanaActivada == 3 ? "active" : ""}`}
                  onClick={(event) => handleCambiarPestana(event, 3)}
                  id="tags-tab"
                  data-toggle="tab"
                  href="#tags"
                  role="tab"
                  aria-controls="tags"
                  aria-selected="true"
                >
                  Tags
                </a>
              </li>
            )}
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className={`tab-pane fade ${
                pestanaActivada == 1 ? "show active" : ""
              }`}
              id="edit-profile"
              role="tabpanel"
              aria-labelledby="edit-profile-tab"
            >
              <div className="setting-body">
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                  <div className="media media-card align-items-center">
                    <h3 className="fs-17 font-weight-semi-bold">
                      Categorías del sistema
                    </h3>
                  </div>
                  <div className="btn-box pt-30px">
                    {permissions[15] && (
                      <button
                        onClick={() => {
                          setVerPopUpCrearCategoria(true);
                          setFormNombre("");
                          setFormIdCategoriaPadre(0);
                          setFormNombreCategoriaPadre("");
                          setFormEstado(1);
                          setFormEstado(-1);
                          reiniciarErrorCampoGlobal();
                        }}
                        type="submit"
                        className="btn theme-btn"
                      >
                        <i className="la la-plus mr-2"></i> Crear categoría
                        sistema
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-lg-12" style={{ marginBottom: "100px" }}>
                  <DndProvider
                    backend={MultiBackend}
                    options={getBackendOptions()}
                  >
                    <Tree
                      tree={treeData}
                      rootId={0}
                      onDrop={handleDrop}
                      render={(node, { depth, isOpen, onToggle }) => (
                        <div style={{ marginLeft: depth * 40 }}>
                          {node.droppable && (
                            <span onClick={onToggle}>
                              {isOpen ? "[-]" : "[+]"}
                            </span>
                          )}
                          <CustomNode
                            permiso_crear={permissions[15]}
                            permiso_editar={permissions[16]}
                            permiso_editar_imagen={permissions[75]}
                            tipo={node.data.tipo}
                            id_real={node.data.id_real}
                            nombre={node.text}
                            estado={node.data.estado}
                            imagen_pequena={node.data.imagen_pequena}
                            video_pequeno={node.video_pequeno}
                            handleClickEditar={handleClickEditar}
                            handleClickCrear={handleClickCrear}
                            handleClickEditarImagen={handleClickEditarImagen}
                            handleClickBorrar={
                              handleClickBorrarCategoriaSistema
                            }
                            handleAgregarVideo={handleAgregarVideo}
                            camposExtras={node}
                          />
                        </div>
                      )}
                    />
                  </DndProvider>
                </div>
              </div>
            </div>
            <div
              className={`tab-pane fade ${
                pestanaActivada == 2 ? "show active" : ""
              }`}
              id="tags_agrupacion"
              role="tabpanel"
              aria-labelledby="tags-agrupacion-tab"
            >
              <div className="setting-body">
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                  <div className="media media-card align-items-center">
                    <h3 className="fs-17 font-weight-semi-bold">
                      Tags agrupación
                    </h3>
                  </div>
                  <div className="btn-box pt-30px">
                    {permissions[51] && (
                      <button
                        onClick={() => {
                          setVerPopUpCrearTagAgrupacion(true);
                          setFormNombre("");
                          setFormEstado(-1);
                          reiniciarErrorCampoGlobal();
                        }}
                        type="submit"
                        className="btn theme-btn"
                      >
                        <i className="la la-plus mr-2"></i> Crear Tag Agrupación
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table generic-table">
                      <thead>
                        <tr>
                          <th scope="col">Nombre</th>
                          <th scope="col">Buscador</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(tagsAgrupaciones).map((key) => (
                          <tr
                            key={`tag-agrupacion-${key}-${tagsAgrupaciones[key].id}`}
                          >
                            <th scope="row" width="40%">
                              {tagsAgrupaciones[key].nombre}
                            </th>
                            <th scope="row" width="40%">
                              {tagsAgrupaciones[key].buscador == 1
                                ? "Si"
                                : "No"}
                            </th>
                            <th scope="row" width="15%">
                              {permissions[52] && (
                                <div
                                  onClick={() => {
                                    handleClickBorrarTagAgrupacion(
                                      tagsAgrupaciones[key].id,
                                      tagsAgrupaciones[key].nombre
                                    );
                                  }}
                                  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Delete"
                                >
                                  <span
                                    data-toggle="modal"
                                    data-target="#itemDeleteModal"
                                    className="w-100 h-100 d-inline-block"
                                  >
                                    <i className="la la-trash"></i>
                                  </span>
                                </div>
                              )}
                              {permissions[52] ? (
                                <div
                                  onClick={() => {
                                    handleClickEditar(
                                      "tag-agrupacion",
                                      tagsAgrupaciones[key].id,
                                      tagsAgrupaciones[key].nombre,
                                      tagsAgrupaciones[key].buscador
                                    );
                                  }}
                                  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  data-title="Editar configuración"
                                >
                                  <i className="la la-gear"></i>
                                </div>
                              ) : (
                                ""
                              )}
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`tab-pane fade ${
                pestanaActivada == 3 ? "show active" : ""
              }`}
              id="tags"
              role="tabpanel"
              aria-labelledby="tags-tab"
            >
              <div className="setting-body">
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                  <div className="media media-card align-items-center">
                    <h3 className="fs-17 font-weight-semi-bold">Tags</h3>
                  </div>
                  <div className="btn-box pt-30px">
                    {permissions[54] && (
                      <button
                        onClick={() => {
                          setVerPopUpCrearTag(true);
                          setFormNombre("");
                          reiniciarErrorCampoGlobal();
                          obtenerTagsAgrupacion();
                        }}
                        type="submit"
                        className="btn theme-btn"
                      >
                        <i className="la la-plus mr-2"></i> Crear Tag
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table generic-table">
                      <thead>
                        <tr>
                          <th scope="col">Nombre</th>
                          <th scope="col">Agrupación</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(tags).map((key) => (
                          <tr key={`tag-agrupacion-${key}-${tags[key].id}`}>
                            <th scope="row" width="40%">
                              {tags[key].nombre}
                            </th>
                            <th scope="row" width="40%">
                              {tags[key].agrupacion}
                            </th>
                            <th scope="row" width="15%">
                              {permissions[52] && (
                                <div
                                  onClick={() => {
                                    handleClickBorrarTag(
                                      tags[key].id,
                                      tags[key].nombre
                                    );
                                  }}
                                  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Delete"
                                >
                                  <span
                                    data-toggle="modal"
                                    data-target="#itemDeleteModal"
                                    className="w-100 h-100 d-inline-block"
                                  >
                                    <i className="la la-trash"></i>
                                  </span>
                                </div>
                              )}
                              {permissions[52] ? (
                                <div
                                  onClick={() => {
                                    handleClickEditar(
                                      "tag",
                                      tags[key].id,
                                      tags[key].nombre,
                                      tags[key].id_tag_agrupacion
                                    );
                                    obtenerTagsAgrupacion();
                                  }}
                                  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  data-title="Editar tag"
                                >
                                  <i className="la la-gear"></i>
                                </div>
                              ) : (
                                ""
                              )}
                              {permissions[56] ||
                              permissions[57] ||
                              permissions[58] ? (
                                <div
                                  onClick={() => {
                                    handleClickEditar(
                                      "tag-asignacion",
                                      tags[key].id,
                                      tags[key].nombre,
                                      0
                                    );
                                  }}
                                  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  data-title="Editar cursos tag"
                                >
                                  <i className="la la-list-ol"></i>
                                </div>
                              ) : (
                                ""
                              )}
                              {permissions[77] ? (
                                <div
                                  onClick={() => {
                                    handleClickEditar(
                                      "tag-imagen",
                                      tags[key].id,
                                      tags[key].imagen_pequena,
                                      tags[key].id_tag_agrupacion
                                    );
                                  }}
                                  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  data-title="Editar imagen del tag"
                                >
                                  <i className="la la-image"></i>
                                </div>
                              ) : (
                                ""
                              )}
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DashboardFooter />
        </div>
      </div>
    </>
  );
}

export const CustomNode = ({
  tipo,
  id_real,
  nombre,
  estado,
  imagen_pequena,
  video_pequeno,
  handleClickEditar,
  handleClickCrear,
  handleClickEditarImagen,
  handleClickBorrar,
  handleAgregarVideo,
  permiso_crear,
  permiso_editar,
  permiso_editar_imagen,
  camposExtras,
}) => {
  const [hover, setHover] = useState(false);
  const {
    descripcion,
    personalizado_1,
    personalizado_2,
    personalizado_3,
    personalizado_4,
    personalizado_5,
    personalizado_6,
  } = camposExtras;

  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {nombre}{" "}
      {tipo == "categoria" && hover ? (
        <>
          {" "}
          [
          {permiso_editar && (
            <span
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleClickEditar(tipo, id_real, nombre, estado, {
                  descripcion,
                  personalizado_1,
                  personalizado_2,
                  personalizado_3,
                  personalizado_4,
                  personalizado_5,
                  personalizado_6,
                })
              }
            >
              {" "}
              Editar |{" "}
            </span>
          )}{" "}
          {permiso_crear && (
            <span
              onClick={() => handleClickCrear(id_real, nombre)}
              style={{ cursor: "pointer" }}
            >
              Crear |{" "}
            </span>
          )}{" "}
          {permiso_editar && (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleClickBorrar(id_real, nombre)}
            >
              Borrar |{" "}
            </span>
          )}{" "}
          {permiso_editar_imagen && (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleClickEditarImagen(id_real, imagen_pequena)}
            >
              Imagen |
            </span>
          )}{" "}
          {permiso_editar_imagen && (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleAgregarVideo(id_real, video_pequeno)}
            >
              Video
            </span>
          )}{" "}
          ]
        </>
      ) : (
        ""
      )}
    </span>
  );
};
