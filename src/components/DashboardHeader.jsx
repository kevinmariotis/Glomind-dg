import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Popup from './Popup';


function DashboardHeader() {  
    const urlBase = import.meta.env.VITE_URL_BASE;    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
    const {jwt, cargarContadorCarrito, setCargarContadorCarrito, authenticated, nombres, correo, imagen_pequena, temaActual, setTemaActual} = useContext(AuthContext);

    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});
    const [contadorCarrito, setContadorCarrito] = useState({"contador":0, "productos":{},"fechahora":0});
    const [misCursos, setMisCursos] = useState({});    
    const [favoritos, setFavoritos] = useState({});

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const handleThemeToggle = () => {
        if(temaActual==1){
            setTemaActual(0);
        }else{
            setTemaActual(1);
        }
    }

    useEffect(() => {                
        //miramos si no tiene los datos del carrito en sessionStorage
        const contadorcarrito = sessionStorage.getItem('contadorcarrito');    
        if (contadorcarrito) {   
            console.log('El contador de productos de carrito ya existia');
            setContadorCarrito(JSON.parse(contadorcarrito));
            if(Math.floor(new Date().getTime()/1000)-parseInt(JSON.parse(contadorcarrito).fechahora)>=3600){                
                setCargarContadorCarrito(true);
            }
        }else{            
            setCargarContadorCarrito(true);
        }
        obtenerFavoritos();
    }, []);

    //use efect para cargar los datos contadores del carrito
    useEffect(() => {        
        if(cargarContadorCarrito && authenticated){                                    
            obtenerDatosCarrito();            
            obtenerMisCursos();            
        }
    }, [cargarContadorCarrito, authenticated]);


    const obtenerDatosCarrito = async () => {
        try {            
            const opciones = {
                method: 'GET',
                headers: {                   
                    'Authorization':`Bearer ${jwt}`,                   
                },
            };
                
            const response = await fetch(`${urlBaseApi}/api/carrito/1`, opciones);

            if (response.ok) {                
                console.log('Contador carrito recuperado del servidor:');
                const contadorcarrito = await response.json();                    
                const tamanocarrito = contadorcarrito.productos.length;
                sessionStorage.setItem('contadorcarrito', JSON.stringify({"contador":tamanocarrito, "productos":contadorcarrito.productos, "total":contadorcarrito.factura.total, "fechahora":Math.floor(new Date().getTime() / 1000)}));                
                setContadorCarrito({"contador":tamanocarrito, "productos":contadorcarrito.productos, "total":contadorcarrito.factura.total, "fechahora":Math.floor(new Date().getTime() / 1000)});                                                  
                setCargarContadorCarrito(false);
            } else {                
                setCargarContadorCarrito(false);
                const data = await response.json();
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerMisCursos = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try { 
            //buscamos los datos de los cursos a mostrar                       
            const opciones = {
                method: 'GET',
                headers: headers,
            };                                    
            const response = await fetch(`${urlBaseApi}/api/usuario/miscursos/1/1/nombre-asc/3`, opciones);            
            if (response.ok){   
                const datos = await response.json();
                setMisCursos(datos.cursos);
            } else {     
                const datos = await response.json();            
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }                          
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerFavoritos = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try { 
            //buscamos los datos de los cursos a mostrar                       
            const opciones = {
                method: 'GET',
                headers: headers,
            };                                    
            const response = await fetch(`${urlBaseApi}/api/usuario/getfavoritos/1/2/nombre-asc/3`, opciones);  //favoritos no comprados           
            if (response.ok){   
                const datos = await response.json();
                setFavoritos(datos.cursos);
            } else {     
                const datos = await response2.json();            
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }                          
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
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
            <div className="header-menu-content dashboard-menu-content pr-30px pl-30px bg-white shadow-sm">
                <div className="container-fluid">
                    <div className="main-menu-content">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <div className="logo-box logo--box">
                                    <Link to="/" className="logo"><img src={`${urlBase}/images/myedulogo-transparente_2.png`} alt="logo" /></Link>
                                    <div className="user-btn-action">
                                        <div className="search-menu-toggle icon-element icon-element-sm shadow-sm mr-2" data-toggle="tooltip" data-placement="top" title="Search">
                                            <i className="la la-search"></i>
                                        </div>
                                        <div className="off-canvas-menu-toggle cat-menu-toggle icon-element icon-element-sm shadow-sm mr-2" data-toggle="tooltip" data-placement="top" title="Category menu">
                                            <i className="la la-th-large"></i>
                                        </div>
                                        <div className="off-canvas-menu-toggle main-menu-toggle icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="top" title="Main menu">
                                            <i className="la la-bars"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="menu-wrapper">
                                    <form method="post" className="mr-auto ml-0">
                                        <div className="form-group mb-0">
                                            <input className="form-control form--control form--control-gray pl-3" type="text" name="search" placeholder="Buscar curso" />
                                            <span className="la la-search search-icon"></span>
                                        </div>
                                    </form>
                                    <div className="nav-right-button d-flex align-items-center">
                                        <div className="user-action-wrap d-flex align-items-center">
                                            <div className="shop-cart course-cart pr-3 mr-3 border-right border-right-gray">
                                                <ul>
                                                    <li>
                                                        <p className="shop-cart-btn d-flex align-items-center fs-16">
                                                            Mis cursos
                                                            <span className="la la-angle-down fs-13 ml-1"></span>
                                                        </p>
                                                        {Object.keys(misCursos).length>0 && <ul className="cart-dropdown-menu after-none">
                                                            {Object.keys(misCursos).slice(0, 3).map((key) => (
                                                                <li key={misCursos[key].id+'mis-cursos'} className="media media-card">
                                                                    <Link to={`/vercurso/${misCursos[key].url_amigable}`} className="media-img" style={{ height: 'auto' }}>
                                                                        {misCursos[key].imagen_pequena!=null ? <img src={`${urlBaseApi}/${misCursos[key].imagen_pequena}`} alt={misCursos[key].nombre} /> : <img src="images/course-no-image.png" alt={misCursos[key].nombre} /> }
                                                                    </Link>
                                                                    <div className="media-body">
                                                                        <h5><Link to={`/vercurso/${misCursos[key].url_amigable}`}>{misCursos[key].nombre}</Link></h5>
                                                                        <div className="skillbar-box pt-3">
                                                                            <div className="skillbar skillbar-skillbar" data-percent="36%">
                                                                                <div className="skillbar-bar skillbar--bar bg-1" style={{width:`${misCursos[key].porcentaje_progreso}%`}}></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                             ))}                                                                 
                                                            {Object.keys(misCursos).length>3 && <li>
                                                                <Link to="/cursos-matriculados" className="btn theme-btn w-100">Ver todos mis cursos <i className="la la-arrow-right icon ml-1"></i></Link>
                                                            </li>}
                                                        </ul>}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="shop-cart pr-3 mr-3 border-right border-right-gray">
                                                <ul>
                                                    <li>
                                                        <p className="shop-cart-btn d-flex align-items-center">
                                                            <i className="la la-shopping-cart fs-22"></i>
                                                            {Object.keys(contadorCarrito.productos).length>0 &&
                                                                <span className="dot-status bg-1"></span>
                                                            }
                                                        </p>
                                                        {authenticated && contadorCarrito.contador>0 && <ul className="cart-dropdown-menu after-none">
                                                            {Object.keys(contadorCarrito.productos).slice(0, 3).map((key) => (
                                                                <li className="media media-card">
                                                                    <Link to={`/curso/${contadorCarrito.productos[key].url_amigable}`} className="media-img" style={{ height: 'auto' }}>
                                                                        {contadorCarrito.productos[key].imagen_pequena!=null ? <img src={`${urlBaseApi}/${contadorCarrito.productos[key].imagen_pequena}`} alt={contadorCarrito.productos[key].nombre} className="mr-3" /> : <img src="images/course-no-image.png" alt={contadorCarrito.productos[key].nombre} className="mr-3" /> }
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
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="shop-cart wishlist-cart pr-3 mr-3 border-right border-right-gray">
                                                <ul>
                                                    <li>
                                                        <p className="shop-cart-btn">
                                                            <i className="la la-heart-o"></i>
                                                            {Object.keys(favoritos).length>0 &&
                                                                <span className="dot-status bg-1"></span>
                                                            }
                                                        </p>
                                                        {authenticated && Object.keys(favoritos).length>0 && <ul className="cart-dropdown-menu after-none">
                                                            {Object.keys(favoritos).slice(0, 3).map((key) => (
                                                                <li>
                                                                    <div className="media media-card">
                                                                        <Link to={`/curso/${favoritos[key].url_amigable}`} className="media-img">
                                                                            <img className="mr-3" src="images/small-img.jpg" alt="Cart image" />
                                                                        </Link>
                                                                        <div className="media-body">
                                                                            <h5><Link to={`/curso/${favoritos[key].url_amigable}`}>{favoritos[key].nombre}</Link></h5>
                                                                            {favoritos[key].instructor!='' && <span className="d-block lh-18 py-1">{favoritos[key].instructor}</span>}
                                                                            <p className="text-black font-weight-semi-bold lh-18">${favoritos[key].precio_actual} {favoritos[key].precio_anterior!=0 && <span className="before-price fs-14">${favoritos[key].precio_anterior}</span>}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Link to={`/curso/${favoritos[key].url_amigable}`} className="btn theme-btn theme-btn-sm theme-btn-transparent lh-28 w-100 mt-3">Agregar al carrito <i className="la la-arrow-right icon ml-1"></i></Link>
                                                                </li>
                                                            ))}                                                            
                                                            <li>
                                                                <a href="my-courses.html" className="btn theme-btn w-100">Ver mi lista de deseos <i className="la la-arrow-right icon ml-1"></i></a>
                                                            </li>
                                                        </ul>}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="shop-cart notification-cart pr-3 mr-3 border-right border-right-gray" style={{ display: 'none' }}>
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
                                                                    <a href="dashboard.html" className="media media-card align-items-center">
                                                                        <div className="icon-element icon-element-sm flex-shrink-0 bg-1 mr-3 text-white">
                                                                            <i className="la la-bolt"></i>
                                                                        </div>
                                                                        <div className="media-body">
                                                                            <h5>Your resume updated!</h5>
                                                                            <span className="d-block lh-18 pt-1 text-gray fs-13">1 hour ago</span>
                                                                        </div>
                                                                    </a>
                                                                    <a href="dashboard.html" className="media media-card align-items-center">
                                                                        <div className="icon-element icon-element-sm flex-shrink-0 bg-2 mr-3 text-white">
                                                                            <i className="la la-lock"></i>
                                                                        </div>
                                                                        <div className="media-body">
                                                                            <h5>You changed password</h5>
                                                                            <span className="d-block lh-18 pt-1 text-gray fs-13">November 12, 2019</span>
                                                                        </div>
                                                                    </a>
                                                                    <a href="dashboard.html" className="media media-card align-items-center">
                                                                        <div className="icon-element icon-element-sm flex-shrink-0 bg-3 mr-3 text-white">
                                                                            <i className="la la-user"></i>
                                                                        </div>
                                                                        <div className="media-body">
                                                                            <h5>Your account has been created successfully</h5>
                                                                            <span className="d-block lh-18 pt-1 text-gray fs-13">November 12, 2019</span>
                                                                        </div>
                                                                    </a>
                                                                </div>
                                                            </li>
                                                            <li className="menu-heading-block">
                                                                <a href="dashboard.html" className="btn theme-btn w-100">Show All Notifications <i className="la la-arrow-right icon ml-1"></i></a>
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
                                                                <img className="rounded-full img-fluid" src={imagen_pequena=='' ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${imagen_pequena}`} alt="Avatar image" />
                                                            </div>
                                                            <span className="dot-status bg-1"></span>
                                                        </div>
                                                        <ul className="cart-dropdown-menu after-none p-0 notification-dropdown-menu">
                                                            <li className="menu-heading-block d-flex align-items-center">
                                                                <a href="teacher-detail.html" className="avatar-sm flex-shrink-0 d-block">
                                                                    <img className="rounded-full img-fluid" src={imagen_pequena=='' ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${imagen_pequena}`} alt="Avatar image" />
                                                                </a>
                                                                <div className="ml-2">
                                                                    <h4><a href="teacher-detail.html" className="text-black">{nombres}</a></h4>
                                                                    <span className="d-block fs-14 lh-20">{correo}</span>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="theme-picker d-flex align-items-center justify-content-center lh-40">
                                                                    <button onClick={handleThemeToggle} className="theme-picker-btn dark-mode-btn w-100 font-weight-semi-bold justify-content-center" title="Modo oscuro">
                                                                        <svg className="mr-1" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                                                        </svg>
                                                                        Modo oscuro
                                                                    </button>
                                                                    <button onClick={handleThemeToggle} className="theme-picker-btn light-mode-btn w-100 font-weight-semi-bold justify-content-center" title="Modo claro">
                                                                        <svg className="mr-1" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
                                                                        Modo claro
                                                                    </button>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <ul className="generic-list-item">
                                                                    <li>
                                                                        <Link to="/cursos-matriculados">
                                                                            <i className="la la-file-video-o mr-1"></i> Mis cursos matriculados
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <Link to="/carrito">
                                                                            <i className="la la-shopping-basket mr-1"></i> Mi carrito
                                                                        </Link>
                                                                    </li>
                                                                    <li style={{ display: 'none' }}>
                                                                        <a href="my-courses.html">
                                                                            <i className="la la-heart-o mr-1"></i> My wishlist
                                                                        </a>
                                                                    </li>
                                                                    <li style={{ display: 'none' }}><div className="section-block"></div></li>
                                                                    <li style={{ display: 'none' }}>
                                                                        <a href="dashboard.html">
                                                                            <i className="la la-bell mr-1"></i> Notifications
                                                                            <span className="badge bg-info text-white ml-2 p-1">9+</span>
                                                                        </a>
                                                                    </li>
                                                                    <li style={{ display: 'none' }}>
                                                                        <a href="dashboard-message.html">
                                                                            <i className="la la-envelope mr-1"></i> Messages
                                                                            <span className="badge bg-info text-white ml-2 p-1">12+</span>
                                                                        </a>
                                                                    </li>
                                                                    <li style={{ display: 'none' }}><div className="section-block"></div></li>
                                                                    <li style={{ display: 'none' }}>
                                                                        <a href="dashboard-settings.html">
                                                                            <i className="la la-gear mr-1"></i> Settings
                                                                        </a>
                                                                    </li>
                                                                    <li style={{ display: 'none' }}>
                                                                        <a href="dashboard-purchase-history.html">
                                                                            <i className="la la-history mr-1"></i> Purchase history
                                                                        </a>
                                                                    </li>
                                                                    <li style={{ display: 'none' }}><div className="section-block"></div></li>
                                                                    <li style={{ display: 'none' }}>
                                                                        <a href="student-detail.html">
                                                                            <i className="la la-user mr-1"></i> Public profile
                                                                        </a>
                                                                    </li>
                                                                    <li style={{ display: 'none' }}>
                                                                        <a href="dashboard-settings.html">
                                                                            <i className="la la-edit mr-1"></i> Edit profile
                                                                        </a>
                                                                    </li>
                                                                    <li><div className="section-block"></div></li>
                                                                    <li style={{ display: 'none' }}>
                                                                        <a href="#">
                                                                            <i className="la la-question mr-1"></i> Help
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="index.html">
                                                                            <i className="la la-power-off mr-1"></i> Cerrar sesión
                                                                        </a>
                                                                    </li>
                                                                    <li style={{ display: 'none' }}><div className="section-block"></div></li>
                                                                    <li style={{ display: 'none' }}>
                                                                        <a href="#" className="position-relative">
                                                                            <span className="fs-17 font-weight-semi-bold d-block">Aduca for Business</span>
                                                                            <span className="lh-20 d-block fs-14 text-gray">Bring learning to your company</span>
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
                <div className="off-canvas-menu-close main-menu-close icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="left" title="Close menu">
                    <i className="la la-times"></i>
                </div>
                <h4 className="off-canvas-menu-heading pt-90px">Alerts</h4>
                <ul className="generic-list-item off-canvas-menu-list pt-1 pb-2 border-bottom border-bottom-gray">
                    <li><a href="dashboard.html">Notifications</a></li>
                    <li><a href="dashboard-message.html">Messages</a></li>
                    <li><a href="my-courses.html">Wishlist</a></li>
                    <li><a href="shopping-cart.html">My cart</a></li>
                </ul>
                <h4 className="off-canvas-menu-heading pt-20px">Account</h4>
                <ul className="generic-list-item off-canvas-menu-list pt-1 pb-2 border-bottom border-bottom-gray">
                    <li><a href="dashboard-settings.html">Account settings</a></li>
                    <li><a href="dashboard-purchase-history.html">Purchase history</a></li>
                </ul>
                <h4 className="off-canvas-menu-heading pt-20px">Profile</h4>
                <ul className="generic-list-item off-canvas-menu-list pt-1 pb-2 border-bottom border-bottom-gray">
                    <li><a href="student-detail.html">Public profile</a></li>
                    <li><a href="dashboard-settings.html">Edit profile</a></li>
                    <li><a href="index.html">Log out</a></li>
                </ul>
                <h4 className="off-canvas-menu-heading pt-20px">More from Aduca</h4>
                <ul className="generic-list-item off-canvas-menu-list pt-1">
                    <li><a href="for-business.html">Aduca for Business</a></li>
                    <li><a href="#">Get the app</a></li>
                    <li><a href="invite.html">Invite friends</a></li>
                    <li><a href="contact.html">Help</a></li>
                </ul>
                <div className="theme-picker d-flex align-items-center justify-content-center mt-4 px-3">
                    <button className="theme-picker-btn dark-mode-btn btn theme-btn-sm theme-btn-white w-100 font-weight-semi-bold justify-content-center" title="Dark mode">
                        <svg className="mr-1" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                        Dark Mode
                    </button>
                    <button className="theme-picker-btn light-mode-btn btn theme-btn-sm theme-btn-white w-100 font-weight-semi-bold justify-content-center" title="Light mode">
                        <svg className="mr-1" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
                <div className="off-canvas-menu-close cat-menu-close icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="left" title="Close menu">
                    <i className="la la-times"></i>
                </div>
                <h4 className="off-canvas-menu-heading pt-90px">Learn</h4>
                <ul className="generic-list-item off-canvas-menu-list pt-1 pb-2 border-bottom border-bottom-gray">
                    <li><a href="my-courses.html">My learning</a></li>
                </ul>
                <h4 className="off-canvas-menu-heading pt-20px">Categories</h4>
                <ul className="generic-list-item off-canvas-menu-list pt-1">
                    <li>
                        <a href="course-grid.html">Development</a>
                        <ul className="sub-menu">
                            <li><a href="#">All Development</a></li>
                            <li><a href="#">Web Development</a></li>
                            <li><a href="#">Mobile Apps</a></li>
                            <li><a href="#">Game Development</a></li>
                            <li><a href="#">Databases</a></li>
                            <li><a href="#">Programming Languages</a></li>
                            <li><a href="#">Software Testing</a></li>
                            <li><a href="#">Software Engineering</a></li>
                            <li><a href="#">E-Commerce</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="course-grid.html">business</a>
                        <ul className="sub-menu">
                            <li><a href="#">All Business</a></li>
                            <li><a href="#">Finance</a></li>
                            <li><a href="#">Entrepreneurship</a></li>
                            <li><a href="#">Strategy</a></li>
                            <li><a href="#">Real Estate</a></li>
                            <li><a href="#">Home Business</a></li>
                            <li><a href="#">Communications</a></li>
                            <li><a href="#">Industry</a></li>
                            <li><a href="#">Other</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="course-grid.html">IT & Software</a>
                        <ul className="sub-menu">
                            <li><a href="#">All IT & Software</a></li>
                            <li><a href="#">IT Certification</a></li>
                            <li><a href="#">Hardware</a></li>
                            <li><a href="#">Network & Security</a></li>
                            <li><a href="#">Operating Systems</a></li>
                            <li><a href="#">Other</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="course-grid.html">Finance & Accounting</a>
                        <ul className="sub-menu">
                            <li><a href="#"> All Finance & Accounting</a></li>
                            <li><a href="#">Accounting & Bookkeeping</a></li>
                            <li><a href="#">Cryptocurrency & Blockchain</a></li>
                            <li><a href="#">Economics</a></li>
                            <li><a href="#">Investing & Trading</a></li>
                            <li><a href="#">Other Finance & Economics</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="course-grid.html">design</a>
                        <ul className="sub-menu">
                            <li><a href="#">All Design</a></li>
                            <li><a href="#">Graphic Design</a></li>
                            <li><a href="#">Web Design</a></li>
                            <li><a href="#">Design Tools</a></li>
                            <li><a href="#">3D & Animation</a></li>
                            <li><a href="#">User Experience</a></li>
                            <li><a href="#">Other</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="course-grid.html">Personal Development</a>
                        <ul className="sub-menu">
                            <li><a href="#">All Personal Development</a></li>
                            <li><a href="#">Personal Transformation</a></li>
                            <li><a href="#">Productivity</a></li>
                            <li><a href="#">Leadership</a></li>
                            <li><a href="#">Personal Finance</a></li>
                            <li><a href="#">Career Development</a></li>
                            <li><a href="#">Parenting & Relationships</a></li>
                            <li><a href="#">Happiness</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="course-grid.html">Marketing</a>
                        <ul className="sub-menu">
                            <li><a href="#">All Marketing</a></li>
                            <li><a href="#">Digital Marketing</a></li>
                            <li><a href="#">Search Engine Optimization</a></li>
                            <li><a href="#">Social Media Marketing</a></li>
                            <li><a href="#">Branding</a></li>
                            <li><a href="#">Video & Mobile Marketing</a></li>
                            <li><a href="#">Affiliate Marketing</a></li>
                            <li><a href="#">Growth Hacking</a></li>
                            <li><a href="#">Other</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="course-grid.html">Health & Fitness</a>
                        <ul className="sub-menu">
                            <li><a href="#">All Health & Fitness</a></li>
                            <li><a href="#">Fitness</a></li>
                            <li><a href="#">Sports</a></li>
                            <li><a href="#">Dieting</a></li>
                            <li><a href="#">Self Defense</a></li>
                            <li><a href="#">Meditation</a></li>
                            <li><a href="#">Mental Health</a></li>
                            <li><a href="#">Yoga</a></li>
                            <li><a href="#">Dance</a></li>
                            <li><a href="#">Other</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="course-grid.html">Photography</a>
                        <ul className="sub-menu">
                            <li><a href="#">All Photography</a></li>
                            <li><a href="#">Digital Photography</a></li>
                            <li><a href="#">Photography Fundamentals</a></li>
                            <li><a href="#">Commercial Photography</a></li>
                            <li><a href="#">Video Design</a></li>
                            <li><a href="#">Photography Tools</a></li>
                            <li><a href="#">Other</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="mobile-search-form">
                <div className="d-flex align-items-center">
                    <form method="post" className="flex-grow-1 mr-3">
                        <div className="form-group mb-0">
                            <input className="form-control form--control pl-3" type="text" name="search" placeholder="Buscar curso" />
                            <span className="la la-search search-icon"></span>
                        </div>
                    </form>
                    <div className="search-bar-close icon-element icon-element-sm shadow-sm">
                        <i className="la la-times"></i>
                    </div>
                </div>
            </div>
            <div className="body-overlay"></div>
        </header>
        </>
    )
}

export default DashboardHeader;