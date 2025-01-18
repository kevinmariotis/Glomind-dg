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
        <section className="footer-area pt-50px bg-gray">
                        
            <div className="copyright-content py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="d-flex flex-wrap align-items-center">
                                <a href={urlBase} className="pr-4">
                                    <img src={`${urlBase}/images/logo_principal.png`} alt="footer logo" className="footer__logo" />
                                </a>
                                <p className="copy-desc">2024 Glomind &copy;. Todos los derechos reservados</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end">
                                <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14">
                                    <li className="mr-3"><a href="#">Términos y condiciones</a></li>
                                    <li className="mr-3"><a href="#">Política de privacidad</a></li>
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