/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";
import { AuthContext } from "../../AuthContext";
import DashboardFooter from "../../components/DashboardFooter";
import GraficCircle from "../../components/grafics/GraficCircle";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import uwu from "../../assets/icons/Gif_glomind.gif";
import audio from "./AudioRecortedCalificaciones.mp3";
import { colors } from "@mui/material";

const FomularioCalificaciones = () => {
  const { jwt } = useContext(AuthContext);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [showDiv, setShowDiv] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // States de Info
  const [levelOne, setLevelOne] = useState("");
  const [levelTwo, setLevelTwo] = useState("");
  const [levelThree, setLevelThree] = useState("");
  const [muted, setMuted] = useState(false);

  // State navbar
  const [showNav, setShowNav] = useState(false);

  const fabStyle = {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    cursor: "pointer",
  };

  function FAB({ onClick }) {
    return (
      <button style={fabStyle} onClick={onClick}>
        +
      </button>
    );
  }

  const obtenerCursos = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      // setMostrarSpinner(true);

      //buscamos los datos de los cursos a mostrar
      // setMostrarSpinner(true);
      const response2 = await fetch(
        `${urlBaseApi}/api/usuario/cursos/0/1/1/id-desc/10/54`,
        opciones
      );
      // setMostrarSpinner(false);
      if (response2.ok) {
        const datos2 = await response2.json();
        setCursos(datos2.cursos);
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerActividades = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      // setMostrarSpinner(true);

      //buscamos los datos de los cursos a mostrar
      // setMostrarSpinner(true);
      const response2 = await fetch(
        `${urlBaseApi}/api/curso/getNotas/${cursoSeleccionado}`,
        opciones
      );
      // setMostrarSpinner(false);
      if (response2.ok) {
        const datos = await response2.json();
        // Reestructar los datos para una mejor lectura de la tabla
        const result = datos.datos?.categorias.flatMap((cat) => {
          const { curso_contenido, resto } = cat;
          return curso_contenido.map((c) => {
            return {
              ...c,
              nota: datos.datos?.usuarios[0]?.notas?.find(
                (item) => item.id_curso_contenido === c.id_contenido
              )?.puntuacion_fija,
              padre: resto,
            };
          });
        });
        setActividades(result);
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const verCalificaciones = (idCurso) => {
    setCursoSeleccionado(idCurso);
  };

  const volver = () => {
    setCursoSeleccionado(null);
  };

  useEffect(() => {
    obtenerCursos();
  }, []);

  useEffect(() => {
    if (cursoSeleccionado !== null) {
      obtenerActividades();
    }
  }, [cursoSeleccionado]);

  let [dropdowns, setDropdowns] = useState([
    // FAKE
    {
      id: 1,
      code: "nucleo",
      label: "1",
      level: "UNO",
      stylus: {},
      variant: "primary",
      status: false,
    },
    {
      id: 2,
      code: "doctorado",
      label: "src/assets/icons/calificaciones/doctorado.svg",
      level: "DOS",
      stylus: { backgroundColor: "#8547FF" },
      position: { bottom: 20 },
      variant: "secondary",
      status: false,
    },
    {
      id: 3,
      code: "licenciatura",
      label: "src/assets/icons/calificaciones/licenciatura.svg",
      level: "DOS",
      stylus: { backgroundColor: "#8547FF" },
      position: { top: 95 },
      variant: "secondary",
      status: false,
    },
    {
      id: 4,
      code: "maestria",
      label: "src/assets/icons/calificaciones/maestria.svg",
      level: "DOS",
      stylus: { backgroundColor: "#8547FF" },
      position: { left: 95 },
      variant: "secondary",
      status: false,
    },
    {
      id: 5,
      code: "doc-derecho",
      label: "src/assets/icons/calificaciones/doc-derecho.svg",
      level: "TRES",
      stylus: { backgroundColor: "#8A7FBA" },
      position: { left: -50, bottom: 105 },
      variant: "ternary",
      status: false,
    },
    {
      id: 6,
      code: "doc-educa",
      label: "src/assets/icons/calificaciones/doc-educa.svg",
      level: "TRES",
      stylus: { backgroundColor: "#8A7FBA" },
      position: { left: 50, bottom: 105 },
      variant: "ternary",
      status: false,
    },
    {
      id: 7,
      code: "mast-educa",
      label: "src/assets/icons/calificaciones/maestria-educa.svg",
      level: "TRES",
      stylus: { backgroundColor: "#8A7FBA" },
      position: { left: 188 },
      variant: "ternary",
      status: false,
    },

    {
      id: 8,
      code: "lic-desarrollo",
      label: "src/assets/icons/calificaciones/lic-desarrollo.svg",
      level: "TRES",
      stylus: { backgroundColor: "#8A7FBA" },
      position: { right: 20, top: 190 },
      variant: "ternary",
      status: false,
    },
    {
      id: 9,
      code: "lic-ciencia",
      label: "src/assets/icons/calificaciones/lic-ciencia.svg",
      level: "TRES",
      stylus: { backgroundColor: "#8A7FBA" },
      position: { top: 190 },
      variant: "ternary",
      status: false,
    },
    {
      id: 10,
      code: "lic-pedag",
      label: "src/assets/icons/calificaciones/lic-pedago.svg",
      level: "TRES",
      stylus: { backgroundColor: "#8A7FBA" },
      position: { left: 95, top: 190 },
      variant: "ternary",
      status: false,
    },

    // Separation Maestria Group
    {
      id: 11,
      code: "Primer Semestre",
      label: "src/assets/icons/calificaciones/semester/sem-1.svg",
      level: "CUATRO",
      stylus: { backgroundColor: "#8547FF" },
      position: { left: 270, top: -60 },
      variant: "ternary",
      status: false,
    },
    {
      id: 12,
      code: "Segundo Semestre",
      label: "src/assets/icons/calificaciones/semester/sem-2.svg",
      level: "CUATRO",
      stylus: { backgroundColor: "#8547FF" },
      position: { left: 270, top: 60 },
      variant: "ternary",
      status: false,
    },
    // Separation Licenciaturas Group
    {
      id: 13,
      code: "semester",
      label: "src/assets/icons/calificaciones/semester/sem-1.svg",
      level: "CUATRO",
      stylus: { backgroundColor: "#8547FF" },
      position: { top: 270, left: -60 },
      variant: "ternary",
      status: false,
    },
    {
      id: 14,
      code: "semester",
      label: "src/assets/icons/calificaciones/semester/sem-2.svg",
      level: "CUATRO",
      stylus: { backgroundColor: "#8547FF" },
      position: { top: 270, left: 60 },
      variant: "ternary",
      status: false,
    },
    // Separation Doctorado Group
    {
      id: 15,
      code: "semester",
      label: "src/assets/icons/calificaciones/semester/sem-1.svg",
      level: "CUATRO",
      stylus: { backgroundColor: "#8547FF" },
      position: { bottom: 195, left: -50 },
      variant: "ternary",
      status: false,
    },
    {
      id: 16,
      code: "semester",
      label: "src/assets/icons/calificaciones/semester/sem-2.svg",
      level: "CUATRO",
      stylus: { backgroundColor: "#8547FF" },
      position: { bottom: 195, left: 50 },
      variant: "ternary",
      status: false,
    },
  ]);

  // Maneja la creación de nuevos Dropdowns
  // const handleAddDropdown = (id) => {
  //   const baseDropdown = dropdowns.find((d) => d.id === id);
  //   if (baseDropdown) {
  //     const newDropdown = {
  //       id: dropdowns.length + 1,
  //     };
  //     setDropdowns([...dropdowns, newDropdown]);
  //   }
  // };

  const resetVis = () => {
    setShowNav(true);
    setLevelOne("");
    setLevelTwo("");
    setLevelThree("");
    dropdowns.map((dropdown) => {
      document.getElementById(`drop-${dropdown.id}`).style.visibility =
        "hidden";
    });
    dropdowns.map((dropdown) => {
      dropdown.status = false;
      if (
        dropdown.id === 1 ||
        dropdown.id === 2 ||
        dropdown.id === 3 ||
        dropdown.id === 4
      ) {
        document.getElementById(`drop-${dropdown.id}`).style.visibility =
          "visible";
      }
    });
  };

  const selectOpt = (obj) => {
    console.log(obj.level);
    if (obj.level === "DOS") {
      setLevelOne(obj.code);
      console.log(levelOne);
      if (obj.code === "doctorado") {
        document.getElementById(`drop-2`).style.visibility = "visible";
        document.getElementById(`drop-3`).style.visibility = "hidden";
        document.getElementById(`drop-4`).style.visibility = "hidden";
        // ----------------------------------------------
        document.getElementById(`drop-5`).style.visibility = "visible";
        document.getElementById(`drop-6`).style.visibility = "visible";
      } else if (obj.code === "licenciatura") {
        document.getElementById(`drop-2`).style.visibility = "hidden";
        document.getElementById(`drop-3`).style.visibility = "visible";
        document.getElementById(`drop-4`).style.visibility = "hidden";
        // ----------------------------------------------
        document.getElementById(`drop-8`).style.visibility = "visible";
        document.getElementById(`drop-9`).style.visibility = "visible";
        document.getElementById(`drop-10`).style.visibility = "visible";
      } else if (obj.code === "maestria") {
        document.getElementById(`drop-2`).style.visibility = "hidden";
        document.getElementById(`drop-3`).style.visibility = "hidden";
        document.getElementById(`drop-4`).style.visibility = "visible";
        // ----------------------------------------------
        document.getElementById(`drop-7`).style.visibility = "visible";
      }
    } else if (obj.level === "TRES") {
      console.log(obj.code);
      setLevelTwo(obj.code);
      if (obj.code === "mast-educa") {
        document.getElementById(`drop-11`).style.visibility = "visible";
        document.getElementById(`drop-12`).style.visibility = "visible";
      } else if (obj.code === "lic-desarrollo") {
        document.getElementById(`drop-13`).style.visibility = "visible";
        document.getElementById(`drop-14`).style.visibility = "visible";
      } else if (obj.code === "doc-derecho") {
        document.getElementById(`drop-15`).style.visibility = "visible";
        document.getElementById(`drop-16`).style.visibility = "visible";
      }
      console.log("no");
    } else if (obj.level === "CUATRO") {
      setLevelThree(obj.code);
      console.log(levelOne, levelTwo, levelThree);
      setShowDiv(true);
    }
    // dropdown.status = !dropdown.status;
    // document.getElementById(dropdown.id).style.visibility = "hidden";
  };

  return (
    <>
      {!showDiv && (
        <>
          <div className="pt-3 pl-4 d-flex">
            <button
              className="icon-button mr-3"
              onClick={() => setMuted(!muted)}
              style={{ width: "50px", height: "50px" }}
            >
              <i
                className={`${muted ? "la la-volume-mute" : "la la-volume-up"}`}
                style={{ color: "var(--Lavander)", fontSize: "50px" }}
              />
            </button>
            {showNav && (
              <>
                <button
                  className="btn theme-btn btn-round"
                  style={{
                    padding: "5px 20px",
                    display:
                      levelOne === "doctorado" || levelOne === "" ? "" : "none",
                  }}
                >
                  Doctorado
                </button>
                <button
                  className="btn theme-btn btn-round ml-2"
                  style={{
                    padding: "5px 20px",
                    display:
                      levelOne === "maestria" || levelOne === "" ? "" : "none",
                  }}
                >
                  Maestria
                </button>
                <button
                  className="btn theme-btn btn-round ml-2"
                  style={{
                    padding: "5px 20px",
                    display:
                      levelOne === "licenciatura" || levelOne === ""
                        ? ""
                        : "none",
                  }}
                >
                  Licenciatura
                </button>

                <button
                  className="btn btn-round ml-2"
                  style={{
                    padding: "5px 20px",
                    backgroundColor: "#8A7FBA",
                    color: "white",
                    display:
                      levelOne === "maestria" &&
                      (levelTwo === "mast-educa" || levelTwo === "")
                        ? ""
                        : "none",
                  }}
                >
                  Educación
                </button>
                {/* <button className="btn btn-round ml-2" style={{ padding: "5px 20px", backgroundColor: "#8A7FBA", color: "white" }}>
              Maestria
            </button>
            <button className="btn btn-round ml-2" style={{ padding: "5px 20px", backgroundColor: "#8A7FBA", color: "white" }}>
              Licenciatura
            </button> */}
                <button
                  className="btn btn-round ml-2"
                  style={{
                    padding: "5px 20px",
                    backgroundColor: "#431E8F",
                    color: "white",
                    display:
                      levelTwo !== "" &&
                      (levelThree === "semester" || levelThree === "")
                        ? ""
                        : "none",
                  }}
                >
                  Semestres
                </button>
              </>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            {/* <img src={uwu} width={250} srcset="" onClick={() => resetVis()} /> */}
            {dropdowns.map((dropdown, index) => (
              <Dropdown key={index}>
                {/* FAB Button */}
                <Button
                  id={`drop-${dropdown.id}`}
                  variant={dropdown.variant}
                  style={{
                    ...dropdown.position,
                    ...dropdown.stylus,
                    overflow: "hidden",
                    position: "absolute",
                    width: "75px",
                    height: "75px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "24px",
                    padding: "0",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    visibility: dropdown.id !== 1 && "hidden",
                  }}
                  onClick={() => {
                    selectOpt(dropdown);
                    // console.log("wenas CAPA:", dropdown.status);
                  }}
                >
                  {dropdown.id === 1 ? (
                    <div>
                      <img src={uwu} width={150} onClick={() => resetVis()} />
                    </div>
                  ) : (
                    <img src={dropdown.label} />
                    // dropdown.label
                  )}
                  {/* {dropdown.label} */}
                </Button>

                {/* Dropdown Menu */}
                <Dropdown.Menu
                  style={{
                    position: "absolute",
                    top: "65px", // Ajusta según la posición del FAB
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {/* <Dropdown.Toggle
              variant="secondary"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                padding: "0",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            ></Dropdown.Toggle> */}

                  {/* <Dropdown.Item href="#/action-1">Item 1</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Item 2</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Item 3</Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            ))}
          </div>
        </>
      )}

      {showDiv && (
        <div className="dashboard-content-wrap">
          {/* <audio src={} autoPlay/> */}
          {cursoSeleccionado !== null && (
            <button onClick={volver} className="btn theme-btn btn-round  mb-5">
              <i className="la la-arrow-left icon ml-1"></i> Atrás
            </button>
          )}

          <CustomBreandcrumb
            titles={[
              cursoSeleccionado === null
                ? "Mis calificaciones"
                : cursos.find((curso) => curso.id === cursoSeleccionado).nombre,
            ]}
          />
          {cursoSeleccionado !== null && (
            <p className="mx-2">
              {cursos.find((curso) => curso.id === cursoSeleccionado).codigo}
            </p>
          )}
          {cursoSeleccionado === null ? (
            <>
              <div className="d-flex mt-5">
                <button
                  className="icon-button"
                  onClick={() => setMuted(!muted)}
                  style={{ width: "50px", height: "50px" }}
                >
                  <i
                    className={`${
                      muted ? "la la-volume-mute" : "la la-volume-up"
                    }`}
                    style={{ color: "var(--Lavander)", fontSize: "50px" }}
                  />
                </button>
                <button
                  className="btn theme-btn btn-round py 3 mx-3"
                  onClick={() => {
                    setShowDiv(false);
                    setLevelOne("");
                    setLevelTwo("");
                    setLevelThree("");
                    setShowNav(false);
                  }}
                >
                  <i className="la la-arrow-left icon mr-1"></i>
                  Volver
                </button>
              </div>
              <div className="custom-table">
                <div className="thead">
                  <div className="row">
                    <div className="col">
                      <span>Categoria</span>
                    </div>
                    <div className="col">
                      <span>Programa</span>
                    </div>
                    <div className="col">
                      <span>Semestre</span>
                    </div>
                    <div className="col col-3">
                      <span>Asignatura/curso</span>
                    </div>
                    <div className="col">
                      <span>Calificación</span>
                    </div>
                    <div className="col"></div>
                  </div>
                </div>
                <div className="tbody">
                  {cursos.map((curso, index) => (
                    <>
                      {levelThree === curso.categoria_nombre && (
                        <div className="row" key={`c-${index}`}>
                          <div className="col">Maestria</div>
                          <div className="col">Maestria en educación</div>

                          <div className="col">{curso.categoria_nombre}</div>
                          <div className="col col-3">{curso.nombre}</div>
                          <div
                            className="col d-flex"
                            style={{ paddingLeft: "50px" }}
                          >
                            <GraficCircle
                              value={curso.calificacion_curso ?? "0.00"}
                              maxValue={5}
                            />
                          </div>
                          <div className="col">
                            <button
                              onClick={() => verCalificaciones(curso.id)}
                              className="btn theme-btn btn-round"
                            >
                              Ver calificaciones
                            </button>
                          </div>
                          {/* <div className="col col-1">
                    <span
                      className="icon-button"
                      onClick={() => verCalificaciones(curso.id)}
                    >
                      <i className="la la-search" />
                    </span>
                  </div> */}
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="custom-table">
              <div className="thead">
                <div className="row">
                  <div className="col">Nombre de la actividad</div>
                  <div className="col">Porcentaje del curso</div>
                  <div className="col">Calificación</div>
                </div>
              </div>
              <div className="tbody">
                {actividades.map((actividad, index) => (
                  <div className="row" key={`a-${index}`}>
                    <div className="col">{actividad.nombre}</div>
                    <div className="col">
                      {actividad.porcentaje_en_total_curso}
                    </div>
                    <div className="col">
                      <GraficCircle
                        value={actividad.nota ?? "0.00"}
                        maxValue={5}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-5">
            <DashboardFooter />
          </div>
        </div>
      )}
      <audio src={audio} autoPlay muted={muted} loop />
    </>
  );
};

export default FomularioCalificaciones;
