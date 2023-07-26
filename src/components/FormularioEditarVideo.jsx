import React, {useContext, useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
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
    
    const [nombre, setNombre] = useState('');    
    const [descripcion, setDescripcion] = useState([]);
    const [duracion, setDuracion] = useState('');
    const [videoActual, setVideoActual] = useState('');
    const [videoImagenVistaPrevia, setVideoImagenVistaPrevia] = useState('');
    const [popUpVistaPrevia, setPopupVistaPrevia] = useState({mostrar:false, titulo:'', contenido:''});    
    
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
                setPopupSubida({...popUpSubida, mostrar:false});
                setPopup({mostrar:true, titulo:'Listo', contenido:'Video actualizado satisfactoriamente'});                    
                obtenerDatosServidor();                                
                return;
            } else {
                setPopupSubida({...popUpSubida, mostrar:false});     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Revisar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});                                                                    
            }                
        }catch (error) {
            setPopupSubida({...popUpSubida, mostrar:false});
            console.error('Error de conexión:', error);
        }

    }

    const handleFuncionCerrarPopUpVistaPrevia = () => {        
        setPopupVistaPrevia({...popUpVistaPrevia, mostrar:false});
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
        <Modal show={popUpVistaPrevia.mostrar} size="xx" onHide={handleFuncionCerrarPopUpVistaPrevia} backdrop="static" keyboard={false} animation={false} centered>
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
        <div className="dashboard-content-wrap">
            <div className="container-fluid">
                <div className="dashboard-heading mb-5">                    
                    <h3 className="fs-22 font-weight-semi-bold">Editar video</h3>                    
                </div>
                <form action="#">                      
                    <div className="card card-item">
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
                    </div>        
                    <div className="card card-item">
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
                                            <span className="file-upload-text"><i className="la la-cloud-upload mr-2 fs-18"></i>Seleccona o arrastra el nuevo video que reemplaza a este aquí (opcional).</span>
                                        </div>
                                        <ul>{fileList}</ul>                                        
                                        {erroresCampos['video_grande'].length > 0 && (<SpamError mensaje={erroresCampos['video_grande']} />)}                                                                                                                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                   
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