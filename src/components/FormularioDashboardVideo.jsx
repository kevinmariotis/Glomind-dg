import React, {useContext, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import TarjetaVideoAdmin from './TarjetaVideoAdmin';
import Paginador from './Paginador';
import Popup from './Popup';
import BotonDashboardNavegacionMovil from './BotonDashboardNavegacionMovil';
import DashboardFooter from './DashboardFooter';

function FormularioDashboardVideo() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const {jwt, esMovil, nombres, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});    
    const [datosUsuario, setDatosUsuario] = useState({docente_rating:99.9});
    const [videos, setVideos] = useState([]);    
    const [paginaNavegacion, setPaginaNavegacion] = useState(1);
    const [totalVideos, setTotalVideos] = useState(1);
    const [palabraBuscar, setPalabraBuscar] = useState('');

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
       
    useEffect(() => {      
        window.scrollTo(0, 0);   
        obtenerDatosVideos();
    }, [paginaNavegacion, palabraBuscar]);

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const handleSetPalabraBuscar = (event) => {                
        event.preventDefault();   
        setPalabraBuscar(event.target.value);
    };
        
    const obtenerDatosVideos = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            
            //buscamos los datos de los videos a mostrar
            setMostrarSpinner(true);
            const response2 = await fetch(`${urlBaseApi}/api/video/getTodos/${paginaNavegacion}/created_at-desc/${palabraBuscar}`, opciones);
            setMostrarSpinner(false);
            if (response2.ok){   
                const datos2 = await response2.json();   
                setVideos(datos2.videos);
                setTotalVideos(datos2.total_videos);
            } else {     
                const datos2 = await response2.json();            
                mensajesDeError(setPopup, response2.status, (typeof datos2.datos !== 'undefined') ? datos2.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
    
    const permisoEditar = (permissions[28] || permissions[71] || permissions[72]) ? 1 : 0;

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
        <div className="dashboard-content-wrap">
            {esMovil && <BotonDashboardNavegacionMovil />}
            <div className="container-fluid">                                                
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                    <div className="media media-card align-items-center">                        
                        <h3 className="fs-22 font-weight-semi-bold">Videos del sistema</h3>                        
                    </div>                    
                    <div className="btn-box pt-30px">
                        {permissions[27] && <Link to="/video/crear" className="btn theme-btn"><i className="la la-plus mr-2"></i> Subir nuevo video</Link>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label className="label-text">Buscar video</label>
                            <input onChange={handleSetPalabraBuscar} className="form-control form--control pl-3" type="text" name="buscar_video" maxLength="32" placeholder="Ej: Leccion 1, Manipulación del DOM" />
                        </div>
                    </div>
                </div>

                <div className="row">
                    {Object.keys(videos).map((key) => (
                        <TarjetaVideoAdmin
                            key={`tarjeta${videos[key].id}`}
                            idvideo={videos[key].id}                                    
                            nombre={videos[key].nombre}
                            imagen_grande={videos[key].imagen_preview_grande}                                                                        
                            imagen_pequena={videos[key].imagen_preview_pequena}
                            duracion={videos[key].duracion_hms}
                            videogrande={videos[key].video_grande}
                            ancho={videos[key].ancho}
                            alto={videos[key].alto}
                            permisoEditar={permisoEditar}                            
                            asignado={videos[key].asignado} 
                            segmentos={videos[key].segmentos} 
                        />
                    ))}                       
                </div>
                <Paginador elemetosTotales={totalVideos} elementosPorPagina={16} paginaActual={paginaNavegacion} callbackCambioPagina={setPaginaNavegacion} />
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioDashboardVideo;