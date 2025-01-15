/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";
import { AuthContext } from "../../AuthContext";
import DashboardFooter from "../../components/DashboardFooter";
import GraficCircle from "../../components/grafics/GraficCircle";
// import second from 'first'

const FomularioCalificaciones = () => {
  const { jwt } = useContext(AuthContext);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [actividades, setActividades] = useState([]);

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

  return (
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
                  <div className="col d-flex" style={{ paddingLeft: "50px"}}>
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
                <div className="col">{actividad.porcentaje_en_total_curso}</div>
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
  );
};

export default FomularioCalificaciones;
