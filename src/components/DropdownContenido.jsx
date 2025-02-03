// Dropdown.js
// Es el drowp dow que originalmente aparece para descargar recursos
import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
/*

    Ejemplo de data; [{descripcion:"Descargable uno", id:7, nombre:"Descargable uno", ruta_archivo:"public/descargables/d_7_9dnBtuUWLady00d2.pdf"}]
*/

function DropdownContenido({
  data = {},
  id_curso_contenido,
  mostrarHaciaArriba = false,
}) {
  const { jwt } = useContext(AuthContext);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const [isOpen, setIsOpen] = useState(false);
  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };
  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseOnOutsideClick = (event) => {
    if (isOpen && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleCloseOnOutsideClick);
    return () => {
      document.removeEventListener("click", handleCloseOnOutsideClick);
    };
  }, [isOpen]);

  const handleItemClick = async (item) => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    const opciones = {
      method: "GET",
      headers: headers,
    };
    const response = await fetch(
      `${urlBaseApi}/api/cursocontenido/${id_curso_contenido}`,
      opciones
    );
    const datos = await response.json();
    if (response.ok) {
      datos.descargables.forEach(function (descargable) {
        if (descargable.id == item.id) {
          descargar(descargable);
        }
      });
    } else {
      setPopup({
        mostrar: true,
        titulo: "Mensaje",
        contenido: "No se puede descargar en este momento.",
      });
    }
  };

  const descargar = async (item) => {
    const parts = item.ruta_archivo.split("public/");
    const url = `${urlBaseApi}/${parts[1]}`;

    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${item.nombre}.${item.ruta_archivo.split(".").pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    setPopup({
      mostrar: true,
      titulo: "Mensaje",
      contenido:
        "El archivo está siendo descargado, por favor revise su carpeta de descargas.",
    });
  };
  return (
    <>
      <Popup
        mostrarPopup={popUp.mostrar}
        tamano="xx"
        tipo={2}
        titulo={popUp.titulo}
        mensaje={popUp.contenido}
        funcionAceptar={handleFuncionAceptarPopUp}
        funcionCerrar={handleFuncionCerrarPopUp}
        textoCerrar="Aceptar"
      />
      <div ref={dropdownRef} className={`dropdown ${isOpen ? "show" : ""}`}>
        <a
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleToggle();
          }}
          className="btn theme-btn btn-round theme-btn-sm mt-1 font-weight-medium"
          href="#"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded={isOpen ? "true" : "false"}
          style={{
            height: "60px",
            width: "80px",
            fontSize: "10px",
          }}
        >
          <i className="la la-folder-open mr-1"></i> Recursos
          <i className="la la-angle-down ml-1"></i>
        </a>
        <div
          className={`dropdown-menu ${
            !mostrarHaciaArriba ? "dropdown-menu-right" : "dropdown_out_of_view"
          } ${isOpen ? "show" : ""}`}
        >
          {Object.keys(data).map((key, index) => (
            <div
              key={`drop-key-contenido-${index}`}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleItemClick(data[key]);
              }}
            >
              {data[key].nombre}.{data[key].extension}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DropdownContenido;
