import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReCAPTCHA from "react-google-recaptcha";
import { mensajesDeError } from './utils';

import SpamError from './SpamError';
import Popup from './Popup';
import Spinner from './Spinner';


function FormularioIniciarSesion() {        
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;  
    const navigate = useNavigate();            

    const [botonIniciarSesionEstado, setBotonIniciarSesionEstado] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captchaValue, setCaptchaValue] = useState("");

    const [errorUsuario, setErrorUsuario] = useState('');
    const [errorContrasena, seterrorContrasena] = useState('');
    const [erroresCaptcha, seterroresCaptcha] = useState('');    
    const [resetKey, setResetKey] = useState(0);

    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);  

    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleTogglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };
         
    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };    

    const handleCaptchaChange = (value) => {
        // Almacena el valor del reCAPTCHA en el estado
        setCaptchaValue(value);
    };
    
    useEffect(() => {    
        window.scrollTo(0, 0);
    }, []);

    const fetchData = async (event) => {
        event.preventDefault();
       
        setBotonIniciarSesionEstado('disabled');
        setMostrarSpinner(true);
        const formData = new FormData();
        formData.append('usuario', username);
        formData.append('contrasena', password);
        formData.append('g-recaptcha-response', captchaValue);        
        const opciones = {
            method: 'POST',
            headers: {                      
            },
            body: formData
        };
        
        try {
            const response = await fetch(`${urlBaseApi}/api/sesion`, opciones);
            setMostrarSpinner(false);
            const data = await response.json();            
            if (response.ok) {
                // Procesar los datos en caso de éxito
                console.log('Inició sesión correctamente, datos de respuesta:', data);                
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30);
                Cookies.set('jwt', data.token, { expires: expirationDate });                                
                window.location.href = '/';     //se recarga la aplicacion de nuevo para que el AuthContext valide la cookie y cargue los permisos                
                return;
            } else {
                // Obtener el código de error de la respuesta
                const statusCode = response.status;                
                let errores = {};          
                if (typeof data.datos !== 'undefined') {
                    errores = data.datos;                      
                }    
                
                let erroresusuario = '';
                let errorecontrasena = '';
                let errorescapchax = '';
                
                Object.entries(errores).forEach(([clave, mensajes]) => {
                    console.log(`Clave: ${clave}`);                                           
                    mensajes.forEach((mensaje) => {
                        switch(clave){
                            case 'usuario':                                
                                if(erroresusuario!=''){
                                    erroresusuario = `${erroresusuario}, ${mensaje}`;                                    
                                }else{
                                    erroresusuario = `${mensaje}`;                                    
                                }
                            break;
                            case 'contrasena':
                                if(errorecontrasena!=''){
                                    errorecontrasena = `${errorecontrasena}, ${mensaje}`;                                    
                                }else{
                                    errorecontrasena = `${mensaje}`;                                    
                                }
                            break;
                            case 'g-recaptcha-response':
                                if(errorescapchax!=''){
                                    errorescapchax = `${errorescapchax}, ${mensaje}`;                                    
                                }else{
                                    errorescapchax = `${mensaje}`;                                    
                                }                                                                
                            break; 
                        }
                        console.log(`- ${mensaje}`);
                    });
                });
                setErrorUsuario(erroresusuario);
                seterrorContrasena(errorecontrasena);
                seterroresCaptcha(errorescapchax);

                //si viene un codigo de error se muestra un mensaje en popup
                if(data.codigo!=''){
                    const contenidos = {
                        "sesioniniciada" : {titulo:"Sesion iniciada", contenido:"Ya tenías la sesión iniciada previamente"},
                        "suspendido" : {titulo:"Suspendido", contenido:"Su cuenta ha sido suspendida"},
                        "incorrecto" : {titulo:"Incorrecto", contenido:"Nombre de usuario o contraseña incorrecta"},
                    }                                        
                    setPopup({mostrar:true, titulo:contenidos[data.codigo].titulo, contenido:contenidos[data.codigo].contenido});
                }

                // Mostrar mensaje de error según el código de error
                switch (statusCode){
                    case 400:
                        console.error('Error 400: Bad Request');                        
                    break;
                    case 401:
                        console.error('Error 401: Unauthorized');
                        console.log('Datos de error:', data);
                    break;
                    case 404:
                        console.error('Error 404: Not Found');
                        console.log('Datos de error:', data);
                    break;
                    case 500:
                        console.error('Error 500: Internal Server Error');
                        console.log('Datos de error:', data);
                    break;
                    default:
                        console.error('Error desconocido');
                        console.log('Datos de error:', data);
                  break;
                }
                setResetKey(prevKey => prevKey + 1);
            }
            setBotonIniciarSesionEstado('');
        }catch (error) {
            console.error('Error de conexión:', error);        
            setBotonIniciarSesionEstado('');
        }
    };    

    return (        
        <section className="contact-area section--padding position-relative">   
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
            <span className="ring-shape ring-shape-1"></span>
            <span className="ring-shape ring-shape-2"></span>
            <span className="ring-shape ring-shape-3"></span>
            <span className="ring-shape ring-shape-4"></span>
            <span className="ring-shape ring-shape-5"></span>
            <span className="ring-shape ring-shape-6"></span>
            <span className="ring-shape ring-shape-7"></span>
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 mx-auto">
                        <div className="card card-item">
                            <div className="card-body">
                                <h3 className="card-title text-center fs-24 lh-35 pb-4">Ingrese a su cuenta!</h3>
                                <div className="section-block"></div>
                                <form method="post" className="pt-4">                                    
                                    <div className="input-box">
                                        <label className="label-text">Correo electrónico</label>
                                        <div className="form-group">
                                            <input onChange={handleUsernameChange} value={username} id="username" className="form-control form--control" type="text" name="username" placeholder="Email" />
                                            <span className="la la-user input-icon"></span>
                                            {errorUsuario!='' && <SpamError mensaje={errorUsuario} />}
                                        </div>
                                    </div>
                                    <div className="input-box">
                                        <label className="label-text">Contraseña</label>
                                        <div className="input-group mb-3">
                                            <span className="la la-lock input-icon"></span>
                                            <input onChange={handlePasswordChange} value={password} id="password" className="form-control form--control password-field" type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Contraseña" />
                                            <div className="input-group-append">
                                                <button className={`btn theme-btn theme-btn-transparent toggle-password ${passwordVisible ? 'active' : ''}`} onClick={handleTogglePassword} type="button">
                                                    <svg className="eye-on" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 24 24" width="22px" fill="#7f8897"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/></svg>
                                                    <svg className="eye-off" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 24 24" width="22px" fill="#7f8897"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"/></svg>
                                                </button>
                                            </div>                                            
                                        </div>
                                        {errorContrasena!='' && <SpamError mensaje={errorContrasena} />}
                                    </div>
                                    <div className="input-box">
                                        <div className="input-group mb-3">                  
                                            <ReCAPTCHA key={resetKey} onChange={handleCaptchaChange} sitekey="6LfyHT0mAAAAADE_ZAEDvGr4Z6QBa8WWbuBJ8WzA" />                                                
                                        </div>
                                        {erroresCaptcha!='' && (<SpamError mensaje={erroresCaptcha} />)}
                                    </div>
                                    <div className="btn-box">
                                        <div className="d-flex align-items-center justify-content-between pb-4">
                                            <div className="custom-control custom-checkbox fs-15">
                                                <input type="checkbox" className="custom-control-input" id="rememberMeCheckbox" required />
                                                <label className="custom-control-label custom--control-label" htmlFor="rememberMeCheckbox">Recordarme</label>
                                            </div>
                                            <a href="recover.html" className="btn-text">Olvidé mi contraseña</a>
                                        </div>
                                        <button className="btn theme-btn" type="submit" disabled={botonIniciarSesionEstado} onClick={fetchData}>Iniciar sesión <i className="la la-arrow-right icon ml-1"></i></button>
                                        <p className="fs-14 pt-2">No tiene una cuenta? <Link to="/signup" className="text-color hover-underline">Regístrese</Link></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FormularioIniciarSesion;