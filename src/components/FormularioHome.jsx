import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import { mensajesDeError } from './utils';
import Skeleton from 'react-loading-skeleton'
import VideoPlayerPrisma from './VideoPlayerPrisma';
import TarjetaCurso from './TarjetaCurso';
import Paginador from './Paginador';
import 'react-loading-skeleton/dist/skeleton.css'

function FormularioHome() {        
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const urlBase = import.meta.env.VITE_URL_BASE_API;
    const navigate = useNavigate();            
    const {jwt, esMovil, authenticated } = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});
    
    const [sliders, setSliders] = useState({});
    const [categoriasPopulares, setCategoriasPopulares] = useState({});
    
    
    const [tagsPromocionados, setTagsPromocionados] = useState({});
    const [tagsPromocionadosIndex, setTagsPromocionadosIndex] = useState(0);
    const [tagsPromocionadosPagina, setTagsPromocionadosPagina] = useState(1);
    const [tagsPromocionadosIdTagSeleccionado, setTagsPromocionadosIdTagSeleccionado] = useState(0);
    const [tagsPromocionadosCursos, setTagsPromocionadosCursos] = useState({});
    const [tagsPromocionadosTotalCursos, setTagsPromocionadosTotalCursos] = useState(0);    

    const [videoVistaPrevia, setVideoVistaPrevia] = useState('');    
    const [videoVistaPreviaImagen, setVideoVistaPreviaImagen] = useState('');    
    const [mostrarVideoVistaPrevia, setMostrarVideoVistaPrevia] = useState(false);    

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
                
    useEffect(() => {    
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {    
        if(!mostrarSpinner){
            obtenerDatosDelServidor();
        }
    }, [mostrarSpinner]);
    
    useEffect(() => {   
        if(tagsPromocionadosIdTagSeleccionado!=0){
            obtenerTagPromocionado();
        }         
    }, [tagsPromocionadosIdTagSeleccionado, tagsPromocionadosPagina]);

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const handlePreviewVideo = (video_vista_previa, video_vista_previa_imagen) => {
        setVideoVistaPrevia(video_vista_previa);
        setVideoVistaPreviaImagen(video_vista_previa_imagen);
        setMostrarVideoVistaPrevia(!mostrarVideoVistaPrevia);

    }

    const handleCargarTagPromocionado = (index, id_tag) => {
        setTagsPromocionadosIndex(index);
        setTagsPromocionadosPagina(1);
        setTagsPromocionadosIdTagSeleccionado(id_tag);        
    }

    const obtenerDatosDelServidor = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
                        
            const response = await fetch(`${urlBaseApi}/api/home/1`, opciones);
            const datos = await response.json();
            if (response.ok){                                                                               
                setSliders(datos.slider_home);
                setTagsPromocionados(datos.tags_promocionados);
                setCategoriasPopulares(datos.categorias_populares);
                if(datos.tags_promocionados.length>0){                    
                    setTagsPromocionadosIdTagSeleccionado(datos.tags_promocionados[0].id);
                }
            } else {                
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };            

    const obtenerTagPromocionado = async () => {  
        let headers = {}      
        if(authenticated){
            headers = {
                'Authorization':`Bearer ${jwt}`,
            }
        }
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
                            
            const response = await fetch(`${urlBaseApi}/api/cursotag/getCursos/${tagsPromocionadosIdTagSeleccionado}/${tagsPromocionadosPagina}/estudiantes_cantidad-asc`, opciones);

            if (response.ok) {                                
                const datos = await response.json();                                    
                setTagsPromocionadosCursos(datos.cursos);
                setTagsPromocionadosTotalCursos(datos.cantidad_total_cursos);
                //console.log("cantidad total cursos ",datos.cantidad_total_cursos);
            } else {  
                const respuesta = await response.json(); 
                if(respuesta.codigo=='no-disponible'){
                    navigate(`/`);
                }else{
                    const data = await response.json(); 
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                                                 
                }
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const alineacion = ['', '', 'text-center', 'text-right'];

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
            {mostrarVideoVistaPrevia && <div className="modal fade modal-container show" style={{ background: 'rgba(0, 0, 0, 0.7)'}} id="previewModal" tabIndex="-1" role="dialog" aria-labelledby="previewModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document" style={{maxWidth: '1200px'}}>
                    <div className="modal-content">                        
                        <div className="modal-body" style={{paddingTop:'56.25%'}}>                            
                            <VideoPlayerPrisma
                                url_video={`${urlBaseApi}/${videoVistaPrevia}`}
                                url_imagen_preview={`${videoVistaPreviaImagen!='' ? `${urlBaseApi}/${videoVistaPreviaImagen}` : `${urlBase}/images/pattern.png` }`}                                                                                                
                                mostrar_controles={false}
                            />
                        </div>
                        <div className="modal-header border-bottom-gray">                            
                            <button type="button" className="close" data-dismiss="modal" onClick={handlePreviewVideo} aria-label="Close">
                                <span aria-hidden="true" className="la la-times"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
            <Carousel>
                {Object.keys(sliders).length>0 ?
                    Object.keys(sliders).map((key) => (
                        <Carousel.Item key={`slider-index-${key}`} interval={3000}>
                            <div className="hero-slider-item" style={{backgroundImage: `url(${urlBaseApi}/${sliders[key].imagen_grande})`}}>
                                <div className="container">
                                    <div className={`hero-content ${alineacion[sliders[key].alineacion]}`}>
                                        <div className="section-heading">
                                            <h2 className="section__title text-white fs-65 lh-80 pb-3">{sliders[key].titulo.split('<br />').map((line, index) => (<span key={`title-line-${sliders[key].id}-${index}`}>{line}<br /></span> ))}</h2>
                                            <p className="section__desc text-white pb-4">
                                                {sliders[key].subtitulo.split('<br />').map((line, index) => (<span key={`subtitle-line-${sliders[key].id}-${index}`}>{line}<br /></span> ))}                                            
                                            </p>
                                        </div>
                                        <div className="hero-btn-box d-flex flex-wrap align-items-center pt-1">
                                            {(sliders[key].texto_boton!=null && sliders[key].url_boton!=null) ? <Link to={sliders[key].url_boton.replace(urlBase, '')} className="btn theme-btn mr-4 mb-4">{sliders[key].texto_boton} <i className="la la-arrow-right icon ml-1"></i></Link>: ''}
                                            {(sliders[key].texto_video!=null && sliders[key].id_video!=null) ? <div onClick={()=>{ handlePreviewVideo(esMovil ? sliders[key].video_pequeno : sliders[key].video_grande, sliders[key].imagen_preview_grande); }} className="btn-text video-play-btn mb-4" style={{cursor:'pointer'}} data-fancybox>
                                                {sliders[key].texto_video}<i className="la la-play icon-btn ml-2"></i>
                                            </div>: ''}
                                        </div>
                                    </div>
                                </div>
                            </div>   

                        </Carousel.Item>
                    ))
                :
                    <Carousel.Item key={`slider-index-999`}>
                        <div className="hero-slider-item">
                            <div className="container">
                                <div className={`hero-content`}>
                                    <div className="section-heading">
                                        <h2 className="section__title text-white fs-65 lh-80 pb-3"><Skeleton width={'60%'} height={60}/><Skeleton width={'50%'} height={60}/></h2>
                                        <p className="section__desc text-white pb-4">
                                            <Skeleton width={'70%'} height={18} />
                                            <Skeleton width={'50%'} height={18} />
                                        </p>
                                    </div>
                                    <div className="hero-btn-box d-flex flex-wrap align-items-center pt-1" >
                                        <Skeleton width={110} height={50}/>
                                    </div>
                                </div>
                            </div>
                        </div>   
                    </Carousel.Item>   
                }
            </Carousel>     

            <section className="category-area pt-90px">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-9">
                            <div className="category-content-wrap">
                                <div className="section-heading">
                                    <h5 className="ribbon ribbon-lg mb-2">Categorías</h5>
                                    <h2 className="section__title">Categorías Populares</h2>
                                    <span className="section-divider"></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="category-btn-box text-right">
                                <a style={{display:'none'}} href="categories.html" className="btn theme-btn">Todas las categorías <i className="la la-arrow-right icon ml-1"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="category-wrapper mt-30px">
                        <div className="row">
                            {Object.keys(categoriasPopulares).map((key) => (
                                <div key={`categoria-popular-${categoriasPopulares[key].id}`} className="col-lg-4 responsive-column-half">
                                    <div className="category-item">
                                        <img  className="cat__img lazy" src={`${categoriasPopulares[key].imagen_tiny!=null ? `${urlBaseApi}/${categoriasPopulares[key].imagen_tiny}` : 'images/img-loading.png'}`} data-src="images/img1.jpg" alt="Category image" />
                                        <div className="category-content">
                                            <div className="category-inner">
                                                <h3 className="cat__title"><a href="#">{categoriasPopulares[key].nombre}</a></h3>
                                                <p className="cat__meta" style={{display:'none'}}>9 courses</p>
                                                <Link to={`/categoria/${categoriasPopulares[key].url_amigable}`} style={{marginTop:'20px'}} className="btn theme-btn theme-btn-sm theme-btn-white">Explorar<i className="la la-arrow-right icon ml-1"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))} 
                        </div>
                    </div>
                </div>
            </section>


            <section className="course-area pb-120px" style={{paddingTop:'100px'}}>
                <div className="container">
                    <div className="section-heading text-center">
                        <h5 className="ribbon ribbon-lg mb-2">Elige tus cursos deseados</h5>
                        <h2 className="section__title">La mayor selección de cursos profesionales</h2>
                        <span className="section-divider"></span>
                    </div>
                    <ul className="nav nav-tabs generic-tab justify-content-center pb-4" id="myTab" role="tablist">
                        {Object.keys(tagsPromocionados).map((key) => (
                            <li onClick={()=>{ handleCargarTagPromocionado(key, tagsPromocionados[key].id); }} className="nav-item" key={`tab-promocionados-key-${key}`}>
                                <div  className={`nav-link ${tagsPromocionadosIndex==key ? 'active' : ''}`} style={{cursor:'pointer'}} data-toggle="tab" role="tab" aria-selected="true">{tagsPromocionados[key].nombre}</div>
                            </li>
                        ))}                        
                    </ul>
                </div>
                <div className="card-content-wrapper bg-gray pt-50px pb-120px">
                    <div className="container">
                        <div className="tab-content" id="tab-contents-cursos">
                            <div className="tab-pane fade show active" role="tabpanel">
                                <div className="row">
                                    {Object.keys(tagsPromocionadosCursos).map((key) => (                                
                                        <TarjetaCurso
                                            key={`tag-curso-${tagsPromocionadosCursos[key].id}`}
                                            idcurso={tagsPromocionadosCursos[key].id}
                                            url_amigable={tagsPromocionadosCursos[key].url_amigable}
                                            nombre={tagsPromocionadosCursos[key].nombre}
                                            imagen={tagsPromocionadosCursos[key].imagen_pequena}
                                            bestseller={tagsPromocionadosCursos[key].bestseller}
                                            promocionado={tagsPromocionadosCursos[key].promocionado}
                                            gratis={tagsPromocionadosCursos[key].gratis}
                                            alto_valorado={tagsPromocionadosCursos[key].alto_valorado}
                                            porcentaje_descuento={tagsPromocionadosCursos[key].porcentaje_descuento}
                                            nivel={tagsPromocionadosCursos[key].nivel}
                                            instructor={tagsPromocionadosCursos[key].instructor}
                                            id_instructor={tagsPromocionadosCursos[key].id_instructor}
                                            reviews_puntuacion={tagsPromocionadosCursos[key].reviews_puntuacion}
                                            reviews_cantidad={tagsPromocionadosCursos[key].reviews_cantidad}
                                            precio_actual={tagsPromocionadosCursos[key].precio_actual}
                                            precio_anterior={tagsPromocionadosCursos[key].precio_anterior}
                                            favorito={tagsPromocionadosCursos[key].favorito}
                                            col_lg={4}
                                        />
                                    ))}
                                </div>
                                <Paginador elemetosTotales={tagsPromocionadosTotalCursos} elementosPorPagina={15} paginaActual={tagsPromocionadosPagina} callbackCambioPagina={setTagsPromocionadosPagina} />
                            </div>
                        </div>                        
                    </div>
                </div>
            </section>



        </>
    );
}

export default FormularioHome;