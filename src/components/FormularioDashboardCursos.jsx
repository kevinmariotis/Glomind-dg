import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import TarjetaCursoAdmin from './TarjetaCursoAdmin';
import Paginador from './Paginador';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioDashboardCursos() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const {jwt, nombres, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});    
    const [datosUsuario, setDatosUsuario] = useState({docente_rating:99.9});
    const [cursos, setCursos] = useState([]);    
    const [paginaNavegacion, setPaginaNavegacion] = useState(1);
    const [totalCursos, setTotalCursos] = useState(1);
    const [palabraBuscar, setPalabraBuscar] = useState('');

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {         
        obtenerDatosCursos();
    }, [palabraBuscar]);

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
            const response2 = await fetch(`${urlBaseApi}/api/curso/getTodos/${paginaNavegacion}/nombre-desc/0/aa/${palabraBuscar}`, opciones);
            setMostrarSpinner(false);
            if (response2.ok){   
                    const datos2 = await response2.json();   
                    setCursos(datos2.cursos);
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

    const nivelHabilidad = ['', 'Básico', 'Intermedio', 'Avanzado'];
    
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
                        <h3 className="fs-22 font-weight-semi-bold">Cursos del sistema</h3>                        
                    </div>
                    <div className="file-upload-wrap file-upload-wrap-2 file--upload-wrap">                        
                        <input type="file" name="files[]" className="multi file-upload-input" />
                        {permissions[21] && <span className="file-upload-text"><i className="la la-upload mr-2"></i>Crear curso</span>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label className="label-text">Buscar curso</label>
                            <input onChange={handleSetPalabraBuscar} className="form-control form--control pl-3" type="text" name="buscar_curso" maxLength="32" placeholder="Ej: Curso de React Avanzado" />
                        </div>
                    </div>
                </div>

                <div className="dashboard-cards mb-5">
                    {Object.keys(cursos).map((key) => (
                        <div key={cursos[key].id} className="card card-item card-item-list-layout">
                            <div className="card-image">
                                <a href="course-details.html" className="d-block">
                                    <img className="card-img-top" src={cursos[key].imagen_pequena!='' ? urlBaseApi+'/'+cursos[key].imagen_pequena : 'images/img8.jpg'} alt="Card image cap" />
                                </a>
                                <div className="course-badge-labels">
                                    {cursos[key].bestseller==1 && <div className="course-badge">Más vendidos</div>}
                                    {cursos[key].promocionado==1 && <div className="course-badge red">Promocionado</div>}
                                    {cursos[key].gratis==1 && <div className="course-badge green">Gratis</div>}
                                    {cursos[key].alto_valorado==1 && <div className="course-badge sky-blue">Mejores reseñas</div>}
                                    {cursos[key].porcentaje_descuento!=0 && <div className="course-badge blue">-{cursos[key].porcentaje_descuento}%</div>}
                                </div>
                            </div>
                            <div className="card-body">
                                <h6 className="ribbon ribbon-blue-bg fs-14 mb-3">{nivelHabilidad[cursos[key].nivel]}</h6>
                                <h5 className="card-title"><a href="course-details.html">{cursos[key].nombre}</a></h5>
                                {cursos[key].id_instructor!=0 && <p className="card-text"><a href="teacher-detail.html">{cursos[key].instructor}</a></p>}
                                <div className="rating-wrap d-flex align-items-center py-2">
                                    <div className="review-stars">
                                        <span className="rating-number">{cursos[key].reviews_puntuacion}</span>
                                        {[1, 2, 3, 4, 5].map((number) => (                                                                                
                                            <span key={`estrella-curso-detalle-${number}`} className={`la la-star${cursos[key].reviews_puntuacion < number ? "-o" : ""}`}></span>
                                        ))}    
                                    </div>
                                    <span className="rating-total pl-1">({cursos[key].reviews_cantidad})</span>
                                </div>
                                <ul className="card-duration d-flex align-items-center fs-15 pb-2">
                                    <li className="mr-2">
                                        <span className="text-black">Status:</span>
                                        <span className="badge badge-success text-white">Published</span>
                                    </li>
                                    <li className="mr-2">
                                        <span className="text-black">Duration:</span>
                                        <span>{cursos[key].cantidad_horas_de_video}</span>
                                    </li>
                                    <li className="mr-2">
                                        <span className="text-black">Estudiantes:</span>
                                        <span>{cursos[key].cantidad_estudiantes}</span>
                                    </li>
                                </ul>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="card-price text-black font-weight-bold">{cursos[key].precio_actual} {cursos[key].precio_anterior!=0 && <span className="before-price font-weight-medium">{cursos[key].precio_anterior}</span>}</p>
                                    <div className="card-action-wrap pl-3">
                                        <a href="course-details.html" className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-success" data-toggle="tooltip" data-placement="top" data-title="View"><i className="la la-eye"></i></a>
                                        <div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Edit"><i className="la la-edit"></i></div>
                                        <div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Delete">
                                            <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}                  
                </div>
                <Paginador elemetosTotales={totalCursos} elementosPorPagina={15} paginaActual={paginaNavegacion} callbackCambioPagina={setPaginaNavegacion} />
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioDashboardCursos;