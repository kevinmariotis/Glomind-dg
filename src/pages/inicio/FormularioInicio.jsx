/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";
import { AuthContext } from "../../AuthContext";
import DashboardFooter from "../../components/DashboardFooter";
import CursosRecientes from "./CursosRecientes";
import CardPensum from "../../components/cards/CardPensum/CardPensum";
import Spinner from "../../components/Spinner";

const FormularioInicio = () => {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { jwt, nombres, esDocente } = useContext(AuthContext);

  const [categoriasNiveles, setCategoriasNiveles] = useState([
    {
      idCategoria: 0,
      nombre: "Oferta acádemica",
    },
  ]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerCategorias = async () => {
    setLoading(true);
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
    setLoading(false);
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
      {/* Breadcrumb de seguimiento */}
      {categoriaSeleccionada === 0 && (
        <div className="card-user col-lg-6">
          <p className="legend">EL APRENDIZAJE IMPULSA TU CRECIMIENTO</p>
          <p className="text">{nombres}</p>
          <p className="text">Bienvenido(a) a Glomind!</p>
        </div>
      )}
      {/* Boton atras */}
      <div className="my-5">
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

        {loading ? (
          <Spinner />
        ) : categorias.length > 0 ? (
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
                <div
                  key={`tarjeta-categoria-admin-${categoria.id}`}
                  className="col-lg-3 py-3"
                >
                  <CardPensum
                    title={categoria.nombre}
                    img={
                      categoria.imagen_pequena != null
                        ? urlBaseApi + "/" + categoria.imagen_pequena
                        : "/images/img8.jpg"
                    }
                    description={categoria.description}
                    value="0,0"
                    path="https://uvirtualad.mx"
                    // footer="Precio Completo"
                  />
                </div>
              ))}
            {/* <TarjetaCategoriaAdmin
                key={`tarjeta-categoria-admin-${categoria.id}`}
                id_categoria={categoria.id}
                nombre={categoria.nombre}
                imagen={categoria.imagen_pequena}
                funcionNavegar={cambiarCategoria}
                totalCursos={cursos.length}
              /> */}
          </div>
        ) : (
          <p>Lo sentimos, no se encontraron resultados</p>
        )}
        {/* Cursos recientes */}
        {categoriasNiveles.length === 1 && !esDocente && <CursosRecientes />}
      </div>
      <DashboardFooter />
    </div>
  );
};

export default FormularioInicio;
