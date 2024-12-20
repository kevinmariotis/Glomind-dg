/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";
import { AuthContext } from "../../AuthContext";
import DashboardFooter from "../../components/DashboardFooter";

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
        `${urlBaseApi}/api/usuario/cursos/0/1/1/nombre-asc`,
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
          <div className="card custom-card mt-4">
            <div className="table-responsive mb-5">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th scope="col">Nombre de la asignatura/curso</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Codigo</th>
                    <th scope="col">Calificación</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {cursos.map((curso, index) => (
                    <tr key={`c-${index}`}>
                      <td>{curso.nombre}</td>
                      <td>{curso.categoria_nombre}</td>
                      <td>{curso.codigo}</td>
                      <td>{curso.calificacion_curso ?? "-"}</td>
                      <td>
                        <button
                          className="btn theme-btn btn-round w-100 px-0"
                          onClick={() => verCalificaciones(curso.id)}
                        >
                          Ver calificaciones
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <Paginador
            elemetosTotales={totalCertificados}
            elementosPorPagina={15}
            paginaActual={paginaNavegacion}
            callbackCambioPagina={setPaginaNavegacion}
          /> */}
            </div>
          </div>
        </>
      ) : (
        <div className="card custom-card mt-4">
          <div className="table-responsive mb-5">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th scope="col">Nombre de la actividad</th>
                  <th scope="col">Porcentaje del curso</th>
                  <th scope="col">Calificación</th>
                </tr>
              </thead>
              <tbody>
                {actividades.map((actividad, index) => (
                  <tr key={`a-${index}`}>
                    <td>{actividad.nombre}</td>
                    <td>{actividad.porcentaje_en_total_curso}</td>
                    <td>{actividad.nota ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <Paginador
            elemetosTotales={totalCertificados}
            elementosPorPagina={15}
            paginaActual={paginaNavegacion}
            callbackCambioPagina={setPaginaNavegacion}
          /> */}
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
