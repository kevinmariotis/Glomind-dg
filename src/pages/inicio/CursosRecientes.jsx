/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import TarjetaCursoAdmin from "../../components/cards/TarjetaCursoAdmin";
import { AuthContext } from "../../AuthContext";
import { Button, Carousel } from "react-bootstrap";

const CursosRecientes = () => {
  const { jwt } = useContext(AuthContext);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const [cursosRecientes, setCursosRecientes] = useState([]);

  const dividirArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
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
        `${urlBaseApi}/api/usuario/cursos/0/${1}/${2}/ultima_visita-asc`,
        opciones
      );
      // setMostrarSpinner(false);
      if (response2.ok) {
        const datos2 = await response2.json();
        const result = dividirArray(datos2.cursos, 4);
        setCursosRecientes(result);
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  useEffect(() => {
    obtenerDatosCursos();
  }, []);

  return (
    <div>
      {cursosRecientes?.length > 0 && (
        <>
          <h3
            className="fs-22 font-weight-semi-bold my-4 mt-5"
            style={{
              alignContent: "center",
              color: "var(--Azul-petroleo)",
            }}
          >
            Continuar viendo
          </h3>
          <Carousel
            interval={null}
            controls={cursosRecientes?.length > 1}
            prevIcon={
              <Button
                style={{ borderRadius: "50%", width: "50px", height: "50px" }}
              >
                <i className="la la-arrow-left icon"></i>
              </Button>
            }
            nextIcon={
              <Button
                style={{ borderRadius: "50%", width: "50px", height: "50px" }}
              >
                <i className="la la-arrow-right icon"></i>
              </Button>
            }
          >
            {cursosRecientes?.map((slide, index) => (
              <Carousel.Item
                key={`slide-item-${index}`}
                style={{ height: "550px" }}
              >
                <div className="card-wrapper container-sm d-flex  justify-content-start">
                  {slide?.map((curso) => (
                    <TarjetaCursoAdmin
                      key={`tarjeta${curso.id}`}
                      idcurso={curso.id}
                      url_amigable={curso.url_amigable}
                      nombre={curso.nombre}
                      imagen={curso.imagen_pequena}
                      instructor={curso.instructor}
                      id_instructor={curso.id_instructor}
                      descripcion_instructor={curso.docente_descripcion}
                      labelButton={"Continuar"}
                      btnVideo={false}
                      curso={curso}
                    />
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      )}
    </div>
  );
};

export default CursosRecientes;
