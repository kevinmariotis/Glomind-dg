import React, {useState, useEffect, useContext, lazy} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from '../AuthContext';
import LoadingAnimation from './LoadingAnimation';
import Popup from './Popup';
import SpamError from './SpamError';

function FormularioDetallesDeCurso(){
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API; 
    const urlBase = import.meta.env.VITE_URL_BASE;     
    const {jwt, authenticated} = useContext(AuthContext);
    const { id } = useParams();

    const [datos, setDatos] = useState([]);
    const [breadCrumb, setBreadCrumb] = useState([]);

    useEffect(() => {    
        window.scrollTo(0, 0);
    });

    useEffect(() => {   
        obtenerDatosDelServidor();
    }, []);

    const obtenerDatosDelServidor = async () => {  
        let headers = {}      
        if(authenticated){
            headers = {
                'Authorization':`Bearer ${jwt}`,
            }
        }
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            
            const response = await fetch(`${urlBaseApi}/api/curso/${id}`, opciones);
            if (response.ok) {                                
                const datos = await response.json();                                    
                setDatos(datos.curso);
                
                const datosArbol = datos.arbol;
                let nuevaDataBreadCrumb = [];
                datosArbol.forEach((elemento) => {  nuevaDataBreadCrumb.push({'link':`${urlBase}/categoria/${elemento.id_categoria}/${elemento.nombre}`, 'nombre':elemento.nombre}); });            
                setBreadCrumb(nuevaDataBreadCrumb);

            } else {                
                console.error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const estrellas = [1, 2, 3, 4, 5];

    return (
        <>{datos.length==0 ? <LoadingAnimation /> :
            <section className="breadcrumb-area pt-50px pb-50px bg-white pattern-bg">
                <div className="container">
                    <div className="col-lg-8 mr-auto">
                        <div className="breadcrumb-content">
                            <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                                <li><Link to="/">Home</Link></li>
                                {Object.keys(breadCrumb).slice(0, 5).map((key) => (   
                                    <li key={`breadcrumb${key}`}><Link to={breadCrumb[key].link}>{breadCrumb[key].nombre}</Link></li>                                                             
                                ))} 
                            </ul>
                            <div className="section-heading">
                                <h2 className="section__title">{datos.nombre}</h2>
                                <p className="section__desc pt-2 lh-30">{datos.desc_general_corta}</p>
                            </div>
                            <div className="d-flex flex-wrap align-items-center pt-3">
                                {datos.bestseller==1 && <h6 className="ribbon ribbon-lg mr-2 bg-3 text-white">Bestseller</h6>}
                                {datos.promocionado==1 && <h6 className="ribbon ribbon-lg mr-2 bg-1 text-white">Promocionado</h6>}
                                {datos.gratis==1 && <h6 className="ribbon ribbon-lg mr-2 bg-5 text-white">Gratis</h6>}
                                {datos.alto_valorado==1 && <h6 className="ribbon ribbon-lg mr-2 bg-4 text-white">Mejores reseñas</h6>}
                                {datos.porcentaje_descuento!=0 && <h6 className="ribbon ribbon-lg mr-2 bg-7 text-white">Con descuento</h6>}
                                <div className="rating-wrap d-flex flex-wrap align-items-center">
                                    <div className="review-stars">
                                        <span className="rating-number">{datos.reviews_puntuacion}</span>
                                        {estrellas.map((number) => (                                                                                
                                            <span key={`estrella-curso-detalle-${number}`} className={`la la-star${datos.reviews_puntuacion < number ? "-o" : ""}`}></span>
                                        ))}                                            
                                    </div>
                                    <span className="rating-total pl-1">({datos.reviews_cantidad} reseñas)</span>
                                    <span className="student-total pl-2">{datos.estudiantes_cantidad} estudiantes</span>
                                </div>
                            </div>
                            {datos.id_instructor!=0 && <p className="pt-2 pb-1">Creado por <a href="teacher-detail.html" className="text-color hover-underline">{datos.instructor}</a></p>}
                            <div className="d-flex flex-wrap align-items-center">
                                {datos.ultima_actualizacion!='' && <p className="pr-3 d-flex align-items-center">
                                    <svg className="svg-icon-color-gray mr-1" width="16px" viewBox="0 0 24 24"><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                                    Última actualización {datos.ultima_actualizacion}
                                </p>}
                                <p className="pr-3 d-flex align-items-center">
                                    <svg className="svg-icon-color-gray mr-1" width="16px" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path></svg>
                                    Español
                                </p>
                            </div>
                            <div className="bread-btn-box pt-3">
                                <button className="btn theme-btn theme-btn-sm theme-btn-transparent lh-28 mr-2 mb-2">
                                    <i className="la la-heart-o mr-1"></i>
                                    <span className="swapping-btn" data-text-swap="Wishlisted" data-text-original="Wishlist">Favorito</span>
                                </button>
                                <button className="btn theme-btn theme-btn-sm theme-btn-transparent lh-28 mr-2 mb-2" data-toggle="modal" data-target="#shareModal">
                                    <i className="la la-share mr-1"></i>Compartir
                                </button>
                                <button className="btn theme-btn theme-btn-sm theme-btn-transparent lh-28 mb-2" data-toggle="modal" data-target="#reportModal">
                                    <i className="la la-flag mr-1"></i>Reportar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        }</>

    );
}

export default FormularioDetallesDeCurso;