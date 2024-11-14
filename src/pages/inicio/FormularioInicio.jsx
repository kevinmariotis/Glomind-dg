/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";
import { AuthContext } from "../../AuthContext";
import TarjetaCategoriaAdmin from "../../components/cards/TarjetaCategoriaAdmin";
import DashboardFooter from "../../components/DashboardFooter";
import TarjetaCursoAdmin from "../../components/cards/TarjetaCursoAdmin";

const FormularioInicio = () => {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { jwt, nombres } = useContext(AuthContext);

  const [categoriasNiveles, setCategoriasNiveles] = useState([
    {
      idCategoria: 0,
      nombre: "Oferta acádemica",
    },
  ]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [cursos, setCursos] = useState([]);

  const obtenerCategorias = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };

      //buscamos los datos de los cursos a mostrar
      //setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/categoriasistema/getCategoriasPorPadre/${categoriaSeleccionada}/1`,
        opciones
      );
      //setMostrarSpinner(false);
      if (response.ok) {
        if (categoriaSeleccionada === 0) {
          obtenerDatosCursos();
        }
        obtenerDatosCursos();
        const datos2 = await response.json();
        if (datos2.length > 0) {
          setCategorias(datos2);
        }
      } else {
        // const datos2 = await response2.json();
        // mensajesDeError(
        //   setPopup,
        //   response2.status,
        //   typeof datos2.datos !== "undefined" ? datos2.datos : {}
        // );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerDatosCursos = async () => {
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
        `${urlBaseApi}/api/usuario/cursos/0/${1}/${3}/nombre-asc/9/${categoriaSeleccionada}`,
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

  const cambiarCategoria = (idCategoria) => {
    setCategorias([]);
    setCursos([]);
    setCategoriaSeleccionada(idCategoria);
    setCategoriasNiveles([
      ...categoriasNiveles,
      {
        idCategoria,
        nombre: categorias.find((item) => item.id === idCategoria).nombre,
      },
    ]);
  };

  const handleVolverCategoriaAnterior = () => {
    let copialista = [...categoriasNiveles];
    copialista.pop();
    setCategoriasNiveles(copialista);
    setCategoriaSeleccionada(copialista[copialista.length - 1].idCategoria);
  };

  console.log(categorias);

  useEffect(() => {
    obtenerCategorias(categoriaSeleccionada);
  }, [categoriaSeleccionada]);

  return (
    <div className="dashboard-content-wrap">
      {/* {esMovil && <BotonDashboardNavegacionMovil />} */}
      {categoriaSeleccionada === 0 && (
        <div className="card-user col-lg-6">
          <p className="legend">el aprendizaje impulsa tu crecimiento</p>
          <p className="text">{nombres}</p>
          <p className="text">Bienvenido(a) a Glomind!</p>
        </div>
      )}
      <div className="container-fluid my-5">
        {categoriaSeleccionada !== 0 && (
          <div
            className="more-btn-box mt-4 text-left"
            style={{ marginBottom: "50px" }}
          >
            <button
              onClick={handleVolverCategoriaAnterior}
              className="btn theme-btn btn-round"
            >
              <i className="la la-arrow-left icon ml-1"></i> Atrás
            </button>{" "}
            <h3
              className="fs-22 font-weight-semi-bold"
              style={{ marginLeft: "120px" }}
            ></h3>
          </div>
        )}

        <CustomBreandcrumb
          titles={[...categoriasNiveles.map((item) => item.nombre)]}
        />

        <div className="row">
          {categoriasNiveles.length !== 2 &&
            categorias.map((categoria, index) => (
              <div key={`cat-${index}`} className="col-lg-3 p-3">
                <div
                  className="card-basic"
                  onClick={() => cambiarCategoria(categoria.id)}
                >
                  <div>
                    <h2>{categoria.nombre}</h2>
                    {categoriaSeleccionada !== 0 && (
                      <p>
                        ( {cursos.length}{" "}
                        {cursos.length === 1 ? "Resultado" : "Resultados"})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {categoriasNiveles.length === 2 &&
            categorias.map((categoria) => (
              <TarjetaCategoriaAdmin
                key={`tarjeta-categoria-admin-${categoria.id}`}
                id_categoria={categoria.id}
                nombre={categoria.nombre}
                imagen={categoria.imagen_pequena}
                funcionNavegar={cambiarCategoria}
                totalCursos={cursos.length}
              />
            ))}
          {categorias.length === 0 &&
            cursos.map((curso) => (
              <TarjetaCursoAdmin
                key={`tarjeta${curso.id}`}
                idcurso={curso.id}
                url_amigable={curso.url_amigable}
                nombre={curso.nombre}
                imagen={curso.imagen_pequena}
                instructor={curso.instructor}
                id_instructor={curso.id_instructor}
                descripcion_instructor={curso.docente_descripcion}
                reviews_puntuacion={curso.reviews_puntuacion}
                porcentaje_progreso={curso.porcentaje_progreso}
                curso={curso}
              />
            ))}
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default FormularioInicio;
