import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReCAPTCHA from "react-google-recaptcha";

import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import { mensajesDeError } from './utils';


function FormularioHome() {        
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const navigate = useNavigate();            
    const {jwt, authenticated, setCargarContadorCarrito} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});

    const [productos, setProductos] = useState([]);
    const [factura, setFactura] = useState([]);
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    

    const [valorCupon, setValorCupon] = useState('');    

    const handleTogglePassword = () => {
        
    };
             
    useEffect(() => {    
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {    
        if(!mostrarSpinner){
            obtenerDatosDelServidor();
        }
    }, [mostrarSpinner]);
    
    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const obtenerDatosDelServidor = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            
            const response = await fetch(`${urlBaseApi}/api/carrito/1`, opciones);
            const datos = await response.json();
            if (response.ok){                                                                               
                setProductos(datos.productos);
                setFactura(datos.factura);
                if(datos.productos.length==0){
                    setPopup({mostrar:true, titulo:'Sin items', contenido:'En el momento no tienes ningún item en tu carrito de compras, te invitamos a navegar las categorías del sistema para encontrar cursos'});
                }
            } else {                
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const quitarItem = async ({id_curso, tipo_compra}) => {  
        setMostrarSpinner(true); 
                
        const raw = {
            'tipo_compra': tipo_compra.toString(),            
        };
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },    
            body: JSON.stringify(raw),        
        };
        
        try {
            const response = await fetch(`${urlBaseApi}/api/carrito/${id_curso}/0`, opciones);
            const data = await response.json();
            setMostrarSpinner(false);       //al quitar el spinner se recargan los datos            
            setCargarContadorCarrito(true);
            if (response.ok){                                               
                return;
            } else {                           
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch (error) {
            console.error('Error de conexión:', error);
        }       
    };

    const descripcion_tipo_compra = ['', 'Acceso a los videos, las descargas, y las actividades que tuviera el curso (No exámenes).', 'Incluye los exámenes que se hacen a lo largo del curso, incluyendo el exámen final.', 'Posibilidad de descargar el certificado en PDF con QR de validación de autenticidad.'];

    const handleAplicarCupon = async (event) =>{
        event.preventDefault();        
        if(valorCupon!=''){
            event.target.disabled = true;        
            setMostrarSpinner(true);
                                                
            const formData = new FormData();
            formData.append('clave', valorCupon);               
            const opciones = {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`,                    
                },
                body: formData,
            };

            try {
                const response = await fetch(`${urlBaseApi}/api/carrito/aplicarcupon/1`, opciones);
                const data = await response.json();
                setMostrarSpinner(false);   
                event.target.disabled = false;
                if (response.ok){
                    obtenerDatosDelServidor();                        
                    setValorCupon("");
                    setPopup({mostrar:true, titulo:'Listo', contenido:'El cupon ha sido aplicado al carrito, si el carrito cumple las condiciones de precio mínimo, se aplicará automáticamente el cupón.'});
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});  
                }            
            }catch (error) {
                console.error('Error de conexión:', error);
            }      

        }
    }

    return (        
        <>
            {mostrarSpinner && <Spinner />}
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
            <section className="hero-area">
                <div className="hero-slider owl-action-styled">
                    <div className="hero-slider-item hero-bg-1">
                        <div className="container">
                            <div className="hero-content">
                                <div className="section-heading">
                                    <h2 className="section__title text-white fs-65 lh-80 pb-3">We Help You Learn <br/> What You Love</h2>
                                    <p className="section__desc text-white pb-4">Emply dummy text of the printing and typesetting industry orem Ipsum has been the
                                        <br/>industry's standard dummy text ever sinceprinting and typesetting industry.
                                    </p>
                                </div>
                                <div className="hero-btn-box d-flex flex-wrap align-items-center pt-1">
                                    <a href="admission.html" className="btn theme-btn mr-4 mb-4">Join with Us <i className="la la-arrow-right icon ml-1"></i></a>
                                    <a href="#" className="btn-text video-play-btn mb-4" data-fancybox data-src="https://www.youtube.com/watch?v=cRXm1p-CNyk">
                                        Watch Preview<i className="la la-play icon-btn ml-2"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-slider-item hero-bg-2">
                        <div className="container">
                            <div className="hero-content text-center">
                                <div className="section-heading">
                                    <h2 className="section__title text-white fs-65 lh-80 pb-3">Join Aduca & Get <br/> Your Free Courses!</h2>
                                    <p className="section__desc text-white pb-4">Emply dummy text of the printing and typesetting industry orem Ipsum has been the
                                        <br/>industry's standard dummy text ever sinceprinting and typesetting industry.
                                    </p>
                                </div>
                                <div className="hero-btn-box d-flex flex-wrap align-items-center pt-1 justify-content-center">
                                    <a href="admission.html" className="btn theme-btn mr-4 mb-4">Get Started <i className="la la-arrow-right icon ml-1"></i></a>
                                    <a href="#" className="btn-text video-play-btn mb-4" data-fancybox data-src="https://www.youtube.com/watch?v=cRXm1p-CNyk">
                                        Watch Preview<i className="la la-play icon-btn ml-2"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-slider-item hero-bg-3">
                        <div className="container">
                            <div className="hero-content text-right">
                                <div className="section-heading">
                                    <h2 className="section__title text-white fs-65 lh-80 pb-3">Learn Anything, <br/> Anytime, Anywhere</h2>
                                    <p className="section__desc text-white pb-4">Emply dummy text of the printing and typesetting industry orem Ipsum has been the
                                        <br/>industry's standard dummy text ever sinceprinting and typesetting industry.
                                    </p>
                                </div>
                                <div className="hero-btn-box d-flex flex-wrap align-items-center pt-1 justify-content-end">
                                    <a href="#" className="btn-text video-play-btn mr-4 mb-4" data-fancybox data-src="https://www.youtube.com/watch?v=cRXm1p-CNyk">
                                        <i className="la la-play icon-btn mr-2"></i>Watch Preview
                                    </a>
                                    <a href="admission.html" className="btn theme-btn mb-4"><i className="la la-arrow-left icon mr-1"></i>Get Enrolled </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        
        </>
    );
}

export default FormularioHome;