import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mensajesDeError } from './utils';
import Popup from './Popup';
import { AuthContext } from '../AuthContext';
import { fijarHeader, clicBuscarMovil } from './comun';
import Buscador from './Buscador';

function HeaderMenuContent() {
    const [datos, setDatos] = useState({"datos":{},"fechahora":0});
    const [contadorCarrito, setContadorCarrito] = useState({"contador":0, "productos":{},"fechahora":0});
    const [tags, setTags] = useState({"datos":{}, "fechahora":0});

    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});

    const urlBase = import.meta.env.VITE_URL_BASE;    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, cargarContadorCarrito, setCargarContadorCarrito, cargarTags, setCargarTags, authenticated} = useContext(AuthContext);    

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


        //miramos si no tiene los datos de los tags
        const dataTags = sessionStorage.getItem('datatags');    
        if (dataTags) {   
            console.log('Los tags ta existían');
            setTags(JSON.parse(dataTags));
            if(Math.floor(new Date().getTime()/1000)-parseInt(JSON.parse(dataTags).fechahora)>=3600){                
                setCargarTags(true);
            }
        }else{            
            setCargarTags(true);
        }

        clicBuscarMovil();
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
                console.log('Tags recuperados del servidor:');
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
                                            <li>
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

            <div className="off-canvas-menu custom-scrollbar-styled main-off-canvas-menu">
                <div className="off-canvas-menu-close main-menu-close icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="left" title="Close menu">
                    <i className="la la-times"></i>
                </div>
                <ul className="generic-list-item off-canvas-menu-list pt-90px">
                    <li>
                        <a href="#">Home</a>
                        <ul className="sub-menu">
                            <li><a href="index.html">Home One</a></li>
                            <li><a href="home-2.html">Home Two</a></li>
                            <li><a href="home-3.html">Home Three</a></li>
                            <li><a href="home-4.html">Home four</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">courses</a>
                        <ul className="sub-menu">
                            <li><a href="course-grid.html">course grid</a></li>
                            <li><a href="course-list.html">course list</a></li>
                            <li><a href="course-grid-left-sidebar.html">grid left sidebar</a></li>
                            <li><a href="course-grid-right-sidebar.html">grid right sidebar</a></li>
                            <li><a href="course-list-left-sidebar.html">list left sidebar <span className="ribbon ribbon-blue-bg">New</span></a></li>
                            <li><a href="course-list-right-sidebar.html">list right sidebar <span className="ribbon ribbon-blue-bg">New</span></a></li>
                            <li><a href="course-details.html">course details</a></li>
                            <li><a href="lesson-details.html">lesson details</a></li>
                            <li><a href="my-courses.html">My courses</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Student</a>
                        <ul className="sub-menu">
                            <li><a href="student-detail.html">student detail</a></li>
                            <li><a href="student-quiz.html">take quiz</a></li>
                            <li><a href="student-quiz-results.html">quiz results</a></li>
                            <li><a href="student-quiz-result-details.html">quiz details</a></li>
                            <li><a href="student-quiz-result-details-2.html">quiz details 2</a></li>
                            <li><a href="student-path.html">path details</a></li>
                            <li><a href="student-path-assessment.html">Skill Assessment</a></li>
                            <li><a href="student-path-assessment-result.html">Skill result</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">pages</a>
                        <ul className="sub-menu">
                            <li><a href="dashboard.html">dashboard <span className="ribbon">Hot</span></a></li>
                            <li><a href="about.html">about</a></li>
                            <li><a href="teachers.html">Teachers</a></li>
                            <li><a href="teacher-detail.html">Teacher detail</a></li>
                            <li><a href="careers.html">careers</a></li>
                            <li><a href="career-details.html">career details</a></li>
                            <li><a href="categories.html">categories</a></li>
                            <li><a href="terms-and-conditions.html">Terms & conditions</a></li>
                            <li><a href="privacy-policy.html">privacy policy</a></li>
                            <li><a href="for-business.html">for business</a></li>
                            <li><a href="become-a-teacher.html">become an instructor</a></li>
                            <li><a href="faq.html">FAQs</a></li>
                            <li><a href="admission.html">admission</a></li>
                            <li><a href="gallery.html">gallery</a></li>
                            <li><a href="pricing-table.html">pricing tables</a></li>
                            <li><a href="contact.html">contact</a></li>
                            <li><a href="sign-up.html">sign-up</a></li>
                            <li><a href="login.html">login</a></li>
                            <li><a href="recover.html">recover</a></li>
                            <li><a href="shopping-cart.html">cart</a></li>
                            <li><a href="checkout.html">checkout</a></li>
                            <li><a href="error.html">page 404</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">blog</a>
                        <ul className="sub-menu">
                            <li><a href="blog-full-width.html">blog full width </a></li>
                            <li><a href="blog-no-sidebar.html">blog no sidebar</a></li>
                            <li><a href="blog-left-sidebar.html">blog left sidebar</a></li>
                            <li><a href="blog-right-sidebar.html">blog right sidebar</a></li>
                            <li><a href="blog-single.html">blog detail</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="off-canvas-menu custom-scrollbar-styled category-off-canvas-menu">
                <div className="off-canvas-menu-close cat-menu-close icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="left" title="Close menu">
                    <i className="la la-times"></i>
                </div>
                <ul className="generic-list-item off-canvas-menu-list pt-90px">
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
                            <input className="form-control form--control pl-3" type="text" name="search" placeholder="Search for anything" />
                            <span className="la la-search search-icon"></span>
                        </div>
                    </form>
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