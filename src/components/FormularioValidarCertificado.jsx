import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';
import Popup from './Popup';
import { mensajesDeError } from './utils';


function FormularioValidarCertificado() {        
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const { codigo_registro } = useParams();    
    const {jwt, authenticated, setCargarContadorCarrito} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});

    const [certificado, setCertificado] = useState([]);
    const [estadoBusqueda, setEstadoBusqueda] = useState(-1);       //-1 buscando, 1 validado, 2 invalido
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
                 
    useEffect(() => {    
        window.scrollTo(0, 0);        
    }, []);
    
    useEffect(() => {    
        if(codigo_registro!=''){
            setTimeout(obtenerDatosDelServidor, 2000);
            
        }
    }, [codigo_registro]);
    
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
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/certificado/validar/${codigo_registro}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();
            if (response.ok){          
                setCertificado(datos);                                                                     
                setEstadoBusqueda(1);                
            } else {                
                setEstadoBusqueda(2);
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
            
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
            <section className="error-area section--padding dot-bg overflow-hidden">
                <div className="container">
                    <div className="col-lg-7 mx-auto">
                        <div className="error-content text-center">
                            {estadoBusqueda==1 ?
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 32 40" enableBackground="new 0 0 32 32" xmlSpace="preserve"><g><rect fill="none" width="32" height="32"/></g><g><g><path d="M5,1v30h22V1H5z M25,29H7V3h18V29z"/></g><g><polygon points="23.07,11.41 13.5,20.98 12.09,19.57 13.5,18.15 21.66,10   "/></g><g><polygon points="14.91,19.57 13.5,20.98 8.93,16.41 10.34,15 13.5,18.15   "/></g></g></svg>
                            : estadoBusqueda==2 ?                                 
                                <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 3" viewBox="0 0 128 160" x="0px" y="0px"><path d="M87.39,66.26V20.93c0-2.8-2.28-5.08-5.09-5.08h-1.48v-1.47c0-2.8-2.28-5.08-5.09-5.08H14.09c-2.81,0-5.09,2.28-5.09,5.08V93.03c0,2.8,2.28,5.08,5.09,5.08h1.48v1.47c0,2.8,2.28,5.08,5.09,5.08h48.25c4.48,8.34,13.32,14.03,23.48,14.03,14.67,0,26.61-11.87,26.61-26.47,0-16.47-15.1-29.13-31.61-25.99Zm5,49.45c-10.67,0-20.21-7.19-22.9-17.75-2.64-10.48,2.26-21.21,11.57-26.29,15.81-8.61,34.94,2.92,34.94,20.58,0,12.94-10.59,23.47-23.61,23.47Zm-24.87-14.03H20.66c-1.15,0-2.09-.94-2.09-2.08V20.93c0-1.15,.94-2.08,2.09-2.08h61.64c1.15,0,2.09,.94,2.09,2.08q0,46.07-.1,46.11c-14.48,4.62-22.21,20.49-16.76,34.64Zm-55.53-8.64V14.38c0-1.15,.94-2.08,2.09-2.08h61.64c1.15,0,2.09,.94,2.09,2.08v1.47H20.66c-2.81,0-5.09,2.28-5.09,5.08V95.12h-1.48c-1.15,0-2.09-.94-2.09-2.08Z"/><path d="M41.2,53.23c.12,.13,.26,.23,.42,.31,5.89,4.34,13.82,4.34,19.71,0,.16-.08,.3-.19,.42-.31,12.46-9.8,5.45-29.76-10.28-29.76s-22.74,19.96-10.28,29.76Zm10.28-26.76c11.73,0,18.06,13.98,10.16,22.78-.87-2.72-2.78-4.95-5.27-6.23,5.31-4.56,2.08-13.28-4.89-13.28s-10.19,8.72-4.89,13.28c-2.48,1.28-4.4,3.51-5.27,6.23-7.9-8.8-1.58-22.78,10.16-22.78Zm-7.6,25.02c.52-3.79,3.72-6.65,7.6-6.65s7.08,2.86,7.6,6.65c-4.6,3.09-10.61,3.09-15.21,0Zm3.08-14.2c0-2.51,2.03-4.55,4.53-4.55s4.53,2.04,4.53,4.55-2.03,4.55-4.53,4.55-4.53-2.04-4.53-4.55Z"/><path d="M24.94,63.59h53.08c.79,0,1.5-.66,1.5-1.5,0-.78-.65-1.5-1.5-1.5H24.94c-1.98,0-1.98,3,0,3Z"/><path d="M67.29,71.94c1.98,0,2-3-.08-3H24.94c-1.98,0-1.98,3,0,3h42.35Z"/><path d="M62.14,77.37c-.41-.13-.01-.08-37.21-.08-1.98,0-1.98,3,0,3H61.68c1.69,0,2.09-2.39,.46-2.92Z"/><path d="M59.45,85.64H24.94c-1.98,0-1.98,3,0,3H59.45c.85,0,1.5-.7,1.5-1.5s-.65-1.5-1.5-1.5Z"/><path d="M59.45,93.99H24.94c-1.97,0-1.99,3,0,3H59.45c.8,0,1.5-.67,1.5-1.5s-.65-1.5-1.5-1.5Z"/><path d="M102.9,79.62l-10.5,10.5-10.5-10.5c-1.4-1.4-3.52,.72-2.12,2.12l10.5,10.5-10.5,10.5c-1.4,1.4,.72,3.52,2.12,2.12l10.5-10.5,10.5,10.5c1.4,1.4,3.52-.72,2.12-2.12l-10.5-10.5,10.5-10.5c1.4-1.4-.72-3.52-2.12-2.12Z"/></svg> 
                            :                                                         
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" x="0px" y="0px"><g data-name="Layer 29 copy 8"><path d="M79,8.38a7.46,7.46,0,0,0-9.56-4.44L38.35,15.32a7.45,7.45,0,0,0-4.73,8.54A21,21,0,0,0,38.76,60l-1,4.68a3.24,3.24,0,0,0-3.17,2.55l-.07.38c-1.92,0-5.33.25-7.62,2.72s-3,2.81-3.9,3l-.92-.17.15-.87a1.5,1.5,0,0,0-1.17-1.72L8.73,67.9a1.51,1.51,0,0,0-1.79,1.22L3.52,89a1.5,1.5,0,0,0,1.17,1.72L17,93.35a1.55,1.55,0,0,0,.31,0,1.51,1.51,0,0,0,1.48-1.25l.32-1.85,1.92.41c.66,1.34,2.48,3.58,7.39,4.73a40.36,40.36,0,0,0,8.85,1.07c3.62,0,7.51-.64,10.26-2.81,1.46-1.15,2.41-4.19,3.5-8,.19-.7.36-1.3.51-1.73a9.18,9.18,0,0,0-4.22-11.36L47.88,70A3.21,3.21,0,0,0,46,66.42l1-4.94h.24L51,71.62a7.46,7.46,0,0,0,7,4.89,7.58,7.58,0,0,0,2.55-.45L91.65,64.68a7.45,7.45,0,0,0,4.44-9.56ZM16.12,90.09l-9.4-2L9.63,71.16l9.4,2Zm27-24.37-2.34-.49.92-4.33.52.14c.61.13,1.22.22,1.83.3Zm-5.32,2h0l7,1.48a.22.22,0,0,1,.14.1.24.24,0,0,1,0,.16l-.78,3.67h0l-.37,1.74-.48,2.3c-2.11.92-5.54-.52-7.42-1.55l1.64-7.72A.21.21,0,0,1,37.75,67.67ZM48.71,83h0c-.15.47-.33,1.11-.54,1.85-.45,1.6-1.66,5.86-2.46,6.49-3.65,2.88-11,2.49-16.58,1.18-4.84-1.13-5.48-3.36-5.48-3.36h0a1.5,1.5,0,0,0-1.17-1.22l-2.84-.6,1.94-11.25,1.14.2a1.35,1.35,0,0,0,.49,0c2-.3,3.05-.85,5.9-3.92a6.78,6.78,0,0,1,4.78-1.77L32.75,76a1.51,1.51,0,0,0,.64,1.57c.77.5,7.67,4.85,12.11,1.75a1.49,1.49,0,0,0,.61-.92l.57-2.67A6.1,6.1,0,0,1,48.71,83ZM42.79,58.1a18,18,0,0,1,3.7-35.68,18.56,18.56,0,0,1,3.77.39A18,18,0,1,1,42.79,58.1Zm50.34,1.45a4.42,4.42,0,0,1-2.51,2.31L59.55,73.24a4.47,4.47,0,0,1-5.72-2.65l-3.45-9.45A21,21,0,0,0,67.56,40.66l10.65-3.9a1.5,1.5,0,0,0-1-2.82l-9.84,3.61a21.13,21.13,0,0,0-12.1-16.23l9.61-3.51a1.5,1.5,0,0,0-1-2.82L50.59,19.83A20.86,20.86,0,0,0,36.47,22a4.45,4.45,0,0,1,2.91-3.86L70.45,6.76A4.53,4.53,0,0,1,72,6.49a4.48,4.48,0,0,1,4.19,2.92L93.28,56.15A4.46,4.46,0,0,1,93.13,59.55Zm-12.5-1.43a1.5,1.5,0,0,1-.89,1.93l-19.22,7a1.34,1.34,0,0,1-.52.1,1.5,1.5,0,0,1-.51-2.91l19.22-7A1.5,1.5,0,0,1,80.63,58.12ZM83,45.35a1.5,1.5,0,0,1-.89,1.93l-10.83,4a1.58,1.58,0,0,1-.52.09,1.5,1.5,0,0,1-.51-2.91l10.83-4A1.49,1.49,0,0,1,83,45.35Zm-7.7-21a1.5,1.5,0,0,1-.89,1.93l-5.39,2a1.52,1.52,0,0,1-.51.09,1.5,1.5,0,0,1-.52-2.91l5.39-2A1.49,1.49,0,0,1,75.25,24.32ZM46.53,55.74A15.28,15.28,0,1,1,61.8,40.46,15.3,15.3,0,0,1,46.53,55.74Zm0-27.56A12.28,12.28,0,1,0,58.8,40.46,12.29,12.29,0,0,0,46.53,28.18Z"/></g></svg>
                            }
                            <div className="section-heading">
                                <h3 className="section__title pb-3">
                                    {estadoBusqueda==-1 ? 'Validando imagen QR...'
                                    : estadoBusqueda==1 ? 
                                        'El certificado es original'
                                    :
                                        'Certificado no encontrado'    
                                    }
                                </h3>
                                {estadoBusqueda==1 && <><br/><p className="section__desc">
                                    {certificado.nombres}<br/>
                                    {certificado.cedula}<br/>
                                    {certificado.curso}<br/>
                                    {certificado.finalizacion}<br/><br/><br/>
                                </p></>}
                                <p className="section__desc">
                                    Garantizamos la integridad y autenticidad de nuestros certificados mediante tecnología avanzada de criptografía. Cada certificado emitido está firmado digitalmente, lo que significa que contiene una firma electrónica única y segura que verifica su autenticidad.
                                </p>
                            </div>
                            <div className="btn-box pt-30px">
                                <Link to="/" className="btn theme-btn"><i className="la la-reply mr-1"></i> Ir al inicio</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>        
        </>
    );
}

export default FormularioValidarCertificado;