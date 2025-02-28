import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setImage } from "../../redux/slices/CursorSlice";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const PaginaBienvenida = ({ datosCurso = {}, setVerBienvenida }) => {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [isOpen, setIsOpen] = useState([]);
  const [idHovered, setIdHovered] = useState(null);
  const [idIndexImageRendered, setIndexImageRendered] = useState(0);
  const [show, setShow] = useState(false);

  const toggleAccordion = (index) => {
    if (isOpen.includes(index)) {
      const copyActiveTabs = isOpen.filter((item) => item !== index);
      setIsOpen(copyActiveTabs);
    } else {
      setIsOpen([...isOpen, index]);
    }
  };

  const handleMouseEnter = (urlImage, id) => {
    if (!isOpen.includes(id)) {
      dispatch(
        setImage({
          isImage: true,
          urlImage,
        })
      );
      setIdHovered(id);
    }
  };

  const handleMouseLeave = () => {
    dispatch(
      setImage({
        isImage: false,
        urlImage: "",
      })
    );
    setIdHovered(null);
  };

  useEffect(() => {
    let timeoutId; // Variable para almacenar el ID del timeout
    if (idHovered) {
      let nextImage = 0;
      const hoveredModule = modulos?.find(
        (item) => item.id_categoria === idHovered
      );
      if (hoveredModule?.media[idIndexImageRendered + 1]) {
        nextImage = idIndexImageRendered + 1;
      }

      // Configuramos el timeout
      timeoutId = setTimeout(() => {
        dispatch(
          setImage({
            isImage: true,
            urlImage: `${urlBaseApi}/${hoveredModule?.media[nextImage]?.media}`,
          })
        );
        setIndexImageRendered(nextImage);
      }, 1500);
    }

    // Cleanup para limpiar el timeout cuando `idHovered` o `idIndexImageRendered` cambien
    return () => {
      clearTimeout(timeoutId);
    };
  }, [idHovered, idIndexImageRendered]);

  useEffect(() => {
    if (datosCurso.id !== -1) {
      if (datosCurso.personalizado_tipo_curso === "diplomado") {
        setShow(true);
      } else {
        setVerBienvenida(false);
      }
    }
    setModulos(
      datosCurso.contenido?.map((item) => {
        const result = item.media?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        );
        return { ...item, media: result };
      })
    );
  }, [datosCurso]);

  return (
    <>
      {show ? (
        <section className="course-dashboard" style={{ marginTop: "90px" }}>
          <div
            className="course-dashboard-wrap"
            style={{ paddingBottom: "100px" }}
          >
            <div style={{ padding: "30px 50px" }}>
              <button
                className="btn theme-btn btn-round mb-4"
                onClick={() => navigate(-1)}
              >
                <i className="la la-arrow-left mr-2"></i>
                Atras
              </button>
              <div>
                <div className="card-user col-lg-6">
                  <p className="text">{datosCurso.nombre}</p>
                  <p
                    className="mt-3 text-justify"
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    {datosCurso.desc_general?.split("<br />")?.[0]}
                    {/* A través de cinco módulos cuidadosamente estructurados, los
                    participantes explorarán desde los fundamentos de la IA
                    hasta su aplicación práctica en el aula, fomentando la
                    innovación educativa y el aprendizaje significativo. */}
                  </p>
                </div>
              </div>
              <div
                style={{ width: "100%", textAlign: "left", marginTop: "20px" }}
              >
                <button
                  className="btn theme-btn btn-round"
                  onClick={() => setVerBienvenida(false)}
                  style={{ marginLeft: "auto" }}
                >
                  Ir al Diplomado
                  <i className="la la-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
            <div style={{ padding: "10px 50px 50px 50px" }}>
              <div
                className="col-lg-6"
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "var(--Lavander-100)",
                  borderRadius: "10px",
                  padding: "5px 20px",
                  maxWidth: "800px",
                }}
              >
                <div style={{ marginRight: "10%" }}>Tiempo certificado:</div>
                <div>{datosCurso.desc_tiempo_certificado} Horas</div>
              </div>
              <div
                className="custom-card"
                style={{
                  margin: "20px 0",
                  // border: "1px solid var(--Azul-petroleo) !important",
                  padding: "10px 30px",
                }}
              >
                <div className="lecture-overview-item m-0">
                  <div className="lecture-overview-stats-wrap d-flex">
                    <div
                      className="lecture-overview-stats-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <h3 className="fs-16 font-weight-semi-bold">
                        Dirigido a:
                      </h3>
                    </div>
                    <div className="lecture-overview-stats-item lecture-overview-stats-wide-item col">
                      <ul className="generic-list-item overview-list-item fs-15">
                        {datosCurso?.desc_requerimientos
                          ?.split("<separador>")
                          ?.map((key) => (
                            <li key={`requerimientos${key}`}>{key}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="section-block my-3"></div>
                <div className="lecture-overview-item m-0">
                  <div className="lecture-overview-stats-wrap d-flex">
                    <div
                      className="lecture-overview-stats-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <h3 className="fs-16 font-weight-semi-bold">
                        Con este curso serás capaz de:
                      </h3>
                    </div>
                    <div className="lecture-overview-stats-item lecture-overview-stats-wide-item col">
                      <ul className="generic-list-item overview-list-item">
                        {datosCurso?.desc_que_aprenderas
                          ?.split("<separador>")
                          ?.map((key) => (
                            <li key={`queAprenderas${key}`}>{key}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {modulos?.map((modulo, index) => (
                <div key={index} style={{ marginBottom: "70px" }}>
                  <div
                    className="d-flex"
                    style={{
                      padding: "30px 50px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className="text-left hover-50"
                      style={{
                        // maxWidth: "1300px",
                        width: "80%",
                      }}
                      onMouseEnter={
                        modulo.media?.length > 0
                          ? () =>
                              handleMouseEnter(
                                `${urlBaseApi}/${modulo.media[0]?.media}`,
                                modulo.id_categoria
                              )
                          : null
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      <h2
                        className="mb-1"
                        style={{
                          fontSize: "40px",
                          fontWeight: "bold",
                          color: "var(--Lavander)",
                        }}
                      >
                        Módulo #{index + 1}
                      </h2>
                      <h2 className="mb-3">{modulo.nombre}</h2>
                      <p className="text-muted">{modulo.descripcion}</p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="text-center">
                        <button
                          className="btn theme-btn rounded-circle"
                          onClick={() => toggleAccordion(modulo.id_categoria)}
                          aria-expanded={isOpen.includes(modulo.id_categoria)}
                          style={{
                            width: "70px",
                            height: "70px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onMouseEnter={handleMouseLeave}
                        >
                          <i
                            className={`la ${
                              isOpen.includes(modulo.id_categoria)
                                ? "la-minus"
                                : "la-plus"
                            }`}
                            style={{ fontSize: "40px" }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`my-4 collapse ${
                      isOpen.includes(modulo.id_categoria) ? "show" : ""
                    }`}
                    style={{ padding: "0 40px" }}
                  >
                    <div className="row">
                      {modulo.media?.map((img, index) => (
                        <div className="col-lg-3 col-sm-6" key={index}>
                          <img
                            src={`${urlBaseApi}/${img.media}`}
                            alt="AI Example 1"
                            className="img-fluid shadow"
                            style={{
                              width: "500px",
                              borderRadius: "15px",
                              margin: "10px",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default PaginaBienvenida;
