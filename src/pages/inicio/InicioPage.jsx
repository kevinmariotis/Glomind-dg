/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";
import { AuthContext } from "../../AuthContext";

const InicioPage = () => {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { jwt, nombres } = useContext(AuthContext);

  const [categorias, setCategorias] = useState({});

  const obtenerCategorias = async (id_padre) => {
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
      const response2 = await fetch(
        `${urlBaseApi}/api/categoriasistema/getTodas/1`,
        opciones
      );
      //setMostrarSpinner(false);
      if (response2.ok) {
        const datos2 = await response2.json();
        setCategorias(datos2);
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
  console.log(categorias)

  useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <div className="dashboard-content-wrap">
      {/* {esMovil && <BotonDashboardNavegacionMovil />} */}
      <div className="card-user col-lg-6">
        <p className="legend">el aprendizaje impulsa tu crecimiento</p>
        <p className="text">{nombres}</p>
        <p className="text">Bienvenido(a) a Glomind!</p>
      </div>
      <div className="container-fluid mt-5">
        <CustomBreandcrumb titles={["Oferta acádemica"]} />
        <div>{Object.keys(categorias).map((item) => item)}</div>
      </div>
    </div>
  );
};

export default InicioPage;
