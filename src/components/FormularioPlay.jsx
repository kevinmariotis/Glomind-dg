import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';

import FormularioPlayHeader from './FormularioPlayHeader';
import VideoPlayerPrisma from './VideoPlayerPrisma';
import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import { mensajesDeError } from './utils';
import DropdownContenido from './DropdownContenido';
import { sideBarAbrirCerrar } from './comun';

function FormularioPlay() {        
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const { url_amigable } = useParams();
    const navigate = useNavigate();            
    const {jwt, esMovil} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);  

    const [dataCurso, setDataCurso] = useState({id:-1, nombre:'', favorito:-1, archivado:-1, porcentaje_progreso:-1});     //se accede por ejmplo: dataCurso.favorito
    const [contenido, setContenido] = useState([]);  
    const [dataContenidoViendo, setDataContenidoViendo] = useState([]);  
      
    const [contenidoActivado, setContenidoActivado] = useState(-1);  //el contenido que se está viendo
    const [contenidoActivadoAnterior, setContenidoActivadoAnterior] = useState(-1);  //el contenido anterior que estaba viendo, por si acaso hay que volver a señalarlo.
    const [pestanaActivada, setPestanaActivada] = useState(2);  //pestañas que estan debajo del video
    const [cargarActividadActual, setCargarActividadActual] = useState(false);
            
    useEffect(() => {    
        window.scrollTo(0, 0);
        sideBarAbrirCerrar();
        obtenerDatosDelServidor();        
    }, []);

    useEffect(() => {    
        if(dataCurso.id!=-1){
            obtenerContenidos({activar_actividad_actual:true});        
        }        
    }, [dataCurso.id]);

    useEffect(() => {    
        if(cargarActividadActual){
            actividadActual();
        }        
    }, [contenido]);
   
        
    //pestañas que estan debajo del video
    const handleCambiarPestana = (event, numero) =>{    
        event.preventDefault();   
        setPestanaActivada(numero);        
    };


    const handleFuncionAceptarPopUp = () => {                
        switch(popUp.data_switch){
            case 'abrir_examen':
                navigate(`/examen/presentacion/${popUp.data_id}/${dataCurso.id}`);
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
        switch(popUp.data_switch){
            case 'abrir_examen':
                setContenidoActivado(-1);
            break;
        }
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
            const response = await fetch(`${urlBaseApi}/api/curso/verPorUrlAmigable/${url_amigable}`, opciones);            
            //setMostrarSpinner(false);
            const datos = await response.json();
            if (response.ok){                                                                               
                setDataCurso(datos.curso);
                if(datos.curso.matriculado==0){
                    setMostrarSpinner(false);
                    navigate('/');
                }
                if(dataCurso.id==datos.curso.id){
                    setMostrarSpinner(false);
                }                
            } else {                
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerContenidos = async ({activar_actividad_actual=false}) => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            //setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/curso/getContenidos/${dataCurso.id}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();
            if (response.ok){                                                                               
                setContenido(datos);
                if(activar_actividad_actual){
                    setCargarActividadActual(true);
                }
            } else {                
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    /*
        Determina cual es la actividad actual y la abre, segun si se es secuencial el curso o no
    */
    const actividadActual = async () => {          
        let id_contenido_actual = -1;
        let nombre_contenido_actual = '';
        contenido.forEach((categoria) => {            
            categoria.curso_contenido.forEach((contenido) => {
                if(contenido.estado_consumo==0 && id_contenido_actual==-1){
                    id_contenido_actual = contenido.id_contenido;
                    nombre_contenido_actual = contenido.nombre;
                }
            });            
        });        
        if(id_contenido_actual!=-1){
            cargarContenidoEspecifico(id_contenido_actual, true);
        }else{
            if(contenido.length>0){
                //ojo aqui el mensaje debe ser personalizado si gano el curso un mensaje de lo contrario mostrar que debe superar los examenes para poder dar finalizado satisfactoriamente el curso.
                setPopup({mostrar:true, titulo:'Felicitaciones', contenido:'Has llegado al final del curso.'});
            }
        }
    };    

    /*
        Obtiene el recurso que intenta abrir y lo coloca en un estado
    */
    const cargarContenidoEspecifico = async (id_contenido, preguntar_abrir=false) => {                  
        if(contenidoActivado!=id_contenido){
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try { 
                setContenidoActivadoAnterior(contenidoActivado);
                setContenidoActivado(id_contenido);
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/cursocontenido/${id_contenido}`, opciones);
                setMostrarSpinner(false);
                const datos = await response.json();
                if (response.ok){             
                    switch(datos.tipo_contenido){
                        case 2:
                            if(preguntar_abrir){
                                setPopup({...popUp, mostrar:true, tipo:3, titulo:'Abrir siguiente actividad?', contenido:`Desea abrir la actividad: <span style="font-style: italic;">${datos.nombre}</span>?`, data_switch:'abrir_examen', data_id:datos.id});
                            }else{
                                navigate(`/examen/presentacion/${datos.id}/${dataCurso.id}`);
                            }
                        break;
                        default:
                            setDataContenidoViendo(datos);                                
                        break;
                    }                                        
                } else {                
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
                    setContenidoActivado(contenidoActivadoAnterior);
                }            
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        }
    };
          
    const handleActualizaPosicionActualVideo = async (posicion_acutal) => {                                        
        const raw = {           
            'puntuacion': posicion_acutal.toString(),                        
        };
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };        
        try {            
            const response = await fetch(`${urlBaseApi}/api/cursocontenidoconsumo/${contenidoActivado}`, opciones);            
            const datos = await response.json();                        
            if (response.ok){                                
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    const handleActualizaEstadoConsumoVideo = async () => {        
        if(dataContenidoViendo.consumo_estado==0){            
            const raw = {           
                'estado': 1,
            };
            const opciones = {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: JSON.stringify(raw),
            };        
            try {            
                const response = await fetch(`${urlBaseApi}/api/cursocontenidoconsumo/${contenidoActivado}`, opciones);            
                const datos = await response.json();                        
                if (response.ok){   
                    obtenerContenidos({activar_actividad_actual:true});                             
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }
        }
    }
        
    //manejo del acordeon
    const [activeTab, setActiveTab] = useState(null);

    /*const toggleTab = (tabIndex) => {
        setActiveTab((prevTab) => (prevTab === tabIndex ? null : tabIndex));
    };*/

    const [collapsing, setCollapsing] = useState(false);
    const toggleTab = (tabIndex) => {
        if (activeTab === tabIndex) {
            setActiveTab(null);
            setCollapsing(false);
        } else {
            setCollapsing(true);
            setActiveTab(tabIndex);
            setTimeout(() => {
                setCollapsing(false);
            }, 350); // Desactivar "collapsing" después de 0.35 segundos
        }
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
            <FormularioPlayHeader id_curso={dataCurso.id} nombre_curso={dataCurso.nombre} favorito={dataCurso.favorito} archivado={dataCurso.archivado} tiene_review={dataCurso.tiene_review} porcentaje_progreso={dataCurso.porcentaje_progreso} callBackFavoritoCambiado={obtenerDatosDelServidor}/>
            
            <section className="course-dashboard">
                <div className="course-dashboard-wrap">
                    <div className="course-dashboard-container d-flex">
                        <div className="course-dashboard-column">
                            <div className="lecture-viewer-container">
                                <div className="lecture-video-item" style={{position:'relative', paddingTop:'56.25%'}}> {/* (9 / 16) * 100 = 56.25 */}
                                    {dataContenidoViendo.tipo_contenido==1 ?                                         
                                        <VideoPlayerPrisma
                                            url_video={`${urlBaseApi}/${esMovil ? dataContenidoViendo.video_pequeno!=null ? dataContenidoViendo.video_pequeno : dataContenidoViendo.video_grande : dataContenidoViendo.video_grande }`}
                                            url_imagen_preview={`${urlBaseApi}/${dataContenidoViendo.imagen_preview_grande}`}
                                            posision_actual={parseInt(dataContenidoViendo.consumo_puntuacion)}                                            
                                            estado_consumo={dataContenidoViendo.consumo_estado}
                                            funcion_reportar_posicion_actual = {handleActualizaPosicionActualVideo}                                            
                                            funcion_reportar_visto_completo = {handleActualizaEstadoConsumoVideo}                                            
                                        />                                                          
                                        : ''
                                    }                                    
                                </div>
                                <div className="lecture-viewer-text-wrap">
                                    <div className="lecture-viewer-text-content custom-scrollbar-styled">
                                        <div className="lecture-viewer-text-body">
                                            <h2 className="fs-24 font-weight-semi-bold pb-4">Download your Footage for your Quick Start</h2>
                                            <div className="lecture-viewer-content-detail">
                                                <ul className="generic-list-item pb-4">
                                                    <li>Hi</li>
                                                    <li>Welcome to Motion Graphics in After Effects. </li>
                                                    <li>In the next lectures you will start creating your first animation and animate imported footage.</li>
                                                    <li>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes,</li>
                                                    <li>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. </li>
                                                    <li>Occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. </li>
                                                    <li>Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus,</li>
                                                    <li>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. </li>
                                                    <li><strong className="font-weight-semi-bold">Download your footage Now, Click on the Link Below.</strong></li>
                                                </ul>
                                                <div className="btn-box">
                                                    <h3 className="fs-18 font-weight-semi-bold pb-3">Resources for this lecture</h3>
                                                    <a href="#" className="btn theme-btn theme-btn-transparent"><i className="la la-file-zip-o mr-1"></i>Quick-start.zip</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lecture-video-detail">
                                <div className="lecture-tab-body bg-gray p-4">
                                    <ul className="nav nav-tabs generic-tab" id="myTab" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link" id="search-tab" data-toggle="tab" href="#search" role="tab" aria-controls="search" aria-selected="false">
                                                <i className="la la-search"></i>
                                            </a>
                                        </li>
                                        <li className="nav-item mobile-menu-nav-item">
                                            <a onClick={(event)=>{ handleCambiarPestana(event, 1); }} className={`nav-link ${pestanaActivada==1 ? 'active': ''}`} id="course-content-tab" data-toggle="tab" href="#course-content" role="tab" aria-controls="course-content" aria-selected="false">
                                                Course Content
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a onClick={(event)=>{ handleCambiarPestana(event, 2); }} className={`nav-link ${pestanaActivada==2 ? 'active': ''}`} id="overview-tab" data-toggle="tab" href="#overview" role="tab" aria-controls="overview" aria-selected="true">
                                                Overview
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a onClick={(event)=>{ handleCambiarPestana(event, 3); }} className={`nav-link ${pestanaActivada==3 ? 'active': ''}`} id="question-and-ans-tab" data-toggle="tab" href="#question-and-ans" role="tab" aria-controls="question-and-ans" aria-selected="false">
                                                Question & Ans
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a onClick={(event)=>{ handleCambiarPestana(event, 4); }} className={`nav-link ${pestanaActivada==4 ? 'active': ''}`} id="announcements-tab" data-toggle="tab" href="#announcements" role="tab" aria-controls="announcements" aria-selected="false">
                                                Announcements
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="lecture-video-detail-body">
                                    <div className="tab-content" id="myTabContent">
                                        <div className="tab-pane fade" id="search" role="tabpanel" aria-labelledby="search-tab">
                                            <div className="search-course-wrap pt-40px">
                                                <form action="#" className="pb-5">
                                                    <div className="input-group">
                                                        <input className="form-control form--control form--control-gray pl-3" type="text" name="search" placeholder="Search course content" />
                                                        <div className="input-group-append">
                                                            <button className="btn theme-btn"><span className="la la-search"></span></button>
                                                        </div>
                                                    </div>
                                                </form>
                                                <div className="search-results-message text-center">
                                                    <h3 className="fs-24 font-weight-semi-bold pb-1">Start a new search</h3>
                                                    <p>To find captions, lectures or resources</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="course-content" role="tabpanel" aria-labelledby="course-content-tab">
                                            <div className="mobile-course-menu pt-4">
                                                <div className="accordion generic-accordion generic--accordion" id="mobileCourseAccordionCourseExample">
                                                    {contenido.map((categoria, index) => (
                                                        <div className="card">
                                                            <div className="card-header" id={`mobileCourseHeading${parseInt(index)+1}`}>
                                                                <button onClick={() => toggleTab(index)} aria-expanded={activeTab === index} className="btn btn-link" type="button" data-toggle="collapse" data-target={`#mobileCourseCollapse${parseInt(index)+1}`}  aria-controls={`mobileCourseCollapse${parseInt(index)+1}`}>
                                                                    <i className="la la-angle-down" style={{display:'none'}}></i>
                                                                    <i className="la la-angle-up" style={{display:'none'}}></i>
                                                                    <span className="fs-15"> Sección {parseInt(index)+1}: {categoria.nombre} </span>
                                                                    <span className="course-duration">
                                                                        <span>&nbsp;{categoria.cantidad_consumidos}/{categoria.cantidad_contenidos}</span>
                                                                        <span>21min</span>
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            <div id={`mobileCourseCollapse${parseInt(index)+1}`} className="show" aria-labelledby={`mobileCourseHeading${parseInt(index)+1}`} data-parent="#mobileCourseAccordionCourseExample">
                                                                <div className="card-body p-0">
                                                                    <ul className="curriculum-sidebar-list">
                                                                        {Object.keys(categoria.curso_contenido).map((key) => (
                                                                            <li className={`course-item-link ${categoria.curso_contenido[key].id_contenido==contenidoActivado ? 'active' : '' }`}>
                                                                                <div className="course-item-content-wrap">
                                                                                    <div className="custom-control custom-checkbox">
                                                                                        <input type="checkbox" className="custom-control-input" id={`mobileCourseCheckbox${parseInt(key)+1}`} checked={`${categoria.curso_contenido[key].estado_consumo==1 ? 'checked' : ''}`} required />
                                                                                        <label className="custom-control-label custom--control-label" for={`mobileCourseCheckbox${parseInt(key)+1}`}></label>
                                                                                    </div>
                                                                                    <div className="course-item-content" onClick={()=>{ cargarContenidoEspecifico(categoria.curso_contenido[key].id_contenido, false) }}>

                                                                                        <div className="custom-control custom-checkbox media media-card" style={{float:'left'}}>                                                                                                                                                                            
                                                                                            {categoria.curso_contenido[key].tipo_contenido==1 ? 
                                                                                                <div className="media-img" style={{ height: 'auto', cursor:'pointer' }}>
                                                                                                    {categoria.curso_contenido[key].imagen_preview_pequena && categoria.curso_contenido[key].imagen_preview_pequena!=null ? <img src={`${urlBaseApi}/${categoria.curso_contenido[key].imagen_preview_pequena}`} alt={categoria.curso_contenido[key].nombre} /> : <img src={`${urlBase}/images/course-no-image.png`} alt={categoria.curso_contenido[key].nombre} /> }
                                                                                                </div> : ''}                                                                            
                                                                                        </div>

                                                                                        <h4 className="fs-15">{parseInt(key)+1}. {categoria.curso_contenido[key].nombre}</h4>
                                                                                        <div className="courser-item-meta-wrap">
                                                                                            <p className="course-item-meta">
                                                                                                {
                                                                                                    categoria.curso_contenido[key].tipo_contenido == 1
                                                                                                    ? 
                                                                                                        <i className="la la-play-circle"></i>
                                                                                                    : categoria.curso_contenido[key].tipo_contenido === 2
                                                                                                    ? 
                                                                                                        categoria.curso_contenido[key].tipo==1 ? 'Actividad' : 'Examen'

                                                                                                    : categoria.curso_contenido[key].tipo_contenido === 3
                                                                                                    ? 'Actividad tipo 3'
                                                                                                    : 'Actividad desconocida'
                                                                                                }

                                                                                                {
                                                                                                    categoria.curso_contenido[key].tipo_contenido == 1
                                                                                                    ? 
                                                                                                        categoria.curso_contenido[key].cantidad_horas_de_video_resumida

                                                                                                    : categoria.curso_contenido[key].tipo_contenido === 2
                                                                                                    ? 
                                                                                                        categoria.curso_contenido[key].tipo==1 ? '' : categoria.curso_contenido[key].cantidad_horas_de_video!='00:00:00' ? categoria.curso_contenido[key].tiempo_resumido : ''
                                                                                                        
                                                                                                    : categoria.curso_contenido[key].tipo_contenido === 3
                                                                                                    ? 'Actividad tipo 3'
                                                                                                    : 'Actividad desconocida'
                                                                                                }    
                                                                                            </p>                                                                                            
                                                                                            {Object.keys(categoria.curso_contenido[key].descargables).length>0 &&
                                                                                                <div className="generic-action-wrap">
                                                                                                    <DropdownContenido data={categoria.curso_contenido[key].descargables} />
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        ))}                                                                          
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}                                                        
                                                </div>
                                            </div>
                                        </div>




                                    </div>    
                                </div>
                            </div>
                        </div> 

                        <div className="course-dashboard-sidebar-column">
                            <button className="sidebar-open" type="button"><i className="la la-angle-left"></i> Contenido&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                            <div className="course-dashboard-sidebar-wrap custom-scrollbar-styled">
                                <div className="course-dashboard-side-heading d-flex align-items-center justify-content-between">
                                    <h3 className="fs-18 font-weight-semi-bold">Contenido del curso</h3>
                                    <button className="sidebar-close" type="button"><i className="la la-times"></i></button>
                                </div>
                                <div className="course-dashboard-side-content">
                                    <div className="accordion generic-accordion generic--accordion" id="accordionCourseExample">
                                        {contenido.map((categoria, index) => (
                                            <div className="card"> 
                                                <div className="card-header" id={`heading${parseInt(index)+1}`}>
                                                    <button aria-expanded={activeTab === index} onClick={() => toggleTab(index)} className={`btn btn-link ${activeTab !== index ? 'collapsed' : ''}`} type="button" data-toggle="collapse" data-target={`#collapse${parseInt(index)+1}`} aria-controls={`collapse${parseInt(index)+1}`}>
                                                        <i className="la la-angle-down" style={{display:'none'}}></i>
                                                        <i className="la la-angle-up" style={{display:'none'}}></i>
                                                        <span className="fs-15"> Sección {parseInt(index)+1}: {categoria.nombre} </span>
                                                        <span className="course-duration">
                                                            <span>&nbsp;{categoria.cantidad_consumidos}/{categoria.cantidad_contenidos}</span>
                                                            <span>21min</span>
                                                        </span>
                                                    </button>
                                                </div>
                                                <div id={`collapse${parseInt(index)+1}`} className={`show ${collapsing && activeTab === index ? 'collapsing2' : ''}${activeTab !== index ? 'collapse2' : ''}${activeTab === index && !collapsing ? 'collapse2 show' : ''}`} aria-labelledby={`heading${parseInt(index)+1}`} data-parent="#accordionCourseExample">
                                                    <div className="card-body p-0">
                                                        <ul className="curriculum-sidebar-list">
                                                            {Object.keys(categoria.curso_contenido).map((key) => (
                                                                <li className={`course-item-link ${categoria.curso_contenido[key].id_contenido==contenidoActivado ? 'active' : '' }`}>
                                                                    <div className="course-item-content-wrap">
                                                                        <div className="custom-control custom-checkbox">
                                                                            <input type="checkbox" className="custom-control-input" id={`courseCheckbox${parseInt(key)+1}`} checked={`${categoria.curso_contenido[key].estado_consumo==1 ? 'checked' : ''}`} required />
                                                                            <label className="custom-control-label custom--control-label" for={`courseCheckbox${parseInt(key)+1}`}></label>
                                                                        </div>
                                                                        <div className="course-item-content" onClick={()=>{ cargarContenidoEspecifico(categoria.curso_contenido[key].id_contenido) }}>

                                                                            <div className="custom-control custom-checkbox media media-card" style={{float:'left'}}>                                                                                                                                                                            
                                                                                {categoria.curso_contenido[key].tipo_contenido==1 ? 
                                                                                    <div className="media-img" style={{ height: 'auto', cursor:'pointer' }}>
                                                                                        {categoria.curso_contenido[key].imagen_preview_pequena && categoria.curso_contenido[key].imagen_preview_pequena!=null ? <img src={`${urlBaseApi}/${categoria.curso_contenido[key].imagen_preview_pequena}`} alt={categoria.curso_contenido[key].nombre} /> : <img src={`${urlBase}/images/course-no-image.png`} alt={categoria.curso_contenido[key].nombre} /> }
                                                                                    </div> : ''}                                                                            
                                                                            </div>

                                                                            <h4 className="fs-15">{parseInt(key) + 1}. {categoria.curso_contenido[key].nombre}</h4>
                                                                            <div className="courser-item-meta-wrap">
                                                                                <p className="course-item-meta">
                                                                                    {
                                                                                        categoria.curso_contenido[key].tipo_contenido == 1
                                                                                        ? 
                                                                                            <i className="la la-play-circle"></i>
                                                                                        : categoria.curso_contenido[key].tipo_contenido === 2
                                                                                        ? 
                                                                                            categoria.curso_contenido[key].tipo==1 ? 'Actividad' : 'Examen'

                                                                                        : categoria.curso_contenido[key].tipo_contenido === 3
                                                                                        ? 'Actividad tipo 3'
                                                                                        : 'Actividad desconocida'
                                                                                    }

                                                                                    {
                                                                                        categoria.curso_contenido[key].tipo_contenido == 1
                                                                                        ? 
                                                                                            categoria.curso_contenido[key].cantidad_horas_de_video_resumida

                                                                                        : categoria.curso_contenido[key].tipo_contenido === 2
                                                                                        ? 
                                                                                            categoria.curso_contenido[key].tipo==1 ? '' : categoria.curso_contenido[key].cantidad_horas_de_video!='00:00:00' ? categoria.curso_contenido[key].tiempo_resumido : ''
                                                                                            
                                                                                        : categoria.curso_contenido[key].tipo_contenido === 3
                                                                                        ? 'Actividad tipo 3'
                                                                                        : 'Actividad desconocida'
                                                                                    }                                                                                        
                                                                                </p>
                                                                                {Object.keys(categoria.curso_contenido[key].descargables).length>0 &&
                                                                                    <div className="generic-action-wrap">
                                                                                        <DropdownContenido data={categoria.curso_contenido[key].descargables} />
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}                                                             
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}                                           
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>    
                </div>    
            </section>            
        </>
    );
}

export default FormularioPlay;