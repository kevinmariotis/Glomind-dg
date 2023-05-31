import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import TarjetaCurso from './TarjetaCurso';

function FormularioCategoriaNavegacion() {
    const urlBase = import.meta.env.VITE_URL_BASE;    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const { id } = useParams();
    
    const [pagina, setPagina] = useState(1);
    const [orderBy, setOrderBy] = useState('precio_actual-asc');
        
    const [cursos, setCursos] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [cantidad_total_cursos, setCantidadTotalCursos] = useState(0);
    const [estrellas, setEstrellas] = useState([]);
    const [duracion_video, setDuracionVideo] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [costos, setCostos] = useState([]);
    const [instructores, setInstructores] = useState([]);    

    const [nombre_seleccionado, setNombreSeleccionado] = useState('');    
    const [estrella_seleccionada, setEstrellaSeleccionada] = useState([]);    
    const [video_selecionado, setVideoSelecionado] = useState('');    
    const [nivel_selecionado, setNivelSelecionado] = useState([]);    
    const [costo_selecionado, setCostoSelecionado] = useState([]);    
    const [instructor_selecionado, setInstructorSelecionado] = useState([]);    
    
    const handleEstrellaSeleccionada = (event) => {                
        const dataId = event.target.getAttribute('data-id');
        const { checked } = event.target;
        if(checked){            
            if(!estrella_seleccionada.includes(dataId)) {                
                setEstrellaSeleccionada([...estrella_seleccionada, dataId]);                
            }    
        }else{
            if(estrella_seleccionada.includes(dataId)) {
                const nuevoArray = estrella_seleccionada.filter((item) => item !== dataId);
                setEstrellaSeleccionada(nuevoArray);                
            }
        }
    };
    const handleBusquedaPorNombre = (event) => {                        
        setNombreSeleccionado(event.target.value);
        console.log("buscando por ", event.target.value);
    };
    const handleVideoSeleccionado = (event) => {                        
        setVideoSelecionado(event.target.value);
    };
    const handleNivelSeleccionado = (event) => {                
        const dataId = event.target.getAttribute('data-id');
        const { checked } = event.target;
        if(checked){            
            if(!nivel_selecionado.includes(dataId)) {                
                setNivelSelecionado([...nivel_selecionado, dataId]);
                //console.log("activando ", dataId);
            }    
        }else{
            if(nivel_selecionado.includes(dataId)) {
                const nuevoArray = nivel_selecionado.filter((item) => item !== dataId);
                setNivelSelecionado(nuevoArray);
                //console.log("desactivando ", dataId);
            }
        }
    };
    const handleCostoSeleccionado = (event) => {                
        const dataId = event.target.getAttribute('data-id');
        const { checked } = event.target;
        if(checked){            
            if(!costo_selecionado.includes(dataId)) {                
                setCostoSelecionado([...costo_selecionado, dataId]);
                console.log("activando ", dataId);
            }    
        }else{
            if(costo_selecionado.includes(dataId)) {
                const nuevoArray = costo_selecionado.filter((item) => item !== dataId);
                setCostoSelecionado(nuevoArray);
                console.log("desactivando ", dataId);
            }
        }
    };
    const handleInstructorSeleccionado = (event) => {                
        const dataId = event.target.getAttribute('data-id');
        const { checked } = event.target;
        if(checked){            
            if(!instructor_selecionado.includes(dataId)) {                
                setInstructorSelecionado([...instructor_selecionado, dataId]);
                console.log("activando instructor ", dataId);
            }    
        }else{
            if(instructor_selecionado.includes(dataId)) {
                const nuevoArray = instructor_selecionado.filter((item) => item !== dataId);
                setInstructorSelecionado(nuevoArray);
                console.log("desactivando instructor ", dataId);
            }
        }
    };

    useEffect(() => {
        obtenerDatosDelServidor();                    
    }, [id, pagina, orderBy, estrella_seleccionada, video_selecionado, nivel_selecionado, costo_selecionado, instructor_selecionado]);

    const obtenerDatosDelServidor = async () => {        
        try {            
            const opciones = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',             
                },
            };
                
            //estrella:0,4-nivel:1,2,3-costo:0,1-instructor:3-video:0,157            
            let add = '';            
            estrella_seleccionada.forEach((elemento) => {  if(add.includes('estrella:')) { add+=','+elemento; }else{ add+='estrella:'+elemento; }  });            
            if(video_selecionado!=''){ if(add==''){ add+='video:'+video_selecionado; }else{ add+='-video:'+video_selecionado; } }
            nivel_selecionado.forEach((elemento) => {  if(add.includes('nivel:')) { add+=','+elemento; }else{ if(add==''){ add+='nivel:'+elemento; }else{ add+='-nivel:'+elemento; } }  });
            costo_selecionado.forEach((elemento) => {  if(add.includes('costo:')) { add+=','+elemento; }else{ if(add==''){ add+='costo:'+elemento; }else{ add+='-costo:'+elemento; } }  });
            instructor_selecionado.forEach((elemento) => {  if(add.includes('instructor:')) { add+=','+elemento; }else{ if(add==''){ add+='instructor:'+elemento; }else{ add+='-instructor:'+elemento; } }  });

            let obtener_detalles = '1';
            if(add!=''){
                obtener_detalles = '0';
            }

            const response = await fetch(`${urlBaseApi}/api/categoriasistema/getCursos/${id}/1/${pagina}/${orderBy}/${obtener_detalles}/${add}`, opciones);

            if (response.ok) {                
                //console.log('Categorías recuperadas del servidor:');
                const datos = await response.json();                    
                //sessionStorage.setItem('categoriasistema', JSON.stringify({"datos":categoriasistema, "fechahora":Math.floor(new Date().getTime() / 1000)}));
                setCursos(datos.cursos);
                setCantidadTotalCursos(datos.cantidad_total_cursos);                
                if(obtener_detalles=='1'){
                    setSubcategorias(datos.subcategorias);                                    
                    setEstrellas(datos.estrellas);
                    setDuracionVideo(datos.duracion_video);
                    setNiveles(datos.niveles);
                    setCostos(datos.costos);
                    setInstructores(datos.instructores);
                }
                console.log("cantidad total cursos ",datos.cantidad_total_cursos);
            } else {                
                console.error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    return (
        <section className="course-area section--padding">
            <div className="container">
                <div className="filter-bar mb-4">
                    <div className="filter-bar-inner d-flex flex-wrap align-items-center justify-content-between">
                        <p className="fs-14">Hemos encontrado <span className="text-black">{cantidad_total_cursos}</span> cursos disponibles para usted</p>
                        <div className="d-flex flex-wrap align-items-center">
                            <ul className="filter-nav mr-3">
                                <li><a href="course-grid.html" data-toggle="tooltip" data-placement="top" title="Grid View" className="active"><span className="la la-th-large"></span></a></li>
                                <li><a href="course-list.html" data-toggle="tooltip" data-placement="top" title="List View"><span className="la la-list"></span></a></li>
                            </ul>
                            <div className="select-container select--container">
                                <select className="select-container-select">
                                    <option value="all-category">Todos los filtros</option>
                                    <option value="newest">Cursos nuevos</option>
                                    <option value="oldest">Cursos no tan nuevos</option>
                                    <option value="high-rated">Mejores reseñas</option>
                                    <option value="popular-courses">Populares</option>
                                    <option value="high-to-low">Mayor a menor precio</option>
                                    <option value="low-to-high">Menor a mayor precio</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="sidebar mb-5">
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-18 pb-2">Sub Categorías</h3>
                                    <div className="divider"><span></span></div>
                                    {Object.keys(subcategorias).map((key) => (
                                        <div key={'cate${subcategorias[key].id}'} className="custom-control custom-checkbox mb-1 fs-15">                                                                                    
                                            <Link to={`${urlBase}/categoria/${subcategorias[key].id}/${subcategorias[key].url_amigable}`}>{subcategorias[key].nombre}<span className="ml-1 text-gray">({subcategorias[key].cantidad_cursos})</span></Link>
                                        </div>
                                    ))}                                                                                                                     
                                </div>
                            </div>        
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-18 pb-2">Campos de filtrado</h3>
                                    <div className="divider"><span></span></div>
                                    <form method="post">
                                        <div className="form-group mb-0">
                                            <input className="form-control form--control pl-3" type="text" name="search_by_name" maxLength="32" placeholder="Buscar cursos" onKeyUp={handleBusquedaPorNombre} />
                                            <span className="la la-search search-icon"></span>
                                        </div>
                                    </form>
                                </div>
                            </div>                                                               
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-18 pb-2">Valoraciones</h3>
                                    <div className="divider"><span></span></div>
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="valoracionCheckbox5" data-id="5" onChange={handleEstrellaSeleccionada} />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="valoracionCheckbox5">
                                            <span className="review-stars">
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                            </span>&nbsp;
                                            5.0&nbsp;<span className="ml-1 text-gray">({estrellas['5']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="valoracionCheckbox4" data-id="4" onChange={handleEstrellaSeleccionada}  />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="valoracionCheckbox4">
                                            <span className="review-stars">
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                                <span className="la la-star-o"></span>
                                            </span>&nbsp;
                                            4.0&nbsp;<span className="ml-1 text-gray">({estrellas['4']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="valoracionCheckbox3" data-id="3" onChange={handleEstrellaSeleccionada} />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="valoracionCheckbox3">
                                            <span className="review-stars">
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                                <span className="la la-star-o"></span>
                                                <span className="la la-star-o"></span>
                                            </span>&nbsp;
                                            3.0&nbsp;<span className="ml-1 text-gray">({estrellas['3']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="valoracionCheckbox2" data-id="2" onChange={handleEstrellaSeleccionada}  />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="valoracionCheckbox2">
                                            <span className="review-stars">
                                                <span className="la la-star"></span>
                                                <span className="la la-star"></span>
                                                <span className="la la-star-o"></span>
                                                <span className="la la-star-o"></span>
                                                <span className="la la-star-o"></span>
                                            </span>&nbsp;
                                            2.0&nbsp;<span className="ml-1 text-gray">({estrellas['2']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="valoracionCheckbox1" data-id="1" onChange={handleEstrellaSeleccionada}  />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="valoracionCheckbox1">
                                            <span className="review-stars">
                                                <span className="la la-star"></span>
                                                <span className="la la-star-o"></span>
                                                <span className="la la-star-o"></span>
                                                <span className="la la-star-o"></span>
                                                <span className="la la-star-o"></span>
                                            </span>&nbsp;
                                            1.0&nbsp;<span className="ml-1 text-gray">({estrellas['1']})</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-18 pb-2">Duración de video</h3>
                                    <div className="divider"><span></span></div>
                                    <div className="custom-control custom-radio mb-1 fs-15">
                                        <input type="radio" className="custom-control-input" id="duracionVideo0" name="radio-video" value="" onChange={handleVideoSeleccionado} />
                                        <label className="custom-control-label custom--control-label" htmlFor="duracionVideo0">
                                            Todos<span className="ml-1 text-gray">({duracion_video['999-999']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-radio mb-1 fs-15">
                                        <input type="radio" className="custom-control-input" id="duracionVideo2" name="radio-video" value="0,7200" onChange={handleVideoSeleccionado} />
                                        <label className="custom-control-label custom--control-label" htmlFor="duracionVideo2">
                                            0-2 Horas<span className="ml-1 text-gray">({duracion_video['0-2']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-radio mb-1 fs-15">
                                        <input type="radio" className="custom-control-input" id="duracionVideo6" name="radio-video" value="7201,21600" onChange={handleVideoSeleccionado} />
                                        <label className="custom-control-label custom--control-label" htmlFor="duracionVideo6">
                                            3-6 Horas<span className="ml-1 text-gray">({duracion_video['3-6']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-radio mb-1 fs-15">
                                        <input type="radio" className="custom-control-input" id="duracionVideo14" name="radio-video" value="21601,50400" onChange={handleVideoSeleccionado} />
                                        <label className="custom-control-label custom--control-label" htmlFor="duracionVideo14">
                                            7-14 Horas<span className="ml-1 text-gray">({duracion_video['7-14']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-radio mb-1 fs-15">
                                        <input type="radio" className="custom-control-input" id="duracionVideo300" name="radio-video" value="50401,360000" onChange={handleVideoSeleccionado} />
                                        <label className="custom-control-label custom--control-label" htmlFor="duracionVideo300">
                                        <span className="rating-wrap d-flex align-items-center">
                                            15+ Horas<span className="ml-1 text-gray">({duracion_video['15-100']})</span>
                                        </span>
                                        </label>
                                    </div>                                    
                                </div>
                            </div>             
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-18 pb-2">Nivel</h3>
                                    <div className="divider"><span></span></div>                                    
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="levelCheckbox2" data-id="1" onChange={handleNivelSeleccionado} />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="levelCheckbox2">
                                            Básico<span className="ml-1 text-gray">({niveles['1']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="levelCheckbox3" data-id="2" onChange={handleNivelSeleccionado} />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="levelCheckbox3">
                                            Intermedio<span className="ml-1 text-gray">({niveles['2']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="levelCheckbox4" data-id="3" onChange={handleNivelSeleccionado} />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="levelCheckbox4">
                                            Avanzado<span className="ml-1 text-gray">({niveles['3']})</span>
                                        </label>
                                    </div>
                                </div>
                            </div>                            
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-18 pb-2">Por Costo</h3>
                                    <div className="divider"><span></span></div>
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="priceCheckbox" data-id="0" onChange={handleCostoSeleccionado} />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="priceCheckbox">
                                            Pagos<span className="ml-1 text-gray">({costos['pagos']})</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-1 fs-15">
                                        <input type="checkbox" className="custom-control-input" id="priceCheckbox2" data-id="1" onChange={handleCostoSeleccionado} />
                                        <label className="custom-control-label custom--control-label text-black" htmlFor="priceCheckbox2">
                                            Gratis<span className="ml-1 text-gray">({costos['gratis']})</span>
                                        </label>
                                    </div>                                    
                                </div>
                            </div>
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-18 pb-2">Instructores</h3>
                                    <div className="divider"><span></span></div>                                                                        
                                    {Object.keys(instructores).slice(0, 5).map((key) => (                                        
                                        <div key={`instructor${key}`} className="custom-control custom-checkbox mb-1 fs-15">
                                            <input type="checkbox" className="custom-control-input" id={`instructorCheckbox${key}`} data-id={key} onChange={handleInstructorSeleccionado}  />
                                            <label className="custom-control-label custom--control-label text-black" htmlFor={`instructorCheckbox${key}`}>
                                                {instructores[key].nombre}
                                            </label>
                                        </div>
                                    ))}                                    
                                    <div className="collapse" id="collapseMoreThree">
                                        {Object.keys(instructores).slice(6, instructores.length).map((key) => (  
                                            <div key={`instructor${key}`} className="custom-control custom-checkbox mb-1 fs-15">
                                                <input type="checkbox" className="custom-control-input" id={`instructorCheckbox${key}`} data-id={key} onChange={handleInstructorSeleccionado} />
                                                <label className="custom-control-label custom--control-label text-black" htmlFor={`instructorCheckbox${key}`} >
                                                    {instructores[key].nombre}
                                                </label>
                                            </div>
                                        ))}                                                 
                                    </div>
                                    <a className="collapse-btn collapse--btn fs-15" data-toggle="collapse" href="#collapseMoreThree" role="button" aria-expanded="false" aria-controls="collapseMoreThree">
                                        <span className="collapse-btn-hide">Show more<i className="la la-angle-down ml-1 fs-14"></i></span>
                                        <span className="collapse-btn-show">Show less<i className="la la-angle-up ml-1 fs-14"></i></span>
                                    </a>
                                </div>
                            </div>                            
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="row">
                            {Object.keys(cursos).map((key) => (                                
                                <TarjetaCurso
                                    key={`tarjeta${cursos[key].id}`}
                                    idcurso={cursos[key].id}
                                    url_amigable={'a'}
                                    nombre={cursos[key].nombre}
                                    imagen={cursos[key].imagen_pequena}
                                    bestseller={cursos[key].bestseller}
                                    promocionado={cursos[key].promocionado}
                                    gratis={cursos[key].gratis}
                                    alto_valorado={cursos[key].alto_valorado}
                                    porcentaje_descuento={cursos[key].porcentaje_descuento}
                                    nivel={cursos[key].nivel}
                                    instructor={cursos[key].instructor}
                                    reviews_puntuacion={cursos[key].reviews_puntuacion}
                                    reviews_cantidad={cursos[key].reviews_cantidad}
                                    precio_actual={cursos[key].precio_actual}
                                    precio_anterior={cursos[key].precio_anterior}
                                />
                            ))}              
                        </div>                                    
                        <div className="text-center pt-3">
                            <nav aria-label="Page navigation example" className="pagination-box">
                                <ul className="pagination justify-content-center">
                                    <li className="page-item">
                                        <a className="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true"><i className="la la-arrow-left"></i></span>
                                            <span className="sr-only">Previous</span>
                                        </a>
                                    </li>
                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item">
                                        <a className="page-link" href="#" aria-label="Next">
                                            <span aria-hidden="true"><i className="la la-arrow-right"></i></span>
                                            <span className="sr-only">Next</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            <p className="fs-14 pt-2">Showing 1-10 of 56 results</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>);
}

export default FormularioCategoriaNavegacion;