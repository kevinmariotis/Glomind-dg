import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mensajesDeError } from './utils';
import Popup from './Popup';
import { AuthContext } from '../AuthContext';
import { fijarHeader, clicBuscarMovil, clickMenuCategoriaSistemaMovil, cliclMenuTagsMovil, closeCategoryMenuMovil, closeTagsMenuMovil, setupSubMenu, clickAbrirBarraSuperiorInformativa } from './comun';
import Buscador from './Buscador';

function HeaderMenuContent() {
    const [datos, setDatos] = useState({"datos":{},"fechahora":0});
    const [contadorCarrito, setContadorCarrito] = useState({"contador":0, "productos":{},"fechahora":0});
    const [tags, setTags] = useState({"datos":{}, "fechahora":0});

    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});

    const urlBase = import.meta.env.VITE_URL_BASE;    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, cargarContadorCarrito, setCargarContadorCarrito, cargarTags, setCargarTags, authenticated, esMovil} = useContext(AuthContext);    
    const navigate = useNavigate(); 

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    useEffect(() => {        
        // Verificar si los datos están almacenados en la caché local
        /* Se comentó para anular las categorías que se muestran en la parte superior del sitio
        const categoriasistema = sessionStorage.getItem('categoriasistema');    
        if (categoriasistema) {   
            setDatos(JSON.parse(categoriasistema));                          
            if(Math.floor(new Date().getTime()/1000)-parseInt(JSON.parse(categoriasistema).fechahora)>=3600){                
                obtenerDatosDelServidor();
            }
        } else {
            // Los datos no están en la caché local, obtenerlos del servidor            
            obtenerDatosDelServidor();
        }*/

        //miramos si no tiene los datos del carrito en sessionStorage
        const contadorcarrito = sessionStorage.getItem('contadorcarrito');    
        if (contadorcarrito) {               
            setContadorCarrito(JSON.parse(contadorcarrito));
            if(Math.floor(new Date().getTime()/1000)-parseInt(JSON.parse(contadorcarrito).fechahora)>=3600){                
                setCargarContadorCarrito(true);
            }
        }else{            
            setCargarContadorCarrito(true);
        }


        //miramos si no tiene los datos de los tags
        const dataTags = sessionStorage.getItem('datatags');    
        if (dataTags) {               
            setTags(JSON.parse(dataTags));
            if(Math.floor(new Date().getTime()/1000)-parseInt(JSON.parse(dataTags).fechahora)>=3600){                
                setCargarTags(true);
            }
        }else{            
            setCargarTags(true);
        }
        if(esMovil){            
            clicBuscarMovil();
            clickMenuCategoriaSistemaMovil();
            cliclMenuTagsMovil();        
            clickAbrirBarraSuperiorInformativa();
        }
    }, []);
    
    //use efect para cargar los datos contadores del carrito
    useEffect(() => {        
        if(cargarContadorCarrito && authenticated){                                    
            obtenerDatosCarrito();            
        }
    }, [cargarContadorCarrito, authenticated]); 
    
    //use efect para cargar los datos contadores del carrito
    useEffect(() => {        
        if(cargarTags){                                    
            obtenerTags();            
        }
    }, [cargarTags]); 

    useEffect(() => {                
        setupSubMenu();        
    }, [tags, datos]); 

    
    const handleAbrirCategoriaSistema = (url_amigable) => {        
        closeCategoryMenuMovil();
        navigate(`/categoria/${url_amigable}`);        
    };
    const handleAbrirTag = (url_amigable) => {        
        closeTagsMenuMovil();
        navigate(`/tag/${url_amigable}`);        
    };
    
    /* Se comentó para anular las categorías que se muestran en la parte superior del sitio
    const obtenerDatosDelServidor = async () => {        
        try {            
            const opciones = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',             
                },
            };
                
            const response = await fetch(`${urlBaseApi}/api/categoriasistema/getCategoriasPorPadre/0/1`, opciones);

            if (response.ok) {                                
                const categoriasistema = await response.json();                    
                sessionStorage.setItem('categoriasistema', JSON.stringify({"datos":categoriasistema, "fechahora":Math.floor(new Date().getTime() / 1000)}));
                setDatos({"datos":categoriasistema, "fechahora":Math.floor(new Date().getTime() / 1000)});                                                  
            } else {    
                const data = await response.json();
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                           
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };*/

    const obtenerTags = async () => {        
        try {            
            const opciones = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',             
                },
            };
                
            const response = await fetch(`${urlBaseApi}/api/cursotagagrupacion/getBuscador/1`, opciones);

            if (response.ok) {                                
                const tagssistema = await response.json();                    
                sessionStorage.setItem('datatags', JSON.stringify({"datos":tagssistema, "fechahora":Math.floor(new Date().getTime() / 1000)}));
                setTags({"datos":tagssistema, "fechahora":Math.floor(new Date().getTime() / 1000)});                                                  
            } else {    
                const data = await response.json();
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                           
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

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
            <div className="header-menu-content pr-150px pl-150px bg-white">
                <div className="container-fluid">
                    <div className="main-menu-content">
                        <a href="#" className="down-button"><i className="la la-angle-down"></i></a>
                        <div className="row align-items-center">
                            <div className="col-lg-2">
                                <div className="logo-box">
                                    <Link to="/" className="logo"><img src={`${urlBase}/images/edukalab_logo.png`} alt="logo" /></Link>
                                    <div className="user-btn-action" style={{display:'none'}}>
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
                            </div>
                            <div className="col-lg-10" style={{display:'none'}}>
                                <div className="menu-wrapper">
                                    <div className="menu-category">
                                        <ul>
                                            <li>
                                                <Link to="/">Categorías <i className="la la-angle-down fs-12"></i></Link>
                                                <ul className="cat-dropdown-menu">
                                                    {Object.keys(datos.datos).map((key) => (
                                                        <li key={`menusup-categoria-${datos.datos[key].id}`}>
                                                            <Link to={`${urlBase}/categoria/${datos.datos[key].url_amigable}`}>{datos.datos[key].nombre} {datos.datos[key].categorias_hijas.length > 0 && (<i className="la la-angle-right"></i>)}</Link>
                                                            { }{
                                                                datos.datos[key].categorias_hijas.length > 0 && (
                                                                    <ul className="sub-menu">
                                                                        {datos.datos[key].categorias_hijas.map((sub_categoria) => {                                                                    
                                                                            return <li key={sub_categoria.id}><Link to={`${urlBase}/categoria/${sub_categoria.url_amigable}`}>{sub_categoria.nombre}</Link></li>
                                                                        })}
                                                                    </ul>
                                                                )
                                                            }
                                                        </li>
                                                    ))}                                            
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <Buscador />
                                    {Object.keys(tags.datos).length>0 ? 
                                        <nav className="main-menu">
                                            <ul>
                                                {Object.keys(tags.datos).map((key) => (
                                                    <li key={`menu-tag-agrupacion-${tags.datos[key].id}`}>
                                                        <a href="#">{tags.datos[key].nombre} <i className="la la-angle-down fs-12"></i></a>                                                        
                                                        {tags.datos[key].tags.length > 0 && (
                                                            <ul className="dropdown-menu-item">                                                                
                                                                {tags.datos[key].tags.map((sub_tag) => {       
                                                                    return <li key={`menu-subtag-agrupacion-${sub_tag.id}`} ><Link to={`${urlBase}/tag/${sub_tag.url_amigable}`} href="index.html">{sub_tag.nombre}</Link></li>
                                                                })}
                                                            </ul>
                                                        )}                                                        
                                                    </li>
                                                ))}                                                 
                                            </ul>
                                        </nav> : ''
                                    }   
                                    <div className="shop-cart mr-4">
                                        <ul>
                                            { /*<li>
                                                <Link to="/carrito "className="shop-cart-btn d-flex align-items-center">
                                                    <i className="la la-shopping-cart"></i>
                                                    {authenticated && contadorCarrito.contador>0 && <span className="product-count">{contadorCarrito.contador}</span>}
                                                </Link>
                                                {authenticated && contadorCarrito.contador>0 && <ul className="cart-dropdown-menu">
                                                    {Object.keys(contadorCarrito.productos).slice(0, 3).map((key) => (
                                                        <li key={contadorCarrito.productos[key].id_curso+'tc'+contadorCarrito.productos[key].tipo_compra} className="media media-card">
                                                            <Link to={`/curso/${contadorCarrito.productos[key].url_amigable}`} className="media-img" style={{ height: 'auto' }}>
                                                                {contadorCarrito.productos[key].imagen_pequena!=null ? <img src={`${urlBaseApi}/${contadorCarrito.productos[key].imagen_pequena}`} alt={contadorCarrito.productos[key].nombre} /> : <img src="/images/course-no-image.png" alt={contadorCarrito.productos[key].nombre} /> }
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
                                                    <li className="media media-card">
                                                        <div className="media-body fs-16">
                                                            <p className="text-black font-weight-semi-bold lh-18">Total: <span className="cart-total">${contadorCarrito.total}</span></p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <Link to="/carrito" className="btn theme-btn w-100">Ir al carrito <i className="la la-arrow-right icon ml-1"></i></Link>
                                                    </li>
                                                </ul>}
                                            </li> */ }
                                        </ul>
                                    </div>
                                    <div className="nav-right-button">
                                        <Link to={`/signup`} className="btn theme-btn d-none d-lg-inline-block"><i className="la la-user-plus mr-1"></i> Admisión</Link>
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
                <ul className="generic-list-item off-canvas-menu-list pt-90px">
                    {Object.keys(tags.datos).map((key) => (
                        <li key={`menu-tag-agrupacion-movil-${tags.datos[key].id}`}>
                            <a href="#">{tags.datos[key].nombre} <button className="sub-nav-toggler" type="button"><i className="la la-angle-down"></i></button></a>                                                        
                            {tags.datos[key].tags.length > 0 && (
                                <ul className="sub-menu">                                                                
                                    {tags.datos[key].tags.map((sub_tag) => {       
                                        return <li key={`menu-subtag-agrupacion-movil-${sub_tag.id}`} ><a onClick={()=>{ handleAbrirTag(sub_tag.url_amigable); }} >{sub_tag.nombre}</a></li>
                                    })}
                                </ul>
                            )}                                                        
                        </li>
                    ))}
                </ul>
            </div>
            <div className="off-canvas-menu custom-scrollbar-styled category-off-canvas-menu">
                <div className="off-canvas-menu-close cat-menu-close icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="left" title="Close menu">
                    <i className="la la-times"></i>
                </div>
                <ul className="generic-list-item off-canvas-menu-list pt-90px">
                    {Object.keys(datos.datos).map((key) => (
                        <li key={`menu-sum-movil-categoria-${datos.datos[key].id}`}>
                            <a href="#">{datos.datos[key].nombre} <button className="sub-nav-toggler" type="button"><i className="la la-angle-down"></i></button></a>
                            { }{
                                datos.datos[key].categorias_hijas.length > 0 && (
                                    <ul className="sub-menu">
                                        {datos.datos[key].categorias_hijas.map((sub_categoria) => {                                                                    
                                            return <li key={`submenu-categoria-${sub_categoria.id}`}><a onClick={()=>{ handleAbrirCategoriaSistema(sub_categoria.url_amigable); }} >{sub_categoria.nombre}</a></li>
                                        })}
                                    </ul>
                                )
                            }
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

        </>    
    );
}

export default HeaderMenuContent;