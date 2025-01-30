import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setImage } from "../../redux/slices/CursorSlice";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const PaginaBienvenida = ({ datosCurso = {}, setVerBienvenida }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modulos] = useState([
    {
      id: 1,
      title: "Fundamentos de la Inteligencia Artificial",
      description:
        "Explora los conceptos clave, historia y evolución de la inteligencia artificial, con énfasis en su impacto en la educación. Aprende los principios básicos y cómo la IA transforma los procesos de enseñanza y aprendizaje.",
      imagenes: ["/images/prueba/M1I1.png", "/images/prueba/M1I2.png"],
    },
    {
      id: 2,
      title: "Inteligencia Artificial Generativa",
      description:
        "Descubre cómo la IA generativa revoluciona la creación de contenidos educativos mediante herramientas innovadoras. Aprende a utilizarlas de manera efectiva y ética para enriquecer experiencias de aprendizaje.",
      imagenes: ["/images/prueba/M2I1.png", "/images/prueba/M2I2.png"],
    },
    {
      id: 3,
      title: "Aplicaciones Prácticas de la IA en la Educación",
      description:
        "Conoce cómo implementar la IA para personalizar el aprendizaje, diseñar rúbricas, gamificar contenidos y desarrollar soluciones educativas inteligentes. Aprende a integrar estas herramientas en contextos educativos reales.",
      imagenes: ["/images/prueba/M3I1.png", "/images/prueba/M3I2.png"],
    },
    {
      id: 4,
      title: "Ética, Privacidad y Regulación en Inteligencia Artificial",
      description:
        "Analiza los principios éticos, normativas y desafíos relacionados con el uso responsable de la IA en educación. Aprende a proteger datos, garantizar la privacidad y abordar dilemas éticos en su implementación.",
      imagenes: ["/images/prueba/M4I1.png"],
    },
    {
      id: 5,
      title: "Proyecto Integrador y Taller de Innovación",
      description:
        "Diseña y prototipa soluciones educativas basadas en IA, aplicando la creatividad y el conocimiento adquirido. Presenta tu proyecto y recibe retroalimentación para perfeccionar tus propuestas innovadoras.",
      imagenes: ["/images/prueba/M5I1.png", "/images/prueba/M5I2.png"],
    },
  ]);
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
      const hoveredModule = modulos.find((item) => item.id === idHovered);
      if (hoveredModule?.imagenes[idIndexImageRendered + 1]) {
        nextImage = idIndexImageRendered + 1;
      }

      // Configuramos el timeout
      timeoutId = setTimeout(() => {
        dispatch(
          setImage({
            isImage: true,
            urlImage: hoveredModule?.imagenes[nextImage],
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
              <div className="row">
                <div className="card-user col-lg-6">
                  <p className="text">{datosCurso.nombre}</p>
                  <p className="legend mt-3">
                    A través de cinco módulos cuidadosamente estructurados, los
                    participantes explorarán desde los fundamentos de la IA
                    hasta su aplicación práctica en el aula,fomentando la
                    innovación educativa y el aprendizaje significativo.
                  </p>
                </div>
              </div>
            </div>
            <div style={{ padding: "10px 50px 50px 50px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  background: "var(--Lavander-100)",
                  borderRadius: "10px",
                  padding: "5px 0",
                }}
              >
                <div>Tiempo certificado:</div>
                <div>{datosCurso.desc_tiempo_certificado} Horas</div>
              </div>
              <div className="lecture-overview-item">
                <div className="lecture-overview-stats-wrap d-flex">
                  <div className="lecture-overview-stats-item">
                    <h3 className="fs-16 font-weight-semi-bold pb-2">
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
              <div className="section-block"></div>
              <div className="lecture-overview-item">
                <div className="lecture-overview-stats-wrap d-flex">
                  <div className="lecture-overview-stats-item">
                    <h3 className="fs-16 font-weight-semi-bold pb-2">
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
              <div style={{ width: "100%", textAlign: "right" }}>
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
            <div>
              {modulos.map((modulo, index) => (
                <div key={index} style={{ marginBottom: "70px" }}>
                  <div
                    className="d-flex"
                    style={{
                      padding: "30px 50px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className="text-left"
                      style={{
                        maxWidth: "1300px",
                      }}
                      onMouseEnter={() =>
                        handleMouseEnter(modulo.imagenes[0], modulo.id)
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
                      <h2 className="mb-3">{modulo.title}</h2>
                      <p className="text-muted">{modulo.description}</p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="text-center">
                        <button
                          className="btn theme-btn rounded-circle"
                          onClick={() => toggleAccordion(modulo.id)}
                          aria-expanded={isOpen.includes(modulo.id)}
                          style={{
                            width: "70px",
                            height: "70px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onMouseEnter={handleMouseLeave}
                          onMouseLeave={() =>
                            handleMouseEnter(modulo.imagenes[0], modulo.id)
                          }
                        >
                          <i
                            className={`la ${
                              isOpen.includes(modulo.id)
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
                      isOpen.includes(modulo.id) ? "show" : ""
                    }`}
                    style={{ padding: "0 40px" }}
                  >
                    <div className="d-flex">
                      {modulo.imagenes.map((img, index) => (
                        <div key={index}>
                          <img
                            src={img}
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
