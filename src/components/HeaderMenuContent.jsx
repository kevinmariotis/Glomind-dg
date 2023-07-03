import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mensajesDeError } from './utils';
import Popup from './Popup';
import { AuthContext } from '../AuthContext';

function HeaderMenuContent() {
    const [datos, setDatos] = useState({"datos":{},"fechahora":0});
    const [contadorCarrito, setContadorCarrito] = useState({"contador":0, "productos":{},"fechahora":0});

    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});

    const urlBase = import.meta.env.VITE_URL_BASE;    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const host = window.location.host;
    const {jwt, cargarContadorCarrito, setCargarContadorCarrito, authenticated} = useContext(AuthContext);    

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    useEffect(() => {        
        // Verificar si los datos están almacenados en la caché local
        const categoriasistema = sessionStorage.getItem('categoriasistema');    
        if (categoriasistema) {   
            console.log('las categorias ya estaban guardadas');
            setDatos(JSON.parse(categoriasistema));                          
            if(Math.floor(new Date().getTime()/1000)-parseInt(JSON.parse(categoriasistema).fechahora)>=3600){                
                obtenerDatosDelServidor();
            }
        } else {
            // Los datos no están en la caché local, obtenerlos del servidor
            console.log('las categorias NO existen');
            obtenerDatosDelServidor();
        }

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

    }, []);
    
    //use efect para cargar los datos contadores del carrito
    useEffect(() => {        
        if(cargarContadorCarrito && authenticated){                                    
            obtenerDatosCarrito();            
        }
    }, [cargarContadorCarrito, authenticated]); 

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
                console.log('Categorías recuperadas del servidor:');
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
                            </div>
                            <div className="col-lg-10">
                                <div className="menu-wrapper">
                                    <div className="menu-category">
                                        <ul>
                                            <li>
                                                <Link to="/">Categorías <i className="la la-angle-down fs-12"></i></Link>
                                                <ul className="cat-dropdown-menu">
                                                    {Object.keys(datos.datos).map((key) => (
                                                        <li key={datos.datos[key].id}>
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
                                    <form method="post">
                                        <div className="form-group mb-0">
                                            <input className="form-control form--control pl-3" type="text" name="search" placeholder="Buscar cursos" />
                                            <span className="la la-search search-icon"></span>
                                        </div>
                                    </form>

                                    <div className="shop-cart mr-4">
                                        <ul>
                                            <li>
                                                <Link to="/carrito "className="shop-cart-btn d-flex align-items-center">
                                                    <i className="la la-shopping-cart"></i>
                                                    {authenticated && contadorCarrito.contador>0 && <span className="product-count">{contadorCarrito.contador}</span>}
                                                </Link>
                                                {authenticated && contadorCarrito.contador>0 && <ul className="cart-dropdown-menu">
                                                    {Object.keys(contadorCarrito.productos).slice(0, 3).map((key) => (
                                                        <li key={contadorCarrito.productos[key].id_curso+'tc'+contadorCarrito.productos[key].tipo_compra} className="media media-card">
                                                            <Link to={`/curso/${contadorCarrito.productos[key].url_amigable}`} className="media-img" style={{ height: 'auto' }}>
                                                                {contadorCarrito.productos[key].imagen_pequena!=null ? <img src={`${urlBaseApi}/${contadorCarrito.productos[key].imagen_pequena}`} alt={contadorCarrito.productos[key].nombre} /> : <img src="images/course-no-image.png" alt={contadorCarrito.productos[key].nombre} /> }
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
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="nav-right-button">
                                        <a href="admission.html" className="btn theme-btn d-none d-lg-inline-block"><i className="la la-user-plus mr-1"></i> Admisión</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>    
    );
}

export default HeaderMenuContent;