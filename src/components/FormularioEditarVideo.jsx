import React, {useContext, useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../AuthContext';
import { mensajesDeError, convertirSegundosAHorasMinutosSegundos } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioEditarVideo() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const { id } = useParams();
    const {jwt, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});        
    const [popUpSubida, setPopupSubida] = useState({mostrar:false, titulo:'', contenido:''});        
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [progress, setProgress] = useState(0);
    const [deshabilitarRange, setDeshabilitarRange] = useState(false);    
    const [rangoSeleccionado, setRangoSeleccionado] = useState(-1);    
    const [rangoSeleccionadoConvertido, setRangoSeleccionadoConvertido] = useState('No cambiar la actual');
    const [imagenMiniaturaSeleccionada, setImagenMiniaturaSeleccionada] = useState(`${urlBase}/images/course-no-image.png`);
    const [mostrarVentanaCrearSegmento, setMostrarVentanaCrearSegmento] = useState(false);
    const [tieneSegmentosDesactivados, setTieneSegmentosDesactivados] = useState(false);
    const [editarMarcador, setEditarMarcador] = useState(0);
    

    const [nombre, setNombre] = useState('');    
    const [descripcion, setDescripcion] = useState([]);
    const [duracion, setDuracion] = useState('');
    const [duracionSegundos, setDuracionSegundos] = useState(0);
    const [videoActual, setVideoActual] = useState('');
    const [videoImagenVistaPrevia, setVideoImagenVistaPrevia] = useState('');
    const [popUpVistaPrevia, setPopupVistaPrevia] = useState({mostrar:false, titulo:'', contenido:''});    
    const [segmentos, setSegmentos] = useState({});    
    const [nombreSegmento, setNombreSegmento] = useState('');    
    const [segundoSegmento, setSegundoSegmento] = useState('');    
    const [rangoSeleccionadoSegmento, setRangoSeleccionadoSegmento] = useState(0);
    const [rangoSeleccionadoConvertidoSegmento, setRangoSeleccionadoConvertidoSegmento] = useState(0);

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        obtenerDatosServidor();                
    }, []);
              
    //Estados de los errores de campos
    const camposErrores = {        
        'nombre':[],        
        'descripcion':[],        
        'video_grande':[],
        'segundo_inicio':[],        
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
          
    const handleNombreChange = (event) => { setNombre(event.target.value);    };  
    const handleDescripcionChange = (event) => { setDescripcion(event.target.value);    };      
    
    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const onDrop = (acceptedFiles) => {
        // Lógica para procesar los archivos aceptados
        setSelectedVideo(acceptedFiles[0]);
        setDeshabilitarRange(acceptedFiles[0]==null ? false : true);
        setRangoSeleccionado(acceptedFiles[0]==null ? rangoSeleccionado : -1);
        setRangoSeleccionadoConvertido(acceptedFiles[0]==null ? rangoSeleccionadoConvertido : 'No cambiar la actual');
        setImagenMiniaturaSeleccionada(acceptedFiles[0]==null ? imagenMiniaturaSeleccionada : `${urlBase}/images/course-no-image.png`);
    };
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4'],            
        }
    });    
    const fileList = acceptedFiles.map((file, index) => (
        <li key={`video-ajunta${index}`}>{file.name}</li>
    ));


    const obtenerDatosServidor = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/video/${id}`, opciones);            
            const datos = await response.json();   
            if (response.ok){      
                let desc_array = datos.descripcion.split("<br />");
                let desc = '';                
                desc_array.forEach((element) => {
                    desc = (desc!='') ? desc+='\n'+element : desc=element;
                });                
                setNombre(datos.nombre);               
                setDescripcion(desc);
                setVideoActual(datos.video_grande);
                setVideoImagenVistaPrevia(datos.imagen_preview_pequena);
                setDuracion(datos.duracion_hms);
                setDuracionSegundos(datos.duracion);                
                setDeshabilitarRange(false);
                setSegmentos(datos.segmentos);
                setTieneSegmentosDesactivados(false);
                datos.segmentos.forEach((element) => {
                    if(element.estado==0){
                        setTieneSegmentosDesactivados(true);                        
                    }
                }); 
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
    
    const handleSubirVideo = async (event) => {        
        event.preventDefault();
        reiniciarErrorCampoGlobal();

        setPopupSubida({...popUpSubida, mostrar:true});        

        if(selectedVideo!=null){                        
            
            const formData = new FormData();                        
            formData.append('video_grande', selectedVideo);

            const xhr = new XMLHttpRequest();

            // Escuchamos el evento de progreso para actualizar el estado del progreso.
            xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentage = (event.loaded / event.total) * 100;
                setProgress(percentage.toFixed(0));                
            }
            });

            // Evento de finalización de la carga.
            xhr.onload = () => {                                    
                setPopupSubida({...popUpSubida, mostrar:false});
                const status = xhr.status;   
                const datos = JSON.parse(xhr.responseText);                                      
                if(status>=200 && status<300){ 
                    handleActualizarCurso();                                       
                }else{
                    mensajesDeError(setPopup, status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error', 'contenido': 'Hubo un error al subir el video, revise el formulario.'});
                }                
                return;
            };

            // Evento de error de la carga.
            xhr.onerror = () => {                
                setPopupSubida({...popUpSubida, mostrar:false});
                const status = xhr.status;
                const datos = JSON.parse(xhr.responseText);
                mensajesDeError(setPopup, status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error', 'contenido': 'Hubo un error al subir el video, revise el formulario.'});                                                                    
                return;                
            };

            // Enviamos la solicitud POST con el archivo.
            xhr.open('POST', `${urlBaseApi}/api/video/actualizarvideo/${id}`, true);
            xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
            xhr.send(formData);
        }else{
            handleActualizarCurso();
        }
    }
    
    const handleActualizarCurso = async () => {
        reiniciarErrorCampoGlobal();
        setProgress(0);
        if(permissions[28]==1){
            const raw = {
                'nombre': nombre.toString(),            
                'descripcion': descripcion.toString(),
            };
                                
            const opciones = {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: JSON.stringify(raw),
            };
            
            try {                
                const response = await fetch(`${urlBaseApi}/api/video/${id}`, opciones);            
                const datos = await response.json();            
                if (response.ok){   
                    if(rangoSeleccionado!=-1){
                        handleActualizarMinuaturaSegundo();
                    }else{    
                        setPopupSubida({...popUpSubida, mostrar:false});
                        setPopup({mostrar:true, titulo:'Listo', contenido:'Video actualizado satisfactoriamente'});                    
                        obtenerDatosServidor();                                
                        return;
                    }                
                } else {
                    setPopupSubida({...popUpSubida, mostrar:false});     
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Revisar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});                                                                    
                }                
            }catch (error) {
                setPopupSubida({...popUpSubida, mostrar:false});
                console.error('Error de conexión:', error);
            }
        }else{
            handleActualizarMinuaturaSegundo();
        }
    }

    const handleActualizarMinuaturaSegundo = async () => {
        reiniciarErrorCampoGlobal();                      
        if(rangoSeleccionado!=-1){
            const opciones = {
                method: 'GET',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                }
            };
            
            try {                
                const response = await fetch(`${urlBaseApi}/api/video/generarVistaPrevia/${id}/${rangoSeleccionado}`, opciones);
                const datos = await response.json();            
                if (response.ok){   
                    setPopupSubida({...popUpSubida, mostrar:false});
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Video actualizado satisfactoriamente'});
                    obtenerDatosServidor();                                                    
                } else {
                    setPopupSubida({...popUpSubida, mostrar:false});     
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Revisar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});                                                                    
                }
                return;
            }catch (error) {
                setPopupSubida({...popUpSubida, mostrar:false});
                console.error('Error de conexión:', error);
            }
        }else{
            setPopupSubida({...popUpSubida, mostrar:false});
            setPopup({mostrar:true, titulo:'Listo', contenido:'Video actualizado satisfactoriamente'});
            obtenerDatosServidor();
        }
    }

    const handleFuncionCerrarPopUpVistaPrevia = () => {        
        setPopupVistaPrevia({...popUpVistaPrevia, mostrar:false});
    };

    const handleRangoSeleccionado = (event) => {                        
        setRangoSeleccionado(event.target.value);
        if(event.target.value!=-1){
            const duracion_hms = convertirSegundosAHorasMinutosSegundos(event.target.value);
            setRangoSeleccionadoConvertido(duracion_hms.horas+':'+duracion_hms.minutos+':'+duracion_hms.segundos);
        }else{
            setRangoSeleccionadoConvertido('No cambiar la actual');
            setImagenMiniaturaSeleccionada(`${urlBase}/images/course-no-image.png`);
        }                
    };
    
    const handleRangoSoltado = async (event) => {                
        //console.log("Rango soltado ", event.target.value);        
        if(event.target.value!=-1){
            setMostrarSpinner(true);
            setDeshabilitarRange(true);
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try {            
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };            
                const response = await fetch(`${urlBaseApi}/api/video/generarVistaPrevia/${id}/${event.target.value}/true`, opciones);            
                setMostrarSpinner(false);
                setDeshabilitarRange(false);
                const datos = await response.blob();                   
                if (response.ok){ 
                    const imageUrl = URL.createObjectURL(datos);                     
                    setImagenMiniaturaSeleccionada(`${imageUrl}`);
                } else {                     
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
                }     
                        
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        }
    };
    
    const handleAgregarMarcador = (event) => { 
        event.preventDefault();
        reiniciarErrorCampoGlobal();     
        setMostrarVentanaCrearSegmento(true);
        setEditarMarcador(0);
        setNombreSegmento('');
        setRangoSeleccionadoSegmento(0);
        setRangoSeleccionadoConvertidoSegmento('00:00:00');
    };
    const handleFuncionCerrarPopUpCrearSegmento = (event) => { 
        setMostrarVentanaCrearSegmento(false);
    };    
    const handleRangoSeleccionadoSegmento = (event) => {                        
        setRangoSeleccionadoSegmento(event.target.value);        
        const duracion_hms = convertirSegundosAHorasMinutosSegundos(event.target.value);
        setRangoSeleccionadoConvertidoSegmento(duracion_hms.horas+':'+duracion_hms.minutos+':'+duracion_hms.segundos);
    };
    const handleNombreSegmentoChange = (event) => { setNombreSegmento(event.target.value);    };      
        
    const handleEditarMarcador = (id_segmento, nombre, segundo_inicio) => {             
        reiniciarErrorCampoGlobal();     
        setMostrarVentanaCrearSegmento(true);
        setEditarMarcador(id_segmento);
        setNombreSegmento(nombre);
        setRangoSeleccionadoSegmento(segundo_inicio.toString());
        const duracion_hms = convertirSegundosAHorasMinutosSegundos(segundo_inicio);
        setRangoSeleccionadoConvertidoSegmento(duracion_hms.horas+':'+duracion_hms.minutos+':'+duracion_hms.segundos);
    };      

    const handleCrearSegmento = async (event) => {         
        event.preventDefault();
        if(editarMarcador==0){
            setMostrarSpinner(true);        
                    
            try {            
                const formData = new FormData();        
                formData.append('id_video', id);
                formData.append('nombre', nombreSegmento);           
                formData.append('segundo_inicio', rangoSeleccionadoSegmento);        

                const opciones = {
                    method: 'POST',
                    headers: {
                        'Authorization' : `Bearer ${jwt}`
                    },
                    body: formData
                };
                const response = await fetch(`${urlBaseApi}/api/videosegmento`, opciones);            
                setMostrarSpinner(false);            
                const datos = await response.json();
                if (response.ok){ 
                    setMostrarVentanaCrearSegmento(false);
                    setNombreSegmento('');
                    setRangoSeleccionadoSegmento(0);
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Marcador Creado.'});
                    obtenerDatosServidor();
                } else {                     
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
                }     
                        
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        }else{
            handleEditarSegmento();
        }
    };

    const handleEditarSegmento = async () => {
        setMostrarSpinner(true);        
                
        try {            
            const raw = {
                'nombre' : nombreSegmento,                        
                'segundo_inicio' : rangoSeleccionadoSegmento,
            }; 
            const opciones = {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: JSON.stringify(raw),
            };
            
            const response = await fetch(`${urlBaseApi}/api/videosegmento/${editarMarcador}`, opciones);            
            setMostrarSpinner(false);            
            const datos = await response.json();
            if (response.ok){ 
                setMostrarVentanaCrearSegmento(false);
                setNombreSegmento('');
                setRangoSeleccionadoSegmento(0);
                setPopup({mostrar:true, titulo:'Listo', contenido:'Marcador Guardado.'});
                obtenerDatosServidor();
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                    
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleBorrarMarcador = async (id_video_segmento) => {         
        setMostrarSpinner(true);        
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'DELETE',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/videosegmento/${id_video_segmento}`, opciones);            
            setMostrarSpinner(false);            
            const datos = await response.blob();                   
            if (response.ok){ 
                setPopup({mostrar:true, titulo:'Listo', contenido:'Marcador borrado.'});
                setSegmentos((prevData) => prevData.filter((item) => item.id !== id_video_segmento));                
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                    
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    return (
        <>
        {mostrarSpinner && <Spinner />}
        <Popup 
            mostrarPopup={popUpSubida.mostrar} 
            tamano="xx"
            tipo={0} 
            titulo={popUpSubida.titulo} 
            mensaje={`${progress} %  Espere que termine la subida y el procesamiento en el servidor antes de intentar subir otro video.`} 
            funcionAceptar={handleFuncionAceptarPopUp} 
            funcionCerrar={handleFuncionCerrarPopUp}
            textoCerrar="Aceptar"
        />                
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
        <Modal show={popUpVistaPrevia.mostrar} size="xx" onHide={handleFuncionCerrarPopUpVistaPrevia} backdrop="static" keyboard={true} animation={false} centered>
            {(popUpVistaPrevia.titulo!='') && <Modal.Header>
                <Modal.Title>{popUpVistaPrevia.titulo}</Modal.Title>                   
            </Modal.Header>}
            <Modal.Body>   
                <video controls crossOrigin="true" playsInline poster={`${videoImagenVistaPrevia!='' ? `${urlBaseApi}/${videoImagenVistaPrevia}` : `${urlBase}/images/pattern.png` }`} id="player" style={{'width':'100%'}}>                                
                    <source src={`${urlBaseApi}/${popUpVistaPrevia.contenido}`} type="video/mp4"/>                                
                </video>
            </Modal.Body>
            <Modal.Footer>                
                <Button variant="secondary" onClick={handleFuncionCerrarPopUpVistaPrevia}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
        <Modal show={mostrarVentanaCrearSegmento} size="lg" onHide={handleFuncionCerrarPopUpCrearSegmento} backdrop="static" keyboard={true} animation={false} centered>
            <Modal.Header>
                <Modal.Title>{editarMarcador==0 ? 'Crear Marcador' : 'Editar Marcador'}</Modal.Title>                   
            </Modal.Header>
            <Modal.Body>   
                <div className="row">                                
                    <div className="col-lg-12">
                        <div className="form-group">
                            <label className="label-text">Nombre</label>
                            <input onChange={handleNombreSegmentoChange} className="form-control form--control pl-3" type="text" name="nombre_segmento" maxLength="64" value={nombreSegmento} placeholder="Ej: Qué es el dom?" />
                            {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}
                        </div>
                    </div>                                
                    <div className="col-lg-12">
                        <div className="form-group">
                            <label className="label-text">Seleccione el minuto/segundo de inicio del marcador</label>
                            <div className="course-item-content-wrap"></div>
                            <p className="course-item-meta"><i className="la la-play-circle"></i>{rangoSeleccionadoConvertidoSegmento}</p>
                            <input type="range" min="0" max={duracionSegundos} value={rangoSeleccionadoSegmento} onChange={handleRangoSeleccionadoSegmento} className="form-range" id="customRange1" style={{width:'100%'}}></input>
                            {erroresCampos['segundo_inicio'].length > 0 && (<SpamError mensaje={erroresCampos['segundo_inicio']} />)}
                        </div>
                    </div>                                
                </div>
            </Modal.Body>
            <Modal.Footer>                
                <Button variant="primary" onClick={handleCrearSegmento}>Guardar</Button>
                <Button variant="secondary" onClick={handleFuncionCerrarPopUpCrearSegmento}>Cancelar</Button>
            </Modal.Footer>
        </Modal>
        <div className="dashboard-content-wrap">
            <div className="container-fluid">
                <div className="dashboard-heading mb-5">                    
                    <h3 className="fs-22 font-weight-semi-bold"><Link to={`/video`}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la lista de videos"><i className="la la-angle-left"></i></div></Link>&nbsp;Editar video</h3>                    
                </div>
                <form action="#">                      
                    {permissions[28] ? <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">General</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Nombre</label>
                                        <input onChange={handleNombreChange} className="form-control form--control pl-3" type="text" name="nombre" maxLength="128" value={nombre} placeholder="Ej: Lección 1: Manipulación del dom" />
                                        {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}
                                    </div>
                                </div>                                
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Descripción</label>
                                        <textarea value={descripcion} onChange={handleDescripcionChange} className="form-control form--control user-text-editor pl-3" name="descripcion" ></textarea>
                                        {erroresCampos['descripcion'].length > 0 && (<SpamError mensaje={erroresCampos['descripcion']} />)}
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div> : ''} 
                    {permissions[71] ? <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Adjuntar video</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                                                
                                <div className="col-lg-12">
                                    <div className="form-group mb-0">                                        
                                        {videoImagenVistaPrevia!='' ?
                                            <div className="course-item-content-wrap">
                                                <div className="form-group media media-card">                                                                                                                                                                                                                
                                                    <div className="media-img" style={{ height: 'auto', width:'160px' }}>
                                                        {videoImagenVistaPrevia && videoImagenVistaPrevia!='' ? <img src={`${urlBaseApi}/${videoImagenVistaPrevia}`} alt={nombre} onClick={()=>{ setPopupVistaPrevia({...popUpVistaPrevia, mostrar:true, 'contenido':videoActual}); }} /> : <img src={`${urlBase}/images/course-no-image.png`} alt={nombre} /> }
                                                    </div>
                                                </div>
                                                <div className="course-item-content">                                                    
                                                    <div className="courser-item-meta-wrap">
                                                        <p className="course-item-meta"><i className="la la-play-circle"></i>{duracion}</p>
                                                    </div>
                                                </div>
                                            </div> : 'No tiene video de preview'
                                        }
                                        <div {...getRootProps()}>                                            
                                            <input {...getInputProps()} className="multi file-upload-input" />
                                            <span className="file-upload-text"><i className="la la-cloud-upload mr-2 fs-18"></i>Selecciona o arrastra el nuevo video que reemplaza a este aquí (opcional).</span>
                                        </div>
                                        <ul>{fileList}</ul>                                        
                                        {erroresCampos['video_grande'].length > 0 && (<SpamError mensaje={erroresCampos['video_grande']} />)}                                                                                                                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>: ''}                   
                    {permissions[70] ? <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Marcadores</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        {tieneSegmentosDesactivados && <span className="badge badge-warning">Los marcadores se desactivaron debido a que el video fue reemplazado por otro y posiblemente los marcadores no concidan, por favor revisar los marcadores.</span>}
                                        <div className="table-responsive">
                                            <table className="table generic-table">
                                                <thead>
                                                <tr>                                                    
                                                    <th scope="col">Inicio tiempo</th>
                                                    <th scope="col">Nombre</th>
                                                    <th scope="col">Estado</th>
                                                    <th scope="col"></th>
                                                </tr>
                                                </thead>
                                                <tbody >
                                                    {Object.keys(segmentos).map((key) => (
                                                        <tr key={`segmento-seleccion-${segmentos[key].id}`}>                                                            
                                                            <td>
                                                                {segmentos[key].segundo_inicio_hms}
                                                            </td>
                                                            <td>
                                                                {segmentos[key].nombre}
                                                            </td>                                                            
                                                            <td>
                                                                {(segmentos[key].estado==1) ? 'Activado' : <span className="badge badge-danger">Desactivado</span>}
                                                                &nbsp;<button type="button"  onClick={() => { handleEditarMarcador(segmentos[key].id, segmentos[key].nombre, segmentos[key].segundo_inicio) } } className="icon-element icon-element-xs shadow-sm border-0" data-toggle="tooltip" data-placement="top" title="Activar"><i className="la la-gear"></i></button>
                                                            </td>                                                            
                                                            <td>
                                                                <button type="button"  onClick={() => { handleBorrarMarcador(segmentos[key].id) } } className="icon-element icon-element-xs shadow-sm border-0" data-toggle="tooltip" data-placement="top" title="Seleccionar">
                                                                    <i className="la la-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}                                
                                                </tbody>
                                            </table>                            
                                        </div>
                                        <div className="course-submit-btn-box pb-4">
                                            <button className="btn theme-btn" type="submit" onClick={event=>{ handleAgregarMarcador(event); }}><i className="la la-plus mr-2"></i>Agregar marcador</button>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : ''}
                    {permissions[72] ? <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Imagen miniatura</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                                                
                                <div className="col-lg-12">
                                    <div className="form-group mb-0">                                        
                                        <label htmlFor="customRange1" className="form-label">Escoger imagen de miniatura</label>
                                        <div className="course-item-content-wrap">
                                            <div className="form-group media media-card">                                                                                                                                                                                                                
                                                <div className="media-img" style={{ height: 'auto', width:'160px' }}>
                                                    <img src={`${imagenMiniaturaSeleccionada}`} alt={nombre} />
                                                </div>
                                            </div>
                                            <div className="course-item-content">                                                    
                                                <div className="courser-item-meta-wrap">
                                                    <p className="course-item-meta"><i className="la la-play-circle"></i>{rangoSeleccionadoConvertido}</p>
                                                </div>
                                            </div>

                                        </div>    
                                        <input disabled={deshabilitarRange} type="range" min="-1" max={duracionSegundos-1} value={rangoSeleccionado} onChange={handleRangoSeleccionado} onMouseUp={handleRangoSoltado} onTouchEnd={handleRangoSoltado} onKeyUp={handleRangoSoltado} className="form-range" id="customRange1" style={{width:'50%'}}></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>: ''}                         
                    <div className="course-submit-btn-box pb-4">
                        <button className="btn theme-btn" type="submit" onClick={handleSubirVideo}>Guardar cambios</button>
                    </div>
                </form>
                <DashboardFooter />                
            </div>
        </div>
        </>
    )
}

export default FormularioEditarVideo;