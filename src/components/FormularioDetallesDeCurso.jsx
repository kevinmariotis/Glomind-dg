import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from '../AuthContext';
import LoadingAnimation from './LoadingAnimation';
import TarjetaCursoHorizontal from './TarjetaCursoHorizontal';
import Popup from './Popup';
import SpamError from './SpamError';

function FormularioDetallesDeCurso(){
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API; 
    const urlBase = import.meta.env.VITE_URL_BASE;     
    const {jwt, authenticated} = useContext(AuthContext);
    const { id } = useParams();

    const [datos, setDatos] = useState([]);
    const [breadCrumb, setBreadCrumb] = useState([]);
    const [cursoFavorito, setCursoFavorito] = useState(-1);
    const [queAprenderas, setQueAprenderas] = useState([]);
    const [listadoRequerimientos, setListadoRequerimientos] = useState([]);
    const [descripcion, setDescripcion] = useState([]);
    const [contenido, setContenido] = useState([]);
    const [otrosCursos, setOtrosCursos] = useState([]);
    const [docenteDescripcion, setDocenteDescripcion] = useState([]);
    const [docenteCursos, setDocenteCursos] = useState([]);
    const [reviews, setReviews] = useState({});    
    
    const [pestanaActivada, setPestanaActivada]  = useState(0);
    const [mostrarMasDocente, setMostrarMasDocente]  = useState(false);
    const [paginaComentarios, setPaginaComentarios]  = useState(1);         //los nuevos datos traidos de la nueva página de acumulan en el estado "reviews"
    const [cantidadComentariosMaximo, setCantidadComentariosMaximo]  = useState(-1);
    const [orderByComentarios, setOrderByComentarios]  = useState('fecha_creacion-desc');
    const [filtrarByComentarios, setFiltarByComentarios]  = useState('estrella:0');

    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});

    //interval para manejar la busqueda por nombre en lapsos de tiempo
    const [nombre_seleccionado, setNombreSeleccionado] = useState('');   
    const intervalRef = useRef(null);
    const latest_ultimo_nombre_escrito = useRef('');
    const latest_nombre_seleccionado = useRef(nombre_seleccionado);
              
    const chekearCambiosBusquedaNombre = useCallback(() => {
        if(latest_ultimo_nombre_escrito.current!=latest_nombre_seleccionado.current){                    
            setNombreSeleccionado(latest_ultimo_nombre_escrito.current);                          
            latest_nombre_seleccionado.current = latest_ultimo_nombre_escrito.current;     
            setReviews({});           
            setPaginaComentarios(1);       
        }                                                    
    }, []);

    useEffect(() => {        
        if (!intervalRef.current) {
            console.log("creando interval");            
            intervalRef.current = setInterval(() => {
                chekearCambiosBusquedaNombre();                
            }, 1500);
        }        
    }, []);

    useEffect(() => {   
        window.scrollTo(0, 0);
        obtenerDatosDelServidor();
    }, []);

    useEffect(() => {   
        getComentarios();        
    }, [paginaComentarios, filtrarByComentarios, orderByComentarios, nombre_seleccionado]);

    const obtenerDatosDelServidor = async () => {  
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
            
            const response = await fetch(`${urlBaseApi}/api/curso/${id}`, opciones);
            if (response.ok) {                                
                const datos = await response.json();                                    
                setDatos(datos.curso);
                
                const datosArbol = datos.arbol;
                let nuevaDataBreadCrumb = [];
                datosArbol.forEach((elemento) => {  nuevaDataBreadCrumb.push({'link':`${urlBase}/categoria/${elemento.id_categoria}/${elemento.nombre}`, 'nombre':elemento.nombre}); });            
                setBreadCrumb(nuevaDataBreadCrumb);
                setCursoFavorito(datos.curso.favorito);                   
                setQueAprenderas(datos.curso.desc_que_aprenderas.split("<separador>"));
                setListadoRequerimientos(datos.curso.desc_requerimientos.split("<separador>"));
                setDescripcion(datos.curso.desc_general.split("<br />"));
                setContenido(datos.curso.contenido);
                setOtrosCursos(datos.curso.otros_usuarios_compraron);
                setDocenteDescripcion(datos.curso.docente_descripcion.split("<separador>"));
                setDocenteCursos(datos.curso.docente_cursos);
                //setReviews(datos.curso.reviews);
            } else {                
                console.error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleSetFavorito = () =>{
        if(cursoFavorito==0){
            establecerFavorito();
        }else{
            retirarFavorito();
        }
    }

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const establecerFavorito = async (event) => {
                               
        const formData = new FormData();
        formData.append('id_curso', id);           
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            const response = await fetch(`${urlBaseApi}/api/cursofavorito`, opciones);
            const data = await response.json();
        
            if (response.ok) {
                setCursoFavorito(1);
                return;
            } else {
                // Obtener el código de error de la respuesta
                const statusCode = response.status;                
                                       
                // Mostrar mensaje de error según el código de error
                switch (statusCode){
                    case 400:
                        console.error('Error 400: Bad Request');                        
                    break;
                    case 401:
                        console.error('Error 401: Unauthorized');
                        console.log('Datos de error:', data);
                    break;
                    case 404:
                        console.error('Error 404: Not Found');
                        console.log('Datos de error:', data);
                    break;
                    case 500:
                        console.error('Error 500: Internal Server Error');
                        console.log('Datos de error:', data);
                    break;
                    default:
                        console.error('Error desconocido');
                        console.log('Datos de error:', data);
                  break;
                }                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };    

    const retirarFavorito = async (event) => {
                                          
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            }
        };
        
        try {
            const response = await fetch(`${urlBaseApi}/api/cursofavorito/${id}`, opciones);
            const data = await response.json();
        
            if (response.ok) {
                setCursoFavorito(0);
                return;
            } else {
                // Obtener el código de error de la respuesta
                const statusCode = response.status;                
                                       
                // Mostrar mensaje de error según el código de error
                switch (statusCode){
                    case 400:
                        console.error('Error 400: Bad Request');                        
                    break;
                    case 401:
                        console.error('Error 401: Unauthorized');
                        console.log('Datos de error:', data);
                    break;
                    case 404:
                        console.error('Error 404: Not Found');
                        console.log('Datos de error:', data);
                    break;
                    case 500:
                        console.error('Error 500: Internal Server Error');
                        console.log('Datos de error:', data);
                    break;
                    default:
                        console.error('Error desconocido');
                        console.log('Datos de error:', data);
                  break;
                }                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };

    const estrellas = [1, 2, 3, 4, 5];

    const handleActivarPestana = (pestana) => {                
        if(pestana!=pestanaActivada){            
            setPestanaActivada(pestana);
        }
    };

    const handleMostrarMasDocente = () => {                
        setMostrarMasDocente(!mostrarMasDocente);
    };

    const handleCargarMasComentarios = () => {                
        setPaginaComentarios(paginaComentarios+1);        
    };

    const handleFiltrarByComentarios = (event) => {
        setReviews({});           
        setPaginaComentarios(1);
        const ordenAlterno = ['calificacion-desc', 'posision_ranking-desc'];

        if (!ordenAlterno.includes(event.target.value)){
            setFiltarByComentarios(event.target.value);
            setOrderByComentarios('fecha_creacion-desc');
        }else{            
            setOrderByComentarios(event.target.value);
            setFiltarByComentarios('estrella:0');
        }
    };

    const handleBusquedaPorNombreComentarios = (event) => {           
        latest_ultimo_nombre_escrito.current = event.target.value;        
    };

    const handlerVotarComentario = ({key, id_curso, id_usuario_review, calificacion}) =>{
        votarPorComentario({'key':key, 'id_curso': id_curso, 'id_usuario_review': id_usuario_review, 'calificacion': calificacion});
    }

    const votarPorComentario = async (parametros) => {                                       
        const formData = new FormData();
        formData.append('id_curso', parametros.id_curso);   
        formData.append('id_usuario_review', parametros.id_usuario_review);   
        formData.append('calificacion', parametros.calificacion);
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            const response = await fetch(`${urlBaseApi}/api/cursoreviewvoto`, opciones);
            const data = await response.json();
        
            if (response.ok){  
                //todo esto para que aparezca el boton coloreado              
                let nuevos_reviews = {}
                Object.keys(reviews).forEach((keyx) => {
                    if(keyx==parametros.key){
                        reviews[keyx].voto = parametros.calificacion;
                    }                    
                    nuevos_reviews[keyx] = reviews[keyx];
                });
                setReviews(nuevos_reviews); 
                //fin
                
                return;
            } else {
                // Obtener el código de error de la respuesta
                const statusCode = response.status;                
                      
                let errores = {};   
                let string_errores = '';       
                if (typeof data.datos !== 'undefined') {
                    errores = data.datos;                      
                }                                    
                Object.entries(errores).forEach(([clave, mensajes]) => {                                            
                    mensajes.forEach((mensaje) => {                        
                        //setErrorCampoGlobal(clave, mensaje);                                                
                        if(string_errores!=''){
                            string_errores+=', ';
                        }
                        string_errores+=mensaje;   
                    });
                    if(string_errores!=''){
                        setPopup({mostrar:true, titulo:'Mensaje', contenido:string_errores});
                    }
                });

                // Mostrar mensaje de error según el código de error
                switch (statusCode){
                    case 400:
                        console.error('Error 400: Bad Request');                        
                    break;
                    case 401:
                        console.error('Error 401: Unauthorized');
                        console.log('Datos de error:', data);
                    break;
                    case 404:
                        console.error('Error 404: Not Found');
                        console.log('Datos de error:', data);
                    break;
                    case 500:
                        console.error('Error 500: Internal Server Error');
                        console.log('Datos de error:', data);
                    break;
                    default:
                        console.error('Error desconocido');
                        console.log('Datos de error:', data);
                  break;
                }                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };

    const getComentarios = async (event) => {                                       
        const opciones = {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        
        try {
            const response = await fetch(`${urlBaseApi}/api/cursoreview/getReviews/${id}/${paginaComentarios}/${orderByComentarios}/${filtrarByComentarios}/${nombre_seleccionado}`, opciones);
            const data = await response.json();
        
            if (response.ok){                               
                //se mezcla el nuevo json con el existente evitando que se reemplazen los indices existentes
                const mergedJson = { ...reviews };
                console.log("la data es ", data);
                Object.keys(data.reviews).forEach((key) => {
                    const newKey = parseInt(key, 10);
                    let currentIndex = newKey;
                    while (mergedJson[currentIndex] !== undefined) {
                        currentIndex++;
                    }
                    mergedJson[currentIndex] = data.reviews[newKey];
                });
                setReviews(mergedJson);  
                setCantidadComentariosMaximo(parseInt(data.tamano_total));
                return;
            } else {
                // Obtener el código de error de la respuesta
                const statusCode = response.status;                
                                       
                // Mostrar mensaje de error según el código de error
                switch (statusCode){
                    case 400:
                        console.error('Error 400: Bad Request');                        
                    break;
                    case 401:
                        console.error('Error 401: Unauthorized');
                        console.log('Datos de error:', data);
                    break;
                    case 404:
                        console.error('Error 404: Not Found');
                        console.log('Datos de error:', data);
                    break;
                    case 500:
                        console.error('Error 500: Internal Server Error');
                        console.log('Datos de error:', data);
                    break;
                    default:
                        console.error('Error desconocido');
                        console.log('Datos de error:', data);
                  break;
                }                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };


    return (
        <>{datos.length==0 ? <LoadingAnimation /> :           
            <>
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
            <section className="breadcrumb-area pt-50px pb-50px bg-white pattern-bg">
                <div className="container">
                    <div className="col-lg-8 mr-auto">
                        <div className="breadcrumb-content">
                            <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                                <li><Link to="/">Home</Link></li>
                                {Object.keys(breadCrumb).slice(0, 5).map((key) => (   
                                    <li key={`breadcrumb${key}`}><Link to={breadCrumb[key].link}>{breadCrumb[key].nombre}</Link></li>                                                             
                                ))} 
                            </ul>
                            <div className="section-heading">
                                <h2 className="section__title">{datos.nombre}</h2>
                                <p className="section__desc pt-2 lh-30">{datos.desc_general_corta}</p>
                            </div>
                            <div className="d-flex flex-wrap align-items-center pt-3">
                                {datos.bestseller==1 && <h6 className="ribbon ribbon-lg mr-2 bg-3 text-white">Bestseller</h6>}
                                {datos.promocionado==1 && <h6 className="ribbon ribbon-lg mr-2 bg-1 text-white">Promocionado</h6>}
                                {datos.gratis==1 && <h6 className="ribbon ribbon-lg mr-2 bg-5 text-white">Gratis</h6>}
                                {datos.alto_valorado==1 && <h6 className="ribbon ribbon-lg mr-2 bg-4 text-white">Mejores reseñas</h6>}
                                {datos.porcentaje_descuento!=0 && <h6 className="ribbon ribbon-lg mr-2 bg-7 text-white">Con descuento</h6>}
                                <div className="rating-wrap d-flex flex-wrap align-items-center">
                                    <div className="review-stars">
                                        <span className="rating-number">{datos.reviews_puntuacion}</span>
                                        {estrellas.map((number) => (                                                                                
                                            <span key={`estrella-curso-detalle-${number}`} className={`la la-star${datos.reviews_puntuacion < number ? "-o" : ""}`}></span>
                                        ))}                                            
                                    </div>
                                    <span className="rating-total pl-1">({datos.reviews_cantidad} reseñas)</span>
                                    <span className="student-total pl-2">{datos.estudiantes_cantidad} estudiantes</span>
                                </div>
                            </div>
                            {datos.id_instructor!=0 && <p className="pt-2 pb-1">Creado por <a href="teacher-detail.html" className="text-color hover-underline">{datos.instructor}</a></p>}
                            <div className="d-flex flex-wrap align-items-center">
                                {datos.ultima_actualizacion!='' && <p className="pr-3 d-flex align-items-center">
                                    <svg className="svg-icon-color-gray mr-1" width="16px" viewBox="0 0 24 24"><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                                    Última actualización {datos.ultima_actualizacion}
                                </p>}
                                <p className="pr-3 d-flex align-items-center">
                                    <svg className="svg-icon-color-gray mr-1" width="16px" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path></svg>
                                    Español
                                </p>
                            </div>
                            <div className="bread-btn-box pt-3">
                                {authenticated && <button className="btn theme-btn theme-btn-sm theme-btn-transparent lh-28 mr-2 mb-2" onClick={handleSetFavorito}>
                                    <i className={`la la-heart${cursoFavorito==1 ? '' : '-o'} mr-1`}></i>
                                    <span className="swapping-btn" data-text-swap="Wishlisted" data-text-original="Wishlist">Favorito</span>
                                </button>}
                                <button className="btn theme-btn theme-btn-sm theme-btn-transparent lh-28 mr-2 mb-2" data-toggle="modal" data-target="#shareModal">
                                    <i className="la la-share mr-1"></i>Compartir
                                </button>
                                {authenticated && <button className="btn theme-btn theme-btn-sm theme-btn-transparent lh-28 mb-2" data-toggle="modal" data-target="#reportModal">
                                    <i className="la la-flag mr-1"></i>Reportar
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="course-details-area pb-20px">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 pb-5">
                            <div className="course-details-content-wrap pt-90px">
                                {queAprenderas.length>0 && <div className="course-overview-card bg-gray p-4 rounded">
                                    <h3 className="fs-24 font-weight-semi-bold pb-3">Qué aprenderás?</h3>
                                    <ul className="generic-list-item overview-list-item">
                                        {Object.keys(queAprenderas).map((key) => (                                               
                                            <li key={`queAprenderas${key}`}><i className="la la-check mr-1 text-black"></i>{queAprenderas[key]}</li>
                                        ))}                                        
                                    </ul>
                                </div>} 
                                {listadoRequerimientos.length>0 && <div className="course-overview-card">
                                    <h3 className="fs-24 font-weight-semi-bold pb-3">Requirementos</h3>
                                    <ul className="generic-list-item generic-list-item-bullet fs-15">
                                        {Object.keys(listadoRequerimientos).map((key) => (                                               
                                            <li key={`requerimiento${key}`}>{listadoRequerimientos[key]}</li>
                                        ))} 
                                    </ul>
                                </div>}
                                <div className="course-overview-card border border-gray p-4 rounded">
                                    <h3 className="fs-20 font-weight-semi-bold">Las mejores empresas confían en Nombre empresa</h3>                                    
                                    <div className="pb-3">
                                        <img width="85" className="mr-3" src={`${urlBase}/images/sponsor-img.png`} alt="Logo de empresa"/>
                                        <img width="80" className="mr-3" src={`${urlBase}/images/sponsor-img2.png`} alt="Logo de empresa"/>
                                        <img width="80" className="mr-3" src={`${urlBase}/images/sponsor-img3.png`} alt="Logo de empresa"/>
                                        <img width="70" className="mr-3" src={`${urlBase}/images/sponsor-img4.png`} alt="Logo de empresa"/>
                                    </div>                                    
                                </div>

                                {descripcion.length>0 && <div className="course-overview-card">
                                    <h3 className="fs-24 font-weight-semi-bold pb-3">Descripción</h3>
                                    {Object.keys(descripcion).map((key) => (                                               
                                        <p className="fs-15 pb-2" key={`descripcion-parrafo-${key}`}>{descripcion[key]}</p>
                                    ))}                                    
                                </div>}

                                {contenido.length>0 && <div className="course-overview-card">
                                    <div className="curriculum-header d-flex align-items-center justify-content-between pb-4">
                                        <h3 className="fs-24 font-weight-semi-bold">Contenido del curso</h3>
                                        <div className="curriculum-duration fs-15">
                                            <span className="curriculum-total__text mr-2"><strong className="text-black font-weight-semi-bold">Total:</strong> {datos.cantidad_examenes} Exámenes</span>
                                            <span className="curriculum-total__hours"><strong className="text-black font-weight-semi-bold">Tiempo total de videos:</strong> {datos.cantidad_horas_de_video}</span>
                                        </div>
                                    </div>
                                    <div className="curriculum-content">
                                        <div id="accordion" className="generic-accordion">
                                            {Object.keys(contenido).map((key) => (
                                                <div className="card" key={`card-contenido${key}`}>
                                                    <div className="card-header" id={`heading${key}`}>
                                                        <button onClick={() => handleActivarPestana(key)} className={`btn btn-link d-flex align-items-center justify-content-between ${key!=pestanaActivada ? 'collapsed' : ''} `} data-toggle="collapse" data-target={`#collapse${key}`} aria-expanded={`${key==pestanaActivada ? 'true' : 'false'}`} aria-controls={`collapse${key}`}>
                                                            <i className="la la-plus"></i>
                                                            <i className="la la-minus"></i>
                                                            {contenido[key].nombre}
                                                            <span className="fs-15 text-gray font-weight-medium">6 lectures</span>
                                                        </button>
                                                    </div>
                                                    <div id={`collapse${key}`} className={`collapse ${key==pestanaActivada ? 'show' : ''}`} aria-labelledby={`heading${key}`} data-parent="#accordion">
                                                        <div className="card-body">
                                                            <ul className="generic-list-item">   
                                                                {contenido[key].curso_contenido.map((tema) => 
                                                                    (tema.tipo_contenido==1 && tema.preview!=null ? 
                                                                        (<li key={tema.id_contenido} >
                                                                            <a href="#" className="d-flex align-items-center justify-content-between text-color" data-toggle="modal" data-target="#previewModal">
                                                                                <span>
                                                                                    <i className="la la-play-circle mr-1"></i>
                                                                                    {tema.nombre}
                                                                                    <span className="ribbon ml-2 fs-13">Preview</span>
                                                                                </span>
                                                                                <span>{ new Date(tema.duracion * 1000).toISOString().substr(11, 8) }</span>
                                                                            </a>
                                                                        </li>)
                                                                        :
                                                                        (<li key={tema.id_contenido}>                                                                        
                                                                            <div className="d-flex align-items-center justify-content-between">
                                                                                <span>
                                                                                    <i className={`la ${tema.tipo_contenido==1 ? 'la-play-circle' : 'la-pencil'} mr-1`}></i>
                                                                                    {tema.nombre}
                                                                                </span>
                                                                                {tema.tipo_contenido==1 && (<span>{ new Date(tema.duracion * 1000).toISOString().substr(11, 8) }</span>)}                                                                            
                                                                            </div>                                                                        
                                                                        </li>)
                                                                    )
                                                                )}                                                                
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}                                            
                                        </div>
                                    </div>
                                </div>}
                                {otrosCursos.length>0 && <div className="course-overview-card pt-4">
                                    <h3 className="fs-24 font-weight-semi-bold pb-4">Los estudiantes también compraron</h3>
                                    <div className="view-more-carousel owl-action-styled">
                                        {Object.keys(otrosCursos).map((key) => (                                
                                            <TarjetaCursoHorizontal
                                                key={`tarjeta${otrosCursos[key].id}`}
                                                idcurso={otrosCursos[key].id}
                                                url_amigable={'a'}
                                                nombre={otrosCursos[key].nombre}
                                                imagen={otrosCursos[key].imagen_pequena}
                                                bestseller={otrosCursos[key].bestseller}
                                                promocionado={otrosCursos[key].promocionado}
                                                gratis={otrosCursos[key].gratis}
                                                alto_valorado={otrosCursos[key].alto_valorado}
                                                porcentaje_descuento={otrosCursos[key].porcentaje_descuento}
                                                nivel={otrosCursos[key].nivel}
                                                instructor={otrosCursos[key].instructor}
                                                id_instructor={otrosCursos[key].id_instructor}
                                                reviews_puntuacion={otrosCursos[key].reviews_puntuacion}
                                                reviews_cantidad={otrosCursos[key].reviews_cantidad}
                                                precio_actual={otrosCursos[key].precio_actual}
                                                precio_anterior={otrosCursos[key].precio_anterior}
                                                favorito={otrosCursos[key].favorito}
                                            />
                                        ))}
                                    </div>
                                </div>}

                                {datos.instructor!='' && <div className="course-overview-card pt-4">
                                    <h3 className="fs-24 font-weight-semi-bold pb-4">Instructor</h3>
                                    <div className="instructor-wrap">
                                        <div className="media media-card">
                                            <div className="instructor-img">
                                                <a href="teacher-detail.html" className="media-img d-block">
                                                    <img className="lazy" src={datos.instructor_imagen_pequena=='' ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${datos.instructor_imagen_pequena}`} data-src={`${urlBase}/images/avatar_docente.jpg`} alt="Avatar image" />
                                                </a>
                                                <ul className="generic-list-item pt-3">
                                                    <li><i className="la la-star mr-2 text-color-3"></i> {datos.instructor_rating} Calificación del instructor</li>
                                                    <li><i className="la la-user mr-2 text-color-3"></i> {datos.docente_estudiantes_cantidad} Estudiantes</li>
                                                    <li><i className="la la-comment-o mr-2 text-color-3"></i> {datos.docente_reviews} Reseñas</li>
                                                    <li><i className="la la-play-circle-o mr-2 text-color-3"></i> {datos.docente_cursos_cantidad} Cursos</li>
                                                    <li><a href="teacher-detail.html">Ver todos los cursos</a></li>
                                                </ul>
                                            </div>
                                            <div className="media-body">
                                                <h5><a href="teacher-detail.html">{datos.instructor}</a></h5>
                                                <span className="d-block lh-18 pt-2 pb-3">Se unió {datos.instructor_created_at}</span>
                                                {Object.keys(docenteCursos).map((key) => (
                                                    <p key={`curso_docente${docenteCursos[key].id}`} className="text-black lh-18 pb-3">{docenteCursos[key].nombre} - {docenteCursos[key].estudiantes_cantidad}+ estudiantes</p>
                                                ))}
                                                
                                                {Object.keys(docenteDescripcion).slice(0, 1).map((key) => (
                                                    <p key={`desc_docente_${key}`} className="pb-3">{docenteDescripcion[key]}</p>
                                                ))}                                                    
                                                {Object.keys(docenteDescripcion).length>1 && <div className={mostrarMasDocente==0 ? "collapse" : ""}   id="collapseMoreTwo">
                                                    {Object.keys(docenteDescripcion).slice(1, docenteDescripcion.length).map((key) => (
                                                        <p key={`desc_docente_${key}`} className="pb-3">{docenteDescripcion[key]}</p>
                                                    ))}
                                                </div>}
                                                {Object.keys(docenteDescripcion).length>1 && <a className="collapse-btn collapse--btn fs-15" data-toggle="collapse" href="#collapseMoreTwo" role="button" aria-expanded={mostrarMasDocente==0 ? "false" : "true"} aria-controls="collapseMoreTwo">
                                                    <span className="collapse-btn-hide" onClick={handleMostrarMasDocente}>Mostrar más<i className="la la-angle-down ml-1 fs-14"></i></span>
                                                    <span className="collapse-btn-show" onClick={handleMostrarMasDocente}>Mostrar menos<i className="la la-angle-up ml-1 fs-14"></i></span>
                                                </a>}
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                                
                                <div className="course-overview-card pt-4">
                                    <h3 className="fs-24 font-weight-semi-bold pb-40px">Reseñas de estudiantes</h3>
                                    <div className="feedback-wrap">
                                        <div className="media media-card align-items-center">
                                            <div className="review-rating-summary">
                                                    <span className="stats-average__count">{datos.reviews_puntuacion}</span>
                                                <div className="rating-wrap pt-1">
                                                    <div className="review-stars">                                                       
                                                        {estrellas.map((number) => (                                                                                
                                                            <span key={`estrella-curso-detalle-2-${number}`} className={`la la-star${datos.reviews_puntuacion < number ? "-o" : ""}`}></span>
                                                        ))} 
                                                    </div>
                                                    <span className="rating-total d-block">({datos.reviews_cantidad})</span>
                                                    <span>Puntuación del curso</span>
                                                </div>
                                            </div>
                                            <div className="media-body">
                                                <div className="review-bars d-flex align-items-center mb-2">
                                                    <div className="review-bars__text">5&nbsp;estrellas</div>
                                                    <div className="review-bars__fill">
                                                        <div className="skillbar-box">
                                                            <div className="skillbar" data-percent={`${datos.reviews_porcentajes[5]}%`}>
                                                                <div className="skillbar-bar bg-3" style={{ width:`${datos.reviews_porcentajes[5]}%`}}></div>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                    <div className="review-bars__percent">{datos.reviews_porcentajes[5]}%</div>
                                                </div>
                                                <div className="review-bars d-flex align-items-center mb-2">
                                                    <div className="review-bars__text">4&nbsp;estrellas</div>
                                                    <div className="review-bars__fill">
                                                        <div className="skillbar-box">
                                                            <div className="skillbar" data-percent={`${datos.reviews_porcentajes[4]}%`} >
                                                                <div className="skillbar-bar bg-3" style={{ width:`${datos.reviews_porcentajes[4]}%`}}></div>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                    <div className="review-bars__percent">{datos.reviews_porcentajes[4]}%</div>
                                                </div>
                                                <div className="review-bars d-flex align-items-center mb-2">
                                                    <div className="review-bars__text">3&nbsp;estrellas</div>
                                                    <div className="review-bars__fill">
                                                        <div className="skillbar-box">
                                                            <div className="skillbar" data-percent={`${datos.reviews_porcentajes[3]}%`}>
                                                                <div className="skillbar-bar bg-3" style={{ width:`${datos.reviews_porcentajes[3]}%`}}></div>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                    <div className="review-bars__percent">{datos.reviews_porcentajes[3]}%</div>
                                                </div>
                                                <div className="review-bars d-flex align-items-center mb-2">
                                                    <div className="review-bars__text">2&nbsp;estrellas</div>
                                                    <div className="review-bars__fill">
                                                        <div className="skillbar-box">
                                                            <div className="skillbar" data-percent={`${datos.reviews_porcentajes[2]}%`}>
                                                                <div className="skillbar-bar bg-3" style={{ width:`${datos.reviews_porcentajes[2]}%`}}></div>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                    <div className="review-bars__percent">{datos.reviews_porcentajes[2]}%</div>
                                                </div>
                                                <div className="review-bars d-flex align-items-center mb-2">
                                                    <div className="review-bars__text">1&nbsp;estrella&nbsp;&nbsp;&nbsp;</div>
                                                    <div className="review-bars__fill">
                                                        <div className="skillbar-box">
                                                            <div className="skillbar" data-percent={`${datos.reviews_porcentajes[1]}%`} >
                                                                <div className="skillbar-bar bg-3" style={{ width:`${datos.reviews_porcentajes[1]}%`}}></div>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                    <div className="review-bars__percent">{datos.reviews_porcentajes[1]}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="course-overview-card pt-4">
                                    <h3 className="fs-24 font-weight-semi-bold pb-4">Comentarios</h3>
                                    <div className="review-wrap">
                                        <div className="d-flex flex-wrap align-items-center pb-4">
                                            <form method="post" className="mr-3 flex-grow-1">
                                                <div className="form-group">
                                                    <input className="form-control form--control pl-3" type="text" name="search_reviews" placeholder="Buscar comentarios" maxLength="32" onKeyUp={handleBusquedaPorNombreComentarios} />
                                                    <span className="la la-search search-icon"></span>
                                                </div>
                                            </form>
                                            <div className="select-container select--container mb-3">
                                                <select className="form-control select-dark" onChange={handleFiltrarByComentarios}>
                                                    <option value="estrella:0">Todos (Recientes)</option>
                                                    <option value="posision_ranking-desc">Todos (Más Útiles)</option>
                                                    <option value="calificacion-desc">Todos (Mejor valorados)</option>                                                    
                                                    <option value="estrella:5">Cinco estrellas</option>
                                                    <option value="estrella:4">Cuatro estrellas</option>
                                                    <option value="estrella:3">Tres estrellas</option>
                                                    <option value="estrella:2">Dos estrellas</option>
                                                    <option value="estrella:1">Una estrella</option>
                                                </select>
                                            </div>
                                        </div>
                                        {Object.keys(reviews).map((key) => (
                                            <div key={`id_review_${reviews[key].id}`} className="media media-card border-bottom border-bottom-gray pb-4 mb-4">
                                                <div className="media-img mr-4 rounded-full">
                                                    <img className="rounded-full lazy" src={reviews[key].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${reviews[key].imagen_pequena}`} data-src={`${urlBase}/images/avatar_docente.jpg`} alt="User image" />
                                                </div>
                                                <div className="media-body">
                                                    <div className="d-flex flex-wrap align-items-center justify-content-between pb-1">
                                                        <h5>{reviews[key].nombre_completo}</h5>
                                                        <div className="review-stars">
                                                            {estrellas.map((number) => (                                                                                
                                                                <span key={`estrella-curso-detalle-2-${number}`} className={`la la-star${reviews[key].calificacion < number ? "-o" : ""}`}></span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="d-block lh-18 pb-2">{reviews[key].fecha_creacion}</span>
                                                    <p className="pb-2">{reviews[key].comentario}</p>
                                                    <div className="helpful-action">
                                                        <span className="d-block fs-13">Te resultó últil el comentario?</span>
                                                        <button className={`btn ${reviews[key].voto=='1' && 'btn-info'}`} onClick={() => handlerVotarComentario({'key':key, 'id_curso':id, 'id_usuario_review':reviews[key].id, 'calificacion':1})}>Si</button>
                                                        <button className={`btn ${reviews[key].voto=='-1' && 'btn-info'}`} onClick={() => handlerVotarComentario({'key':key, 'id_curso':id, 'id_usuario_review':reviews[key].id, 'calificacion':-1})}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}                                        
                                    </div>
                                    {Object.keys(reviews).length<cantidadComentariosMaximo && <div className="see-more-review-btn text-center">
                                        <button type="button" className="btn theme-btn theme-btn-transparent" onClick={handleCargarMasComentarios}>Cargar más comentarios</button>
                                    </div>}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            </>     
        }</>

    );
}

export default FormularioDetallesDeCurso;