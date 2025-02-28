/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";
import { AuthContext } from "../../AuthContext";
import DashboardFooter from "../../components/DashboardFooter";
import CursosRecientes from "./CursosRecientes";
import CardPensum from "../../components/cards/CardPensum/CardPensum";
import Spinner from "../../components/Spinner";
import TarjetaCategoriaAdmin from "../../components/cards/TarjetaCategoriaAdmin";

const FormularioInicio = () => {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const VITE_OFERTA_ACADEMICA = import.meta.env.VITE_OFERTA_ACADEMICA;

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
        `${urlBaseApi}/api/categoriasistema/getCategoriasPorPadre/${categoriaSeleccionada}/1/${
          categoriaSeleccionada === 0 ? "personalizado_1:tipo_de_programa" : ""
        }`,
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

  const contarCursosCategoria = (id_categoria) => {
    let contador = 0;

    categorias?.forEach((catx) => {
      // For de padres
      catx?.categorias_hijas?.forEach((catx2) => {
        // For de hijos
        if (catx2.id_padre == id_categoria) {
          contador++;
        }
      });
    });

    /*datosCursosTodos.forEach((curso, index) => {            
            curso.categorias_perteneciente.forEach((cate, index2) => {                                            
                if(cate==id_categoria){                    
                    contador++;
                }                
            });                                
        });*/
    return contador;
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
          <p className="text">Bienvenid@ a Glomind!</p>
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

        {VITE_OFERTA_ACADEMICA === "true" && (
          <CustomBreandcrumb
            titles={[...categoriasNiveles.map((item) => item.nombre)]}
          />
        )}

        {VITE_OFERTA_ACADEMICA === "true" && (
          <>
            {loading ? (
              <Spinner />
            ) : categorias.length > 0 ? (
              <div className="row">
                {categoriasNiveles.length !== 2 &&
                  categorias.map((categoria) => (
                    <TarjetaCategoriaAdmin
                      key={`tarjeta-categoria-admin-${categoria.id}`}
                      id_categoria={categoria.id}
                      nombre={categoria.nombre}
                      imagen={categoria.imagen_pequena}
                      funcionNavegar={cambiarCategoria}
                      funcionCantidadCursos={contarCursosCategoria}
                    />
                    // <div key={`cat-${index}`} className="col-lg-3 p-3">
                    //   <div
                    //     className="card-basic"
                    //     onClick={() => cambiarCategoria(categoria.id)}
                    //   >
                    //     <div>
                    //       <h2>{categoria.nombre}</h2>
                    //       {categoriaSeleccionada !== 0 && (
                    //         <p>
                    //           ( {cursos.length}{" "}
                    //           {cursos.length === 1 ? "Resultado" : "Resultados"})
                    //         </p>
                    //       )}
                    //     </div>
                    //   </div>
                    // </div>
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
                        description={categoria.descripcion}
                        path="https://uvirtualad.mx"
                        value={categoria.personalizado_2 ?? "0.0"}
                        items={[
                          categoriasNiveles[1]?.nombre,
                          categoria.personalizado_3,
                          categoria.personalizado_4?.split(" ")[0] ?? "",
                          categoria.personalizado_5?.split(" ")[0] ?? "",
                          categoria.personalizado_6,
                        ]}
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
          </>
        )}
        {/* Cursos recientes */}
        <CursosRecientes />
      </div>
      <DashboardFooter />
    </div>
  );
};

export default FormularioInicio;
