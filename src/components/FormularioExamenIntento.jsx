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

function FormularioExamenIntento() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const navigate = useNavigate(); 
    const { id_examen_intento, id_curso } = useParams();
    const {jwt} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
    
    const [preguntas, setPreguntas] = useState({});
    const [configuracion, setConfiguracion] = useState({tiempo:0, tiempo_restante:-1, cerrado_por_tiempo:0, fecha_hora_fin:null});
    const [curso, setCurso] = useState({nombre:'', instructor:'', url_amigable:'', imagen_pequena:null});
    const [preguntaActual, setPreguntaActual] = useState(-1);

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    

    useEffect(() => {           
        window.scrollTo(0, 0);    
        obtenerDatosDelServidor();
        obtenerDatosCurso();
    }, []);

    useEffect(() => {                   
        if(configuracion.cerrado_por_tiempo==1){
            handleTiempoTerminado();
        }else{            
            if(configuracion.fecha_hora_fin!==null && popUp.data_switch!='tiempo_terminado'){
                navigate(`/examen/resultados/${id_examen_intento}/${id_curso}`);
                /*if(configuracion.tipo_examen!=1){
                    navigate(`/examen/presentacion/${configuracion.id_examen}/${id_curso}`);
                }else{
                    navigate(`/examen/resultados/${id_examen_intento}/${id_curso}`);
                }*/
            }
        }
    }, [configuracion]);

    useEffect(() => {    
        if(verificarTodasRespondidas()){
            if(configuracion.tipo_examen!=1){
                handleConfirmarEnviarIntentoPorCompletado();
            }
        }
    }, [preguntas]);
    
    const verificarTodasRespondidas = () => {
        if(Object.keys(preguntas).length>0){
            let respondidas = 0;
            {Object.keys(preguntas).map((key) => {               
                if(preguntas[key].id_pregunta_opcion_seleccionada!==null){
                    respondidas++;
                }
            })} 
            if(respondidas==Object.keys(preguntas).length){
                return true;
            }else{
                return false;
            }
        }
        return false;
    }     

    const handleFuncionAceptarPopUp = () => {        
        switch(popUp.data_switch){
            case 'tiempo_terminado':
                navigate(`/examen/resultados/${id_examen_intento}/${id_curso}`);
                /*if(configuracion.tipo_examen!=1){
                    navigate(`/examen/presentacion/${configuracion.id_examen}/${id_curso}`);
                }else{
                    navigate(`/examen/resultados/${id_examen_intento}/${id_curso}`);
                } */   
            break;
            case 'enviar_respuestas':
                handleCerrarIntento(false);
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
                setPreguntaActual(0);                
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
    
    const handleEnviarRespuestaPregunta = async (id_pregunta, id_pregunta_opcion_seleccionada) => {                             
        const raw = {            
            'id_pregunta_opcion_seleccionada': id_pregunta_opcion_seleccionada+'',            
        };                            
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {            
            const response = await fetch(`${urlBaseApi}/api/examenRespuestaPregunta/${id_examen_intento}/${id_pregunta}`, opciones);            
            const datos = await response.json();            
            if (response.ok){    
                //setPopup({mostrar:true, titulo:'Listo', contenido:'Cambios guardados correctamente.'});
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    const handleCerrarIntento = async (cerrado_por_tiempo=false) => {
        const raw = {            
            'id_examen_intento': id_examen_intento+'',            
            'id_curso': id_curso+'',
        };                            
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {            
            const response = await fetch(`${urlBaseApi}/api/examenintento/cerrarintento/1`, opciones);            
            const datos = await response.json();            
            if (response.ok){
                if(cerrado_por_tiempo){
                    handleTiempoTerminado();
                }else{
                    setPopup({mostrar:true, titulo:'Respuestas enviadas', tipo:3, contenido:'Ahora podrás ver tus resultados.', data_switch:'tiempo_terminado'});
                }
                //setPopup({mostrar:true, titulo:'Listo', contenido:'Cambios guardados correctamente.'});
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    const cambiarPregunta = (id_pregunta) => {                        
        setPreguntaActual(id_pregunta);       
    };
    
    const actualizarOpcionSeleccionada = (index, id_pregunta_opcion_seleccionada) => {        
        let actualizado = false;        
        setPreguntas((prevPreguntas) => {
            const nuevaPreguntas = { ...prevPreguntas };
            if (nuevaPreguntas[index]) {                
                if(!actualizado){
                    handleEnviarRespuestaPregunta(nuevaPreguntas[index].id_pregunta, id_pregunta_opcion_seleccionada);
                    actualizado = true;
                }
                nuevaPreguntas[index].id_pregunta_opcion_seleccionada = id_pregunta_opcion_seleccionada;                
            }
            return nuevaPreguntas;
        });        
      };

    const handleConfirmarEnviarIntento = (event) => {        
        event.preventDefault(); 
        if(configuracion.tipo_examen!=1){             
            setPopup({mostrar:true, titulo:'Confirmar', tipo:3, contenido:'Confirma que desea enviar las respuestas?', data_switch:'enviar_respuestas'});
        }else{
            //debe haber respondido todas
            if(verificarTodasRespondidas()){
                handleCerrarIntento(false);
            }else{
                setPopup({mostrar:true, titulo:'Señala tu respuesta', tipo:2, contenido:'Falta alguna respuesta por señalar.', data_switch:''});
            }
        }
    };

    const handleConfirmarEnviarIntentoPorCompletado = () => {                
        setPopup({mostrar:true, titulo:'Deseas enviar las respuestas?', tipo:3, contenido:'Has terminado de responder, deseas enviar las respuestas ahora?', data_switch:'enviar_respuestas'});
    };
   
    const handleTiempoTerminado = () => {                
        setPopup({mostrar:true, titulo:'Tiempo superado!', tipo:2, contenido:'El tiempo para responder ha terminado y el intento fue cerrado, las respuestas que hayas seleccionado se procesaron y generaron una calificación.', data_switch:'tiempo_terminado'});
    };

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
                                                {curso.imagen_pequena!=null ? <img src={`${urlBaseApi}/${curso.imagen_pequena}`} alt={curso.nombre} /> : <img src="images/course-no-image.png" alt={curso.nombre} /> }
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
                <div className="bg-dark pt-60px pb-60px">
                    <div className="container" >  
                        {preguntaActual!=-1 && Object.keys(preguntas).length>1 ?
                        <ul className="quiz-course-nav d-flex align-items-center justify-content-between list_preguntas" style={{overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom:'15px'}}>
                            {Object.keys(preguntas).map((key) => (   
                                <li key={`scroll-preguntas-${key}`}>
                                    <span onClick={e => cambiarPregunta(key) } className="icon-element icon-element-sm" style={{cursor:'pointer'}} data-toggle="tooltip" data-placement="top" title={`Pregunta ${parseInt(key)+1}`}>
                                        {preguntas[key].id_pregunta_opcion_seleccionada==null ? parseInt(key)+1 :
                                            <span className="icon-element icon-element-sm text-success" data-toggle="tooltip" data-placement="top" title={`Pregunta ${parseInt(key)+1}`}>
                                                <i className="la la-check"></i>
                                            </span>
                                        }                                        
                                    </span>
                                </li>
                            ))}                                                        
                        </ul> : ''}
                        {preguntaActual!=-1 && <div className="breadcrumb-content pt-40px">
                            <div className="section-heading">
                                {preguntaActual!=-1 && Object.keys(preguntas).length>1 ? <h2 className="section__title text-white fs-30 pb-2">Pregunta {parseInt(preguntaActual)+1} de {Object.keys(preguntas).length}</h2> : ''}
                                <p className="section__desc text-white-50">{preguntas[preguntaActual].texto_pregunta.split('<br />').map((line, index) => (<span>{line}<br /></span> ))}</p>                                
                            </div>
                        </div>}
                    </div>
                </div>
                {preguntaActual!=-1 ? <div className="quiz-action-nav bg-white py-3 shadow-sm">
                    <div className="container">
                        <div className="quiz-action-content d-flex flex-wrap align-items-center justify-content-between">
                            <ul className="quiz-nav d-flex align-items-center">
                                {Object.keys(preguntas).length>1 && <li>
                                    {preguntaActual!=-1 ? <><i className="la la-sliders fs-17 mr-2"></i>Esta pregunta aquivale al {preguntas[preguntaActual].porcentaje_puntuacion}% {configuracion.tipo_examen!=1 ? 'del examen' : 'de la actividad'} </> : ''}                                    
                                </li>}
                                <li>
                                    {preguntaActual!=-1 ? <button onClick={e => handleConfirmarEnviarIntento(event) } href="#" className="btn theme-btn theme-btn-transparent mr-2">Terminar intento</button> : ''}
                                </li>
                                <li>
                                    {configuracion.tiempo!=0 && configuracion.tiempo_restante!=0  ?
                                        <CountdownClock seconds={configuracion.tiempo_restante}
                                            color="#D7D7D7"
                                            alpha={0.9}
                                            size={50}
                                            weight={4}
                                            fontSize="12px"
                                            onComplete={() => { handleCerrarIntento(true); }} />
                                    : ''}    
                                </li>
                            </ul>
                            <div className="quiz-nav-btns">                                        
                                {preguntaActual!=-1 && preguntaActual>0 ? <a onClick={e => cambiarPregunta(parseInt(preguntaActual)-1) } href="#" className="btn theme-btn theme-btn-transparent mr-2">Pregunta Anterior</a> : ''}
                                {preguntaActual!=-1 && (parseInt(preguntaActual)+1)<Object.keys(preguntas).length ? <a onClick={e => cambiarPregunta(parseInt(preguntaActual)+1) } href="#" className="btn theme-btn">Siguiente pregunta <i className="la la-angle-right icon ml-1"></i></a> : ''}
                            </div>
                        </div>
                    </div>
                </div> : ''}
            </section>                           
            <section className="quiz-ans-wrap pt-60px pb-60px">
                <div className="container">
                    <div className="quiz-ans-content">
                        <h3 className="fs-22 font-weight-semi-bold">Tu respuesta:</h3>
                        <div className="quiz-ans-list py-3">
                            {preguntaActual==-1 ? '' :
                                preguntas[preguntaActual].tipo_pregunta==1 || preguntas[preguntaActual].tipo_pregunta==2 ? 
                                    <>
                                        {Object.keys(preguntas[preguntaActual].pregunta_opciones).map((key) => (   
                                            <div className="custom-control custom-radio mb-1" key={`pregunta-opcion-${preguntas[preguntaActual].pregunta_opciones[key].id}`} style={{marginTop:'20px'}}>
                                                <input onClick={e => actualizarOpcionSeleccionada(preguntaActual, preguntas[preguntaActual].pregunta_opciones[key].id) } name={`pregunta-${preguntaActual}`} checked={preguntas[preguntaActual].id_pregunta_opcion_seleccionada==preguntas[preguntaActual].pregunta_opciones[key].id ? 'checked' : '' } type="radio" className="custom-control-input" id={`opcion-${preguntas[preguntaActual].pregunta_opciones[key].id}`} />
                                                <label className="custom-control-label custom--control-label" htmlFor={`opcion-${preguntas[preguntaActual].pregunta_opciones[key].id}`}>
                                                    {preguntas[preguntaActual].pregunta_opciones[key].texto_opcion.split('<br />').map((line, index2) => (<span>{line}<br /></span> ))}
                                                </label>
                                            </div> 
                                        ))}                                                                                 
                                    </>
                                : 
                                preguntas[preguntaActual].tipo_pregunta==3 ? 
                                    <>

                                    </>
                                : ''
                            } 
                        </div>
                        {preguntaActual==-1 ? '' :
                                preguntas[preguntaActual].tipo_pregunta==1 ? 
                                    <p className="fs-15"><strong className="font-weight-semi-bold text-black">Nota:</strong> Solo una opción es la correcta.</p>
                                : ''
                        }        
                    </div>
                </div>
            </section>            
            <CompaniasAliadas />
        </>
    )
}

export default FormularioExamenIntento;