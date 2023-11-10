import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';

import SpamError from './SpamError';
import Popup from './Popup';
import Spinner from './Spinner';


function FormularioRecuperarContrasena() {        
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;  
    const navigate = useNavigate();                
    const { id_usuario, hash } = useParams();
    const {jwt, temaActual} = useContext(AuthContext);
    const [botonIniciarSesionEstado, setBotonIniciarSesionEstado] = useState('');

    const [username, setUsername] = useState('');    
    const [captchaValue, setCaptchaValue] = useState("");
    const [resetKey, setResetKey] = useState(0);
    
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [repetirNuevaContrasena, setRepetirNuevaContrasena] = useState('');
    
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);  

    const [passwordVisible, setPasswordVisible] = useState(false);    
          
    //Estados de los errores de campos
    const camposErrores = {        
        'email':[],
        'g-recaptcha-response':[],
    }    
    const [erroresCampos, setErrorCampo] = useState(camposErrores);
    const setErrorCampoGlobal = (index, newValue) => {
        if (index in erroresCampos) {
            setErrorCampo((prevState) => ({
                ...prevState,
                [index]: [...(prevState[index] || []), newValue],
            }));
        }
    };
    const reiniciarErrorCampoGlobal = () => {
        for (let propiedad in erroresCampos) {
            if (Array.isArray(erroresCampos[propiedad])) {
                erroresCampos[propiedad] = [];
            }
        }
    };

    const handleFuncionAceptarPopUp = () => {        
        switch(popUp.data_switch){            
            case 'contrasena-cambiada':
                navigate('/login');
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };

    const handleCaptchaChange = (value) => {
        // Almacena el valor del reCAPTCHA en el estado
        setCaptchaValue(value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handleNuevaContrasena = (event) => {
        setNuevaContrasena(event.target.value);
    };
    const handleRepetirNuevaContrasena = (event) => {
        setRepetirNuevaContrasena(event.target.value);
    };
        
    const enviarCorreoElectronico = async () => {                          
        reiniciarErrorCampoGlobal();
       
        const formData = new FormData();               
        formData.append('usuario', username);
        formData.append('g-recaptcha-response', captchaValue);

        const opcionesx = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/usuario/enviarEmailRecuperarCuenta/1`, opcionesx);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){   
                setPopup({mostrar:true, titulo:'Listo', contenido:'Si la cuenta proporcionada '+username+' está registrada en nuestro sistema, se le acaba de enviar un correo electrónico para el reestablecimiento de su contraseña.'});
                setResetKey(prevKey => prevKey + 1);
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error', 'contenido': 'Revise los errores en el formulario.'});
                setResetKey(prevKey => prevKey + 1);
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };
    
    const restablecerContrasena = async () => {
        reiniciarErrorCampoGlobal();      
        if(nuevaContrasena==repetirNuevaContrasena){
            const raw = {            
                'hash': hash+'',
                'nueva_contrasena': nuevaContrasena+'',
            };
                                
            const opciones = {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: JSON.stringify(raw),
            };
            
            try {
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/usuario/recuperarCuenta/${id_usuario}`, opciones);
                setMostrarSpinner(false);
                const datos = await response.json();            
                if (response.ok){    
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Cambios guardados correctamente, ahora puedes inciar sesión.', data_switch:'contrasena-cambiada'});
                } else {
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }
        }else{
            setPopup({mostrar:true, titulo:'Contraseñas no coincicden', contenido:'Asegúrate de haber escrito bien la contraseña y la repetición.'});
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
                        {id_usuario==undefined ? 
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-24 lh-35 pb-2">Recuperar cuenta!</h3>
                                    <p className="fs-15 lh-24 pb-3">Ingrese el correo electrónico de su cuenta para restablecer la contraseña. Recibirá un enlace por correo electrónico para restablecer la contraseña.</p>
                                    <div className="section-block"></div>
                                    <form method="post" className="pt-4">
                                        <div className="input-box">
                                            <label className="label-text">Correo electrónico</label>
                                            <div className="form-group">
                                                <input onChange={handleUsernameChange} value={username} className="form-control form--control" type="text" name="name" placeholder="Digite el correo electrónico de la cuenta" />
                                                <span className="la la-user input-icon"></span>
                                            </div>
                                        </div>
                                        <div className="input-box">
                                            <div className="input-group mb-3">                  
                                                <ReCAPTCHA theme={`${temaActual==1 ? 'light' : 'dark'}`} key={resetKey} onChange={handleCaptchaChange} sitekey="6LfyHT0mAAAAADE_ZAEDvGr4Z6QBa8WWbuBJ8WzA" />                                                
                                            </div>
                                            {erroresCampos['g-recaptcha-response'].length > 0 && (<SpamError mensaje={erroresCampos['g-recaptcha-response']} />)}
                                        </div>
                                        <div className="btn-box">
                                            <button onClick={enviarCorreoElectronico} className="btn theme-btn" type="button">Enviarme correo electrónico <i className="la la-arrow-right icon ml-1"></i></button>
                                            <div className="d-flex align-items-center justify-content-between fs-14 pt-2">
                                                <Link to={`/login`} className="text-color hover-underline">Iniciar sesión</Link>
                                                <p>No eres un miembro? <Link to={`/signup`} className="text-color hover-underline">Regístrate</Link></p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        :
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-24 lh-35 pb-2">Define tu nueva contraseña</h3>
                                    <p className="fs-15 lh-24 pb-3">Si el link de recuperación es válido se le reestablecerá su contraseña.</p>
                                    <div className="section-block"></div>
                                    <form method="post" className="pt-4">
                                        <div className="input-box">
                                            <label className="label-text">Nueva contraseña</label>
                                            <div className="form-group">
                                                <input onChange={handleNuevaContrasena} value={nuevaContrasena} className="form-control form--control" type="password" name="nueva_contrasena" placeholder="" />
                                                <span className="la la-user input-icon"></span>
                                            </div>
                                        </div>
                                        <div className="input-box">
                                            <label className="label-text">Repetir nueva contraseña</label>
                                            <div className="form-group">
                                                <input onChange={handleRepetirNuevaContrasena} value={repetirNuevaContrasena} className="form-control form--control" type="password" name="repetir_nueva_contrasena" placeholder="" />
                                                <span className="la la-user input-icon"></span>
                                            </div>
                                        </div>
                                        <div className="input-box">
                                            <div className="input-group mb-3">                  
                                                <ReCAPTCHA theme={`${temaActual==1 ? 'light' : 'dark'}`} key={resetKey} onChange={handleCaptchaChange} sitekey="6LfyHT0mAAAAADE_ZAEDvGr4Z6QBa8WWbuBJ8WzA" />                                                
                                            </div>
                                            {erroresCampos['g-recaptcha-response'].length > 0 && (<SpamError mensaje={erroresCampos['g-recaptcha-response']} />)}
                                        </div>
                                        <div className="btn-box">
                                            <button onClick={restablecerContrasena} className="btn theme-btn" type="button">Restablecer la contraseña <i className="la la-arrow-right icon ml-1"></i></button>
                                            <div className="d-flex align-items-center justify-content-between fs-14 pt-2">
                                                <Link to={`/login`} className="text-color hover-underline">Iniciar sesión</Link>
                                                <p>No eres un miembro? <Link to={`/signup`} className="text-color hover-underline">Regístrate</Link></p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FormularioRecuperarContrasena;