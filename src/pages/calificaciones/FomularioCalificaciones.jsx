/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";
import { AuthContext } from "../../AuthContext";
import DashboardFooter from "../../components/DashboardFooter";
import GraficCircle from "../../components/grafics/GraficCircle";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import uwu from "../../assets/icons/Gif_glomind.gif";

const FomularioCalificaciones = () => {
  const { jwt } = useContext(AuthContext);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [showDiv, setShowDiv] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
        `${urlBaseApi}/api/usuario/cursos/0/1/1/nombre-desc`,
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
              )?.puntuacion,
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

  const [dropdowns, setDropdowns] = useState([
    {
      id: 1,
      name: "nucleo",
      level: "UNO",
      stylus: {},
      position: { top: 0 },
      variant: "primary",
    },
    {
      id: 2,
      name: "doctorado",
      level: "DOS",
      stylus: {},
      position: { bottom: 20 },
      variant: "secondary",
    },
    {
      id: 3,
      name: "licenciatura",
      level: "DOS",
      stylus: {},
      position: { top: 75 },
      variant: "secondary",
    },
    {
      id: 4,
      name: "maestria",
      level: "DOS",
      stylus: {},
      position: { left: 75 },
      variant: "secondary",
    },
    {
      id: 5,
      name: "maestria",
      level: "TRES",
      stylus: {},
      position: { left: -40, bottom: 95 },
      variant: "ternary",
    },
    {
      id: 6,
      name: "maestria",
      level: "TRES",
      stylus: {},
      position: { left: 40, bottom: 95 },
      variant: "ternary",
    },
    {
      id: 7,
      name: "maestria",
      level: "TRES",
      stylus: {},
      position: { left: 145 },
      variant: "ternary",
    },

    {
      id: 8,
      name: "licenciatura",
      level: "DOS",
      stylus: {},
      position: { right: 20, top: 150 },
      variant: "ternary",
    },
    {
      id: 9,
      name: "licenciatura",
      level: "DOS",
      stylus: {},
      position: { top: 150 },
      variant: "ternary",
    },
    {
      id: 10,
      name: "licenciatura",
      level: "DOS",
      stylus: {},
      position: { left: 75, top: 150 },
      variant: "ternary",
    },

    // Separation Maestria Group
    {
      id: "S1",
      name: "semester",
      level: "CUATRO",
      stylus: {},
      position: { left: 220, top: -40 },
      variant: "danger",
    },
    {
      id: "S2",
      name: "semester",
      level: "CUATRO",
      stylus: {},
      position: { left: 220, top: 40 },
      variant: "danger",
    },
    // Separation Licenciaturas Group
    {
      id: "S1",
      name: "semester",
      level: "CUATRO",
      stylus: {},
      position: { top: 220, left: -40 },
      variant: "danger",
    },
    {
      id: "S2",
      name: "semester",
      level: "CUATRO",
      stylus: {},
      position: { top: 220, left: 40 },
      variant: "danger",
    },
    // Separation Doctorado Group
    {
      id: "S1",
      name: "semester",
      level: "CUATRO",
      stylus: {},
      position: { bottom: 170, left: -40 },
      variant: "danger",
    },
    {
      id: "S2",
      name: "semester",
      level: "CUATRO",
      stylus: {},
      position: { bottom: 170, left: 40 },
      variant: "danger",
    },
  ]);

  // Maneja la creación de nuevos Dropdowns
  const handleAddDropdown = (id) => {
    const baseDropdown = dropdowns.find((d) => d.id === id);
    if (baseDropdown) {
      const newDropdown = {
        id: dropdowns.length + 1,
      };
      setDropdowns([...dropdowns, newDropdown]);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img src={uwu} width={250} />
        {dropdowns.map((dropdown, index) => (
          <Dropdown key={`DROP-${index}`}>
            {/* FAB Button */}
            <Button
              variant={dropdown.variant}
              style={{
                ...dropdown.position,
                position: "absolute",
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
              onClick={() => {
                console.log("wenas CAPA:", dropdown.level);
              }}
            >
              {dropdown.id}
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
                <button className="btn theme-btn-white btn-round py 3 mr-3">
                  <i className="la la-filter icon mr-1"></i>
                  Categoria
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
                    <div className="row" key={`c-${index}`}>
                      <div className="col">Doctorado</div>
                      <div className="col">Doctorado en derecho</div>

                      <div className="col">{curso.categoria_nombre}</div>
                      <div className="col col-3">{curso.nombre}</div>
                      <div
                        className="col d-flex"
                        style={{ paddingLeft: "50px" }}
                      >
                        <GraficCircle
                          value={curso.calificacion_curso}
                          maxValue={10}
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
                      {actividad.porcentaje_en_total_curso}%
                    </div>
                    <div className="col">
                      <GraficCircle value={actividad.nota} maxValue={10} />
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
    </>
  );
};
export default FomularioCalificaciones;
