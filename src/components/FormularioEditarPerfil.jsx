import React, {useContext, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioCrearVideo() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, nombres, setImagenPequena} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});        
    const [verPopUpEliminarCuenta, setVerPopUpEliminarCuenta] = useState(false);
    const [pestanaActivada, setPestanaActivada] = useState(1);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);    
    const [progress, setProgress] = useState(0);
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);  

    const [datosUsuario, setDatosUsuario] = useState({docente_rating:99.9, docente_reviews:0});     //datos estaticos que no se editarán
    const [formNombres, setFormNombres] = useState('');
    const [formApellidos, setFormApellidos] = useState('');
    const [formTelefono, setFormTelefono] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formIdPais, setFormIdPais] = useState('');
    const [formIdDepartamento, setFormIdDepartamento] = useState('');
    const [formCiudad, setFormCiudad] = useState('');
    const [formCedula, setFormCedula] = useState('');
    const [formBiografia, setFormBiografia] = useState('');
    const [formRecibirPromociones, setFormRecibirPromociones] = useState(1);    

    const [formContrasenaActual, setFormContrasenaActual] = useState('');    
    const [formNuevaContrasena, setFormNuevaContrasena] = useState('');    
    const [formConfirmarNuevaContrasena, setFormConfirmarNuevaContrasena] = useState('');    
    const [formContrasenaEliminarCuenta, setFormContrasenaEliminarCuenta] = useState('');    
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        //window.scrollTo(0, 0);
        obtenerDatosDelServidor();        
    }, []);
              
    //Estados de los errores de campos
    const camposErrores = {        
        'nombres':[],
        'apellidos':[],
        'email':[],
        'telefono':[],
        'id_pais':[],
        'id_departamento':[],
        'ciudad':[],
        'identificacion':[],
        'docente_descripcion':[],

        'contrasena_actual':[],
        'nueva_contrasena':[],
        'confirmar_nueva_contrasena':[],

        'contrasena':[],
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
        
    const handleCambiarPestana = (event, numero) =>{    
        event.preventDefault();   
        setPestanaActivada(numero);
    };

    const handleNombresChange = (event) => { setFormNombres(event.target.value);    };
    const handleApellidosChange = (event) => { setFormApellidos(event.target.value);    };
    const handleTelefonoChange = (event) => { setFormTelefono(event.target.value);    };
    const handleEmailChange = (event) => { setFormEmail(event.target.value);    };
    const handleDepartamentoChange = (event) => {   setFormIdDepartamento(event.target.value);    };
    const handleCiudadChange = (event) => {   setFormCiudad(event.target.value);    };
    const handleCedulaChange = (event) => {   setFormCedula(event.target.value);    };
    const handleBiografiaChange = (event) => {   setFormBiografia(event.target.value);    };   

    const handleContrasenActualChange = (event) => {   setFormContrasenaActual(event.target.value);    };   
    const handleNuevaContrasenaChange = (event) => {   setFormNuevaContrasena(event.target.value);    };   
    const handleConfirmarNuevaContrasenaChange = (event) => {   setFormConfirmarNuevaContrasena(event.target.value);    };   

    const handleContrasenaEliminarCuenta = (event) => {   setFormContrasenaEliminarCuenta(event.target.value);    };   

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const handleCambiarPais = (event) => {
        const seleccion = event.target.value;
        setFormIdPais(seleccion);
        if(seleccion!=''){            
            try{            
                getDepartamentos(seleccion).then(datos => {
                    setDepartamentos(datos);
                    setFormIdDepartamento('');
                });            
            } catch (error) {                
                console.log(error.message);           
            }
        }else{
            setDepartamentos([]);
        }
    };


    const onDrop = (acceptedFiles) => {
        // Lógica para procesar los archivos aceptados
        setImagenSeleccionada(acceptedFiles[0]);
    };
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpg': ['.jpg'],
            'image/png': ['.png'],
        }
    });    
    const fileList = acceptedFiles.map((file, index) => (
        <li key={`video-ajunta${index}`}>{file.name}</li>
    ));
       
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
            const response = await fetch(`${urlBaseApi}/api/usuario`, opciones);
            setMostrarSpinner(false);
            if (response.ok){                           
                const datos = await response.json();   
                setDatosUsuario(datos.usuario);   
                setFormNombres(datos.usuario.nombres);
                setFormApellidos(datos.usuario.apellidos);
                setFormTelefono(datos.usuario.telefono);
                setFormEmail(datos.usuario.email);                                           
                setFormIdDepartamento(datos.usuario.id_departamento);
                setFormIdPais(datos.usuario.id_pais);
                setFormCiudad(datos.usuario.ciudad);
                setFormCedula(datos.usuario.identificacion);                
                setPaises(datos.paises);
                setImagenPequena(datos.usuario.imagen_pequena);     //Authcontext                
                const biografia_array = datos.usuario.docente_descripcion.split("<separador>");
                let biografiax = '';                
                biografia_array.forEach((element) => {
                    biografiax = (biografiax!='') ? biografiax+='\n'+element : biografiax=element;
                });
                setFormBiografia(biografiax)

                if(datos.usuario.id_pais!=null){                                        
                    getDepartamentos(datos.usuario.id_pais).then(datos => {
                        setDepartamentos(datos);
                    });
                }
            } else {      
                const data = await response.json();          
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleActualizarPerfil = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();        
        const raw = {                   
            'nombres': formNombres,
            'apellidos': formApellidos,
            'email': formEmail,            
            'telefono': formTelefono.toString(),
            'id_pais': formIdPais,
            'id_departamento': formIdDepartamento,
            'ciudad': formCiudad,            
            'recibir_promociones': formRecibirPromociones,
        };
        if(formBiografia!=''){
            raw.docente_descripcion = formBiografia;
        }
        if(formCedula!='' && formCedula!=null){
            raw.identificacion = formCedula;
        }
                            
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/usuario/0`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                //Se sube la imagen si se tuviera una adjunta             
                if(imagenSeleccionada!=null){
                    setMostrarSpinner(true);
                    const formData = new FormData();
                    formData.append('imagen', imagenSeleccionada);
                    const opciones = {
                        method: 'POST',
                        headers: {
                            'Authorization' : `Bearer ${jwt}`
                        },
                        body: formData
                    };
                    const response = await fetch(`${urlBaseApi}/api/usuario/actualizarImagen/0`, opciones);
                    const datos = await response.json();            
                    setMostrarSpinner(false);
                    if (response.ok){                      
                        setPopup({mostrar:true, titulo:'Listo', contenido:'Datos guardados satisfactoriamente.'});
                        obtenerDatosDelServidor();
                        return;
                    } else {
                        mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Rellenar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});                                                                    
                    }

                }else{
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Datos guardados satisfactoriamente.'});
                }
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Revisar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});                                                                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }
    
    const handleActualizarContrasena = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();        
        const raw = {                   
            'contrasena_actual': formContrasenaActual,
            'nueva_contrasena': formNuevaContrasena,
            'confirmar_nueva_contrasena': formConfirmarNuevaContrasena,                        
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
            const response = await fetch(`${urlBaseApi}/api/usuario/cambiarcontrasena/0`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){   
                setFormContrasenaActual('');
                setFormNuevaContrasena('');
                setFormConfirmarNuevaContrasena('');
                setPopup({mostrar:true, titulo:'Listo', contenido:'Contraseña cambiada exitosamente.'});
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Revisar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    const eliminarCuenta = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();        
        const raw = {                   
            'contrasena': formContrasenaEliminarCuenta,            
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
            const response = await fetch(`${urlBaseApi}/api/usuario/eliminarCuenta/0`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){                   
                setPopup({mostrar:true, titulo:'Listo', contenido:'Cuenta eliminada correctamente, gracias por usar nuestros servicios.'});
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Revisar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }   

    const handleEliminarCuenta = (event) => {   
        event.preventDefault();
        setVerPopUpEliminarCuenta(true);    
    };    

    const getDepartamentos = (id_pais) => {
        return new Promise(async (resolve, reject) => {
            try{                            
                const opciones = {
                    method: 'GET',
                    headers: {                       
                    }
                };                                     
                const response = await fetch(`${urlBaseApi}/api/pais/getDepartamentos/${id_pais}`, opciones);
                const data = await response.json();
                if (response.status === 200) {                                              
                    resolve(data.departamentos);
                } else {                  
                    reject(null);
                }                          
            }catch(error){
                console.log("Error al tratar de obtener los paises ", error);
                //reject(null);
            }
        });
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
        <div className={`modal fade modal-container ${verPopUpEliminarCuenta==true ? 'show' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="eliminarCuentta" tabIndex="-1" role="dialog" aria-labelledby="eliminarCuentaTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="eliminarCuentaTitle">Eliminar cuenta</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Confirme esta acción escribiendo su contraseña</label>
                            <input onChange={handleContrasenaEliminarCuenta} value={formContrasenaEliminarCuenta} className="form-control form--control pl-3" type="password" name="contasena_eliminar_cuenta" maxLength="32" placeholder="" />
                            {erroresCampos['contrasena'].length > 0 && (<SpamError mensaje={erroresCampos['contrasena']} />)}
                        </div>                        
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={eliminarCuenta}> Eliminar cuenta definitivamente </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setVerPopUpEliminarCuenta(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>    
        <div className="dashboard-content-wrap">
            <div className="dashboard-menu-toggler btn theme-btn theme-btn-sm lh-28 theme-btn-transparent mb-4 ml-3">
                <i className="la la-bars mr-1"></i> Dashboard Nav
            </div>
            <div className="container-fluid">
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                    <div className="media media-card align-items-center">
                        <div className="media-img media--img media-img-md rounded-full">
                        <img className="rounded-full" src={datosUsuario.imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${datosUsuario.imagen_pequena}`} alt="Foto del usuario" />
                        </div>
                        <div className="media-body">
                            <h2 className="section__title fs-30">{nombres}</h2>
                            <div className="rating-wrap d-flex align-items-center pt-2">
                                {datosUsuario.docente_reviews>0 && <div className="rating-wrap d-flex align-items-center pt-2">
                                    <div className="review-stars">
                                        <span className="rating-number">{datosUsuario.docente_rating}</span>
                                        <span className="la la-star"></span>
                                        <span className="la la-star"></span>
                                        <span className="la la-star"></span>
                                        <span className="la la-star"></span>
                                        <span className="la la-star-o"></span>
                                    </div>
                                    <span className="rating-total pl-1">({datosUsuario.docente_reviews})</span>
                                </div>}
                            </div>
                        </div>
                    </div>                    
                </div>
                <div className="section-block mb-5"></div>
                <div className="dashboard-heading mb-5">
                    <h3 className="fs-22 font-weight-semi-bold">Configuración</h3>
                </div>
                <ul className="nav nav-tabs generic-tab pb-30px" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==1 ? 'active': ''}`} onClick={event =>{ handleCambiarPestana(event, 1) }} id="edit-profile-tab" data-toggle="tab" href="#edit-profile" role="tab" aria-controls="edit-profile" aria-selected="false">
                            Perfil
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==2 ? 'active': ''}`} onClick={event =>handleCambiarPestana(event, 2) } id="password-tab" data-toggle="tab" href="#password" role="tab" aria-controls="password" aria-selected="true">
                            Contraseña
                        </a>
                    </li>                                  
                    <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==3 ? 'active': ''}`} onClick={event => handleCambiarPestana(event, 3) } id="account-tab" data-toggle="tab" href="#account" role="tab" aria-controls="account" aria-selected="false">
                            Cuenta
                        </a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${pestanaActivada==1 ? 'show active': ''}`} id="edit-profile" role="tabpanel" aria-labelledby="edit-profile-tab">
                        <div className="setting-body">
                            <h3 className="fs-17 font-weight-semi-bold pb-4">Editar perfil</h3>
                            <div className="media media-card align-items-center">
                                <div className="media-img media-img-lg mr-4 bg-gray">
                                    <img className="mr-3" src={datosUsuario.imagen_pequena==null ? `${urlBase}/images/teams11.jpg` : `${urlBaseApi}/${datosUsuario.imagen_pequena}`} alt="Avatar" />
                                </div>
                                <div className="media-body">
                                    <div {...getRootProps()}>    
                                        <input {...getInputProps()} className="multi file-upload-input" />
                                        <span className="file-upload-text"><i className="la la-photo mr-2"></i>Subir foto</span>
                                    </div>
                                    <ul>{fileList}</ul>   
                                    <p className="fs-14">El tamaño máximo de archivo es 2 MB, dimensión mínima: 200x200 y los archivos adecuados son .jpg y .png.</p>
                                </div>
                            </div>
                            <form method="post" className="row pt-40px">
                                <div className="input-box col-lg-6">
                                    <label className="label-text">Nombres</label>
                                    <div className="form-group">
                                        <input onChange={handleNombresChange} maxLength={64} className="form-control form--control" type="text" name="text" value={formNombres} />
                                        <span className="la la-user input-icon"></span>
                                        {erroresCampos['nombres'].length > 0 && (<SpamError mensaje={erroresCampos['nombres']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-6">
                                    <label className="label-text">Apellidos</label>
                                    <div className="form-group">
                                        <input onChange={handleApellidosChange} maxLength={64} className="form-control form--control" type="text" name="text" value={formApellidos} />
                                        <span className="la la-user input-icon"></span>
                                        {erroresCampos['apellidos'].length > 0 && (<SpamError mensaje={erroresCampos['apellidos']} />)}
                                    </div>
                                </div>                                
                                <div className="input-box col-lg-6">
                                    <label className="label-text">Correo electrónico</label>
                                    <div className="form-group">
                                        <input onChange={handleEmailChange}  value={formEmail} maxLength={128} className="form-control form--control" type="email" name="email" />
                                        <span className="la la-envelope input-icon"></span>
                                        {erroresCampos['email'].length > 0 && (<SpamError mensaje={erroresCampos['email']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-6">
                                    <label className="label-text">Teléfono</label>
                                    <div className="form-group">
                                        <input onChange={handleTelefonoChange} value={formTelefono} maxLength={10} className="form-control form--control" type="text" name="text" />
                                        <span className="la la-phone input-icon"></span>
                                        {erroresCampos['telefono'].length > 0 && (<SpamError mensaje={erroresCampos['telefono']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-6">
                                    <label className="label-text">País</label>
                                    <div className="form-group">
                                        <div className="select-container w-auto">
                                            <select value={formIdPais} onChange={handleCambiarPais} className="form-control form--control select-dark" type="text" name="id_pais">                                                        
                                                <option value="">Seleccione País</option>
                                                {paises.map((dato, index) => (
                                                    <option key={dato.id} value={dato.id} >{dato.nombre}</option>
                                                ))}
                                            </select>                                                                                            
                                        </div>
                                        {erroresCampos['id_pais'].length > 0 && (<SpamError mensaje={erroresCampos['id_pais']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-6">
                                    <label className="label-text">Departamento</label>
                                    <div className="form-group">
                                        <select value={formIdDepartamento} onChange={handleDepartamentoChange} className="form-control form--control select-dark" type="text" name="id_departamento">
                                            <option value="" >Seleccione departamento</option>
                                            {departamentos.map((dato, index) => (
                                                <option key={dato.id} value={dato.id} >{dato.nombre}</option>
                                            ))}
                                        </select>
                                        {erroresCampos['id_departamento'].length > 0 && (<SpamError mensaje={erroresCampos['id_departamento']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-6">
                                    <label className="label-text">Ciudad</label>
                                    <div className="form-group">
                                        <input onChange={handleCiudadChange} maxLength={64} className="form-control form--control" type="text" name="text" value={formCiudad} />
                                        {erroresCampos['ciudad'].length > 0 && (<SpamError mensaje={erroresCampos['ciudad']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-6">
                                    <label className="label-text">Cédula</label>
                                    <div className="form-group">
                                        <input onChange={handleCedulaChange} maxLength={16} className="form-control form--control" type="text" name="text" value={formCedula} />
                                        {erroresCampos['identificacion'].length > 0 && (<SpamError mensaje={erroresCampos['identificacion']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-12">
                                    <label className="label-text">Biografía</label>
                                    <div className="form-group">
                                        <textarea onChange={handleBiografiaChange} value={formBiografia!==null ? formBiografia : ''} rows="8" className="form-control form--control user-text-editor pl-3" name="biografia"></textarea>
                                        {erroresCampos['docente_descripcion'].length > 0 && (<SpamError mensaje={erroresCampos['docente_descripcion']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-12 py-2">
                                    <button onClick={handleActualizarPerfil} type="submit" className="btn theme-btn">Guardar cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className={`tab-pane fade ${pestanaActivada==2 ? 'show active': ''}`} id="password" role="tabpanel" aria-labelledby="password-tab">
                        <div className="setting-body">
                            <h3 className="fs-17 font-weight-semi-bold pb-4">Cambiar contraseña</h3>
                            <form method="post" className="row">
                                <div className="input-box col-lg-4">
                                    <label className="label-text">Contaseña actual</label>
                                    <div className="form-group">
                                        <input onChange={handleContrasenActualChange} maxLength={32} className="form-control form--control" type="password" name="text" placeholder="" />
                                        <span className="la la-lock input-icon"></span>
                                        {erroresCampos['contrasena_actual'].length > 0 && (<SpamError mensaje={erroresCampos['contrasena_actual']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-4">
                                    <label className="label-text">Nueva contraseña</label>
                                    <div className="form-group">
                                        <input onChange={handleNuevaContrasenaChange} maxLength={32} className="form-control form--control" type="password" name="text" placeholder="" />
                                        <span className="la la-lock input-icon"></span>
                                        {erroresCampos['nueva_contrasena'].length > 0 && (<SpamError mensaje={erroresCampos['nueva_contrasena']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-4">
                                    <label className="label-text">Confirmar Nueva Contraseña</label>
                                    <div className="form-group">
                                        <input onChange={handleConfirmarNuevaContrasenaChange} maxLength={32} className="form-control form--control" type="password" name="text" placeholder="" />
                                        <span className="la la-lock input-icon"></span>
                                        {erroresCampos['confirmar_nueva_contrasena'].length > 0 && (<SpamError mensaje={erroresCampos['confirmar_nueva_contrasena']} />)}
                                    </div>
                                </div>
                                <div className="input-box col-lg-12 py-2">
                                    <button onClick={handleActualizarContrasena} type="submit" className="btn theme-btn">Cambiar contaseña</button>
                                </div>
                            </form>                            
                        </div>
                    </div>                                       
                    <div className={`tab-pane fade ${pestanaActivada==3 ? 'show active': ''}`} id="account" role="tabpanel" aria-labelledby="account-tab">
                        <div className="setting-body">
                            <h3 className="fs-17 font-weight-semi-bold pb-4">Eliminar cuenta</h3>                            
                            <div className="danger-zone pt-40px">
                                <h4 className="fs-17 font-weight-semi-bold text-danger">Borrar cuenta permanentemente</h4>
                                <p className="pt-1 pb-4"><span className="text-warning">Advertencia: </span>Una vez que eliminas tu cuenta, no hay vuelta atrás. Por favor asegúrese.</p>
                                <button onClick={handleEliminarCuenta} className="btn theme-btn" type="submit">Eliminar mi cuenta</button>
                            </div>
                            <div style={{height:'100px'}}></div>
                        </div>
                    </div>
                </div>
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioCrearVideo;