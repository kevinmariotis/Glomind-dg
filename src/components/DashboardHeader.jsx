/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { mensajesDeError } from "./utils";
import {
  clicBuscarMovil,
  clickMenuCategoriaSistemaMovil,
  setupSubMenu,
  closeCategoryMenuMovil,
  cliclMenuTagsMovil,
  closeTagsMenuMovil,
} from "./comun";
import Popup from "./Popup";
import Buscador from "./Buscador";

function DashboardHeader({ expandir_ancho = false }) {
  const urlBase = import.meta.env.VITE_URL_BASE;
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const {
    jwt,
    esMovil,
    logout,
    cargarContadorCarrito,
    setCargarContadorCarrito,
    cargarFavoritos,
    setCargarFavoritos,
    cargarMisCursos,
    setCargarMisCursos,
    authenticated,
    nombres,
    correo,
    imagen_pequena,
    temaActual,
    setTemaActual,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const [datos, setDatos] = useState({ datos: {}, fechahora: 0 });
  const [contadorCarrito, setContadorCarrito] = useState({
    contador: 0,
    productos: {},
    fechahora: 0,
  });
  const [misCursos, setMisCursos] = useState({});
  const [favoritos, setFavoritos] = useState({});

  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };
  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const handleThemeToggle = () => {
    if (temaActual == 1) {
      setTemaActual(0);
    } else {
      setTemaActual(1);
    }
  };

  useEffect(() => {
    //miramos si no tiene los datos de categorias del sistema en sessionStorage
    const categoriasistema = sessionStorage.getItem("categoriasistema");
    if (categoriasistema) {
      setDatos(JSON.parse(categoriasistema));
      if (
        Math.floor(new Date().getTime() / 1000) -
          parseInt(JSON.parse(categoriasistema).fechahora) >=
        3600
      ) {
        obtenerCategoriasSistema();
      }
    } else {
      // Los datos no están en la caché local, obtenerlos del servidor
      obtenerCategoriasSistema();
    }

    //miramos si no tiene los datos del carrito en sessionStorage
    const contadorcarrito = sessionStorage.getItem("contadorcarrito");
    if (contadorcarrito) {
      setContadorCarrito(JSON.parse(contadorcarrito));
      if (
        Math.floor(new Date().getTime() / 1000) -
          parseInt(JSON.parse(contadorcarrito).fechahora) >=
        3600
      ) {
        setCargarContadorCarrito(true);
      }
    } else {
      setCargarContadorCarrito(true);
    }

    //miramos si no tiene los datos de favoritos en sessionStorage
    const contadorfavoritos = sessionStorage.getItem("contadorfavoritos");
    if (contadorfavoritos) {
      setFavoritos(JSON.parse(contadorfavoritos));
      if (
        Math.floor(new Date().getTime() / 1000) -
          parseInt(JSON.parse(contadorfavoritos).fechahora) >=
        3600
      ) {
        setCargarFavoritos(true);
      }
    } else {
      setCargarFavoritos(true);
    }

    //miramos si no tiene los datos de mis-cursos en sessionStorage
    const contadormiscursos = sessionStorage.getItem("contadormiscursos");
    if (contadormiscursos) {
      setMisCursos(JSON.parse(contadormiscursos));
      if (
        Math.floor(new Date().getTime() / 1000) -
          parseInt(JSON.parse(contadormiscursos).fechahora) >=
        3600
      ) {
        setCargarMisCursos(true);
      }
    } else {
      setCargarMisCursos(true);
    }

    if (esMovil) {
      clicBuscarMovil();
      clickMenuCategoriaSistemaMovil();
      cliclMenuTagsMovil();
    }
  }, []);

  useEffect(() => {
    setupSubMenu();
  }, [datos]);

  const handleAbrirMiAprendizaje = () => {
    closeCategoryMenuMovil();
    navigate(`/cursos/matriculados`);
  };

  const handleAbrirLinkMenuPrincipal = (url_link) => {
    closeTagsMenuMovil();
    navigate(url_link);
  };

  const handleCerrarSesion = () => {
    if (logout()) {
      document.location.reload();
    }
  };

  //use efect para cargar los datos contadores del carrito
  useEffect(() => {
    if (cargarContadorCarrito && authenticated) {
      obtenerDatosCarrito();
    }
    if (cargarFavoritos && authenticated) {
      obtenerFavoritos();
    }
    if (cargarMisCursos && authenticated) {
      obtenerMisCursos();
    }
  }, [cargarContadorCarrito, cargarFavoritos, cargarMisCursos, authenticated]);

  const obtenerCategoriasSistema = async () => {
    try {
      const opciones = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `${urlBaseApi}/api/categoriasistema/getCategoriasPorPadre/0/1`,
        opciones
      );

      if (response.ok) {
        const categoriasistema = await response.json();
        sessionStorage.setItem(
          "categoriasistema",
          JSON.stringify({
            datos: categoriasistema,
            fechahora: Math.floor(new Date().getTime() / 1000),
          })
        );
        setDatos({
          datos: categoriasistema,
          fechahora: Math.floor(new Date().getTime() / 1000),
        });
      } else {
        const data = await response.json();
        mensajesDeError(
          setPopup,
          response.status,
          typeof data.datos !== "undefined" ? data.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerDatosCarrito = async () => {
    try {
      const opciones = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await fetch(`${urlBaseApi}/api/carrito/1`, opciones);

      if (response.ok) {
        const contadorcarrito = await response.json();
        const tamanocarrito = contadorcarrito.productos.length;
        sessionStorage.setItem(
          "contadorcarrito",
          JSON.stringify({
            contador: tamanocarrito,
            productos: contadorcarrito.productos,
            total: contadorcarrito.factura.total,
            fechahora: Math.floor(new Date().getTime() / 1000),
          })
        );
        setContadorCarrito({
          contador: tamanocarrito,
          productos: contadorcarrito.productos,
          total: contadorcarrito.factura.total,
          fechahora: Math.floor(new Date().getTime() / 1000),
        });
        setCargarContadorCarrito(false);
      } else {
        setCargarContadorCarrito(false);
        const data = await response.json();
        mensajesDeError(
          setPopup,
          response.status,
          typeof data.datos !== "undefined" ? data.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerMisCursos = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      //buscamos los datos de los cursos a mostrar
      const opciones = {
        method: "GET",
        headers: headers,
      };
      const response = await fetch(
        `${urlBaseApi}/api/usuario/cursos/0/1/1/nombre-asc/3`,
        opciones
      );
      if (response.ok) {
        const datos = await response.json();
        setMisCursos(datos.cursos);

        sessionStorage.setItem(
          "contadormiscursos",
          JSON.stringify(datos.cursos)
        );
        setCargarMisCursos(false);
      } else {
        setCargarMisCursos(false);
        const datos = await response.json();
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerFavoritos = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      //buscamos los datos de los cursos a mostrar
      const opciones = {
        method: "GET",
        headers: headers,
      };
      const response = await fetch(
        `${urlBaseApi}/api/usuario/getfavoritos/0/1/2/nombre-asc/3`,
        opciones
      ); //favoritos no comprados
      if (response.ok) {
        const datos = await response.json();
        setFavoritos(datos.cursos);

        sessionStorage.setItem(
          "contadorfavoritos",
          JSON.stringify(datos.cursos)
        );
        setCargarFavoritos(false);
      } else {
        setCargarFavoritos(false);
        const datos = await response2.json();
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
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
      <header className="header-menu-area">
        <div
          className={`header-menu-content ${
            !expandir_ancho && "dashboard-menu-content"
          } pr-30px pl-30px bg-white shadow-sm`}
        >
          <div className="container-fluid">
            <div className="main-menu-content">
              <div className="row align-items-center">
                <div className="col-lg-12">
                  <div className="logo-box logo--box">
                    <Link to="/" className="logo">
                      <img
                        src={`${urlBase}/images/logo_principal.png`}
                        alt="logo"
                      />
                    </Link>
                    <div className="user-btn-action">
                      <div
                        className="search-menu-toggle icon-element icon-element-sm shadow-sm mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Búsqueda"
                      >
                        <i className="la la-search"></i>
                      </div>
                      <div
                        className="off-canvas-menu-toggle cat-menu-toggle icon-element icon-element-sm shadow-sm mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Menú de categorías"
                      >
                        <i className="la la-th-large"></i>
                      </div>
                      <div
                        className="off-canvas-menu-toggle main-menu-toggle icon-element icon-element-sm shadow-sm"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Menú principal"
                      >
                        <i className="la la-bars"></i>
                      </div>
                    </div>
                  </div>
                  <div className="menu-wrapper">
                    <Buscador class_name={`mr-auto ml-0`} />
                    <div className="nav-right-button d-flex align-items-center">
                      <div className="user-action-wrap d-flex align-items-center">
                        <div className="shop-cart course-cart pr-3 mr-3 border-right border-right-gray">
                          <ul>
                            <li>
                              <p className="shop-cart-btn d-flex align-items-center fs-16">
                                Mis cursos
                                <span className="la la-angle-down fs-13 ml-1"></span>
                              </p>
                              {Object.keys(misCursos).length > 0 && (
                                <ul className="cart-dropdown-menu after-none">
                                  {Object.keys(misCursos)
                                    .slice(0, 3)
                                    .map((key) => (
                                      <li
                                        key={misCursos[key].id + "mis-cursos"}
                                        className="media media-card"
                                      >
                                        <Link
                                          to={`/play/${misCursos[key].url_amigable}`}
                                          className="media-img"
                                          style={{ height: "auto" }}
                                        >
                                          {misCursos[key].imagen_pequena !=
                                          null ? (
                                            <img
                                              src={`${urlBaseApi}/${misCursos[key].imagen_pequena}`}
                                              alt={misCursos[key].nombre}
                                            />
                                          ) : (
                                            <img
                                              src="/images/course-no-image.png"
                                              alt={misCursos[key].nombre}
                                            />
                                          )}
                                        </Link>
                                        <div className="media-body">
                                          <h5>
                                            <Link
                                              to={`/play/${misCursos[key].url_amigable}`}
                                            >
                                              {misCursos[key].nombre}
                                            </Link>
                                          </h5>
                                          <div className="skillbar-box pt-3">
                                            <div
                                              className="skillbar skillbar-skillbar"
                                              data-percent="36%"
                                            >
                                              <div
                                                className="skillbar-bar skillbar--bar bg-1"
                                                style={{
                                                  width: `${misCursos[key].porcentaje_progreso}%`,
                                                }}
                                              ></div>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  {Object.keys(misCursos).length > 3 && (
                                    <li key="vertodoscursos">
                                      <Link
                                        to="/cursos/matriculados"
                                        className="btn theme-btn w-100"
                                      >
                                        Ver todos mis cursos{" "}
                                        <i className="la la-arrow-right icon ml-1"></i>
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              )}
                            </li>
                          </ul>
                        </div>
                        <div className="shop-cart pr-3 mr-3 border-right border-right-gray">
                          <ul>
                            {/*<li>
                                                        <p className="shop-cart-btn d-flex align-items-center">
                                                            <i className="la la-shopping-cart fs-22"></i>
                                                            {Object.keys(contadorCarrito.productos).length>0 &&
                                                                <span className="dot-status bg-1"></span>
                                                            }
                                                        </p>
                                                        {authenticated && contadorCarrito.contador>0 && <ul className="cart-dropdown-menu after-none">
                                                            {Object.keys(contadorCarrito.productos).slice(0, 3).map((key) => (
                                                                <li key={`´productos-carrito-${key}`} className="media media-card">
                                                                    <Link to={`/curso/${contadorCarrito.productos[key].url_amigable}`} className="media-img" style={{ height: 'auto' }}>
                                                                        {contadorCarrito.productos[key].imagen_pequena!=null ? <img src={`${urlBaseApi}/${contadorCarrito.productos[key].imagen_pequena}`} alt={contadorCarrito.productos[key].nombre} className="mr-3" /> : <img src="/images/course-no-image.png" alt={contadorCarrito.productos[key].nombre} className="mr-3" /> }
                                                                    </Link>
                                                                    <div className="media-body">
                                                                        <h5><Link to={`/curso/${contadorCarrito.productos[key].url_amigable}`}>{contadorCarrito.productos[key].nombre}</Link></h5>
                                                                        {contadorCarrito.productos[key].nombres!='' && <span className="d-block lh-18 py-1">{contadorCarrito.productos[key].nombres} {contadorCarrito.productos[key].apellidos}</span>}
                                                                        <p className="text-black font-weight-semi-bold lh-18">${contadorCarrito.productos[key].total_momento} {contadorCarrito.productos[key].precio_anterior!=0 && <span className="before-price fs-14">${contadorCarrito.productos[key].precio_anterior}</span>}</p>
                                                                    </div>
                                                                </li> 
                                                            ))}  
                                                            {Object.keys(contadorCarrito.productos).length>3 &&
                                                                <li className="media media-card">
                                                                    <div className="media-body fs-16">
                                                                    <Link to="/carrito"><p className="text-black font-weight-semi-bold lh-18"> + {Object.keys(contadorCarrito.productos).length-3} productos</p></Link>
                                                                    </div>
                                                                </li>
                                                            }                                                           
                                                            <li>
                                                            <Link to="/carrito" className="btn theme-btn w-100">Ir al carrito <i className="la la-arrow-right icon ml-1"></i></Link>
                                                            </li>
                                                        </ul>}
                                                    </li> */}
                          </ul>
                        </div>
                        <div className="shop-cart wishlist-cart pr-3 mr-3 border-right border-right-gray">
                          <ul>
                            <li>
                              <p className="shop-cart-btn">
                                <i className="la la-heart-o"></i>
                                {Object.keys(favoritos).length > 0 && (
                                  <span className="dot-status bg-1"></span>
                                )}
                              </p>
                              {authenticated &&
                                Object.keys(favoritos).length > 0 && (
                                  <ul className="cart-dropdown-menu after-none">
                                    {Object.keys(favoritos)
                                      .slice(0, 3)
                                      .map((key) => (
                                        <li key={`´productos-favoritos-${key}`}>
                                          <div className="media media-card">
                                            <Link
                                              to={`/curso/${favoritos[key].url_amigable}`}
                                              className="media-img"
                                              style={{ height: "auto" }}
                                            >
                                              {favoritos[key].imagen_pequena !=
                                              null ? (
                                                <img
                                                  src={`${urlBaseApi}/${favoritos[key].imagen_pequena}`}
                                                  alt={favoritos[key].nombre}
                                                  className="mr-3"
                                                />
                                              ) : (
                                                <img
                                                  src={`${urlBase}/images/small-img.jpg`}
                                                  alt={favoritos[key].nombre}
                                                  className="mr-3"
                                                />
                                              )}
                                            </Link>
                                            <div className="media-body">
                                              <h5>
                                                <Link
                                                  to={`/curso/${favoritos[key].url_amigable}`}
                                                >
                                                  {favoritos[key].nombre}
                                                </Link>
                                              </h5>
                                              {favoritos[key].instructor !=
                                                "" && (
                                                <span className="d-block lh-18 py-1">
                                                  {favoritos[key].instructor}
                                                </span>
                                              )}
                                              <p className="text-black font-weight-semi-bold lh-18">
                                                ${favoritos[key].precio_actual}{" "}
                                                {favoritos[key]
                                                  .precio_anterior != 0 && (
                                                  <span className="before-price fs-14">
                                                    $
                                                    {
                                                      favoritos[key]
                                                        .precio_anterior
                                                    }
                                                  </span>
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                          <Link
                                            to={`/curso/${favoritos[key].url_amigable}`}
                                            className="btn theme-btn theme-btn-sm theme-btn-transparent lh-28 w-100 mt-3"
                                          >
                                            Agregar al carrito{" "}
                                            <i className="la la-arrow-right icon ml-1"></i>
                                          </Link>
                                        </li>
                                      ))}
                                    <li>
                                      <a
                                        href="my-courses.html"
                                        className="btn theme-btn w-100"
                                      >
                                        Ver mi lista de deseos{" "}
                                        <i className="la la-arrow-right icon ml-1"></i>
                                      </a>
                                    </li>
                                  </ul>
                                )}
                            </li>
                          </ul>
                        </div>
                        <div
                          className="shop-cart notification-cart pr-3 mr-3 border-right border-right-gray"
                          style={{ display: "none" }}
                        >
                          <ul>
                            <li>
                              <p className="shop-cart-btn">
                                <i className="la la-bell"></i>
                                <span className="dot-status bg-1"></span>
                              </p>
                              <ul className="cart-dropdown-menu after-none p-0 notification-dropdown-menu">
                                <li className="menu-heading-block d-flex align-items-center justify-content-between">
                                  <h4>Notificaciones</h4>
                                  <span className="ribbon fs-14">18</span>
                                </li>
                                <li>
                                  <div className="notification-body">
                                    <a
                                      href="dashboard.html"
                                      className="media media-card align-items-center"
                                    >
                                      <div className="icon-element icon-element-sm flex-shrink-0 bg-1 mr-3 text-white">
                                        <i className="la la-bolt"></i>
                                      </div>
                                      <div className="media-body">
                                        <h5>Your resume updated!</h5>
                                        <span className="d-block lh-18 pt-1 text-gray fs-13">
                                          1 hour ago
                                        </span>
                                      </div>
                                    </a>
                                    <a
                                      href="dashboard.html"
                                      className="media media-card align-items-center"
                                    >
                                      <div className="icon-element icon-element-sm flex-shrink-0 bg-2 mr-3 text-white">
                                        <i className="la la-lock"></i>
                                      </div>
                                      <div className="media-body">
                                        <h5>You changed password</h5>
                                        <span className="d-block lh-18 pt-1 text-gray fs-13">
                                          November 12, 2019
                                        </span>
                                      </div>
                                    </a>
                                    <a
                                      href="dashboard.html"
                                      className="media media-card align-items-center"
                                    >
                                      <div className="icon-element icon-element-sm flex-shrink-0 bg-3 mr-3 text-white">
                                        <i className="la la-user"></i>
                                      </div>
                                      <div className="media-body">
                                        <h5>
                                          Your account has been created
                                          successfully
                                        </h5>
                                        <span className="d-block lh-18 pt-1 text-gray fs-13">
                                          November 12, 2019
                                        </span>
                                      </div>
                                    </a>
                                  </div>
                                </li>
                                <li className="menu-heading-block">
                                  <a
                                    href="dashboard.html"
                                    className="btn theme-btn w-100"
                                  >
                                    Show All Notifications{" "}
                                    <i className="la la-arrow-right icon ml-1"></i>
                                  </a>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                        <div className="shop-cart user-profile-cart">
                          <ul>
                            <li>
                              <div className="shop-cart-btn">
                                <div className="avatar-xs">
                                  <img
                                    className="rounded-full img-fluid"
                                    src={
                                      imagen_pequena == null
                                        ? `${urlBase}/images/avatar_docente.jpg`
                                        : `${urlBaseApi}/${imagen_pequena}`
                                    }
                                    alt="Avatar image"
                                  />
                                </div>
                                <span className="dot-status bg-1"></span>
                              </div>
                              <ul className="cart-dropdown-menu after-none p-0 notification-dropdown-menu">
                                <li className="menu-heading-block d-flex align-items-center">
                                  <Link
                                    to={`/usuario/editar`}
                                    className="avatar-sm flex-shrink-0 d-block"
                                  >
                                    <img
                                      className="rounded-full img-fluid"
                                      src={
                                        imagen_pequena == null
                                          ? `${urlBase}/images/avatar_docente.jpg`
                                          : `${urlBaseApi}/${imagen_pequena}`
                                      }
                                      alt="Avatar image"
                                    />
                                  </Link>
                                  <div className="ml-2">
                                    <h4>
                                      <Link
                                        to={`/usuario/editar`}
                                        className="text-black"
                                      >
                                        {nombres}
                                      </Link>
                                    </h4>
                                    <span className="d-block fs-14 lh-20">
                                      {correo}
                                    </span>
                                  </div>
                                </li>
                                <li>
                                  <div className="theme-picker d-flex align-items-center justify-content-center lh-40">
                                    <button
                                      onClick={handleThemeToggle}
                                      className="theme-picker-btn dark-mode-btn w-100 font-weight-semi-bold justify-content-center"
                                      title="Modo oscuro"
                                    >
                                      <svg
                                        className="mr-1"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                      </svg>
                                      Modo oscuro
                                    </button>
                                    <button
                                      onClick={handleThemeToggle}
                                      className="theme-picker-btn light-mode-btn w-100 font-weight-semi-bold justify-content-center"
                                      title="Modo claro"
                                    >
                                      <svg
                                        className="mr-1"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <circle cx="12" cy="12" r="5"></circle>
                                        <line
                                          x1="12"
                                          y1="1"
                                          x2="12"
                                          y2="3"
                                        ></line>
                                        <line
                                          x1="12"
                                          y1="21"
                                          x2="12"
                                          y2="23"
                                        ></line>
                                        <line
                                          x1="4.22"
                                          y1="4.22"
                                          x2="5.64"
                                          y2="5.64"
                                        ></line>
                                        <line
                                          x1="18.36"
                                          y1="18.36"
                                          x2="19.78"
                                          y2="19.78"
                                        ></line>
                                        <line
                                          x1="1"
                                          y1="12"
                                          x2="3"
                                          y2="12"
                                        ></line>
                                        <line
                                          x1="21"
                                          y1="12"
                                          x2="23"
                                          y2="12"
                                        ></line>
                                        <line
                                          x1="4.22"
                                          y1="19.78"
                                          x2="5.64"
                                          y2="18.36"
                                        ></line>
                                        <line
                                          x1="18.36"
                                          y1="5.64"
                                          x2="19.78"
                                          y2="4.22"
                                        ></line>
                                      </svg>
                                      Modo claro
                                    </button>
                                  </div>
                                </li>
                                <li>
                                  <ul className="generic-list-item">
                                    <li>
                                      <Link to="/cursos/matriculados">
                                        <i className="la la-file-video-o mr-1"></i>{" "}
                                        Mis cursos ofertados
                                      </Link>
                                    </li>
                                    {/* <li>
                                                                        <Link to="/carrito">
                                                                            <i className="la la-shopping-basket mr-1"></i> Mi carrito
                                                                        </Link>
                                                                    </li>  */}
                                    <li style={{ display: "none" }}>
                                      <a href="my-courses.html">
                                        <i className="la la-heart-o mr-1"></i>{" "}
                                        My wishlist
                                      </a>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <div className="section-block"></div>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <a href="dashboard.html">
                                        <i className="la la-bell mr-1"></i>{" "}
                                        Notifications
                                        <span className="badge bg-info text-white ml-2 p-1">
                                          9+
                                        </span>
                                      </a>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <a href="dashboard-message.html">
                                        <i className="la la-envelope mr-1"></i>{" "}
                                        Messages
                                        <span className="badge bg-info text-white ml-2 p-1">
                                          12+
                                        </span>
                                      </a>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <div className="section-block"></div>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <a href="dashboard-settings.html">
                                        <i className="la la-gear mr-1"></i>{" "}
                                        Settings
                                      </a>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <a href="dashboard-purchase-history.html">
                                        <i className="la la-history mr-1"></i>{" "}
                                        Purchase history
                                      </a>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <div className="section-block"></div>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <a href="student-detail.html">
                                        <i className="la la-user mr-1"></i>{" "}
                                        Public profile
                                      </a>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <a href="dashboard-settings.html">
                                        <i className="la la-edit mr-1"></i> Edit
                                        profile
                                      </a>
                                    </li>
                                    <li>
                                      <div className="section-block"></div>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <a href="#">
                                        <i className="la la-question mr-1"></i>{" "}
                                        Help
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#" onClick={handleCerrarSesion}>
                                        <i className="la la-power-off mr-1"></i>{" "}
                                        Cerrar sesión
                                      </a>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <div className="section-block"></div>
                                    </li>
                                    <li style={{ display: "none" }}>
                                      <a href="#" className="position-relative">
                                        <span className="fs-17 font-weight-semi-bold d-block">
                                          Aduca for Business
                                        </span>
                                        <span className="lh-20 d-block fs-14 text-gray">
                                          Bring learning to your company
                                        </span>
                                        <span className="position-absolute top-0 right-0 mt-3 mr-3 fs-18 text-gray">
                                          <i className="la la-external-link"></i>
                                        </span>
                                      </a>
                                    </li>
                                  </ul>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="off-canvas-menu custom-scrollbar-styled main-off-canvas-menu">
          <div
            className="off-canvas-menu-close main-menu-close icon-element icon-element-sm shadow-sm"
            data-toggle="tooltip"
            data-placement="left"
            title="Close menu"
          >
            <i className="la la-times"></i>
          </div>
          <h4
            style={{ display: "none" }}
            className="off-canvas-menu-heading pt-90px"
          >
            Alertas
          </h4>
          <ul
            style={{ display: "none" }}
            className="generic-list-item off-canvas-menu-list pt-1 pb-2 border-bottom border-bottom-gray"
          >
            <li>
              <a href="dashboard.html">Notificaciones</a>
            </li>
            <li>
              <a href="dashboard-message.html">Messages</a>
            </li>
            <li>
              <a href="my-courses.html">Wishlist</a>
            </li>
            <li>
              <a href="shopping-cart.html">My cart</a>
            </li>
          </ul>
          <h4 className="off-canvas-menu-heading pt-90px">Cuenta</h4>
          <ul className="generic-list-item off-canvas-menu-list pt-1 pb-2 border-bottom border-bottom-gray">
            <li style={{ display: "none" }}>
              <a href="dashboard-settings.html">Account settings</a>
            </li>
            <li>
              <a
                onClick={() => {
                  handleAbrirLinkMenuPrincipal("/cursos/matriculados");
                }}
              >
                Cursos Ofertados
              </a>
            </li>
            {/*<li><a onClick={()=>{ handleAbrirLinkMenuPrincipal('/cursos/favoritos'); }}>Cursos Favoritos</a></li>*/}
            {/*<li><a onClick={()=>{ handleAbrirLinkMenuPrincipal('/factura/historial'); }}>Historial de compras</a></li>   */}
          </ul>
          <h4 className="off-canvas-menu-heading pt-20px">Perfil</h4>
          <ul className="generic-list-item off-canvas-menu-list pt-1 pb-2 border-bottom border-bottom-gray">
            <li style={{ display: "none" }}>
              <a href="student-detail.html">Public profile</a>
            </li>
            <li>
              <a
                onClick={() => {
                  handleAbrirLinkMenuPrincipal("/usuario/editar");
                }}
              >
                Editar perfil
              </a>
            </li>
            <li>
              <a href="#" onClick={handleCerrarSesion}>
                Cerrar sesión
              </a>
            </li>
          </ul>
          <h4
            style={{ display: "none" }}
            className="off-canvas-menu-heading pt-20px"
          >
            More from Aduca
          </h4>
          <ul
            style={{ display: "none" }}
            className="generic-list-item off-canvas-menu-list pt-1"
          >
            <li>
              <a href="for-business.html">Aduca for Business</a>
            </li>
            <li>
              <a href="#">Get the app</a>
            </li>
            <li>
              <a href="invite.html">Invite friends</a>
            </li>
            <li>
              <a href="contact.html">Help</a>
            </li>
          </ul>
          <div className="theme-picker d-flex align-items-center justify-content-center mt-4 px-3">
            <button
              onClick={handleThemeToggle}
              className="theme-picker-btn dark-mode-btn btn theme-btn-sm theme-btn-white w-100 font-weight-semi-bold justify-content-center"
              title="Dark mode"
            >
              <svg
                className="mr-1"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              Dark Mode
            </button>
            <button
              onClick={handleThemeToggle}
              className="theme-picker-btn light-mode-btn btn theme-btn-sm theme-btn-white w-100 font-weight-semi-bold justify-content-center"
              title="Light mode"
            >
              <svg
                className="mr-1"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              Light Mode
            </button>
          </div>
        </div>
        <div className="off-canvas-menu custom-scrollbar-styled category-off-canvas-menu">
          <div
            className="off-canvas-menu-close cat-menu-close icon-element icon-element-sm shadow-sm"
            data-toggle="tooltip"
            data-placement="left"
            title="Close menu"
          >
            <i className="la la-times"></i>
          </div>
          <h4 className="off-canvas-menu-heading pt-90px">Aprender</h4>
          <ul className="generic-list-item off-canvas-menu-list pt-1 pb-2 border-bottom border-bottom-gray">
            <li>
              <a onClick={handleAbrirMiAprendizaje}>Mi Aprendizaje</a>
            </li>
          </ul>
          <h4 className="off-canvas-menu-heading pt-20px">Categorías</h4>
          <ul className="generic-list-item off-canvas-menu-list pt-1">
            {Object.keys(datos.datos).map((key) => (
              <li key={`menusup-categoria-${datos.datos[key].id}`}>
                <a href="#">
                  {datos.datos[key].nombre}{" "}
                  <button className="sub-nav-toggler" type="button">
                    <i className="la la-angle-down"></i>
                  </button>
                </a>
                {}
                {datos.datos[key].categorias_hijas.length > 0 && (
                  <ul className="sub-menu">
                    {datos.datos[key].categorias_hijas.map((sub_categoria) => {
                      return (
                        <li key={sub_categoria.id}>
                          <Link
                            to={`${urlBase}/categoria/${sub_categoria.url_amigable}`}
                          >
                            {sub_categoria.nombre}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="mobile-search-form">
          <div className="d-flex align-items-center">
            <Buscador class_name={`flex-grow-1 mr-3`} />
            <div className="search-bar-close icon-element icon-element-sm shadow-sm">
              <i className="la la-times"></i>
            </div>
          </div>
        </div>
        <div className="body-overlay"></div>
      </header>
    </>
  );
}

export default DashboardHeader;
