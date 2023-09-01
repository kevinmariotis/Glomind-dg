import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import { AuthContext } from '../AuthContext';
import { mensajesDeError, convertirSegundosAHorasMinutosSegundos } from './utils';
import Spinner from './Spinner';
import Popup from './Popup';
import CompaniasAliadas from './CompaniasAliadas';
import 'react-loading-skeleton/dist/skeleton.css'

function FormularioExamenHistorial() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const navigate = useNavigate(); 
    const { id_examen, id_curso } = useParams();
    const {jwt, nombres, imagen_pequena} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
    
    const [examen, setExamen] = useState({tiempo:0, cantidad_preguntas:0, tipo:0, intentos:'', descripcion:'', mejor_intento:'', peor_intento:'', promedio_intentos:'', promedio_global:'', intentos_realizados:''});
    const [curso, setCurso] = useState({nombre:'', instructor:'', url_amigable:'', imagen_pequena:null});
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    

    useEffect(() => {           
        window.scrollTo(0, 0);    
        obtenerDatosDelServidor();
        obtenerDatosCurso();
    }, []);
    
    const handleFuncionAceptarPopUp = () => {                
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
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
            const response = await fetch(`${urlBaseApi}/api/examen/${id_examen}/${id_curso}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){                                                           
                if(datos.id_examen_intento_abierto!=-1){
                    navigate(`/examen/intento/${datos.id_examen_intento_abierto}/${id_curso}`);
                }else{
                    setExamen(datos);   
                }
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
                                <img className="rounded-full" src={imagen_pequena=='' ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${imagen_pequena}`} alt="Foto del estudiante" />
                            </div>
                            <div className="media-body">
                                <h2 className="section__title fs-30">{nombres}</h2>
                                <span className="d-block lh-18 pt-1">Estudiante</span>
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
                        
                        
                        <div class="quiz-result-item mb-5">
                            <ul class="quiz-nav pb-4">
                                <li>
                                    <div class="d-flex align-items-center">
                                        <a href="course-details.html">
                                            <img src="images/angular.png" alt="" class="w-50px" />
                                        </a>
                                        <p>
                                            <a href="course-details.html" class="fs-22 font-weight-semi-bold">Angular Fundamentals</a><span class="d-block pt-1">View Course</span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            <div class="list-group">
                                <a href="student-quiz-result-details.html" class="list-group-item list-group-item-action d-flex">
                                    <div class="flex-grow-1">
                                        <h5 class="fs-16">Fundamentals of Working with Angular</h5>
                                        <small class="text-muted">14 min ago</small>
                                    </div>
                                    <div class="text-center">
                                        <span class="d-block lh-20 font-weight-semi-bold mb-n1">4.8</span>
                                        <small class="text-uppercase text-muted">score</small>
                                    </div>
                                </a>
                                <a href="student-quiz-result-details.html" class="list-group-item list-group-item-action d-flex">
                                    <div class="flex-grow-1">
                                        <h5 class="fs-16">Working with the Angular CLI</h5>
                                        <small class="text-muted">14 min ago</small>
                                    </div>
                                    <div class="text-center">
                                        <span class="d-block lh-20 font-weight-semi-bold mb-n1">4.8</span>
                                        <small class="text-uppercase text-muted">score</small>
                                    </div>
                                </a>
                                <a href="student-quiz-result-details.html" class="list-group-item list-group-item-action d-flex">
                                    <div class="flex-grow-1">
                                        <h5 class="fs-16">Understanding Dependency Injection</h5>
                                        <small class="text-muted">14 min ago</small>
                                    </div>
                                    <div class="text-center">
                                        <span class="d-block lh-20 font-weight-semi-bold mb-n1">4.8</span>
                                        <small class="text-uppercase text-muted">score</small>
                                    </div>
                                </a>

                            </div>
                        </div>



                    </div>
                </div>                    
            </section>                                       
            <CompaniasAliadas />
        </>
    )
}

export default FormularioExamenHistorial;