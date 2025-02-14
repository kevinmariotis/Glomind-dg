/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { mensajesDeError } from "../utils";
import { AuthContext } from "../../AuthContext";

function TarjetaVideoAdmin({
  idvideo = 0,
  nombre = "Nombre video",
  tipo = 1,
  imagen_grande = "/images/img8.jpg",
  imagen_pequena = "/images/img8.jpg",
  duracion = "00:00:00",
  videogrande = "",
  ancho = "",
  alto = "",
  permisoEditar = false,
  permisoBorrar = false,
  asignado = -1,
  segmentos = 0,
  handleBorrar,
  showSelect = false,
  onChangeSelect,
}) {
  const urlBase = import.meta.env.VITE_URL_BASE;
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { jwt } = useContext(AuthContext);
  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const [posterVistaPrevia, setPosterVistaPrevia] = useState("");
  const [tiposVideo, setTiposVideos] = useState([]);

  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const obtenerTiposDeVideos = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "DELETE",
        headers: headers,
      };
      const response = await fetch(`${urlBaseApi}/api/video/form`, opciones);
      const datos = await response.json();
      if (response.ok) {
        setTiposVideos(datos.tipos_de_video);
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

  useEffect(() => {
    obtenerTiposDeVideos();
  }, []);

  //console.log("Este es el favorito ", estadoFavorito);
  return (
    <>
      <Modal
        show={popUp.mostrar}
        size="lg"
        onHide={handleFuncionCerrarPopUp}
        backdrop="static"
        keyboard={true}
        animation={true}
        centered
        className="modal-theme"
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
            style={{ maxWidth: "100%", borderRadius: "20px" }}
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
      <div className="col-lg-3 responsive-column-half">
        <div className="card card-item card-video">
          <div className="card-image">
            <div
              className="d-block"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPosterVistaPrevia(imagen_grande);
                setPopup({ ...popUp, mostrar: true, contenido: videogrande });
              }}
            >
              <img
                className="card-img-top"
                src={
                  imagen_pequena != "/images/img8.jpg"
                    ? urlBaseApi + "/" + imagen_pequena
                    : imagen_pequena
                }
                alt="Card image cap"
              />
              <div className="play-button">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="-307.4 338.8 91.8 91.8"
                >
                  <g>
                    <circle
                      style={{
                        opacity: "0.6",
                        fill: "#000000",
                        borderRadius: "100px",
                      }}
                      cx="-261.5"
                      cy="384.7"
                      r="45.9"
                    ></circle>
                    <path
                      style={{ fill: "#FFFFFF" }}
                      d="M-272.9,363.2l35.8,20.7c0.7,0.4,0.7,1.3,0,1.7l-35.8,20.7c-0.7,0.4-1.5-0.1-1.5-0.9V364C-274.4,363.3-273.5,362.8-272.9,363.2z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div className="course-badge-labels">
                {asignado > 0 ? (
                  <div
                    className="course-badge"
                    style={{ background: "var(--success)" }}
                  >
                    Asignado
                  </div>
                ) : (
                  <div
                    className="course-badge"
                    style={{ background: "var(--warning)" }}
                  >
                    Por asignar
                  </div>
                )}
                {segmentos > 0 && (
                  <div className="course-badge blue">Marcadores</div>
                )}
              </div>
            </div>
          </div>
          <div
            className="card-body"
            style={{
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div
                className="badge"
                style={{
                  background: "var(--Lavander)",
                  color: "white",
                  borderRadius: "10px",
                  padding: "2px 10px",
                }}
              >
                {tiposVideo?.find((item) => item?.id === tipo)?.nombre}
              </div>
            </div>
            <h5 className="card-title">
              <div
                onClick={() => {
                  setPosterVistaPrevia(imagen_grande);
                  setPopup({ ...popUp, mostrar: true, contenido: videogrande });
                }}
                style={{ cursor: "pointer" }}
              >
                {nombre}
              </div>
            </h5>
            <p className="card-text lh-22 pt-2">
              <span>{duracion}</span>{" "}
              {ancho != "" && alto != "" ? `(${ancho} x ${alto})` : ""}
            </p>
            {showSelect && asignado === 0 && (
              <div className={`p-0 pr-1 mt-2`}>
                <button
                  className={` btn theme-btn btn-round d-flex align-items-center`}
                  onClick={() => onChangeSelect(idvideo)}
                  style={{ width: "100%", fontSize: "12px" }}
                >
                  Seleccionar
                </button>
              </div>
            )}
            <div className="rating-wrap d-flex align-items-center justify-content-between pt-3">
              {permisoEditar && (
                <Link
                  to={`${urlBase}/video/editar/${idvideo}`}
                  className="btn theme-btn theme-btn-sm btn-round theme-btn"
                  data-toggle="modal"
                  data-target="#ratingModal"
                >
                  <i className="la la-gear"></i> Editar
                </Link>
              )}
              {permisoBorrar && (
                <div
                  onClick={handleBorrar}
                  className="btn theme-btn theme-btn-sm btn-round theme-btn-dark"
                  data-toggle="modal"
                  data-target="#ratingModal"
                >
                  <i className="la la-trash"></i> Borrar
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TarjetaVideoAdmin;
