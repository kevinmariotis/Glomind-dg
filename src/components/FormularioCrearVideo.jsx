import React, {useContext, useState, useEffect} from 'react';
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
    const {jwt, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});        
    const [popUpSubida, setPopupSubida] = useState({mostrar:false, titulo:'', contenido:''});        
    const [selectedVideo, setSelectedImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const [nombre, setNombre] = useState('');    
    const [descripcion, setDescripcion] = useState('');
    const [videoActual, setVideoActual] = useState('');
    
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        //obtenerDatosServidor();        
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
        setSelectedImage(acceptedFiles[0]);
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
    
    const handleSubirVideo = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();

        if(selectedVideo!=null){                        
            setPopupSubida({...popUpSubida, mostrar:true});

            const formData = new FormData();
            formData.append('descripcion', descripcion);
            formData.append('nombre', nombre);
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
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Video guardado satisfactoriamente'});
                    setNombre('');
                    setDescripcion('');
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
            xhr.open('POST', `${urlBaseApi}/api/video`, true);
            xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
            xhr.send(formData);
        }    
    }
                
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
        <div className="dashboard-content-wrap">
            <div className="container-fluid">
                <div className="dashboard-heading mb-5">                    
                    <h3 className="fs-22 font-weight-semi-bold">Crear video</h3>                    
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
                                        <div {...getRootProps()}>
                                            {videoActual!='' && 
                                                <><img className="mr-3" src={`${urlBaseApi}/${videoActual}`} alt="Video del curso"/><br/></>
                                            }                                                                                                        
                                            <input {...getInputProps()} className="multi file-upload-input" />
                                            <span className="file-upload-text"><i className="la la-cloud-upload mr-2 fs-18"></i>Seleccona o arrastra el video aquí.</span>
                                        </div>
                                        <ul>{fileList}</ul>                                        
                                        {erroresCampos['video_grande'].length > 0 && (<SpamError mensaje={erroresCampos['video_grande']} />)}                                                                                                                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                   
                    <div className="course-submit-btn-box pb-4">
                        <button className="btn theme-btn" type="submit" onClick={handleSubirVideo}>Subir video</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default FormularioCrearVideo;