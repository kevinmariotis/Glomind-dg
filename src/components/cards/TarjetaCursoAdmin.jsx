/* eslint-disable react/prop-types */
// import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalVideoCurso from "../modals/ModalVideoCurso";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
// import { AuthContext } from "../../AuthContext";

function TarjetaCursoAdmin({
  // idcurso = 0,
  url_amigable = null,
  nombre = "Nombre curso",
  imagen = null,
  instructor = "",
  id_instructor = 0,
  descripcion_instructor = "",
  labelButton = "",
  btnVideo = true,
  curso = {},
  className = "",
  state = null,
}) {
  // const { jwt } = useContext(AuthContext);
  const urlBase = import.meta.env.VITE_URL_BASE;
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const navigate = useNavigate();
  const { esDocente } = useContext(AuthContext);

  // const estrellas = [1, 2, 3, 4, 5];

  //console.log("Este es el favorito ", estadoFavorito);
  return (
    <div className={`col ${className}`}>
      <div className="card card-item card-course">
        <div className="card-image">
          {/* <Link to={`${urlBase}/play/${url_amigable}`} className="d-block"> */}
          <img
            className="card-img-top"
            src={
              imagen != null ? urlBaseApi + "/" + imagen : "/images/img8.jpg"
            }
            alt="Card image cap"
            style={{
              borderRadius: "var(--CornerLarge) var(--CornerLarge) 0 0",
            }}
          />
          {/* <div className="play-button">
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
          </div> */}
          {/* </Link> */}
        </div>
        <div className="card-body content-card-course">
          <div
            className="custom-scroll"
            style={{ height: "220px", overflow: "auto", marginBottom: "10px" }}
          >
            <h5 className="card-title text-center">
              <Link to={`${urlBase}/play/${url_amigable}`}>{nombre}</Link>
            </h5>
            {instructor != "" && (
              <p className="card-text lh-22 pt-2 text-center">
                <Link
                  to={`${urlBase}/usuario/${id_instructor}`}
                  style={{ color: "var(--Azul-petroleo) !important" }}
                >
                  {instructor}
                </Link>
                <span>
                  {descripcion_instructor != "" ? ". " : ""}{" "}
                  {descripcion_instructor}
                </span>
              </p>
            )}
            <div className="my-3">
              <p
                className="card-text lh-22 pt-"
                style={{ color: "var(--Gris-oscuro)" }}
              >
                Codigo: {curso.codigo}
              </p>
              <p
                className="card-text lh-22 pt-"
                style={{ color: "var(--Gris-oscuro)" }}
              >
                Fecha de inicio: {curso.fecha_matriculacion?.split(" ")[0]}
              </p>
              <p
                className="card-text lh-22 pt-"
                style={{ color: "var(--Gris-oscuro)" }}
              >
                Fecha final: {curso.fecha_vencimiento?.split(" ")[0]}
              </p>
            </div>
            {curso.personalizado_tipo_curso === "diplomado" && (
              <div>{curso.proposito_del_curso}</div>
            )}
          </div>
          <div>
            <div className="row">
              <div
                className={`${
                  curso.personalizado_tipo_curso === "diplomado" || !btnVideo
                    ? "col-12"
                    : "col-8"
                } p-0 pr-1 mt-2`}
              >
                <button
                  className={` btn theme-btn btn-round d-flex align-items-center`}
                  onClick={() =>
                    navigate(`/play/${url_amigable}`, { state: state })
                  }
                  style={{ width: "100%", fontSize: "12px" }}
                >
                  {labelButton !== "" ? labelButton : "Ir al curso"}
                  <i className="la la-arrow-right icon ml-1"></i>
                </button>
              </div>

              {btnVideo && (
                <>
                  <div
                    className={`${
                      curso.personalizado_tipo_curso === "diplomado"
                        ? "col-6"
                        : "col-4"
                    } p-0 pr-1 mt-2`}
                  >
                    <ModalVideoCurso curso={curso} video={curso.video_grande} />
                  </div>

                  {curso.personalizado_tipo_curso === "diplomado" && (
                    <div className="col-6 p-0 px-1 mt-2">
                      <button
                        className="btn theme-btn btn-round d-flex align-items-center"
                        style={{ width: "100%", fontSize: "12px" }}
                        onClick={() =>
                          window.open(
                            "https://drive.google.com/file/d/1V8Ju_wPZy4AcxF_SE1XuokBQ2pErQIhB/view?usp=sharing",
                            "_blank"
                          )
                        }
                      >
                        <i className="la la-download icon mr-2"></i>
                        Ficha tecnica
                      </button>
                    </div>
                  )}
                  {esDocente && (
                    <div className="col-12 p-0 pr-1 mt-2">
                      <button
                        className={` btn theme-btn btn-round d-flex align-items-center`}
                        onClick={() =>
                          navigate(`/curso/contenido/${curso.id}`, {
                            state: { urlFrom: location.pathname },
                          })
                        }
                        style={{ width: "100%", fontSize: "12px" }}
                      >
                        <i className="la la-cog mr-1"></i>
                        Administrar{" "}
                        {curso.personalizado_tipo_curso === "diplomado"
                          ? "Diplomado"
                          : "Curso"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {/* <div className="my-course-progress-bar-wrap d-flex align-items-center pt-3">
            <p className="skillbar-title">Completado:</p>
            <div className="skillbar-box">
            <div
            className="skillbar skillbar-skillbar-2"
            data-percent={`${porcentaje_progreso}%`}
            >
            <div
            className="skillbar-bar skillbar--bar-2 bg-1"
            style={{ width: `${porcentaje_progreso}%` }}
            ></div>
            </div>
            </div>
            <div className="skill-bar-percent">{porcentaje_progreso}%</div>
            </div> */}
          {/* <div className="rating-wrap d-flex align-items-center justify-content-between pt-3">
            <div className="review-stars">
              {estrellas.map((number) => (
                <span
                  key={`estrella-${idcurso}-${number}`}
                  className={`la la-star${
                    reviews_puntuacion < number ? "-o" : ""
                  }`}
                ></span>
              ))}
            </div>
            <Link
              to={`${urlBase}/curso/${url_amigable}`}
              className="btn theme-btn theme-btn-sm theme-btn-transparent"
              data-toggle="modal"
              data-target="#ratingModal"
            >
              Dejar una reseña
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default TarjetaCursoAdmin;
