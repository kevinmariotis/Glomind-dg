import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import SpamError from './SpamError';
import Spinner from './Spinner';
import Popup from './Popup';

function HiloComentarios({id_hilo=0, id_objeto_enlace=-1, tipo_objeto_enlace=-1}) {
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const {jwt, esMovil} = useContext(AuthContext);
        
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);  

    const [seccionActivada, setSeccionActivada] = useState(1);
    const [opcionesDeFiltradoActivado, setOpcionesDeFiltradoActivado] = useState(false);

    const [dataComentariosHilo, setDataComentariosHilo] = useState({});  
    const [cantidadComentarios, setCantidadComentarios] = useState(0);
    const [idComentarioHijosViendo, setIdComentarioHijosViendo] = useState(0);
    const [dataComentariosHijos, setDataComentariosHijos] = useState({});
    const [nuevaPregunta, setNuevaPregunta] = useState('');

    const [pagina, setPagina] = useState(1);
    
    const [ordenarPor, setOrdenarPor] = useState('comentario.puntuacion-desc');
    const [filtrarPorPreguntasQueSigo, setFiltrarPorPreguntasQueSigo] = useState(false);
    const [filtrarPorPreguntasQueHice, setFiltrarPorPreguntasQueHice] = useState(false);
    const [filtrarPorPreguntasSinRespuesta, setFiltrarPorPreguntasSinRespuesta] = useState(false);
    
    //interval para manejar la busqueda de comentarios en lapsos de tiempo
    const [buscarComentario, setBuscarComentario] = useState('');
    const intervalRef = useRef(null);
    const latest_ultimo_comentario_escrito = useRef('');
    const latest_comentario_seleccionado = useRef(buscarComentario);
        
    //Estados de los errores de campos
    const camposErrores = {        
        'texto':[],
        'id_comentario':[],
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
    
    useEffect(() => {    
        if(id_hilo!=0){
            reiniciarEstados();                        
            cargarHiloComentarios(id_hilo, true);            
        }else{
            setDataComentariosHilo({});
        }        
    }, [id_hilo]);

    useEffect(() => {        
        if (!intervalRef.current) {            
            intervalRef.current = setInterval(() => {                
                chekearCambiosBusquedaNombre();                
            }, 1500);
        }else{
            return () => { clearInterval(intervalRef.current); }
        } 
    }, []);
        
    useEffect(() => { 
        if(id_hilo!=0){            
            if(pagina==-1){
                cargarHiloComentarios(id_hilo, true);             //activado
            }
            setPagina(-1);
        }    
    }, [ordenarPor, filtrarPorPreguntasQueSigo, filtrarPorPreguntasQueHice, filtrarPorPreguntasSinRespuesta]);

    useEffect(() => { 
        if(id_hilo!=0){            
            setDataComentariosHilo({});
            if(pagina==-1){
                cargarHiloComentarios(id_hilo, true);                        //activado
            }    
            setPagina(-1);            
        }    
    }, [buscarComentario]);

    useEffect(() => {                 
        if(id_hilo!=0){       //ojo con esto que lo acabamos de pone: pagina!=1            
            let reiniciar_data = pagina<0 ? true : false;            
            cargarHiloComentarios(id_hilo, reiniciar_data);
        }    
    }, [pagina]);

    useEffect(() => {            
        if(idComentarioHijosViendo!=0){
            cargarRespuestasComentario(idComentarioHijosViendo);
            reiniciarErrorCampoGlobal();
        }
    }, [idComentarioHijosViendo]);

    /*establece lo que se habia escrito en el campo buscar cuando se regresa a la pagina principal de los comentarios*/
    useEffect(() => {            
        if(seccionActivada==1){            
            const inputElement = document.getElementById(`buscar_comentarios_${id_hilo}`); // Reemplaza 'miInput' con el ID real de tu input
            if (inputElement) {                
                inputElement.value = latest_ultimo_comentario_escrito.current;                
            }
        }
    }, [seccionActivada]);
     
    
    const handleFuncionAceptarPopUp = () => {                        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    const handleFuncionCerrarPopUp = () => {                
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };

    const cargarHiloComentarios = async (id_comentario_hilo, reiniciar_data=false) => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            
            let opciones_filtrado = '';
            if(filtrarPorPreguntasQueSigo){
                opciones_filtrado = 'comentarios_siguiendo';
            }
            if(filtrarPorPreguntasQueHice){
                if(opciones_filtrado!=''){ opciones_filtrado+=','; }
                opciones_filtrado = 'comentarios_propios';
            }
            if(filtrarPorPreguntasSinRespuesta){
                if(opciones_filtrado!=''){ opciones_filtrado+=','; }
                opciones_filtrado = 'comentarios_sin_respuesta';
            }
            opciones_filtrado = opciones_filtrado=='' ? 'none' : opciones_filtrado;            
            //setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/comentariohilo/${id_comentario_hilo}/${Math.abs(pagina)}/${ordenarPor}/${opciones_filtrado}${buscarComentario!='' ? '/'+buscarComentario : ''}`, opciones);
            //setMostrarSpinner(false);
            const datos = await response.json();
            if (response.ok){                     
                //introducimos los nuevos datos evitando que se repitan
                if(!reiniciar_data){
                    //introducimos los nuevos datos evitando que se repitan
                    const mergedJson = { ...dataComentariosHilo };
                    Object.keys(datos.comentarios).forEach((key) => {      
                        let encontrado = false;                  
                        const id_ingresando = datos.comentarios[key].id;
                        Object.keys(dataComentariosHilo).forEach((key2) => {
                            if(dataComentariosHilo[key].id==id_ingresando){
                                encontrado = true;
                            }
                        });
                        if(!encontrado){
                            //buscamos el nuevo indice
                            let currentIndex = key;
                            while (mergedJson[currentIndex] !== undefined) {
                                currentIndex++;
                            }
                            datos.comentarios[key].update = 0;
                            mergedJson[currentIndex] = datos.comentarios[key];
                        }                        
                    });
                    setDataComentariosHilo(mergedJson);                    
                }else{    
                    const mergedJson = {};  
                    Object.keys(datos.comentarios).forEach((key) => {
                        datos.comentarios[key].update = 1;
                        mergedJson[key] = datos.comentarios[key];
                    });
                    setDataComentariosHilo(mergedJson);                    
                }    
                
                
                setCantidadComentarios(datos.cantidad_comentarios[0]);
            } else {  
                setDataComentariosHilo({});
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
        
    const handleCrearPregunta  = async (event) => {                
        event.preventDefault();           
        try {            
            const formData = new FormData();                           
            formData.append('tipo_objeto_enlace', tipo_objeto_enlace);
            formData.append('id_objeto_enlace', id_objeto_enlace);
            formData.append('texto', nuevaPregunta);
            if(idComentarioHijosViendo!=0){
                formData.append('id_comentario_padre', idComentarioHijosViendo);
            }
            //formData.append('id_comentario_padre', 0);            
            const opciones = {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: formData
            };        
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/comentario`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){                                                           
                setSeccionActivada(1);                
                setNuevaPregunta('');
                setIdComentarioHijosViendo(0);
                setPopup({mostrar:true, titulo:'Listo', contenido:'Tu pregunta ha sido publicada.'});                
                cargarHiloComentarios(id_hilo);
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }

    };
    
    const votarPorComentario  = async (id_comentario) => {        
        try {                                                          
            const opciones = {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
            };            
            try {
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/comentario/votar/${id_comentario}`, opciones);
                setMostrarSpinner(false);
                const datos = await response.json();            
                if (response.ok){                        
                    cargarHiloComentarios(id_hilo);
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
    
    const seguirComentario  = async (id_comentario, seguir) => {        
        try {                                                          
            const opciones = {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
            };            
            try {
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/comentario/seguir/${id_comentario}/${seguir}`, opciones);
                setMostrarSpinner(false);
                const datos = await response.json();            
                if (response.ok){      
                    if(seguir==1){
                        setPopup({mostrar:true, titulo:'Listo', contenido:'Ahora estás siguiendo este hilo, se te notificarán las actualizaciones.'});
                    }else{
                        setPopup({mostrar:true, titulo:'Listo', contenido:'Ya no estás siguiendo este hilo.'});
                    }
                    //cargarHiloComentarios(id_hilo, true);                    
                    marcarComoSiguiendo(id_comentario, seguir);
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const marcarComoSiguiendo = (id_comentario, seguir) => {
        const mergedJson = { ...dataComentariosHilo };   
        Object.keys(mergedJson).forEach((key) => {                                
            if (mergedJson[key].id==id_comentario) {                
                mergedJson[key].siguiendo = seguir;
            }
        });
        setDataComentariosHilo(mergedJson);        
    }
    
    const cargarRespuestasComentario = async (id_comentario_padre) => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/comentario/hijos/${id_comentario_padre}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){
                setDataComentariosHijos(datos);
                setSeccionActivada(3);                
            } else {  
                setDataComentariosHijos({});
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }

    };
    
    const handleCambiarSeccion = (event, id_seccion) => {
        event.preventDefault();        
        setNuevaPregunta('');
        setSeccionActivada(id_seccion);
        setIdComentarioHijosViendo(0);
        reiniciarErrorCampoGlobal();            
    };

    const handleEscribirPregunta = (event) => {                        
        setNuevaPregunta(event.target.value); 
    };
    
    const handleBuscarComentario = (event) => {                                
        latest_ultimo_comentario_escrito.current = event.target.value;        
    };    

    const chekearCambiosBusquedaNombre = useCallback(() => {
        if(latest_ultimo_comentario_escrito.current!=latest_comentario_seleccionado.current){                    
            setBuscarComentario(latest_ultimo_comentario_escrito.current);                          
            latest_comentario_seleccionado.current = latest_ultimo_comentario_escrito.current;     
            //setDataComentariosHilo({});           
            if(pagina==-1){     //ojo pruebas
                cargarHiloComentarios(id_hilo, true);   //ojo pruebas
            }
            setPagina(-1);
        }                                                    
    }, []);

    const handleOrdenarPorChange = (event) => { setOrdenarPor(event.target.value);    }; 
    const handleFiltrarPorPreguntasQueSigo = (event) => {                        
        const { checked } = event.target;
        setFiltrarPorPreguntasQueSigo(checked ? true: false);        
    };
    const handleFiltrarPorPreguntasQueHice = (event) => {                        
        const { checked } = event.target;
        setFiltrarPorPreguntasQueHice(checked ? true: false);        
    };
    const handleFiltrarPorPreguntasSinRespuesta = (event) => {                        
        const { checked } = event.target;
        setFiltrarPorPreguntasSinRespuesta(checked ? true: false);        
    };
    
    const handleCargarMasComentarios = () => {                
        setPagina(Math.abs(pagina)+1);        
    };

    const reiniciarEstados  = () => {
        setSeccionActivada(1);
        setPagina(1);
        setDataComentariosHilo({});
        setIdComentarioHijosViendo(0);
        setDataComentariosHijos({});
        setNuevaPregunta('');
        setBuscarComentario('');
        latest_ultimo_comentario_escrito.current = '';
        latest_comentario_seleccionado.current = '';
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
            <div className="lecture-overview-wrap lecture-quest-wrap">
                {seccionActivada==2 ? <div className="new-question-wrap-2">
                    <button onClick={event => handleCambiarSeccion(event, 1)} className="btn theme-btn theme-btn-transparent back-to-question-btn"><i className="la la-reply mr-1"></i>Volver a todas las preguntas</button>
                    <div className="question-replay-input-wrap pt-20px">
                        <div className="question-replay-body">
                            <h3 className="fs-20 font-weight-semi-bold">Escribe tu pregunta</h3>
                            <form method="post" className="pt-4">
                                <div className="replay-action-bar">
                                    <div className="btn-group">
                                        <button style={{visibility:'hidden'}} className="btn" type="button" data-toggle="modal" data-target="#insertLinkModal" title="Insert link"><i className="la la-link"></i></button>
                                        <button style={{visibility:'hidden'}} className="btn" type="button" data-toggle="modal" data-target="#uploadPhotoModal" title="Upload an image"><i className="la la-photo"></i></button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <textarea onChange={handleEscribirPregunta} value={nuevaPregunta} className="form-control form--control pl-3" name="message" rows="6" placeholder=""></textarea>
                                    {erroresCampos['texto'].length > 0 && (<SpamError mensaje={erroresCampos['texto']} />)}
                                </div>

                                <div className="btn-box">
                                    <button onClick={event => handleCrearPregunta(event)} className="btn theme-btn">Agregar pregunta <i className="la la-arrow-right icon ml-1"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>                    
                </div> : ''}
                {seccionActivada==3 ? <div className="replay-question-wrap-2">
                    <button onClick={event => handleCambiarSeccion(event, 1)}  className="btn theme-btn theme-btn-transparent back-to-question-btn"><i className="la la-reply mr-1"></i>Volver a todas las preguntas</button>
                    <div className="replay-question-body pt-30px">
                        <div className="question-list-item">
                            {Object.keys(dataComentariosHilo).map((key) => (
                                dataComentariosHilo[key].id==idComentarioHijosViendo ?
                                    <>                                                  
                                        <div className="media media-card border-bottom border-bottom-gray py-4">
                                            <div className="media-img rounded-full flex-shrink-0 avatar-sm">
                                            <img className="rounded-full" src={dataComentariosHilo[key].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${dataComentariosHilo[key].imagen_pequena}`} data-src={`${urlBase}/images/small-avatar-1.jpg`} alt="Foto del usuario" />
                                            </div>
                                            <div className="media-body">
                                                <div className="d-flex justify-content-between">
                                                    <div className="question-meta-content">                                                                                                         
                                                        <h5 class="fs-16 pb-1">{dataComentariosHilo[key].nombres}</h5>                                                        
                                                        <p className="fs-15 text-gray">
                                                            {dataComentariosHilo[key].texto.split('<br />').map((line, index2) => (<span key={`desc-general-corta-${index2}`}>{line}<br /></span> ))}
                                                        </p>
                                                        <p className="meta-tags fs-13">                                                            
                                                            <span>{dataComentariosHilo[key].fecha_hace}</span>
                                                        </p>                                        
                                                    </div>
                                                    <div className="question-upvote-action">
                                                        <div className="number-upvotes pb-2 d-flex align-items-center generic-action-wrap">
                                                            <span>{dataComentariosHilo[key].puntuacion}</span>
                                                            <button onClick={e => votarPorComentario(dataComentariosHilo[key].id)} type="button"><i className="la la-arrow-up"></i></button>
                                                            <div className="dropdown" style={{display:'none'}}>
                                                                <button className="ml-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <i className="la la-ellipsis-v"></i>
                                                                </button>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#" data-toggle="modal" data-target="#reportModal"><i className="la la-flag mr-1"></i> Reportar comentario</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="question-replay-separator-wrap d-flex align-items-center justify-content-between py-3">
                                            <h4 className="fs-16 font-weight-semi-bold">{Object.keys(dataComentariosHijos).length} respuestas</h4>
                                            {dataComentariosHilo[key].siguiendo==1 ?
                                                <button onClick={e => seguirComentario(dataComentariosHilo[key].id, 0)} className="btn swapping-btn text-gray font-weight-medium" data-text-swap="Following replies" data-text-original="Follow replies">Dejar de seguir este hilo</button>
                                            : <button onClick={e => seguirComentario(dataComentariosHilo[key].id, 1)} className="btn swapping-btn text-gray font-weight-medium" data-text-swap="Following replies" data-text-original="Follow replies">Seguir este hilo</button> }
                                        </div>
                                    </>
                                :''
                            ))}                                      
                            <div className="section-block"></div>
                            <div className="question-answer-wrap">
                                {Object.keys(dataComentariosHijos).map((key) => (
                                    <div key={`respuesta-key-${dataComentariosHijos[key].id}`} className="media media-card mb-3 border-bottom border-bottom-gray py-4">
                                        <div className="media-img rounded-full avatar-sm flex-shrink-0">
                                        <img className="rounded-full" src={dataComentariosHijos[key].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${dataComentariosHijos[key].imagen_pequena}`} data-src={`${urlBase}/images/small-avatar-1.jpg`} alt="Foto del usuario" />
                                        </div>
                                        <div className="media-body">
                                            <h5 className="fs-16">{dataComentariosHijos[key].nombres}</h5>
                                            <span className="fs-14">{dataComentariosHijos[key].fecha_hace}</span>
                                            <p className="pt-1 fs-15">
                                                {dataComentariosHijos[key].texto.split('<br />').map((line, index2) => (<span key={`desc-respuesta-${dataComentariosHijos[key].id}-${index2}`}>{line}<br /></span> ))}
                                            </p>
                                        </div>
                                    </div>
                                ))} 
                                <div className="question-replay-input-wrap pt-20px">
                                    <div className="question-replay-body">
                                        <h3 className="fs-16 font-weight-semi-bold">Agregar respuesta</h3>
                                        <form method="post" className="pt-4">
                                            <div className="replay-action-bar">
                                                <div className="btn-group" style={{visibility:'hidden'}}>
                                                    <button className="btn" type="button" data-toggle="modal" data-target="#insertLinkModal" title="Insert link"><i className="la la-link"></i></button>
                                                    <button className="btn" type="button" data-toggle="modal" data-target="#uploadPhotoModal" title="Upload an image"><i className="la la-photo"></i></button>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <textarea onChange={handleEscribirPregunta} value={nuevaPregunta}  className="form-control form--control pl-3" name="message" rows="6" placeholder=""></textarea>
                                                {erroresCampos['texto'].length > 0 && (<SpamError mensaje={erroresCampos['texto']} />)}
                                            </div>
                                            <div className="btn-box">
                                                <button onClick={event => handleCrearPregunta(event)} className="btn theme-btn" type="submit">Agregar respuesta <i className="la la-arrow-right icon ml-1"></i></button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>: ''}
                {seccionActivada==1 ? <div className="question-overview-result-wrap-2">
                    <div className="lecture-overview-item">
                        <form method="post">
                            <div className="input-group mb-3">
                                <input onChange={handleBuscarComentario} className="form-control form--control form--control-gray pl-3" type="text" name="buscar_comentario" id={`buscar_comentarios_${id_hilo}`} placeholder="Buscar comentarios" />
                                <div className="input-group-append">
                                    <div className="btn theme-btn"><i className="la la-search search-icon"></i></div>
                                </div>
                            </div>
                        </form>
                        <div className="question-overview-filter-wrap d-flex align-items-center">
                            <div className="question-overview-filter-item">
                                <div className="select-container w-100">
                                    <select onChange={handleOrdenarPorChange} value={ordenarPor} className="form-control select-dark">
                                        <option value="comentario.puntuacion-desc">Ordenar por Los más votados</option>
                                        <option value="comentario.created_at-desc">Ordenar por Los más recientes</option>
                                    </select>
                                </div>
                            </div>
                            <div className="question-overview-filter-item">
                                <div className="generic-action-wrap">
                                    <div className="dropdown">
                                        <div onClick={e=>setOpcionesDeFiltradoActivado(!opcionesDeFiltradoActivado) }className="btn theme-btn theme-btn-transparent w-100" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Filtrar por
                                        </div>
                                        <div className="dropdown-menu" style={{display:opcionesDeFiltradoActivado ? 'block' : 'none'}}>
                                            <div className="dropdown-item">
                                                <div className="custom-control custom-checkbox fs-15">
                                                    <input onChange={handleFiltrarPorPreguntasQueSigo} checked={filtrarPorPreguntasQueSigo} type="checkbox" className="custom-control-input" id="questionsCheckbox" required />
                                                    <label className="custom-control-label custom--control-label" htmlFor="questionsCheckbox">
                                                        Comentarios que sigo
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="dropdown-item">
                                                <div className="custom-control custom-checkbox fs-15">
                                                    <input onChange={handleFiltrarPorPreguntasQueHice} checked={filtrarPorPreguntasQueHice} type="checkbox" className="custom-control-input" id="questionsCheckbox2" required />
                                                    <label className="custom-control-label custom--control-label" htmlFor="questionsCheckbox2">
                                                        Comentarios que hice
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="dropdown-item">
                                                <div className="custom-control custom-checkbox fs-15">
                                                    <input onChange={handleFiltrarPorPreguntasSinRespuesta} checked={filtrarPorPreguntasSinRespuesta} type="checkbox" className="custom-control-input" id="questionsCheckbox3" required />
                                                    <label className="custom-control-label custom--control-label" htmlFor="questionsCheckbox3">
                                                        Comentarios sin respuesta
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lecture-overview-item">
                        <div className="question-overview-result-header d-flex align-items-center justify-content-between">
                            <h3 className="fs-17 font-weight-semi-bold">{cantidadComentarios} comentarios / preguntas</h3>
                            <button onClick={event => handleCambiarSeccion(event, 2)} className="btn theme-btn theme-btn-sm theme-btn-transparent ask-new-question-btn">Nueva pregunta</button>
                        </div>
                    </div>
                    <div className="section-block"></div>
                    <div className="lecture-overview-item mt-0">
                        {Object.keys(dataComentariosHilo).map((key) => (
                            <div key={`tarjeta-hilo-${dataComentariosHilo[key].id}`} className="question-list-item">
                                <div className="media media-card border-bottom border-bottom-gray py-4 px-3">
                                    <div className="media-img rounded-full flex-shrink-0 avatar-sm">                                                                        
                                    <img className="rounded-full" src={dataComentariosHilo[key].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${dataComentariosHilo[key].imagen_pequena}`} data-src={`${urlBase}/images/small-avatar-1.jpg`} alt="Foto del usuario" />
                                    </div>
                                    <div className="media-body">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="question-meta-content">
                                                <div onClick={e => setIdComentarioHijosViendo(dataComentariosHilo[key].id) } className="d-block" style={{cursor:'pointer'}}>
                                                    <h5 className="fs-16 pb-1">{dataComentariosHilo[key].nombres}</h5>
                                                    <p className="fs-15 text-gray">
                                                        {dataComentariosHilo[key].texto.split('<br />').map((line, index2) => (<span key={`desc-general-corta-${index2}`}>{line}<br /></span> ))}                                                                                        
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="question-upvote-action">
                                                <div className="number-upvotes pb-2 d-flex align-items-center">
                                                    <span>{dataComentariosHilo[key].puntuacion}</span>
                                                    <button onClick={e => votarPorComentario(dataComentariosHilo[key].id)} type="button"><i className="la la-arrow-up"></i></button>
                                                </div>
                                                <div className="number-upvotes question-response d-flex align-items-center">
                                                    <span>{dataComentariosHilo[key].comentarios_hijos}</span>
                                                    <button onClick={e => setIdComentarioHijosViendo(dataComentariosHilo[key].id) }  type="button" className="question-replay-btn"><i className="la la-comments"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="meta-tags pt-1 fs-13">                                                                           
                                            <span>{dataComentariosHilo[key].fecha_hace}</span>
                                        </p>
                                    </div>
                                </div>                                                            
                            </div>
                        ))}
                        {Object.keys(dataComentariosHilo).length<cantidadComentarios && 
                            <div className="question-btn-box pt-35px text-center">
                                <button onClick={handleCargarMasComentarios} className="btn theme-btn theme-btn-transparent w-100" type="button">Ver más comentarios</button>
                            </div>
                        }
                    </div>
                </div>: ''}
            </div>
        </>
  );
}

export default HiloComentarios;