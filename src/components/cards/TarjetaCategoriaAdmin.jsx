/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

function TarjetaCategoriaAdmin({
  id_categoria = 0,
  nombre = "Nombre categoría",
  imagen = null,
  funcionNavegar = null,
  funcionCantidadCursos = null,
  totalCursos = 0,
  tipo = "",
}) {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const [cantidadCursos, setCantidadCursos] = useState(totalCursos);

  useEffect(() => {
    if (funcionCantidadCursos != null) {
      let cantidad = funcionCantidadCursos(id_categoria);
      setCantidadCursos(cantidad);
    }
  }, []);

  useEffect(() => {
    if (tipo === "semestre") {
      const style = document.createElement("style");
      style.textContent = `
        .category-item::after {
          background-color: transparent;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style); // Limpieza
      };
    }
  }, [tipo]);

  /*const handleNavegar = () => {            

        }*/

  //console.log("Este es el favorito ", estadoFavorito);
  return (
    <div className="col-lg-3 responsive-column-half p-3">
      <div
        className="category-item"
        onClick={() => {
          funcionNavegar(id_categoria);
        }}
        style={{ cursor: "pointer", borderRadius: "var(--CornerLarge)" }}
      >
        <img
          className="cat__img lazy"
          src={imagen != null ? urlBaseApi + "/" + imagen : "/images/img8.jpg"}
          data-src={
            imagen != null ? urlBaseApi + "/" + imagen : "/images/img8.jpg"
          }
          alt="Category image"
        />
        <div className="category-content">
          <div className="category-inner px-3">
            {tipo !== "semestre" && (
              <>
                <h3 className="cat__title">
                  <a href="#">{nombre}</a>
                </h3>
                <p className="cat__meta">
                  {cantidadCursos}{" "}
                  {cantidadCursos === 1 ? "Resultado" : "Resultados"}
                </p>
              </>
            )}
            <button
              onClick={() => {
                funcionNavegar(id_categoria);
              }}
              className="btn theme-btn theme-btn-sm theme-btn-white"
            >
              Ver<i className="la la-arrow-right icon ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarjetaCategoriaAdmin;
