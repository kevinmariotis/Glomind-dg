import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CountdownClock from "react-countdown-clock";
import Skeleton from 'react-loading-skeleton'
import { AuthContext } from '../AuthContext';
import { mensajesDeError, convertirSegundosAHorasMinutosSegundos } from './utils';
import Spinner from './Spinner';
import Popup from './Popup';
import CompaniasAliadas from './CompaniasAliadas';
import 'react-loading-skeleton/dist/skeleton.css'

function FormularioExamenIntentoResultados() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const navigate = useNavigate(); 
    const { id_examen_intento, id_curso } = useParams();
    const {jwt} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
        
    const [configuracion, setConfiguracion] = useState({fecha_hora_fin_formateada:'', duracion_realizacion:'', calificacion:'', mostrar_retroalimentacion:0, politica_retroalimentacion:0});
    const [preguntas, setPreguntas] = useState({});
    const [curso, setCurso] = useState({nombre:'', instructor:'', url_amigable:'', imagen_pequena:null, es_docente:0});    

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    

    useEffect(() => {           
        window.scrollTo(0, 0);    
        obtenerDatosDelServidor();
        obtenerDatosCurso();
    }, []);
        
        
    const handleFuncionAceptarPopUp = () => {  
        switch(popUp.data_switch){
            case 'iniciar_intento':
                iniciarIntento();
            break;
            case 'borrar_intento':
                borrarIntento();
            break;
        }              
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
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
            const response = await fetch(`${urlBaseApi}/api/examenintento/${id_examen_intento}/${id_curso}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){        
                setPreguntas(datos.preguntas);                                                   
                setConfiguracion(datos.configuracion);                
                if(datos.configuracion.fecha_hora_fin===null){
                    navigate(`/examen/presentacion/${datos.configuracion.id_examen}/${id_curso}`);
                }
            } else {                      
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerDatosCurso = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/curso/informacionBasica/${id_curso}`, opciones);            
            const datos = await response.json();   
            if (response.ok){                                           
                setCurso(datos);                                       
            } else {                      
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
      
    const iniciarIntento = async () => {                          
        try {            
            const formData = new FormData();               
            formData.append('id_examen', configuracion.id_examen);
            formData.append('id_curso', id_curso);
                                    
            const opciones = {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: formData
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/examenintento`, opciones);            
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){                                                           
                navigate(`/examen/intento/${datos.id_intento}/${id_curso}`);
            } else {                      
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const borrarIntento = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'DELETE',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/examenintento/${id_examen_intento}/${id_curso}`, opciones);            
            const datos = await response.json();   
            if (response.ok){                                           
                navigate(`/examen/historial/${configuracion.id_examen}/${id_curso}`);
            } else {                      
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleConfirmarIntento = (event) => {        
        event.preventDefault(); 
        setPopup({mostrar:true, titulo:'Confirmar', tipo:3, contenido:'Confirma que desea iniciar un intento?', data_switch:'iniciar_intento'});
    };

    const handleVerHistorial = (event) => {
        event.preventDefault(); 
        navigate(`/examen/historial/${configuracion.id_examen}/${id_curso}`);
    };

    const handleBorrarIntento = (event) => {
        event.preventDefault(); 
        setPopup({mostrar:true, titulo:'Confirmar', tipo:3, contenido:'Confirma que desea borrar este intento?', data_switch:'borrar_intento'});
    };
    
    const nivelHabilidad = ['', 'Actividad', 'Intermedio', 'Avanzado'];
    const abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return (
        <>
            {mostrarSpinner && <Spinner />}
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
            <section className="breadcrumb-area">
                <div className="bg-white py-3 pattern-bg" style={{zIndex:'0'}}>
                    <div className="container">
                        <div className="breadcrumb-content">
                            <ul className="quiz-nav d-flex flex-wrap align-items-center">
                                <li><Link to={`${urlBase}/play/${curso.url_amigable}`}><i className="la la-arrow-left mr-2"></i>Volver al curso</Link></li>
                                <li>
                                    <div className="d-flex align-items-center">
                                        <div className="media media-card">
                                        {curso.url_amigable=='' ? <Skeleton width={82} height={48} /> : 
                                            <Link to={`/play/${curso.url_amigable}`} className="media-img" style={{ height: 'auto' }}>
                                                {curso.imagen_pequena!=null ? <img src={`${urlBaseApi}/${curso.imagen_pequena}`} alt={curso.nombre} /> : <img src="/images/course-no-image.png" alt={curso.nombre} /> }
                                            </Link>
                                        }
                                        </div>
                                        <p>
                                            {curso.nombre=='' ?  <Skeleton width={300}  style={{marginLeft: '15px'}} /> : <Link to={`/play/${curso.url_amigable}`}>{curso.nombre}</Link>}
                                            {curso.nombre=='' ? <Skeleton width={150}  style={{marginLeft: '15px'}} /> : <span className="d-block fs-13">{curso.instructor}</span>}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>  
                {configuracion.tipo_examen!=1 ? <div className="bg-dark pt-60px pb-60px">
                    <div className="container">
                        <div className="breadcrumb-content text-center">
                            <div className="section-heading">
                                <p className="section__desc text-white-50">Enviado el {configuracion.fecha_hora_fin_formateada}</p>
                                <h2 className="section__title text-white pt-2">Tu calificación es: {configuracion.calificacion}</h2>
                            </div>
                            <div className="breadcrumb-btn-box pt-30px">
                                <button onClick={handleConfirmarIntento} className="btn theme-btn theme-btn-transparent text-white-50 mr-2 mb-2">Reintentar</button>
                                <button onClick={handleVerHistorial} className="btn theme-btn theme-btn-transparent text-white-50 mb-2">Ver historial</button>
                            </div>
                        </div>
                    </div>
                </div> : ''}
                <div className="quiz-action-nav bg-white py-3 shadow-sm">
                    <div className="container">
                        <div className="quiz-action-content d-flex flex-wrap align-items-center justify-content-between">
                            <ul className="quiz-nav d-flex flex-wrap align-items-center">
                                <li>{configuracion.calificacion>=3 ? <i className="la la-check-circle fs-17 mr-2"></i> : <i className="la la-close fs-17 mr-2"></i>}{configuracion.calificacion}/5.0 Puntuación</li>
                                <li><i className="la la-clock fs-17 mr-2"></i>{configuracion.duracion_realizacion}</li>
                                <li><i className="la la-bar-chart fs-17 mr-2"></i>{nivelHabilidad[configuracion.tipo_examen]}</li>
                                {curso.es_docente==1 && <li><button onClick={handleBorrarIntento} className="btn theme-btn theme-btn-transparent text-white-50 mb-2"> Borrar intento</button></li>}                                
                            </ul>
                        </div>
                    </div>
                </div>
            </section>                           
            {configuracion.mostrar_retroalimentacion==1 ? 
                Object.keys(preguntas).map((key) => (   
                    <section key={`pregunta-retro-${key}`} className="quiz-ans-wrap pt-60px pb-60px">
                        <div className="container">
                            <div className="quiz-ans-content">
                                <div className="d-flex align-items-center">
                                    <span className="icon-element icon-element-sm mr-2 bg-1 text-white">{parseInt(key)+1}</span>
                                    <h3 className="fs-22 font-weight-semi-bold">Pregunta {parseInt(key)+1} de { Object.keys(preguntas).length}</h3>
                                    &nbsp;<p className="section__desc text-white-50">| {preguntas[key].porcentaje_puntuacion!=100 ? `${preguntas[key].porcentaje_puntuacion}% - ${preguntas[key].calificacion}`: ''}</p>
                                </div>
                                <p className="pt-2">{preguntas[key].texto_pregunta.split('<br />').map((line, index) => (<span>{line}<br /></span> ))}</p>
                                <ul className="quiz-result-list pt-4 pl-3">
                                    {Object.keys(preguntas[key].pregunta_opciones).map((key2) => (
                                        <li key={`pregunta-op${key}-${key2}`} className="text-black mb-2">
                                            {preguntas[key].id_pregunta_opcion_seleccionada==preguntas[key].pregunta_opciones[key2].id && preguntas[key].pregunta_opciones[key2].porcentaje_puntuacion>0 ?
                                                <span className="icon-element icon-element-xs bg-success text-white mr-2 border border-gray">
                                                    <i className="la la-check"></i>
                                                </span>
                                                :
                                                    preguntas[key].id_pregunta_opcion_seleccionada==preguntas[key].pregunta_opciones[key2].id ?
                                                        <span className="icon-element icon-element-xs bg-danger text-white mr-2 border border-gray">
                                                            <i className="la la-close"></i>
                                                        </span>
                                                    :
                                                        <span className="icon-element icon-element-xs mr-2 border border-gray">{abecedario[key2<=25 ? key2 : 25]}</span>

                                            }                                            
                                            {preguntas[key].pregunta_opciones[key2].texto_opcion.split('<br />').map((line, index2) => (<span>{line}<br /></span> ))}
                                        </li>
                                    ))}                                       
                                </ul>
                                {parseInt(preguntas[key].calificacion)!=0 ?
                                    preguntas[key].texto_retro_afirmativa!=null ? <p className="section__desc text-white-50">{preguntas[key].texto_retro_afirmativa.split('<br />').map((line, index) => (<span>{line}<br /></span> ))}</p> : ''
                                    :
                                    preguntas[key].texto_retro_negativa!=null ? <p className="section__desc text-white-50">{preguntas[key].texto_retro_negativa.split('<br />').map((line, index) => (<span>{line}<br /></span> ))}</p> : ''
                                }
                            </div>
                        </div>                        
                    </section> 
                ))
            : 
                <div className="bg-dark pt-60px pb-60px">
                    <div className="container">
                        <div className="breadcrumb-content text-center">
                            <div className="section-heading">
                                <p className="section__desc text-white-50">Las retroalimentaciones no están disponibles{configuracion.politica_retroalimentacion==3 ? ' hasta que completes todos los intentos.' : '  en este momento.'}</p>                                
                            </div>                            
                        </div>
                    </div>
                </div>                        
            }             
            <div className="quiz-action-nav bg-white py-3 shadow-sm">
                <div className="container">
                    <div className="quiz-action-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="breadcrumb-btn-box pt-30px">
                            <Link to={`${urlBase}/play/${curso.url_amigable}`} className="btn theme-btn theme-btn-transparent text-white-50 mr-2 mb-2">Volver al curso</Link>                                        
                        </div>
                    </div>
                </div>
            </div>
            <CompaniasAliadas />
        </>
    )
}

export default FormularioExamenIntentoResultados;