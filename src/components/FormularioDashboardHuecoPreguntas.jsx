import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError, cortarCadenaPorCaracter } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioDashboardHuecoPreguntas() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const navigate = useNavigate(); 
    const {jwt, permissions} = useContext(AuthContext);
    const { id, id_curso } = useParams();
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});                    
    const [PopUpAgrupacion, setPopUpAgrupacion] = useState({mostrar:false, titulo:'', contenido:''});                    
    const [popUpCrearPregunta, setPopUpCrearPregunta] = useState(false);
    const [popUpCrearHuecoPregunta, setPopUpCrearHuecoPregunta] = useState(false);
    const [popUpConfirmar, setPopupConfirmar] = useState({mostrar:false, titulo:'', contenido:'', data:-1, tipo:''});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    const [mostrarMensaje100, setMostrarMensaje100] = useState(false);    
    const [editandoIdAgrupacion, setEditandoIdAgrupacion] = useState(-1);        
    const [editandoIdHuecoPregunta, setEditandoIdHuecoPregunta] = useState(-1);        
    const [porcentajeValor, setPorcentajeValor] = useState(0);
    const [agrupacionPreguntaFija, setAgrupacionPreguntaFija] = useState(-1);    

    const [huecos, setHuecos] = useState([]);    
    const [agrupaciones, setAgrupaciones] = useState([]);    
    const [preguntas, setPreguntas] = useState([]);    
    const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
    const [agrupacionesDisponibles, setAgrupacionesDisponibles] = useState([]);
           
    const [nombreAgrupacion, setNombreAgrupacion] = useState('');    
    

    useEffect(() => {           
        window.scrollTo(0, 0);
        obtenerDatosServidor();
    }, []);
   
               
    //Estados de los errores de campos
    const camposErrores = {        
        'nombre':[],
        'id_examen_agrupacion_preguntas':[],
        'id_examen_agrupacion':[],        
        'id_examen_hueco_pregunta':[],        
        'porcentaje_valor':[],                
    }    
    const [erroresCampos, setErrorCampo] = useState(camposErrores);
    const setErrorCampoGlobal = (index, newValue) => {
        if (index in erroresCampos) {
            const nuevoObjeto = erroresCampos[index].concat(newValue);            
            let objeto = erroresCampos;
            objeto[index] = nuevoObjeto;        
            setErrorCampo(objeto);      
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
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const handleFuncionCerrarPopUpConfirmar = () => {        
        setPopupConfirmar({...popUp, mostrar:false});
    };
    const handlePopUpConfirmarBorrarExamenPregunta = (id_examen_pregunta) => {      
        setPopupConfirmar({mostrar:true, titulo:'Confirmar', contenido:'Confirma borrar esta pregunta?', tipo:'pregunta', data:id_examen_pregunta});
    }
    const handlePopUpConfirmarBorrarHuecoPregunta = (id_hueco_pregunta) => {      
        setPopupConfirmar({mostrar:true, titulo:'Confirmar', contenido:'Confirma borrar esta pregunta del examen?', tipo:'hueco', data:id_hueco_pregunta});
    }
    
    const handleAgregarHuecoPregunta = (event) => {        
        event.preventDefault();
        reiniciarErrorCampoGlobal();  
        setPorcentajeValor(-1);
        setEditandoIdHuecoPregunta(-1);
        setPopUpCrearHuecoPregunta(true);
        obtenerDatosFormularioHueco();
    };    
    const handleAgregarAgrupacion = (event) => {        
        event.preventDefault();
        setNombreAgrupacion('');
        setEditandoIdAgrupacion(-1);
        setPopUpAgrupacion({...PopUpAgrupacion, mostrar:true});        
    }; 
    

    const handleAgregarPregunta = (event) => {        
        event.preventDefault();
        setPopUpCrearPregunta(true);
    };
    
    const handleSetNombreAgrupacion = (event) => {  setNombreAgrupacion(event.target.value); };
    const handlePorcentajeValor = (event) => { setPorcentajeValor(event.target.value);    };
    const handleAgrupacionPreguntaFija = (event) => { setAgrupacionPreguntaFija(event.target.value);    };
    
    const handleClickEditarAgrupacion = (data) => {
        setEditandoIdAgrupacion(data.id_agrupacion);

        setNombreAgrupacion(data.nombre_actual);
        setPopUpAgrupacion({...PopUpAgrupacion, mostrar:true});
                
        //console.log("editando agrupacion ", data.id_agrupacion);
    };

    const handleEditarHuecoPregunta = (data) => {
        obtenerDatosFormularioHueco();                     
        setEditandoIdHuecoPregunta(data.id_hueco_pregunta);
        setAgrupacionPreguntaFija(data.id_examen_agrupacion);        
        setPorcentajeValor(data.porcentaje_valor);
        setPopUpCrearHuecoPregunta(true);          
    };

    const obtenerDatosServidor = async () => {
        setMostrarSpinner(true);        
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }  
        //obtenemos los huecos de pregunta de este examen      
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            
            let url = `${urlBaseApi}/api/examen/getHuecosPregunta/${id}`;
            if (typeof id_curso !== 'undefined') {
                url+=`/${id_curso}`;
            }
            
            const response = await fetch(url, opciones);            
            
            const datos = await response.json();   
            if (response.ok){                                     
                setHuecos(datos);

                let acumulador = 0;
                datos.forEach(function(element){
                    acumulador = acumulador + element.porcentaje_valor;
                });
                setMostrarMensaje100(acumulador!=100 ? true : false);                
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }

        //obtenemos las agrupaciones de este examen
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
                                    
            const response = await fetch(`${urlBaseApi}/api/examen/getAgrupacionesPreguntas/${id}`, opciones);                        
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){                                     
                setAgrupaciones(datos);                
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }

        //obtenemos las preguntas de este examen
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
                                    
            const response = await fetch(`${urlBaseApi}/api/examen/getPreguntas/${id}`, opciones);                        
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){                                     
                setPreguntas(datos);                
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerDatosFormularioHueco = async () => {
        setMostrarSpinner(true);
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }  
        //obtenemos los huecos de pregunta de este examen      
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
                                               
            const response = await fetch(`${urlBaseApi}/api/examenhuecopregunta/getFormularioCrear/${id}${typeof id_curso !== 'undefined' ? `/${id_curso}` : ''}`, opciones);            
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){                                     
                setAgrupacionesDisponibles(datos.agrupaciones);
                setPreguntasDisponibles(datos.preguntas_fijas);
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }        
    };
    
    const handleGuardarEditarHueco = async (event) => {
        event.preventDefault();      
        reiniciarErrorCampoGlobal();  
        if(editandoIdHuecoPregunta==-1){
            const formData = new FormData();                            
            formData.append('id_examen', id);
            formData.append('id_examen_agrupacion', agrupacionPreguntaFija);        
            formData.append('porcentaje_valor', porcentajeValor);
            if (typeof id_curso !== 'undefined'){
                formData.append('id_curso', id_curso);
            }        
                    
            const opciones = {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: formData
            };
            
            try {
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/examenhuecopregunta`, opciones);
                setMostrarSpinner(false);
                const datos = await response.json();                            
                if (response.ok){                       
                    setPopUpCrearHuecoPregunta(false);
                    setEditandoIdHuecoPregunta(-1);                    
                    setPorcentajeValor(0);
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Pregunta Fija o Agrupación establecida en el examen.'});
                    obtenerDatosServidor();
                    return;
                } else {                                
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }
        }else{
            const raw = {           
                'id_examen_agrupacion': agrupacionPreguntaFija.toString(),
                'porcentaje_valor': porcentajeValor,
            };                    
            if (typeof id_curso !== 'undefined') {
                raw.id_curso = id_curso;                
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
                const response = await fetch(`${urlBaseApi}/api/examenhuecopregunta/${editandoIdHuecoPregunta}`, opciones);
                setMostrarSpinner(false);
                const datos = await response.json();                        
                if(response.ok){
                    setPopUpCrearHuecoPregunta(false);
                    setEditandoIdHuecoPregunta(-1);                    
                    setPorcentajeValor(0);
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Asignación editada.'});
                    obtenerDatosServidor();
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }

        }
    }

    const handleGuardarEditarAgrupacion = async (event) => {
        event.preventDefault();      
        reiniciarErrorCampoGlobal();  
        if(editandoIdAgrupacion==-1){
            const formData = new FormData();                
            formData.append('nombre', nombreAgrupacion);        
            formData.append('id_examen', id);
            formData.append('pregunta_fija', 0);
            if (typeof id_curso !== 'undefined'){
                formData.append('id_curso', id_curso);
            }        
                    
            const opciones = {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: formData
            };
            
            try {
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/examenagrupacionpreguntas`, opciones);
                setMostrarSpinner(false);
                const datos = await response.json();            
                if (response.ok){   
                    setNombreAgrupacion('');
                    setPopUpAgrupacion({...PopUpAgrupacion, mostrar:false});        
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Agrupacion creada.'});
                    obtenerDatosServidor();
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }
        }else{
            const raw = {           
                'nombre': nombreAgrupacion,                        //.toString()
            };                    
            if (typeof id_curso !== 'undefined') {
                raw.id_curso = id_curso;                
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
                const response = await fetch(`${urlBaseApi}/api/examenagrupacionpreguntas/${editandoIdAgrupacion}`, opciones);
                setMostrarSpinner(false);
                const datos = await response.json();                        
                if(response.ok){
                    setNombreAgrupacion('');                    
                    setPopUpAgrupacion({...PopUpAgrupacion, mostrar:false});        
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Agrupacion guardada.'});
                    obtenerDatosServidor();
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }

        }
    }    

    const handleBorrarAgrupacion = async (id_agrupacion) => {                
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/examenagrupacionpreguntas/${id_agrupacion}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();                        
            if(response.ok){                
                setPopup({mostrar:true, titulo:'Listo', contenido:'Agrupacion borrada.'});
                obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }
    
    const handleAceptarConfirmar = async () => {        
        setPopupConfirmar({...popUp, mostrar:false});
        switch(popUpConfirmar.tipo){
            case 'pregunta':
                handleBorrarPregunta();
                return;
            break;
            case 'hueco':
                handleBorrarHuecoPregunta();
                return;
            break;
        }
    }    

    const handleBorrarPregunta = async () => {                
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/examenpregunta/${popUpConfirmar.data}${typeof id_curso !== 'undefined' ? `/${id_curso}` : ''}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();                        
            if(response.ok){                
                setPopup({mostrar:true, titulo:'Listo', contenido:'Pregunta borrada del banco de pregunta del examen.'});
                obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };

    const handleBorrarHuecoPregunta = async () => {                
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/examenhuecopregunta/${popUpConfirmar.data}${typeof id_curso !== 'undefined' ? `/${id_curso}` : ''}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();                        
            if(response.ok){                
                setPopup({mostrar:true, titulo:'Listo', contenido:'Pregunta borrada del examen.'});
                obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };

    const handleMoverHuecoPregunta = async (event, id_examen_hueco_pregunta, direccion) => {
        event.preventDefault();                
        const raw = {
            'direccion': direccion,                        
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
            const response = await fetch(`${urlBaseApi}/api/examenhuecopregunta/mover/${id_examen_hueco_pregunta}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'No es posible', 'contenido': 'Realizar este movimiento.'});                                                                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }

    }

    const tipo_preguntas = {
        '1':'Múltiples opciones única respuesta',
        '2':'Falso o verdadero',
    }
    const porcentaje_valor = Array.from({ length: 100 }, (_, index) => index + 1);

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
        <Popup 
            mostrarPopup={popUpConfirmar.mostrar} 
            tamano="xx"
            tipo={3} 
            titulo={popUpConfirmar.titulo} 
            mensaje={popUpConfirmar.contenido} 
            funcionAceptar={handleAceptarConfirmar} 
            funcionCerrar={handleFuncionCerrarPopUpConfirmar}
            textoCerrar="Cancelar"
            textoAceptar="Borrar"
        />
        <div className={`modal fade modal-container ${popUpCrearHuecoPregunta ? 'show' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="crearHuecoPregunta" tabIndex="-1" role="dialog" aria-labelledby="crearHuecoPregunta" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="crearHuecoPreguntaTitle">{editandoIdHuecoPregunta!=-1 ? 'Editar pregunta establecida' : 'Agregar espacio para pregunta'}</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Agrupación o pregunta fija</label>
                            <select onChange={handleAgrupacionPreguntaFija} value={agrupacionPreguntaFija} name="id_agrupacion_agregar" className="form-control select-dark">
                                <option value={0}> -- Seleccione --</option>                                            
                                {agrupacionesDisponibles.map((tema) => (
                                    <option key={tema.id} value={tema.id}>
                                        Agrup: {tema.nombre}
                                    </option>
                                ))}
                                {preguntasDisponibles.map((tema) => (
                                    <option key={tema.id} value={tema.id}>
                                        P.Fija: {tema.texto_pregunta.length>100 ? tema.texto_pregunta.slice(0, 100).replace(/<br \/>/g, ' ') + "..." : tema.texto_pregunta.replace(/<br \/>/g, ' ')}
                                    </option>
                                ))}
                            </select>
                            {erroresCampos['id_examen_agrupacion'].length > 0 && (<SpamError mensaje={erroresCampos['id_examen_agrupacion']} />)}
                        </div>
                        <div className="form-group">
                            <label className="label-text">Porcentaje en el examen</label>
                            <select onChange={handlePorcentajeValor} value={porcentajeValor} name="porcentaje_valor" className="form-control select-dark">
                                <option value={0}> -- Seleccione --</option>                                            
                                {porcentaje_valor.map((number) => (
                                    <option key={number} value={number}>
                                        {number} %
                                    </option>
                                ))}                                            
                            </select>
                            {erroresCampos['porcentaje_valor'].length > 0 && (<SpamError mensaje={erroresCampos['porcentaje_valor']} />)}
                        </div>                        
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={handleGuardarEditarHueco}> Guardar </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setPopUpCrearHuecoPregunta(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>
        <div className={`modal fade modal-container ${PopUpAgrupacion.mostrar==true ? 'show' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="crearAgrupacion" tabIndex="-1" role="dialog" aria-labelledby="crearAgrupacionTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="crearAgrupacionTitle">{editandoIdAgrupacion!=-1 ? 'Editar agrupación' : 'Crear agrupación'}</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Nombre</label>
                            <input onChange={handleSetNombreAgrupacion} value={nombreAgrupacion} className="form-control form--control pl-3" type="text" name="nombre_agrupacion" maxLength="64" placeholder="Ej: Preguntas sobre CSS" />
                            {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}
                        </div>                        
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={handleGuardarEditarAgrupacion}> Guardar </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setPopUpAgrupacion({...PopUpAgrupacion, mostrar:false}); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>
        <div className={`modal fade modal-container ${popUpCrearPregunta ? 'show' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="crearPregunta" tabIndex="-1" role="dialog" aria-labelledby="crearPreguntaTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="crearPreguntaTitle">Crear pregunta</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Seleccione el tipo de pregunta</label><br/><br/>
                            <Link to={`${urlBase}/examen/crearpregunta/falso_verdadero/${id}${typeof id_curso !== 'undefined' ? `/${id_curso}` : ''}`} className="btn theme-btn" type="button" ><i className="la la-plus mr-2"></i>Falso o verdadero</Link>
                            &nbsp;<Link to={`${urlBase}/examen/crearpregunta/seleccion_multiple_unica_respuesta/${id}${typeof id_curso !== 'undefined' ? `/${id_curso}` : ''}`} className="btn theme-btn" type="button" ><i className="la la-plus mr-2"></i>Selección múltiple, única respuesta</Link>
                            
                        </div>                        
                    </div>
                    <div className="modal-footer border-top-gray">                                                
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setPopUpCrearPregunta(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="dashboard-content-wrap">
            <div className="container-fluid">
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                    <div className="media media-card align-items-center">                        
                        {typeof id_curso !== 'undefined' ? <Link to={`/curso/contenido/${id_curso}`}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la edición de contenidos" title="Volver a la edición de contenidos"><i className="la la-angle-left"></i></div></Link> : ''}                        
                        &nbsp;<h3 className="fs-22 font-weight-semi-bold">Editar preguntas</h3>                        
                    </div>                    
                    <div className="btn-box pt-30px">
                        
                    </div>
                </div>                
                <form action="#">                      
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Preguntas establecidas</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                
                                <div className="col-lg-12"> 
                                    {mostrarMensaje100 ? <div class="alert alert-warning" role="alert">La suma de los porcentajes de todas las preguntas deben dar 100%</div> : ''}
                                    <div className="table-responsive">
                                        <table className="table generic-table">
                                            <thead>
                                            <tr>               
                                                <th scope="col"></th> 
                                                <th scope="col">Tipo</th>                             
                                                <th scope="col">Agrupación / Pregunta</th>
                                                <th scope="col">Porcentaje</th>                                            
                                                <th scope="col"></th>
                                            </tr>
                                            </thead>
                                            <tbody >
                                                {huecos.map((tema) => 
                                                    <tr key={`contenido-x-${tema.id}`}>
                                                        <th scope="row">
                                                            {tema.posicion+1}
                                                        </th>
                                                        <th scope="row">
                                                            {tema.pregunta_fija==1 ? <div className="course-badge sky-blue">Fija</div>: 'Aleatoria'}
                                                        </th>
                                                        <th scope="row">
                                                            {tema.pregunta_fija==0 ? <span style={{border: '1px dotted white', padding: '5px', borderRadius: '5px'}}>{tema.nombre}</span> : cortarCadenaPorCaracter(tema.texto_pregunta, '.', 10).split('<br />').map((line, index) => (<span style={{ fontStyle: 'italic' }}>{line}<br /></span> ))}
                                                        </th>
                                                        <td>
                                                            {tema.porcentaje_valor}%
                                                        </td>                                                                                                        
                                                        <td>    
                                                            <a href="#" className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-success" data-toggle="tooltip" data-placement="top" data-title="Subir" onClick={event => handleMoverHuecoPregunta(event, tema.id, -1)} title="Subir"><i className="la la-sort-up"></i></a>
                                                            <a href="#" className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-success" data-toggle="tooltip" data-placement="top" data-title="Bajar" onClick={event => handleMoverHuecoPregunta(event, tema.id, 1)} title="Bajar"><i className="la la-sort-down"></i></a>

                                                            <div onClick={()=>{ handleEditarHuecoPregunta({'id_hueco_pregunta':tema.id, 'id_examen_agrupacion':tema.id_agrupacion, 'porcentaje_valor':tema.porcentaje_valor}) }  } className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Editar configuración" title="Configurar"><i className="la la-gear"></i></div>
                                                            <div onClick={()=>{ handlePopUpConfirmarBorrarHuecoPregunta(tema.id); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Borrar">
                                                                <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}                                
                                            </tbody>
                                        </table>                            
                                    </div>
                                </div>                                                                
                            </div>
                            <button className="btn theme-btn" style={{marginTop:'20px'}} type="submit" onClick={handleAgregarHuecoPregunta}><i className="la la-plus mr-2"></i> Agregar espacio para pregunta</button>&nbsp;
                        </div>
                    </div>                    
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Agrupaciones de preguntas</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                
                                <div className="col-lg-12">                                     
                                    <div className="table-responsive">
                                        <table className="table generic-table">
                                            <thead>
                                            <tr>               
                                                <th scope="col">Nombre</th>                                                 
                                                <th scope="col"></th>
                                            </tr>
                                            </thead>
                                            <tbody >
                                                {agrupaciones.map((tema) => 
                                                    <tr key={`contenido-agrupacion-${tema.id}`}>
                                                        <th scope="row">
                                                            {tema.nombre}
                                                        </th>                                                        
                                                        <td>                                                                
                                                            <div onClick={(event) => { handleClickEditarAgrupacion({'id_agrupacion':tema.id, 'nombre_actual':tema.nombre}) }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Editar configuración" title="Configurar"><i className="la la-gear"></i></div>
                                                            <div onClick={()=>{ handleBorrarAgrupacion(tema.id) }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Borrar">
                                                                <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}                                
                                            </tbody>
                                        </table>                            
                                    </div>
                                </div>                                                                
                            </div>
                            <button className="btn theme-btn" style={{marginTop:'20px'}} type="submit" onClick={handleAgregarAgrupacion}><i className="la la-plus mr-2"></i> Crear agrupación</button>
                        </div>
                    </div>
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Banco de preguntas del examen</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                
                                <div className="col-lg-12">                                     
                                    <div className="table-responsive">
                                        <table className="table generic-table">
                                            <thead>
                                            <tr>               
                                                <th scope="col">Pregunta</th>
                                                <th scope="col">Pertenece a la agrupación</th>
                                                <th scope="col">Estado</th>
                                                <th scope="col">Tipo</th>                                                
                                                <th scope="col"></th>
                                            </tr>
                                            </thead>
                                            <tbody >
                                                {preguntas.map((tema) => 
                                                    <tr key={`contenido-x-${tema.id}`}>
                                                        <th scope="row">
                                                            {cortarCadenaPorCaracter(tema.texto_pregunta, '.', 10).split('<br />').map((line, index) => (
                                                                <span style={{ fontStyle: 'italic' }}>{line}<br /></span>                                                                
                                                            ))}
                                                        </th>
                                                        <th scope="row">
                                                            {tema.pregunta_fija==0 ? <span style={{border: '1px dotted white', padding: '5px', borderRadius: '5px'}}>{tema.agrupacion}</span> : <div className="course-badge sky-blue">Fija</div>}
                                                        </th>
                                                        <th scope="row">
                                                            {tema.estado==1? 'Activado' : 'Desactivado'}
                                                        </th>
                                                        <th scope="row">
                                                            {tipo_preguntas[tema.tipo_pregunta]}
                                                        </th>                                                        
                                                        <td>   
                                                            {tema.tipo_pregunta==1 ? <Link to={`${urlBase}/examen/editarpregunta/seleccion_multiple_unica_respuesta/${id}/${tema.id}${typeof id_curso !== 'undefined' ? `/${id_curso}` : ''}`} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Editar configuración" title="Configurar"><i className="la la-gear"></i></Link> : ''}                                                                                                                         
                                                            <div onClick={()=>{ handlePopUpConfirmarBorrarExamenPregunta(tema.id); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Borrar">
                                                                <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}                                
                                            </tbody>
                                        </table>                            
                                    </div>
                                </div>                                                                
                            </div>
                            <button style={{marginTop:'20px'}} className="btn theme-btn" type="submit" onClick={handleAgregarPregunta}><i className="la la-plus mr-2"></i> Crear pregunta</button>
                        </div>
                    </div>
                    <div className="course-submit-btn-box pb-4">                                                
                        
                    </div>
                </form>
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioDashboardHuecoPreguntas;