import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import VideoPicker from './VideoPicker';
import TarjetaCursoAdmin from './TarjetaCursoAdmin';
import Paginador from './Paginador';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioEditarCursoVideoPreview() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const { id } = useParams();
    const {jwt, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});    
        
    const [nombre, setNombre] = useState('');    
    const [idVideoPreview, setIdVideoPreview] = useState(0);    
    const [urlVideoPreview, setUrlVideoPreview] = useState('');    
    const [coverVideoPreview, setCoverVideoPreview] = useState('');    
    const [nombreVideoPreview, setNombreVideoPreview] = useState('');     
    const [duracionVideoPreview, setDuracionNombreVideoPreview] = useState('');     
    
    const [mostrarPopUpAgregarVideo, setMostrarPopUpAgregarVideo] = useState(false);
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        obtenerDatosServidor();        
    }, []);
              
    //Estados de los errores de campos
    const camposErrores = {        
        'id_video_preview':[],        
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
                
    const obtenerDatosServidor = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/curso/${id}`, opciones);            
            const datos = await response.json();   
            if (response.ok){      
                setNombre(datos.curso.nombre);               
                setIdVideoPreview(datos.curso.id_video_preview);                                
                setUrlVideoPreview(datos.curso.video_vista_previa);
                setCoverVideoPreview(datos.curso.video_imagen_vista_previa);
                setNombreVideoPreview(datos.curso.video_vista_previa_nombre);
                setDuracionNombreVideoPreview(datos.curso.video_vista_previa_duracion_hms);
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleActualizarCurso = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
                       
        const raw = {            
            'id_video_preview': idVideoPequenoPreview,            
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
            const response = await fetch(`${urlBaseApi}/api/curso/editarvideopreview/${id}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                setPopup({mostrar:true, titulo:'Listo', contenido:'Curso guardado satisfactoriamente'});
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Revisar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});                                                                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }

    }
    
    const handleAgregarVideo = (event) => {         
        event.preventDefault();                       
        setMostrarPopUpAgregarVideo(true);
    }
    const handleSeleccionarVideo = async (id_video) => {        
        setIdVideoPreview(id_video);
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
        {mostrarPopUpAgregarVideo && <VideoPicker funcionMostrarPopUp={setMostrarPopUpAgregarVideo} funcionSetVideoSeleccionado={handleSeleccionarVideo} />}
        <div className="dashboard-content-wrap">
            <div className="container-fluid">
                <div className="dashboard-heading mb-5">                    
                    <h3 className="fs-22 font-weight-semi-bold">{nombre}</h3>
                    <span>Editar video de vista previa del curso</span>
                </div>
                <form action="#">                                                                                
                    {permissions[67] ? <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Video de vista previa</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                                                
                                <div className="col-lg-12">
                                    <div className="form-group mb-0">
                                        <label className="label-text">Tenga en cuenta que el video debería tener internamente las versiones pequeña (Para dispositivos moviles, navegacion rápida, ahorro de datos del cliente y ahorro consumo de banda en el servidor) y grande (Presentación del curso). Si necesita editar las versiones debe dirigirse al panel de subida de videos.</label>                                                                         

                                        {nombreVideoPreview!='' ?
                                        <div className="course-item-content-wrap">
                                            <div className="custom-control custom-checkbox media media-card">                                                                                                                                                                                                                            
                                                <div className="media-img" style={{ height: 'auto' }}>
                                                    {coverVideoPreview && coverVideoPreview!='' ? <img src={`${urlBaseApi}/${coverVideoPreview}`} alt={tema.nombre} onClick={()=>{ setPopupVideo({...popUpVideo, mostrar:true, 'contenido':urlVideoPreview}); }} /> : <img src={`${urlBase}/images/course-no-image.png`} alt={nombreVideoPreview} /> }
                                                </div>
                                            </div>
                                            <div className="course-item-content">
                                                <h4 className="fs-15">{nombreVideoPreview}</h4>                                                                                           
                                                <div className="courser-item-meta-wrap">
                                                    <p className="course-item-meta"><i className="la la-play-circle"></i>{duracionVideoPreview}</p>
                                                </div>
                                            </div>
                                        </div> : 'No tiene video de preview'}

                                        <div className="form-group">                                            
                                            <button className="btn theme-btn" type="button" onClick={handleAgregarVideo} ><i className="la la-plus mr-2"></i>Video</button>&nbsp;                                            
                                        </div>

                                        {erroresCampos['id_video_preview'].length > 0 && (<SpamError mensaje={erroresCampos['id_video_preview']} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : ''}                    
                    <div className="course-submit-btn-box pb-4">
                        <button className="btn theme-btn" type="submit" onClick={handleActualizarCurso}>Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default FormularioEditarCursoVideoPreview;