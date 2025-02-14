/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import TarjetaVideoAdmin from "./cards/TarjetaVideoAdmin";

function VideoPicker({ funcionMostrarPopUp, funcionSetVideoSeleccionado }) {
  const { jwt } = useContext(AuthContext);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const urlBase = import.meta.env.VITE_URL_BASE;
  const [optionsVideo, setOptionsVideo] = useState({});
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);
  const [palabraBuscar, setPalabraBuscar] = useState("");
  const [filters, setFilters] = useState({ "asignado-0": true });

  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "Vista previa",
    contenido: "",
  });
  const [posterVistaPrevia, setPosterVistaPrevia] = useState("");

  useEffect(() => {
    obtenerDatosVideos();
  }, [palabraBuscar, filters]);

  useEffect(() => {
    if (videoSeleccionado !== null) {
      funcionSetVideoSeleccionado(videoSeleccionado);
      funcionMostrarPopUp(false);
    }
  }, [videoSeleccionado]);

  const handleSetPalabraBuscar = (event) => {
    event.preventDefault();
    setPalabraBuscar(event.target.value);
  };

  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const obtenerDatosVideos = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      let filtersString = "";
      if (Object.values(filters).some((value) => value === true)) {
        const id_video_tipo = [];
        const asignado = [];
        Object.keys(filters).forEach((element) => {
          if (filters[element]) {
            if (element.split("-")[0] === "id_video_tipo") {
              id_video_tipo.push(element.split("-")[1]);
            }
            if (element.split("-")[0] === "asignado") {
              asignado.push(element.split("-")[1]);
            }
          }
        });
        filtersString = `id_video_tipo:${id_video_tipo.toString()}-asignado:${asignado.toString()}`;
      }

      const opciones = {
        method: "GET",
        headers: headers,
      };
      let buscartext = palabraBuscar != "" ? palabraBuscar : "ultimos";
      const response = await fetch(
        `${urlBaseApi}/api/cursocontenido/buscarvideo/${buscartext}/1${
          filtersString === "" ? "" : `/${filtersString}`
        }`,
        opciones
      );
      if (response.ok) {
        const datos = await response.json();
        setOptionsVideo(datos);
      } else {
        // const datos = await response.json();
        // mensajesDeError(
        //   setPopup,
        //   response.status,
        //   typeof datos.datos !== "undefined" ? datos.datos : {}
        // );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const handleTogglefilters = (name) => {
    setFilters({
      ...filters,
      [name]: !filters[name],
    });
  };

  return (
    <>
      <Modal
        show={popUp.mostrar}
        size="xx"
        onHide={handleFuncionCerrarPopUp}
        backdrop="static"
        keyboard={false}
        animation={false}
        centered
      >
        {popUp.titulo != "" && (
          <Modal.Header>
            <Modal.Title>{popUp.titulo}</Modal.Title>
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
            <source src={`${urlBaseApi}/${popUp.contenido}`} type="video/mp4" />
          </video>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFuncionCerrarPopUp}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className="modal fade modal-container show modal-theme"
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
        id="comprarModal3"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="comprarModalTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-xl modal-dialog-centered"
          role="document"
          style={{
            width: "100% !important",
          }}
        >
          <div className="modal-content">
            <div className="modal-header border-bottom-gray">
              <div className="pr-2">
                <h5
                  className="modal-title fs-19 font-weight-semi-bold lh-24"
                  id="comprarModalTitle"
                >
                  Seleccionar video
                </h5>
              </div>
            </div>
            <div className="modal-body">
              <div className="card2 mb-4">
                <div className="form-group">
                  <label className="label-text">Buscar video por nombre</label>
                  <input
                    onChange={handleSetPalabraBuscar}
                    className="form-control form--control pl-3"
                    type="text"
                    name="buscar_curso"
                    maxLength="32"
                    placeholder="Ej: Componentes y JSX"
                  />
                </div>
                <div className="row mx-1" style={{ gap: "10px" }}>
                  <button
                    className="btn theme-btn btn-round"
                    style={{ display: "inline-flex", alignItems: "center" }}
                    onClick={() => handleTogglefilters("id_video_tipo-1")}
                  >
                    <i
                      className={`la ${
                        filters["id_video_tipo-1"]
                          ? "la-check-circle"
                          : "la-circle"
                      } fs-18 mr-1`}
                    ></i>
                    Video
                  </button>
                  <button
                    className="btn theme-btn btn-round"
                    style={{ display: "inline-flex", alignItems: "center" }}
                    onClick={() => handleTogglefilters("id_video_tipo-2")}
                  >
                    <i
                      className={`la ${
                        filters["id_video_tipo-2"]
                          ? "la-check-circle"
                          : "la-circle"
                      } fs-18 mr-1`}
                    ></i>
                    Podcast
                  </button>
                  <button
                    className="btn theme-btn btn-round"
                    style={{ display: "inline-flex", alignItems: "center" }}
                    onClick={() => handleTogglefilters("asignado-1")}
                  >
                    <i
                      className={`la ${
                        filters["asignado-1"] ? "la-check-circle" : "la-circle"
                      } fs-18 mr-1`}
                    ></i>
                    Asignados
                  </button>
                  <button
                    className="btn theme-btn btn-round"
                    style={{ display: "inline-flex", alignItems: "center" }}
                    onClick={() => handleTogglefilters("asignado-0")}
                  >
                    <i
                      className={`la ${
                        filters["asignado-0"] ? "la-check-circle" : "la-circle"
                      } fs-18 mr-1`}
                    ></i>
                    Por asignar
                  </button>
                  <button
                    className="btn theme-btn-icon btn-round"
                    onClick={() => setFilters({})}
                  >
                    <i
                      className="la la-sync"
                      style={{
                        padding: "0 !important",
                        transform: "rotate(-50deg)",
                      }}
                    ></i>
                  </button>
                </div>
              </div>

              <div className="row">
                {Object.keys(optionsVideo).map((key) => (
                  <>
                    <TarjetaVideoAdmin
                      key={`tarjeta${optionsVideo[key].id}`}
                      idvideo={optionsVideo[key].id}
                      tipo={optionsVideo[key].id_video_tipo}
                      nombre={optionsVideo[key].nombre}
                      imagen_grande={optionsVideo[key].imagen_preview_grande}
                      imagen_pequena={optionsVideo[key].imagen_preview_pequena}
                      duracion={optionsVideo[key].duracion_hms}
                      videogrande={optionsVideo[key].video_grande}
                      ancho={optionsVideo[key].ancho}
                      alto={optionsVideo[key].alto}
                      // permisoEditar={permisoEditar}
                      // permisoBorrar={permissions[79]}
                      asignado={optionsVideo[key].asignado}
                      segmentos={optionsVideo[key].segmentos}
                      // handleBorrar={() => handleBorrar(optionsVideo[key].id)}
                      showSelect
                      onChangeSelect={(id) => setVideoSeleccionado(id)}
                    />
                  </>
                ))}
              </div>

              {/* <div
                className="table-responsive"
                style={{ maxHeight: "250px", overflowY: "scroll" }}
              >
                <table className="table generic-table">
                  <thead>
                    <tr>
                      <th scope="col">Vista Previa</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Duración</th>
                      <th scope="col">Seleccionar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(optionsVideo).map((key) => (
                      <tr key={`video-seleccion-${optionsVideo[key].id}`}>
                        <th scope="row">
                          <div className="media media-card">
                            <div
                              onClick={() => {
                                setPosterVistaPrevia(
                                  optionsVideo[key].imagen_preview_grande
                                );
                                setPopup({
                                  ...popUp,
                                  mostrar: true,
                                  contenido: optionsVideo[key].video_grande,
                                });
                              }}
                              className="media-img mr-0"
                            >
                              {optionsVideo[key].imagen_preview_pequena !=
                              null ? (
                                <img
                                  src={`${urlBaseApi}/${optionsVideo[key].imagen_preview_pequena}`}
                                  style={{ height: "auto" }}
                                  alt="Imagen del video"
                                />
                              ) : (
                                <img
                                  src={`${urlBase}/images/course-no-image.png`}
                                  style={{ height: "auto" }}
                                  alt="Imagen del video"
                                />
                              )}
                            </div>
                          </div>
                        </th>
                        <td>{optionsVideo[key].nombre}</td>
                        <td>
                          <ul className="generic-list-item font-weight-semi-bold">
                            <li className="text-black lh-18">
                              {optionsVideo[key].duracion_hms}
                            </li>
                          </ul>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setVideoSeleccionado(optionsVideo[key].id);
                            }}
                            className="icon-element icon-element-xs shadow-sm border-0"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Seleccionar"
                          >
                            <i className="la la-check"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
            </div>
            <div className="modal-footer border-top-gray">
              <button
                type="button"
                className="btn theme-btn theme-btn-dark mb-2"
                onClick={() => {
                  funcionMostrarPopUp(false);
                }}
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

export default VideoPicker;
