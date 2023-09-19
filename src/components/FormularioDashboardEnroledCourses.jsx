import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import TarjetaCursoAdmin from './TarjetaCursoAdmin';
import Paginador from './Paginador';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioDashboardEnroledCourses() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const {jwt, nombres, imagen_pequena} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});
    const [pestanaActivada, setPestanaActivada] = useState(1);
    const [datosUsuario, setDatosUsuario] = useState({docente_rating:99.9});
    const [datosCursosTodos, setDatosCursosTodos] = useState([]);
    const [datosCursosProceso, setDatosCursosProceso] = useState([]);
    const [datosCursosCompletados, setDatosCursosCompletados] = useState([]);
    const [paginaNavegacion, setPaginaNavegacion] = useState(1);
    const [totalCursos, setTotalCursos] = useState(1);

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    

    useEffect(() => {           
        window.scrollTo(0, 0);    
        obtenerDatosDelServidor();    
    }, []);

    useEffect(() => {         
        obtenerDatosCursos();
    }, [pestanaActivada]);

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const handleCambiarPestana = ({numero}) => (event) =>{    
          event.preventDefault();   
          setPestanaActivada(numero);
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
            const response = await fetch(`${urlBaseApi}/api/usuario`, opciones);
            setMostrarSpinner(false);
            if (response.ok){                           
                const datos = await response.json();   
                setDatosUsuario(datos.usuario);                       
            } else {      
                const data = await response.json();          
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerDatosCursos = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            
            //buscamos los datos de los cursos a mostrar
            setMostrarSpinner(true);
            const response2 = await fetch(`${urlBaseApi}/api/usuario/miscursos/${paginaNavegacion}/${pestanaActivada}/nombre-asc/3`, opciones);
            setMostrarSpinner(false);
            if (response2.ok){   
                    const datos2 = await response2.json();   
                    switch(pestanaActivada){
                        case 1:                            
                            setDatosCursosTodos(datos2.cursos);
                        break;
                        case 4:                        
                            setDatosCursosProceso(datos2.cursos);
                        break;
                        case 5:
                            setDatosCursosCompletados(datos2.cursos);
                        break;
                    }
                    setTotalCursos(datos2.total_cursos);
            } else {     
                    const datos2 = await response2.json();            
                    mensajesDeError(setPopup, response2.status, (typeof datos2.datos !== 'undefined') ? datos2.datos : {});                    
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
            <div className="dashboard-menu-toggler btn theme-btn theme-btn-sm lh-28 theme-btn-transparent mb-4 ml-3">
                <i className="la la-bars mr-1"></i> Dashboard Nav
            </div>
            <div className="container-fluid">
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                    <div className="media media-card align-items-center">
                        <div className="media-img media--img media-img-md rounded-full">
                            <img className="rounded-full" src={imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${imagen_pequena}`} alt="Foto del usuario" />
                        </div>
                        <div className="media-body">
                            <h2 className="section__title fs-30">{nombres}</h2>
                            {datosUsuario.docente_reviews>0 && <div className="rating-wrap d-flex align-items-center pt-2">
                                <div className="review-stars">
                                    <span className="rating-number">{datosUsuario.docente_rating}</span>
                                    <span className="la la-star"></span>
                                    <span className="la la-star"></span>
                                    <span className="la la-star"></span>
                                    <span className="la la-star"></span>
                                    <span className="la la-star-o"></span>
                                </div>
                                <span className="rating-total pl-1">({datosUsuario.docente_reviews})</span>
                            </div>}
                        </div>
                    </div>                    
                </div>
                <div className="section-block mb-5"></div>
                <div className="dashboard-heading mb-5">
                    <h3 className="fs-22 font-weight-semi-bold">Cursos matriculados</h3>
                </div>
                <ul className="nav nav-tabs generic-tab pb-30px" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==1 ? 'active': ''}`} onClick={()=>{ handleCambiarPestana({numero:1})(event); }} id="all-course-tab" data-toggle="tab" href="#" role="tab" aria-controls="all-course" aria-selected="false">
                            Todos los cursos
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==4 ? 'active': ''}`} onClick={()=>{ handleCambiarPestana({numero:4})(event); }} id="active-course-tab" data-toggle="tab" href="#" role="tab" aria-controls="active-course" aria-selected="true">
                            Cursos en proceso
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==5 ? 'active': ''}`} onClick={()=>{ handleCambiarPestana({numero:5})(event); }} id="completed-course-tab" data-toggle="tab" href="#" role="tab" aria-controls="completed-course" aria-selected="false">
                            Cursos completados
                        </a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${pestanaActivada==1 ? 'show active': ''}`} id="all-course" role="tabpanel" aria-labelledby="all-course-tab">
                        <div className="row">
                            {Object.keys(datosCursosTodos).map((key) => (
                                <TarjetaCursoAdmin
                                    key={`tarjeta${datosCursosTodos[key].id}`}
                                    idcurso={datosCursosTodos[key].id}
                                    url_amigable={datosCursosTodos[key].url_amigable}
                                    nombre={datosCursosTodos[key].nombre}
                                    imagen={datosCursosTodos[key].imagen_pequena}
                                    instructor={datosCursosTodos[key].instructor}
                                    id_instructor={datosCursosTodos[key].id_instructor}
                                    descripcion_instructor={datosCursosTodos[key].docente_descripcion}
                                    reviews_puntuacion={datosCursosTodos[key].reviews_puntuacion}  
                                    porcentaje_progreso={datosCursosTodos[key].porcentaje_progreso}
                                />
                            ))} 
                        </div>
                    </div>
                    <div className={`tab-pane fade ${pestanaActivada==4 ? 'show active': ''}`} id="active-course" role="tabpanel" aria-labelledby="active-course-tab">
                        <div className="row">
                            {Object.keys(datosCursosProceso).map((key) => (
                                <TarjetaCursoAdmin
                                    key={`tarjeta${datosCursosProceso[key].id}`}
                                    idcurso={datosCursosProceso[key].id}
                                    url_amigable={datosCursosProceso[key].url_amigable}
                                    nombre={datosCursosProceso[key].nombre}
                                    imagen={datosCursosProceso[key].imagen_pequena}
                                    instructor={datosCursosProceso[key].instructor}
                                    id_instructor={datosCursosProceso[key].id_instructor}
                                    descripcion_instructor={datosCursosProceso[key].docente_descripcion}
                                    reviews_puntuacion={datosCursosProceso[key].reviews_puntuacion}  
                                    porcentaje_progreso={datosCursosProceso[key].porcentaje_progreso}
                                />
                            ))} 
                        </div>
                    </div>
                    <div className={`tab-pane fade ${pestanaActivada==5 ? 'show active': ''}`} id="completed-course" role="tabpanel" aria-labelledby="completed-course-tab">
                        <div className="row">
                            {Object.keys(datosCursosCompletados).map((key) => (
                                <TarjetaCursoAdmin
                                    key={`tarjeta${datosCursosCompletados[key].id}`}
                                    idcurso={datosCursosCompletados[key].id}
                                    url_amigable={datosCursosCompletados[key].url_amigable}
                                    nombre={datosCursosCompletados[key].nombre}
                                    imagen={datosCursosCompletados[key].imagen_pequena}
                                    instructor={datosCursosCompletados[key].instructor}
                                    id_instructor={datosCursosCompletados[key].id_instructor}
                                    descripcion_instructor={datosCursosCompletados[key].docente_descripcion}
                                    reviews_puntuacion={datosCursosCompletados[key].reviews_puntuacion}  
                                    porcentaje_progreso={datosCursosCompletados[key].porcentaje_progreso}
                                />
                            ))} 
                        </div>
                    </div>
                </div>
                <Paginador elemetosTotales={totalCursos} elementosPorPagina={3} paginaActual={paginaNavegacion} callbackCambioPagina={setPaginaNavegacion} />
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioDashboardEnroledCourses;