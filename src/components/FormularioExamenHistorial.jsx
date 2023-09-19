import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import Popup from './Popup';
import CompaniasAliadas from './CompaniasAliadas';
import Paginador from './Paginador';
import 'react-loading-skeleton/dist/skeleton.css'

function FormularioExamenHistorial() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const navigate = useNavigate(); 
    const { id_examen, id_curso } = useParams();
    const {jwt, nombres, imagen_pequena} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
    
    const [intentos, setIntentos] = useState({});
    const [examen, setExamen] = useState({nombre:'', tipo:1});
    const [pagina, setPagina] = useState(1);
    const [elementosTotales, setElementosTotales] = useState(0);
    const [buscarPorNombre, setBuscarPorNombre] = useState('');
    const [curso, setCurso] = useState({nombre:'', instructor:'', url_amigable:'', imagen_pequena:null, es_docente:0});
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    

    useEffect(() => {           
        window.scrollTo(0, 0);            
        obtenerDatosCurso();
    }, []);

    useEffect(() => {
        if(curso.nombre!=''){
            obtenerDatosDelServidor();
        }
    }, [curso, buscarPorNombre]);
    
    const handleFuncionAceptarPopUp = () => {                
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    
    const handleBusquedaPorNombre = (event) => {    
        setBuscarPorNombre(event.target.value);
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
            const response = await fetch(`${urlBaseApi}/api/examen/getResultadosIntentos/${id_examen}/${id_curso}/${pagina}${curso.es_docente==1 ? '/-1' : ''}/${buscarPorNombre}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){  
                setExamen(datos.examen);
                setIntentos(datos.intentos);                
                setElementosTotales(datos.elementos_totales);
            } else {                      
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerDatosCurso = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/curso/informacionBasica/${id_curso}`, opciones);            
            const datos = await response.json();   
            if (response.ok){                                           
                setCurso(datos);                       
            } else {                      
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
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
                tipo={popUp.tipo} 
                titulo={popUp.titulo} 
                mensaje={popUp.contenido} 
                funcionAceptar={handleFuncionAceptarPopUp} 
                funcionCerrar={handleFuncionCerrarPopUp}
                textoCerrar="Cerrar"
            />
            <section className="breadcrumb-area pt-5 bg-white pattern-bg">
                <div className="container">
                    <div className="breadcrumb-content">
                        <div className="media media-card align-items-center">
                            <div className="media-img media--img media-img-md rounded-full">                                
                                <img className="rounded-full" src={imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${imagen_pequena}`} alt="Foto del usuario" />
                            </div>
                            <div className="media-body">
                                <h2 className="section__title fs-30">{nombres}</h2>
                                <span className="d-block lh-18 pt-1">{curso.es_docente==1 ? 'Instructor' : 'Estudiante' }</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="quiz-action-nav bg-white py-3 shadow-sm mt-50px">
                    <div className="container">
                        <div className="breadcrumb-content">
                            <ul className="quiz-nav d-flex flex-wrap align-items-center">
                                <li><Link to={`${urlBase}/play/${curso.url_amigable}`}><i className="la la-arrow-left mr-2"></i>Volver al curso</Link></li>
                                <li>
                                    <div className="d-flex align-items-center">
                                        <div className="media media-card">
                                        {curso.url_amigable=='' ? <Skeleton width={82} height={48} /> : 
                                            <Link to={`/play/${curso.url_amigable}`} className="media-img" style={{ height: 'auto' }}>
                                                {curso.imagen_pequena!=null ? <img src={`${urlBaseApi}/${curso.imagen_pequena}`} alt={curso.nombre} /> : <img src="images/course-no-image.png" alt={curso.nombre} /> }
                                            </Link>
                                        }
                                        </div>
                                        <p>
                                            {curso.nombre=='' ?  <Skeleton width={300}  style={{marginLeft: '15px'}} /> : <Link to={`/play/${curso.url_amigable}`}>{curso.nombre}</Link>}
                                            {curso.nombre=='' ? <Skeleton width={150}  style={{marginLeft: '15px'}} /> : <span className="d-block fs-13">{curso.instructor}</span>}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="breadcrumb-area">
                <div className="pt-60px pb-60px">
                    <div className="container">                                                                    
                        <div className="quiz-result-item mb-5">
                            <ul className="quiz-nav pb-4">
                                <li>
                                    <div className="d-flex align-items-center">
                                        <a href="course-details.html">
                                            <img src="images/angular.png" alt="" className="w-50px" />
                                        </a>
                                        <p>
                                            <Link  to={`/examen/presentacion/${id_examen}/${id_curso}`}className="fs-22 font-weight-semi-bold">{examen.nombre}</Link><span className="d-block pt-1">{examen.tipo==1 ? 'Actividad' : 'Examen'}</span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            {curso.es_docente==1 && <div className="d-flex flex-wrap align-items-center pb-4">
                                <form method="post" className="mr-3 flex-grow-1">
                                    <div className="form-group">
                                        <input onKeyUp={handleBusquedaPorNombre} className="form-control form--control pl-3" type="text" name="buscar_por_nombre" placeholder="Buscar por nombre" maxLength="64" />
                                        <span className="la la-search search-icon"></span>
                                    </div>
                                </form>                            
                            </div>}         
                            {Object.keys(intentos).map((key) => (
                                <div key={`intento-item-${key}`} className="list-group">
                                    <Link to={`/examen/resultados/${intentos[key].id}/${id_curso}`} className="list-group-item list-group-item-action d-flex">
                                        <div className="flex-grow-1">
                                            <h5 className="fs-16">{intentos[key].nombres} {intentos[key].apellidos}</h5>
                                            <small className="text-muted">{intentos[key].fecha_hora_fin_formateada}</small>
                                        </div>
                                        <div className="text-center">
                                            <span className="d-block lh-20 font-weight-semi-bold mb-n1">{intentos[key].calificacion}</span>
                                            <small className="text-uppercase text-muted">puntuación</small>
                                        </div>
                                    </Link>                                
                                </div>
                            ))}
                            <Paginador elemetosTotales={elementosTotales} elementosPorPagina={100} paginaActual={pagina} callbackCambioPagina={setPagina} />
                        </div>
                    </div>
                </div>                    
            </section>                                       
            <CompaniasAliadas />
        </>
    )
}

export default FormularioExamenHistorial;