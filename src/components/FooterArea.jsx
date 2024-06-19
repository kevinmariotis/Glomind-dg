import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { mensajesDeError } from './utils';
import Popup from './Popup';

function FooterArea() {
    const urlBase = import.meta.env.VITE_URL_BASE;    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;

    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});
    const [datos, setDatos] = useState({"datos":{}, "fechahora":0});
    const [email, setEmail] = useState('');

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };


    const handleMostrarPopUpAplicacion = (event) => {        
        event.preventDefault();
        setPopup({...popUp, mostrar:true, titulo:'Aún no disponible', contenido:'Estamos en proceso de creación de la aplicación, inténtalo en unos días o suscríbete a el boletín informativo para saber cuando estará lista :).'});
    };

    const handleSetEmail = (event) => { setEmail(event.target.value); };

    useEffect(() => {
        //miramos si no tiene los datos de categorias del sistema en sessionStorage
        const categoriasistema = sessionStorage.getItem('categoriasistema');    
        if (categoriasistema) {               
            setDatos(JSON.parse(categoriasistema));                          
            if(Math.floor(new Date().getTime()/1000)-parseInt(JSON.parse(categoriasistema).fechahora)>=3600){                
                obtenerCategoriasSistema();
            }
        } else {
            // Los datos no están en la caché local, obtenerlos del servidor            
            obtenerCategoriasSistema();
        }
    }, []);

    const obtenerCategoriasSistema = async () => {        
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
    };

    const handleSuscribirBoletin = async (event) => {
        event.preventDefault();
               
        const formData = new FormData();               
        formData.append('email', email);
        
        const opciones = {
            method: 'POST',            
            body: formData
        };
        
        try {            
            const response = await fetch(`${urlBaseApi}/api/SuscripcionNoticiasExterno`, opciones);            
            const datos = await response.json();            
            if (response.ok){   
                setEmail('');
                setPopup({mostrar:true, titulo:'Listo', contenido:'Suscripción creada correctamente.'});
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    return (
        <>
        <Popup 
            mostrarPopup={popUp.mostrar} 
            tamano="xx"
            tipo={popUp.tipo} 
            titulo={popUp.titulo} 
            mensaje={popUp.contenido} 
            funcionAceptar={handleFuncionAceptarPopUp} 
            funcionCerrar={handleFuncionCerrarPopUp}
            textoCerrar="Cerrar"
        />
        <section className="footer-area pt-100px bg-gray">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 responsive-column-half">
                        <div className="footer-item">
                            <h3 className="fs-20 font-weight-semi-bold pb-2">Empresa</h3>
                            <div className="divider border-bottom-0"><span></span></div>
                            <ul className="generic-list-item">
                                <li><a href="https://americana.edu.co/barranquilla" target="_blank">Acerca de nosotros</a></li>
                                <li><a href="#">Contáctanos</a></li>                                
                                <li><a href="#">Soporte</a></li>
                                <li><a href="#">Preguntas Frecuentes</a></li>                                
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 responsive-column-half">
                        <div className="footer-item">
                            <h3 className="fs-20 font-weight-semi-bold pb-2">Cursos</h3>
                            <div className="divider border-bottom-0"><span></span></div>
                            <ul className="generic-list-item">
                                {Object.keys(datos.datos).map((key) => (
                                    <li key={`menusup-categoria-footer-${datos.datos[key].id}`}>
                                        <Link to={`${urlBase}/categoria/${datos.datos[key].url_amigable}`}>{datos.datos[key].nombre} <button className="sub-nav-toggler" type="button"><i className="la la-angle-down"></i></button></Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 responsive-column-half">
                        <div className="footer-item">
                            <h3 className="fs-20 font-weight-semi-bold pb-2">Descarga la App</h3>
                            <div className="divider border-bottom-0"><span></span></div>
                            <div className="mobile-app">
                                <p className="pb-3 lh-24">Descarga nuestra aplicación móvil y aprende sobre la marcha.</p>                                
                                <a href="#" onClick={handleMostrarPopUpAplicacion} className="d-block hover-s"><img src={`${urlBase}/images/googleplay.png`} alt="Google play store" className="img-fluid" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 responsive-column-half">
                        <div className="footer-item">
                            <h3 className="fs-20 font-weight-semi-bold pb-2">Boletín informativo</h3>
                            <div className="divider border-bottom-0"><span></span></div>
                            <form method="post" className="subscriber-form">
                                <p className="pb-3 lh-24">¿Quiere que le enviemos un correo electrónico sobre ofertas especiales y actualizaciones?</p>
                                <div className="form-group">
                                    <input onChange={handleSetEmail} type="email" name="email" maxLength="64" className="form-control form--control pl-3" placeholder="Escriba su email" />
                                    <button onClick={handleSuscribirBoletin} className="btn theme-btn w-100 mt-3" type="button">Suscribirme <i className="la la-arrow-right icon ml-1"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section-block"></div>
            <div className="copyright-content py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="d-flex flex-wrap align-items-center">
                                <a href="index.html" className="pr-4">
                                    <img src={`${urlBase}/images/educalablogo.png`} alt="footer logo" className="footer__logo" />
                                </a>
                                <p className="copy-desc">Copyright &copy; 2024 <a href="https://google.com.co" target="_blank">Desarrolladores</a></p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end">
                                <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14">
                                    <li className="mr-3"><a href="terms-and-conditions.html">Términos y condiciones</a></li>
                                    <li className="mr-3"><a href="privacy-policy.html">Política de privacidad</a></li>
                                </ul>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>);
}

export default FooterArea;