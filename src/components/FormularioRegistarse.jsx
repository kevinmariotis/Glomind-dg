import React, {useState, useEffect, useContext, lazy} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from '../AuthContext';
import LoadingAnimation from './LoadingAnimation';
import Popup from './Popup';
import SpamError from './SpamError';

function FormularioRegistrarse(){
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API; 
    const {jwt, temaActual} = useContext(AuthContext);
    const navigate = useNavigate();

    const [datosCargados, setDatosCargados] = useState(false);    
    const [contrasenaVisible, setContrasenaVisible] = useState(false);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});    
    const [popUpErrores, setPopupErrores] = useState({mostrar:false, titulo:'Corrige los campos', contenido:'Algunos campos contienen datos incorrectos o faltantes, por favor corrígelos.'});    
    const [resetKey, setResetKey] = useState(0);

    //estados del formulario    
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');    
    const [telefono, setTelefono] = useState('');    
    const [contrasena, setContrasena] = useState('');
    const [promociones, setPromociones] = useState(false);
    const [terminosCondiciones, setTerminosCondiciones] = useState(false);
    const [captchaValue, setCaptchaValue] = useState("");
    const [botonRegistrarseEstado, setBotonRegistrarseEstado] = useState('');
    //fin de estados del formulario

    //Estados de los errores de campos
    const camposErrores = {
        'nombres':[],
        'apellidos':[],
        'email':[],        
        'telefono':[],        
        'contrasena':[],
        'recibir_promociones':[],
        'g-recaptcha-response':[],
        'terminos_y_condiciones':[],
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
    //fin de los estados de errores de campos
    
    useEffect(() => {    
        window.scrollTo(0, 0);        
        setDatosCargados(true);
    }, []);
            
    //handles del formulario
    const handleToggleContrasena = () => {
        setContrasenaVisible(!contrasenaVisible);
    };
    const handleNombresChange = (event) => { console.log("el name es "+event.target.name);  setNombres(event.target.value);    };    
    const handleApellidosChange = (event) => {   setApellidos(event.target.value);    };    
    const handleEmailChange = (event) => {   setEmail(event.target.value);    };                
    const handleTelefonoChange = (event) => {   setTelefono(event.target.value);    };        
    const handleContrasenaChange = (event) => {   setContrasena(event.target.value);    };    
    const handlePromociones = (event) => {  setPromociones(event.target.checked);    };    
    const handleTerminosCondiciones = (event) => {  setTerminosCondiciones(event.target.checked);    };    
    
    const handleCaptchaChange = (value) => {
        // Almacena el valor del reCAPTCHA en el estado
        setCaptchaValue(value);
    };

    const handleFuncionAceptarPopUpErrores = () => {        
        setPopupErrores({...popUpErrores, mostrar:false});        
    };
    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
        navigate('/login');
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };    
                
    const postData = async (event) => {
        event.preventDefault();
        
        reiniciarErrorCampoGlobal();        
        setBotonRegistrarseEstado('disabled');
        const formData = new FormData();
        formData.append('nombres', nombres);
        formData.append('apellidos', apellidos);
        formData.append('email', email);                
        formData.append('telefono', telefono);
        formData.append('contrasena', contrasena);
        formData.append('recibir_promociones', (promociones) ? '1' : '0');
        formData.append('g-recaptcha-response', captchaValue);        
        formData.append('terminos_y_condiciones', (terminosCondiciones) ? '1' : '0');
        
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            const response = await fetch(`${urlBaseApi}/api/usuario`, opciones);
            const data = await response.json();
        
            if (response.ok) {
                setPopup({mostrar:true, titulo:'Listo!', contenido:'Haz creado tu usuario, te invitamos a iniciar sesión, al presionar aceptar te enviaremos a la página de inicio de sesión.'});
                return;
            } else {
                // Obtener el código de error de la respuesta
                const statusCode = response.status;

                let errores = {};          
                if (typeof data.datos !== 'undefined') {
                    errores = data.datos;                      
                }                                    
                Object.entries(errores).forEach(([clave, mensajes]) => {
                    //console.log(`Clave: ${clave}`);                                           
                    mensajes.forEach((mensaje) => {                        
                        setErrorCampoGlobal(clave, mensaje);                        
                        //console.log(`- ${mensaje}`);
                    });                   
                });               
                //si viene un codigo de error se muestra un mensaje en popup
                if(data.codigo!=''){
                    const contenidos = {
                        "sesioniniciada" : {titulo:"Sesion iniciada", contenido:"Ya tenias la sesión iniciada previamente"},
                        "suspendido" : {titulo:"Suspendido", contenido:"Su cuenta ha sido suspendida"},
                        "incorrecto" : {titulo:"Incorrecto", contenido:"Nombre de usuario o contraseña incorrecta"},
                    }                                        
                    setPopup({mostrar:true, titulo:contenidos[data.codigo].titulo, contenido:contenidos[data.codigo].contenido});
                }
                setPopupErrores({...popUpErrores, mostrar:true});
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
            setBotonRegistrarseEstado('');
        }catch (error) {
            console.error('Error de conexión:', error);        
        }
    };

    return (
        <>{datosCargados ? (
            <section className="contact-area section--padding position-relative">

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
                <Popup 
                    mostrarPopup={popUpErrores.mostrar} 
                    tamano="xx"
                    tipo={2} 
                    titulo={popUpErrores.titulo} 
                    mensaje={popUpErrores.contenido} 
                    funcionAceptar={handleFuncionAceptarPopUpErrores} 
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
                        <div className="col-lg-9 mx-auto">
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title text-center fs-24 lh-35 pb-4">Crea una cuenta<br/> Inicia tu aprendizaje!</h3>
                                    <div className="section-block"></div>
                                    <form method="post" className="pt-4">                            
                                        <div className="input-box form-row">
                                            <div className="form-group col-md-6">                                                       
                                                <input onChange={handleNombresChange} value={nombres} className="form-control form--control" type="text" name="nombres" placeholder="Nombres" maxLength="64" />
                                                <span className="la la-user input-icon"></span>                                                
                                                {erroresCampos['nombres'].length > 0 && (<SpamError mensaje={erroresCampos['nombres']} />)}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <input onChange={handleApellidosChange} value={apellidos} className="form-control form--control" type="text" name="apellidos" placeholder="Apellidos" maxLength="64" />
                                                <span className="la la-user input-icon"></span>
                                                {erroresCampos['apellidos'].length > 0 && (<SpamError mensaje={erroresCampos['apellidos']} />)}
                                            </div>
                                        </div>                                                                                                                                                    
                                        <div className="input-box form-row">                                                                                                                                               
                                            <div className="form-group col-md-12">
                                                <input onChange={handleTelefonoChange} value={telefono} className="form-control form--control" type="text" name="telefono" placeholder="Telefono" maxLength="10"/>
                                                <span className="la la-mobile-phone input-icon"></span>
                                                {erroresCampos['telefono'].length > 0 && (<SpamError mensaje={erroresCampos['telefono']} />)}
                                            </div>
                                        </div>                                       
                                        <div className="input-box">    
                                            <div className="form-group">
                                                <input onChange={handleEmailChange} value={email} className="form-control form--control" type="email" name="email" placeholder="Correo electrónico" maxLength="64" />
                                                <span className="la la-envelope input-icon"></span>
                                                {erroresCampos['email'].length > 0 && (<SpamError mensaje={erroresCampos['email']} />)}
                                            </div>                                                                        
                                        </div>   
                                        <div className="input-box">      
                                            <div className="input-group mb-3">
                                                <span className="la la-lock input-icon"></span>
                                                <input className="form-control form--control password-field" onChange={handleContrasenaChange} type={contrasenaVisible ? 'text' : 'password'} name="contrasena" placeholder="Contraeña" />
                                                <div className="input-group-append">
                                                    <button className={`btn theme-btn theme-btn-transparent toggle-password ${contrasenaVisible ? 'active' : ''}`} type="button" onClick={handleToggleContrasena}>
                                                        <svg className="eye-on" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 24 24" width="22px" fill="#7f8897"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/></svg>
                                                        <svg className="eye-off" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 24 24" width="22px" fill="#7f8897"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"/></svg>
                                                    </button>
                                                </div>                                                                                                
                                            </div>                                            
                                            {erroresCampos['contrasena'].length > 0 && (<SpamError mensaje={erroresCampos['contrasena']} />)}
                                        </div>                                        
                                        <div className="input-box">
                                            <div className="input-group mb-3">                  
                                                <ReCAPTCHA theme={`${temaActual==1 ? 'light' : 'dark'}`} key={resetKey} onChange={handleCaptchaChange} sitekey="6LfyHT0mAAAAADE_ZAEDvGr4Z6QBa8WWbuBJ8WzA" />                                                
                                            </div>
                                            {erroresCampos['g-recaptcha-response'].length > 0 && (<SpamError mensaje={erroresCampos['g-recaptcha-response']} />)}
                                        </div>
                                        <div className="btn-box">
                                            <div className="custom-control custom-checkbox mb-2 fs-15">
                                                <input onChange={handlePromociones} checked={promociones} type="checkbox" className="custom-control-input" id="recibir_promociones" name="recibir_promociones" />
                                                <label className="custom-control-label custom--control-label lh-20" htmlFor="recibir_promociones">Sí! Quiero aprovechar al máximo la plataforma recibiendo correos electrónicos con ofertas exclusivas, recomendaciones personales y consejos de aprendizaje!</label>
                                            </div>
                                            <div className="custom-control custom-checkbox mb-4 fs-15">
                                                <input type="checkbox" onChange={handleTerminosCondiciones} checked={terminosCondiciones} className="custom-control-input" id="agreeCheckbox" required />
                                                <label className="custom-control-label custom--control-label" htmlFor="agreeCheckbox">Al registrarme acepto los&nbsp;
                                                    <a href="terms-and-conditions.html" className="text-color hover-underline">terminos y condiciones</a> y la&nbsp;
                                                    <a href="privacy-policy.html" className="text-color hover-underline">política de privacidad</a>
                                                </label><br/>
                                                {erroresCampos['terminos_y_condiciones'].length > 0 && (<SpamError mensaje={erroresCampos['terminos_y_condiciones']} />)}
                                            </div>
                                            <button className="btn theme-btn" type="submit" disabled={botonRegistrarseEstado} onClick={postData} >Registrar cuenta <i className="la la-arrow-right icon ml-1"></i></button>
                                            <p className="fs-14 pt-2">Ya tienes una cuenta? <Link to="/login" className="text-color hover-underline">Inicia sesión</Link></p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    ) : (
        <LoadingAnimation />
    )}</>    
    );
}

export default FormularioRegistrarse;