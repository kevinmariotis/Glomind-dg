import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { mensajesDeError } from "./utils";
import Spinner from "./Spinner";
import SpamError from "./SpamError";
import Popup from "./Popup";

export default function CrearEditarRecurso({
  funcionMostrarPopUp,
  id_curso,
  id_categoria,
  id_recurso = -1,
}) {
  const urlBase = import.meta.env.VITE_URL_BASE;
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { jwt, permissions, esMovil } = useContext(AuthContext);
  const [popUp, setPopup] = useState({
    mostrar: false,
    tipo: 2,
    titulo: "",
    contenido: "",
    data_switch: "",
    data_id: -1,
    data_id_2: -1,
  });
  const [popUpResource, setPopupResource] = useState({
    mostrar: true,
    nombre: "",
    descripcion: "",
    archivo: "",
    archivo_vista_previa: "",
    id_curso: -1,
    id_categoria: -1,
  });
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  useEffect(() => {
    if (id_recurso != -1) {
      handleResource.get();
    }
  }, [id_recurso]);

  //Estados de los errores de campos
  const camposErrores = {
    nombre: [],
    descripcion: [],
    archivo: [],
    archivo_vista_previa: [],
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

  const handleFuncionAceptarPopUp = () => {
    switch (popUp.data_switch) {
      case "cerrar_ventana":
        handleResource.close();
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

  const handleResource = {
    nombre: (event) => {
      setPopupResource({ ...popUpResource, nombre: event.target.value });
    },
    descripcion: (event) => {
      setPopupResource({ ...popUpResource, descripcion: event.target.value });
    },
    show: (event) => {
      setPopupResource({ ...popUpResource, mostrar: 1 });
    },
    close: (event) => {
      funcionMostrarPopUp(false);
    },
    get: async (event) => {
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
          `${urlBaseApi}/api/recurso/${id_recurso}`,
          opciones
        );
        setMostrarSpinner(false);
        if (response.ok) {
          const datos = await response.json();
          setPopupResource({
            ...popUpResource,
            nombre: datos.nombre,
            descripcion: datos.descripcion.replace(/<br\s*\/?>/gi, "\n"),
            archivo: datos.ruta_archivo,
            archivo_vista_previa: datos.ruta_imagen_preview_small,
          });
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
    },
    save: async (event) => {
      reiniciarErrorCampoGlobal();

      if (id_recurso != -1) {
        let file = document.querySelector("input[name=resourceArchivo]")
          .files[0];
        let preview = document.querySelector("input[name=resourceVistaPrevia]")
          .files[0];

        const resData = new FormData();
        const previewData = new FormData();

        resData.append("archivo", file);

        if (preview) {
          previewData.append("archivo_vista_previa", preview);
        }

        let resRowData = {
          nombre: popUpResource.nombre,
          descripcion: popUpResource.descripcion,
        };

        const opcionesArchivo = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: resData,
        };

        const opcionesPreview = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: previewData,
        };

        const opcionesData = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(resRowData),
        };

        setMostrarSpinner(true);

        if (file) {
          const response = await fetch(
            `${urlBaseApi}/api/recurso/actualizarArchivo/${id_recurso}`,
            opcionesArchivo
          );
          if (!response.ok) {
            setMostrarSpinner(false);
            const datos = await response.json();
            mensajesDeError(
              setPopup,
              response.status,
              typeof datos.datos !== "undefined" ? datos.datos : {},
              setErrorCampoGlobal,
              { titulo: "", contenido: "" }
            );
            return;
          }
        }

        if (preview) {
          const responsePreview = await fetch(
            `${urlBaseApi}/api/recurso/actualizarImagenVistaPrevia/${id_recurso}`,
            opcionesPreview
          );
          if (!responsePreview.ok) {
            setMostrarSpinner(false);
            const datos = await responsePreview.json();
            mensajesDeError(
              setPopup,
              responsePreview.status,
              typeof datos.datos !== "undefined" ? datos.datos : {},
              setErrorCampoGlobal,
              { titulo: "", contenido: "" }
            );
            return;
          }
        }

        const responseRaw = await fetch(
          `${urlBaseApi}/api/recurso/${id_recurso}`,
          opcionesData
        );
        if (responseRaw.ok) {
          setPopup({
            mostrar: true,
            titulo: "Listo",
            contenido: "Recurso guardado.",
            data_switch: "cerrar_ventana",
          });
        } else {
          const datos = await responseRaw.json();
          mensajesDeError(
            setPopup,
            responseRaw.status,
            typeof datos.datos !== "undefined" ? datos.datos : {},
            setErrorCampoGlobal,
            { titulo: "", contenido: "" }
          );
        }
        setMostrarSpinner(false);
      } else {
        console.log(popUpResource);

        let file = document.querySelector("input[name=resourceArchivo]")
          .files[0];
        let preview = document.querySelector("input[name=resourceVistaPrevia]")
          .files[0];

        if (!file) {
          setErrorCampoGlobal("archivo", "Por favor adjunte un archivo");
          return;
        }

        const resData = new FormData();
        resData.append("nombre", popUpResource.nombre);
        resData.append("descripcion", popUpResource.descripcion);
        resData.append("id_curso", id_curso);
        resData.append("id_categoria", id_categoria);
        resData.append("archivo", file);

        if (preview) {
          resData.append("archivo_vista_previa", preview);
        }

        const opciones = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: resData,
        };

        setMostrarSpinner(true);
        const response = await fetch(`${urlBaseApi}/api/recurso`, opciones);
        setMostrarSpinner(false);
        if (response.ok) {
          setPopup({
            mostrar: true,
            titulo: "Listo",
            contenido: "Recurso creado.",
            data_switch: "cerrar_ventana",
          });
          return;
        } else {
          const datos = await response.json();
          mensajesDeError(
            setPopup,
            response.status,
            typeof datos.datos !== "undefined" ? datos.datos : {},
            setErrorCampoGlobal,
            { titulo: "", contenido: "" }
          );
        }
      }
    },
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
      <div
        className="modal fade modal-container show"
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          // height: "50vh !important",
          // overflow: "auto !important",
        }}
        id="resourceModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="resourceModalTitle"
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
                  id="resourceModalTitle"
                >
                  {id_recurso != -1 ? "Editar recurso" : "Crear recurso"}
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="col-lg-12">
                <div className="form-group">
                  <label className="label-text">Nombre</label>
                  <input
                    value={popUpResource.nombre}
                    onChange={handleResource.nombre}
                    className="form-control form--control pl-3"
                    type="text"
                    name="nombre"
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
                    value={popUpResource.descripcion}
                    onChange={handleResource.descripcion}
                    className="form-control form--control user-text-editor pl-3"
                    name="descripcion"
                  ></textarea>
                  {erroresCampos["descripcion"].length > 0 && (
                    <SpamError mensaje={erroresCampos["descripcion"]} />
                  )}
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label className="label-text">Archivo</label>
                  <input
                    type="file"
                    name="resourceArchivo"
                    className="form-control form--control user-text-editor pl-3"
                  ></input>
                  {erroresCampos["archivo"].length > 0 && (
                    <SpamError mensaje={erroresCampos["archivo"]} />
                  )}
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label className="label-text">Vista previa</label>
                  <input
                    type="file"
                    name="resourceVistaPrevia"
                    className="form-control form--control user-text-editor pl-3"
                  ></input>
                  {erroresCampos["archivo_vista_previa"].length > 0 && (
                    <SpamError
                      mensaje={erroresCampos["archivo_vista_previa"]}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn mb-2"
                onClick={handleResource.save}
              >
                {id_recurso != -1 ? "Guardar" : "Crear"}
              </button>
              <button
                type="button"
                className="btn theme-btn theme-btn-dark mb-2"
                onClick={handleResource.close}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
