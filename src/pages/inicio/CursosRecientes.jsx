import { useContext, useEffect, useState, useRef } from "react";
import TarjetaCursoAdmin from "../../components/cards/TarjetaCursoAdmin";
import { AuthContext } from "../../AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { useLocation } from "react-router-dom";

const CursosRecientes = () => {
  const { jwt, esMovil } = useContext(AuthContext);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const [cursosRecientes, setCursosRecientes] = useState([]);
  const [showContorls, setShowControls] = useState(false);
  const swiperRef = useRef(null);
  const location = useLocation();

  const obtenerDatosCursos = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };

      const response2 = await fetch(
        `${urlBaseApi}/api/usuario/cursos/0/1/1/ultima_visita-desc`,
        opciones
      );

      if (response2.ok) {
        const datos2 = await response2.json();
        setCursosRecientes(datos2.cursos);
      }
    } catch (error) {
      console.error("Error en la solicitud al servidor", error);
    }
  };

  useEffect(() => {
    obtenerDatosCursos();
  }, []);

  const handleMouseEnter = () => {
    setShowControls(true);
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.stop(); // Detener autoplay
    }
  };

  const handleMouseLeave = () => {
    setShowControls(false);
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.start(); // Reiniciar autoplay
    }
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {cursosRecientes?.length > 0 && (
        <>
          <h3
            className="fs-22 font-weight-semi-bold my-4 mt-5"
            style={{
              alignContent: "center",
              color: "var(--Azul-petroleo)",
            }}
          >
            Cursos recientes
          </h3>

          <Swiper
            loop={true}
            autoplay={{
              delay: 0,
            }}
            speed={2000}
            modules={[Navigation, Autoplay]}
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
            navigation={{
              nextEl: "#nextBtn",
              prevEl: "#prevBtn",
            }}
            ref={swiperRef}
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
                  state={{
                    pathname: location.pathname,
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Botones de navegación personalizados */}
          <>
            <button
              id="prevBtn"
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                zIndex: 10,
                backgroundColor: "var(--Lavander)",
                border: "none",
                fontSize: "30px",
                color: "white",
                padding: "10px",
                borderRadius: "50%",
                display: !esMovil && showContorls ? "block" : "none",
              }}
            >
              <i className="la la-arrow-left"></i>
            </button>
            <button
              id="nextBtn"
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                zIndex: 10,
                backgroundColor: "var(--Lavander)",
                border: "none",
                fontSize: "30px",
                color: "white",
                padding: "10px",
                borderRadius: "50%",
                visibility: !esMovil && showContorls ? "visible" : "hidden",
              }}
            >
              <i className="la la-arrow-right"></i>
            </button>
          </>
        </>
      )}
    </div>
  );
};

export default CursosRecientes;
