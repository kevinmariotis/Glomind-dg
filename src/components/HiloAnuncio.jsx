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

    const [seccionActivada, setSeccionActivada] = useState(es_creador==1 ? 2 : 1);    

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
                    cargarHiloComentarios(id_hilo!=0 ? id_hilo : datos.comentario_hilo, true);
                    //const numeroAleatorio = Math.floor(Math.random() * 1000) + 1;
                    //setRandActualizar(numeroAleatorio);     //se cambia para que cargue de nuevo el comentario mas reciente del hilo                    
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
                {Object.keys(dataComentariosHilo).length>0 ? 
                    Object.keys(dataComentariosHilo).slice(0, 1).map((key) => (
                        <div key={`comentario-hilo-${id_hilo}-${dataComentariosHilo[key].id}`}className="lecture-overview-wrap lecture-announcement-wrap">

                            {es_creador==1 ? <div className="lecture-overview-item">
                                <div className="question-overview-result-header d-flex align-items-center justify-content-between">                            
                                    <h3 className="fs-17 font-weight-semi-bold" style={{visibility:'hidden'}}>{cantidadComentarios} comentarios / preguntas</h3>
                                    <button onClick={event => handleCambiarSeccion(event, 2)} className="btn theme-btn theme-btn-sm theme-btn-transparent ask-new-question-btn">Nuevo anunucio</button>
                                </div>
                            </div> : ''}

                            <div className="lecture-overview-item">                            
                                <div className="media media-card align-items-center">
                                    <Link to={`${urlBase}/perfil/${dataComentariosHilo[key].id_usuario}`} className="media-img d-block rounded-full avatar-md">
                                        <img src={dataComentariosHilo[key].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${dataComentariosHilo[key].imagen_pequena}`} alt="Instructor avatar" className="rounded-full" />
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
                                                    <img src={dataComentariosHijos[key2].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${dataComentariosHijos[key2].imagen_pequena}`} alt="Avatar de usuario" className="rounded-full" />
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
                    )) 
                        : 
                        <div className="col-lg-7 mx-auto">
                            <div className="error-content text-center">                                                        
                                <svg
                                    version="1.1"
                                    id="_x32_"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="20%"
                                    height="20%"
                                    viewBox="0 0 512 512"
                                    xmlSpace="preserve"
                                >
                                    <style type="text/css">
                                    {`.st0 { fill: #E5E5E5; }`}
                                    </style>
                                    <g>
                                    <path
                                        className="st0"
                                        d="M427.197,157.686c-3.594-1.609-7.203-3.125-10.828-4.656c-1.406,1.031-3.016,2.016-4.953,2.906
                                        c-0.844,0.406-2.063,0.906-3.578,1.406c-23.031,8.031-79.25,4-143.188-10.25s-116.563-34.5-134.047-51.594
                                        c-0.969-0.875-1.953-1.938-2.813-3c-1.109-1.297-1.953-2.578-2.688-3.859c-3-0.078-5.984-0.234-8.969-0.281
                                        c-13.828-0.234-80.656,3.203-83.609,16.438c-4.719,21.203,62.547,41.813,74.656,46.344c48.328,17.969,98.453,31.344,148.719,42.547
                                        c50.297,11.219,101.359,20.406,152.75,24.641c12.891,1.063,82.531,10.969,87.266-10.234
                                        C500.65,186.811,439.807,163.342,427.197,157.686z"
                                    />
                                    <path
                                        className="st0"
                                        d="M269.947,123.326c62.859,14,111.531,16.328,128.563,11.438c0.188-3.5,0.281-6.984,0.172-10.453
                                        c-0.047-2.422-0.203-4.797-0.453-7.172C393.572,62.904,354.369,15.576,298.4,3.092C242.463-9.361,186.838,16.811,159.588,63.936
                                        c-1.203,2.063-2.359,4.141-3.438,6.297c-1.781,3.516-3.359,7.156-4.844,10.906C167.588,92.982,210.916,110.17,269.947,123.326z
                                        M355.307,76.779c9.156,0.906,15.688,10.453,14.609,21.281s-9.375,18.906-18.516,17.969c-9.156-0.906-15.703-10.438-14.625-21.281
                                        C337.854,83.92,346.15,75.873,355.307,76.779z M284.15,67.014c10.641,2.375,17.328,12.906,14.969,23.531
                                        c-2.375,10.641-12.906,17.328-23.547,14.969c-10.625-2.375-17.328-12.906-14.953-23.547
                                        C262.979,71.342,273.525,64.639,284.15,67.014z M193.322,58.701c3.625-10.281,13.594-16.125,22.266-13.063
                                        s12.766,13.875,9.141,24.125c-3.625,10.281-13.594,16.125-22.281,13.063C193.775,79.764,189.697,68.951,193.322,58.701z"
                                    />
                                    <path
                                        className="st0"
                                        d="M27.619,438.686c-1.5-0.328-2.969-0.906-4.344-1.719c-7.188-4.234-9.594-13.453-5.375-20.625l124.391-211.625
                                        c4.203-7.172,13.453-9.594,20.625-5.359c7.172,4.219,9.578,13.438,5.359,20.625L43.9,431.607
                                        C40.494,437.404,33.838,440.076,27.619,438.686z"
                                    />
                                    <path
                                        className="st0"
                                        d="M354.932,511.639c-6.219-1.375-11.109-6.625-11.734-13.297L320.479,253.92
                                        c-0.766-8.297,5.313-15.625,13.609-16.391c8.266-0.766,15.625,5.313,16.406,13.594l22.719,244.422
                                        c0.766,8.281-5.328,15.641-13.609,16.391C357.994,512.076,356.416,511.982,354.932,511.639z"
                                    />
                                    <path
                                        className="st0"
                                        d="M170.557,424.779c-1.797,8.109-9.859,13.234-17.984,11.422c-8.125-1.797-13.25-9.859-11.438-17.984
                                        s9.875-13.25,18-11.438S172.369,416.654,170.557,424.779z"
                                    />
                                    <path
                                        className="st0"
                                        d="M271.947,385.607c-1.813,8.125-9.859,13.234-17.984,11.422s-13.25-9.859-11.453-18
                                        c1.828-8.109,9.875-13.219,18-11.406C268.635,369.42,273.744,377.467,271.947,385.607z"
                                    />
                                    <path
                                        className="st0"
                                        d="M229.494,298.936c-1.813,8.125-9.859,13.234-17.984,11.422c-8.125-1.797-13.25-9.859-11.438-18
                                        c1.813-8.094,9.875-13.234,17.984-11.422C226.182,282.764,231.307,290.811,229.494,298.936z"
                                    />
                                    </g>
                                </svg>
                                <div className="section-heading" style={{marginBottom:'100px'}}>
                                    <p className="section__desc">
                                        No hay anuncios en el curso
                                    </p>
                                </div>
                            </div>
                        </div>
                }               
            </div>: ''}
            
        </>
  );
}

export default HiloAnuncio;