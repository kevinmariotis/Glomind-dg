import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError, convertirSegundosAHorasMinutosSegundos } from './utils';
import Spinner from './Spinner';
import Popup from './Popup';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function FormularioExamenPresentacion() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const navigate = useNavigate(); 
    const { id_examen, id_curso } = useParams();
    const {jwt} = useContext(AuthContext);
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
        switch(popUp.data_switch){
            case 'iniciar_intento':
                iniciarIntento();
            break;
        }
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

    const iniciarIntento = async () => {                          
        try {            
            const formData = new FormData();               
            formData.append('id_examen', id_examen);
            formData.append('id_curso', id_curso);
                                    
            const opciones = {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: formData
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/examenintento`, opciones);            
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){                                                           
                navigate(`/examen/intento/${datos.id_intento}/${id_curso}`);
            } else {                      
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
    
    const handleConfirmarIntento = (event) => {        
        event.preventDefault(); 
        setPopup({mostrar:true, titulo:'Confirmar', tipo:3, contenido:'Confirma que desea iniciar un intento?', data_switch:'iniciar_intento'});
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
            <section className="breadcrumb-area">
                <div className="bg-white py-3 pattern-bg" style={{zIndex:'0'}}>
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
                <div className="pt-60px pb-60px">
                    <div className="container">                    
                        <div className="breadcrumb-content pt-40px">
                            <div className="section-heading">
                                <h2 className="section__title fs-30 pb-2">Descripción del examen</h2>
                                {examen.descripcion=='' ? 
                                    <>
                                        <Skeleton width={'60%'} height={20} />
                                        <Skeleton width={'55%'} height={20}  />
                                        <Skeleton width={'45%'} height={20}  />
                                    </>
                                    : <p className="section__desc">{examen.descripcion.split('<br />').map((line, index) => (<span>{line}<br /></span> ))}</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>    
                <div className="bg-dark pt-60px pb-60px">
                    <div className="container">                        
                        <div className="row">
                            <div className="col-lg-3 responsive-column-half">
                                <div className="quiz-result-content text-center">
                                    <p className="section__desc text-white-50 pb-2">Nivel</p>
                                    <h2 className="section__title text-white">{examen.tipo==2 ? 'Medio' : examen.tipo==3 ? 'Avanzado' : 'Básico' }</h2>
                                </div>
                            </div>
                            <div className="col-lg-3 responsive-column-half">
                                <div className="quiz-result-content text-center">
                                    <p className="section__desc text-white-50 pb-2">Preguntas</p>
                                    <h2 className="section__title text-white">{examen.cantidad_preguntas}</h2>
                                </div>
                            </div>
                            <div className="col-lg-3 responsive-column-half">
                                <div className="quiz-result-content text-center">
                                    <p className="section__desc text-white-50 pb-2">Límite de tiempo</p>
                                    <h2 className="section__title text-white">{convertirSegundosAHorasMinutosSegundos(examen.tiempo, true)}</h2>
                                </div>
                            </div>
                            <div className="col-lg-3 responsive-column-half">                                
                                <div className="quiz-result-content text-center">
                                    <p className="section__desc text-white-50 pb-2">Intentos realizados</p>
                                    <h2 className="section__title text-white">{examen.intentos_realizados}/{examen.intentos}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>                           
            <section className="quiz-ans-wrap pt-80px pb-80px">
                <div className="container">                   
                    <div className="section-heading text-center">
                        <h2 className="section__title">Estadísticas</h2>
                    </div>
                    <div className="row pt-50px">                       
                        <div className="col">
                            <div className="quiz-result-content text-center mb-4">
                                <h2 className="section__title text-color-4">{examen.mejor_intento}</h2>
                                <p className="section__desc text-color-4 font-weight-semi-bold pt-2">Tu mejor resultado</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="quiz-result-content text-center mb-4">
                                <h2 className="section__title text-color-3">{examen.promedio_intentos}</h2>
                                <p className="section__desc text-color-3 font-weight-semi-bold pt-2">Tu resultado promedio</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="quiz-result-content text-center mb-4">
                                <h2 className="section__title text-color">{examen.peor_intento}</h2>
                                <p className="section__desc text-color font-weight-semi-bold pt-2">Tu peor resultado</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="quiz-result-content text-center mb-4">
                                <h2 className="section__title text-color-2">{examen.promedio_global}</h2>
                                <p className="section__desc text-color-2 font-weight-semi-bold pt-2">Resultado promedio usuarios</p>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="click-to-start-btn-box text-center pt-3">
                                <button className="btn theme-btn" onClick={handleConfirmarIntento}>Click para iniciar un intento</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>            
            <section className="cta-area py-5 position-relative overflow-hidden bg-gray">
                <span className="stroke-shape stroke-shape-1"></span>
                <span className="stroke-shape stroke-shape-2"></span>
                <span className="stroke-shape stroke-shape-3"></span>
                <span className="stroke-shape stroke-shape-4"></span>
                <span className="stroke-shape stroke-shape-5"></span>
                <span className="stroke-shape stroke-shape-6"></span>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="cta-content-wrap">
                                <h3 className="fs-20 font-weight-semi-bold lh-28">Top companies choose <a href="#" className="text-color hover-underline">Aduca for Business</a> to build in-demand career skills.</h3>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="client-logo-wrap text-right">
                                <a href="#" className="client-logo-item client--logo-item-2 pr-3"><img src="images/sponsor-img.png" alt="brand image" /></a>
                                <a href="#" className="client-logo-item client--logo-item-2 pr-3"><img src="images/sponsor-img2.png" alt="brand image" /></a>
                                <a href="#" className="client-logo-item client--logo-item-2 pr-3"><img src="images/sponsor-img3.png" alt="brand image" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default FormularioExamenPresentacion;