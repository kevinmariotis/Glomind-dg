/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import TarjetaCursoAdmin from "../../components/cards/TarjetaCursoAdmin";
import { AuthContext } from "../../AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const CursosRecientes = () => {
  const { jwt } = useContext(AuthContext);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const [cursosRecientes, setCursosRecientes] = useState([]);

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
        `${urlBaseApi}/api/usuario/cursos/0/1/1/ultima_visita-desc`,
        opciones
      );
      // setMostrarSpinner(false);
      if (response2.ok) {
        const datos2 = await response2.json();
        setCursosRecientes(datos2.cursos);
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
            Cursos vistos recientemente
          </h3>

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1600: {
                slidesPerView: 4,
              },
            }}
          >
            {cursosRecientes.map((curso) => (
              <SwiperSlide key={curso.id}>
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
              </SwiperSlide>
            ))}
          </Swiper>
          {/* <Carousel
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
          </Carousel> */}
        </>
      )}
    </div>
  );
};

export default CursosRecientes;
