import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import TarjetaCurso from './TarjetaCurso';
import Paginador from './Paginador';
import Popup from './Popup';
import { mensajesDeError } from './utils';

function FormularioTagNavegacion({actualizarBreadCrumb, actualizarBreadCrumbData, actualizarBreadCrumbImagen}) {
    const urlBase = import.meta.env.VITE_URL_BASE;    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const navigate = useNavigate();
    const {jwt, authenticated, temaActual} = useContext(AuthContext);  
    const { url_amigable } = useParams();    
    
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});
    const [pagina, setPagina] = useState(1);
    const [orderBy, setOrderBy] = useState('estudiantes_cantidad-asc');    
        
    const [cursos, setCursos] = useState([]);    
    const [cantidad_total_cursos, setCantidadTotalCursos] = useState(0);            
        
    const [nombre_seleccionado, setNombreSeleccionado] = useState('');            
          
    //interval para manejar la busqueda por nombre en lapsos de tiempo
    const intervalRef = useRef(null);
    const latest_ultimo_nombre_escrito = useRef('');
    const latest_nombre_seleccionado = useRef(nombre_seleccionado);
           
    const chekearCambiosBusquedaNombre = useCallback(() => {
        if(latest_ultimo_nombre_escrito.current!=latest_nombre_seleccionado.current){                    
            setNombreSeleccionado(latest_ultimo_nombre_escrito.current);                          
            latest_nombre_seleccionado.current = latest_ultimo_nombre_escrito.current;            
        }
    }, []);

    useEffect(() => {        
        if (!intervalRef.current){
            intervalRef.current = setInterval(() => {
                chekearCambiosBusquedaNombre();                
            }, 1500);
        }else{
            return () => { clearInterval(intervalRef.current); }
        }
    }, []);

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    
    const handleBusquedaPorNombre = (event) => {           
        latest_ultimo_nombre_escrito.current = event.target.value;        
    };
    const handleOrdenarPor = (event) => {           
        setOrderBy(event.target.value);
    };
        
    useEffect(() => {                      
        obtenerDatosDelServidor();                          
    }, [url_amigable, pagina, orderBy, nombre_seleccionado]);

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
                            
            const response = await fetch(`${urlBaseApi}/api/cursotag/getCursosUrlAmigable/${url_amigable}/${pagina}/${orderBy}`, opciones);

            if (response.ok) {                
                //console.log('Categorías recuperadas del servidor:');
                const datos = await response.json();                    
                //sessionStorage.setItem('categoriasistema', JSON.stringify({"datos":categoriasistema, "fechahora":Math.floor(new Date().getTime() / 1000)}));                
                setCursos(datos.cursos);
                setCantidadTotalCursos(datos.cantidad_total_cursos);                                                
                actualizarBreadCrumbImagen(datos.imagen_grande!=null ? datos.imagen_grande : 'images/breadcrumb-bg.jpg');
                //se actualiza el breadCrrumb                
                actualizarBreadCrumb(datos.nombre);
                actualizarBreadCrumbData([]);
                //actualizarBreadCrumbImagen(datosArbol[datosArbol.length-1].imagen_grande!=null ? datosArbol[datosArbol.length-1].imagen_grande : 'images/breadcrumb-bg.jpg');                
                //fin de actualizar el breadCrumb                                
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

    return (
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
        <section className="course-area section--padding">
            <div className="container">
                <div className="filter-bar mb-4">
                    <div className="filter-bar-inner d-flex flex-wrap align-items-center justify-content-between">
                        <p className="fs-14">Hemos encontrado <span className="text-black">{cantidad_total_cursos}</span> cursos disponibles para usted</p>
                        <div className="d-flex flex-wrap align-items-center">
                            
                            <div className="select-container select--container">    
                                <select onChange={handleOrdenarPor} className={`form-control ${temaActual==1 ? '' : 'select-dark'}`} >                                                        
                                    <option value="precio_actual-asc">Ordenar por</option>
                                    <option value="precio_actual-asc">Menor a mayor precio</option>
                                    <option value="precio_actual-desc">Mayor a menor precio</option>                                    
                                    <option value="ultima_actualizacion-desc">Más nuevos a antiguos</option>                                    
                                    <option value="ultima_actualizacion-asc">Antiguos a más nuevos</option>                                    
                                    <option value="porcentaje_descuento-desc">Mayor a menor descuento</option>
                                    <option value="estudiantes_cantidad-desc">Cantidad Matriculados</option>
                                </select>                                          
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">                    
                    <div className="col-lg-12">
                        <div className="row">
                            {Object.keys(cursos).map((key) => (                                
                                <TarjetaCurso
                                    key={`tarjeta${cursos[key].id}`}
                                    idcurso={cursos[key].id}
                                    url_amigable={cursos[key].url_amigable}
                                    nombre={cursos[key].nombre}
                                    imagen={cursos[key].imagen_pequena}
                                    bestseller={cursos[key].bestseller}
                                    promocionado={cursos[key].promocionado}
                                    gratis={cursos[key].gratis}
                                    alto_valorado={cursos[key].alto_valorado}
                                    porcentaje_descuento={cursos[key].porcentaje_descuento}
                                    nivel={cursos[key].nivel}
                                    instructor={cursos[key].instructor}
                                    id_instructor={cursos[key].id_instructor}
                                    reviews_puntuacion={cursos[key].reviews_puntuacion}
                                    reviews_cantidad={cursos[key].reviews_cantidad}
                                    precio_actual={cursos[key].precio_actual}
                                    precio_anterior={cursos[key].precio_anterior}
                                    favorito={cursos[key].favorito}
                                    col_lg={4}
                                />
                            ))}              
                        </div>                                    
                        <Paginador elemetosTotales={cantidad_total_cursos} elementosPorPagina={15} paginaActual={pagina} callbackCambioPagina={setPagina} />
                    </div>
                </div>
            </div>
        </section>
        </>);
}

export default FormularioTagNavegacion;