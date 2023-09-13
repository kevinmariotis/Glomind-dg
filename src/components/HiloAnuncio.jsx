import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import SpamError from './SpamError';
import Spinner from './Spinner';
import Popup from './Popup';

function HiloAnuncio({id_hilo=0, id_objeto_enlace=-1, tipo_objeto_enlace=-1, es_creador=0}) {
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const {jwt, esMovil} = useContext(AuthContext);
        
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);  

    const [seccionActivada, setSeccionActivada] = useState(1);    

    const [dataComentariosHilo, setDataComentariosHilo] = useState({});  
    const [cantidadComentarios, setCantidadComentarios] = useState(0);
    const [idComentarioHijosViendo, setIdComentarioHijosViendo] = useState(0);
    const [idComentarioHijosViendoAux, setIdComentarioHijosViendoAux] = useState(0);
    
    const [dataComentariosHijos, setDataComentariosHijos] = useState({});
    const [nuevaPregunta, setNuevaPregunta] = useState('');    

    const [pagina, setPagina] = useState(1);
    const [randActualizar, setRandActualizar] = useState(0);
                
    //Estados de los errores de campos
    const camposErrores = {        
        'texto':[],
        'id_comentario':[],
    }        
    
    const [erroresCampos, setErrorCampo] = useState(camposErrores);
    const setErrorCampoGlobal = (index, newValue) => {       
        if (index in erroresCampos) {
            const nuevoObjeto = erroresCampos[index].concat(newValue);            
            let objeto = erroresCampos;
            objeto[index] = nuevoObjeto;
        }
        setErrorCampo({...erroresCampos});
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
        if(id_hilo!=0){       //ojo con esto que lo acabamos de pone: pagina!=1            
            let reiniciar_data = pagina<0 ? true : false;            
            cargarHiloComentarios(id_hilo, reiniciar_data);
        }    
    }, [pagina]);


    useEffect(() => {                 
        if(randActualizar!=0){
            cargarHiloComentarios(id_hilo, true);
        }    
    }, [randActualizar]);

    useEffect(() => {            
        if(idComentarioHijosViendo!=0){
            cargarRespuestasComentario(idComentarioHijosViendo);
            reiniciarErrorCampoGlobal();
        }
    }, [idComentarioHijosViendo]);
             
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
            
            let opciones_filtrado = 'none';                                                
            const response = await fetch(`${urlBaseApi}/api/comentariohilo/${id_comentario_hilo}/${Math.abs(pagina)}/comentario.created_at-desc/${opciones_filtrado}`, opciones);
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
                    setIdComentarioHijosViendo(mergedJson[0].id);   //debe de existir, de lo contario no hubiera entrado a esta funcion.                    
                }else{    
                    const mergedJson = {};  
                    Object.keys(datos.comentarios).forEach((key) => {
                        datos.comentarios[key].update = 1;
                        mergedJson[key] = datos.comentarios[key];
                    });
                    setDataComentariosHilo(mergedJson);   
                    setIdComentarioHijosViendo(mergedJson[0].id);                 
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
                setPopup({mostrar:true, titulo:'Listo', contenido:'Tu comentario ha sido publicado.'});                                
                if(idComentarioHijosViendo!=0){
                    cargarRespuestasComentario(idComentarioHijosViendo);
                }else{
                    const numeroAleatorio = Math.floor(Math.random() * 1000) + 1;
                    setRandActualizar(numeroAleatorio);     //se cambia para que cargue de nuevo el comentario mas reciente del hilo                    
                }    
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }

    };
                        
    const cargarRespuestasComentario = async (id_comentario_padre) => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/comentario/hijos/${id_comentario_padre}`, opciones);            
            const datos = await response.json();            
            if (response.ok){
                setDataComentariosHijos(datos);                
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
        reiniciarErrorCampoGlobal();            
        switch(id_seccion){
            case 1:
                setIdComentarioHijosViendo(idComentarioHijosViendoAux);
                //setIdComentarioHijosViendoAux(0);            
            break;    
            case 2:
                setIdComentarioHijosViendoAux(idComentarioHijosViendo);
                setIdComentarioHijosViendo(0);
            break;
        }
    };

    const handleEscribirPregunta = (event) => {                        
        setNuevaPregunta(event.target.value); 
    };
                
    const reiniciarEstados  = () => {
        setSeccionActivada(1);
        setPagina(1);
        setDataComentariosHilo({});        
        setDataComentariosHijos({});
        setNuevaPregunta('');        
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
            {seccionActivada==2 ? <div className="lecture-overview-wrap lecture-announcement-wrap">
                <button onClick={event => handleCambiarSeccion(event, 1)} className="btn theme-btn theme-btn-transparent back-to-question-btn"><i className="la la-reply mr-1"></i>Volver a mi último anuncio</button>
                <div className="question-replay-input-wrap pt-20px">
                    <div className="question-replay-body">
                        <h3 className="fs-20 font-weight-semi-bold">Escribe tu anuncio</h3>
                        <div className="announcement-meta fs-15">
                            <span>Advertencia: Esto reemplazará al anuncio actual</span>                                        
                        </div>
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
                                <button onClick={event => handleCrearPregunta(event)} className="btn theme-btn">Publicar anuncio <i className="la la-arrow-right icon ml-1"></i></button>
                            </div>
                        </form>
                    </div>
                </div>                    
            </div> : ''}            
            {seccionActivada==1 ? <div className="question-overview-result-wrap-2">
                
                {Object.keys(dataComentariosHilo).slice(0, 1).map((key) => (
                    <div className="lecture-overview-wrap lecture-announcement-wrap">

                        {es_creador==1 ? <div className="lecture-overview-item">
                            <div className="question-overview-result-header d-flex align-items-center justify-content-between">                            
                                <h3 className="fs-17 font-weight-semi-bold" style={{visibility:'hidden'}}>{cantidadComentarios} comentarios / preguntas</h3>
                                <button onClick={event => handleCambiarSeccion(event, 2)} className="btn theme-btn theme-btn-sm theme-btn-transparent ask-new-question-btn">Nuevo anunucio</button>
                            </div>
                        </div> : ''}

                        <div className="lecture-overview-item">                            
                            <div className="media media-card align-items-center">
                                <Link to={`${urlBase}/perfil/${dataComentariosHilo[key].id_usuario}`} className="media-img d-block rounded-full avatar-md">
                                    <img src={dataComentariosHilo[key].imagen_pequena=='' ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${dataComentariosHilo[key].imagen_pequena}`} alt="Instructor avatar" className="rounded-full" />
                                </Link>
                                <div className="media-body">
                                    <h5 className="pb-1"><Link to={`${urlBase}/perfil/${dataComentariosHilo[key].id_usuario}`}>{dataComentariosHilo[key].nombres}</Link></h5>
                                    <div className="announcement-meta fs-15">
                                        <span>Publicado en anuncios</span>
                                        <span> · {dataComentariosHilo[key].fecha_hace} ·</span>                                        
                                    </div>
                                </div>
                            </div>

                            <div className="lecture-owner-decription pt-4">
                                {dataComentariosHilo[key].texto.split('<br />').map((line, index2) => (<span key={`desc-general-corta-${index2}`}>{line}<br /></span> ))}
                            </div>
                        
                            <div className="lecture-announcement-comment-wrap pt-4">
                                <div className="comments pt-40px">
                                    
                                    {Object.keys(dataComentariosHijos).map((key2) => (
                                        <div className="media media-card mb-3 border-bottom border-bottom-gray pb-3">
                                            <div className="media-img rounded-full avatar-sm flex-shrink-0">
                                                <img src={dataComentariosHijos[key2].imagen_pequena=='' ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${dataComentariosHijos[key2].imagen_pequena}`} alt="Avatar de usuario" className="rounded-full" />
                                            </div>
                                            <div className="media-body">
                                                <div className="announcement-meta fs-15 lh-20">
                                                    <Link to={`${urlBase}/perfil/${dataComentariosHijos[key2].id_usuario}`} className="text-color">{dataComentariosHijos[key2].nombres}</Link>
                                                    <span> · {dataComentariosHijos[key2].fecha_hace} ·</span>                                                    
                                                </div>
                                                <p className="pt-1">{dataComentariosHijos[key2].texto.split('<br />').map((line, index2) => (<span key={`desc-respuesta-${dataComentariosHijos[key2].id}-${index2}`}>{line}<br /></span> ))}</p>
                                            </div>
                                        </div>
                                    ))}

                                </div>            
                            </div>    
                        </div>
                        <div className="question-replay-input-wrap pt-20px">
                            <div className="question-replay-body">
                                <h3 className="fs-16 font-weight-semi-bold">Comentar anuncio</h3>
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
                                        <button onClick={event => handleCrearPregunta(event)} className="btn theme-btn" type="submit">Publicar comentario <i className="la la-arrow-right icon ml-1"></i></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>    
                ))}                
            </div>: ''}
            
        </>
  );
}

export default HiloAnuncio;