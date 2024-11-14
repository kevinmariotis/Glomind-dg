import React, {useContext, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import TarjetaCurso from './cards/TarjetaCurso';
import Paginador from './Paginador';
import BotonDashboardNavegacionMovil from './BotonDashboardNavegacionMovil';
import DashboardFooter from './DashboardFooter';

function FormularioFavoritos() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, nombres, setImagenPequena, esMovil} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});        
    const [paginaNavegacion, setPaginaNavegacion] = useState(1);
    
    const [datosUsuario, setDatosUsuario] = useState({docente_rating:99.9, docente_reviews:0});     //datos estaticos que no se editarán
    const [favoritos, setFavoritos] = useState({});            
    const [totalFavoritos, setTotalFavoritos] = useState(1);
        
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        //window.scrollTo(0, 0);
        obtenerDatosDelServidor();        
    }, []);
       
    useEffect(() => {      
        window.scrollTo(0, 0);   
        obtenerFavoritos();
    }, [paginaNavegacion]);
    
    //Estados de los errores de campos
    const camposErrores = {        
        'nombres':[],        
    }    
    const [erroresCampos, setErrorCampo] = useState(camposErrores);
    const setErrorCampoGlobal = (index, newValue) => {
        if (index in erroresCampos) {
            setErrorCampo((prevState) => ({
                ...prevState,
                [index]: [...(prevState[index] || []), newValue],
            }));
        }
    };
    const reiniciarErrorCampoGlobal = () => {
        for (let propiedad in erroresCampos) {
            if (Array.isArray(erroresCampos[propiedad])) {
                erroresCampos[propiedad] = [];
            }
        }
    };
           
    const handleDetallesIdChange = (id_factura) => { console.log("esableciendo ", id_factura); setVerDetallesId(id_factura);    };
        
    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
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

    const obtenerFavoritos = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try { 
            //buscamos los datos de los cursos a mostrar                       
            const opciones = {
                method: 'GET',
                headers: headers,
            };                                    
            const response = await fetch(`${urlBaseApi}/api/usuario/getFavoritos/0/${paginaNavegacion}/1/nombre-asc/9`, opciones);  //favoritos no comprados           
            if (response.ok){   
                const datos = await response.json();
                setFavoritos(datos.cursos);
                setTotalFavoritos(datos.total_cursos);
            } else {     
                const datos = await response2.json();            
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
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
            {esMovil && <BotonDashboardNavegacionMovil />}
            <div className="container-fluid">
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                    <div className="media media-card align-items-center">
                        <div className="media-img media--img media-img-md rounded-full">
                        <img className="rounded-full" src={datosUsuario.imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${datosUsuario.imagen_pequena}`} alt="Foto del usuario" />
                        </div>
                        <div className="media-body">
                            <h2 className="section__title fs-30">{nombres}</h2>
                            <div className="rating-wrap d-flex align-items-center pt-2">
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
                </div>
                <div className="section-block mb-5"></div>
                    <div className="dashboard-heading mb-5">
                        <h3 className="fs-22 font-weight-semi-bold">Mis cursos favoritos</h3>
                    </div>
                    <div className="row">
                        {Object.keys(favoritos).map((key) => (
                            <TarjetaCurso
                                key={`lista-favorito-${favoritos[key].id_curso}`}
                                idcurso={favoritos[key].id_curso}
                                url_amigable={favoritos[key].url_amigable}
                                nombre={favoritos[key].nombre}
                                imagen={favoritos[key].imagen_pequena}
                                bestseller={favoritos[key].bestseller}
                                promocionado={favoritos[key].promocionado}
                                gratis={favoritos[key].gratis}
                                alto_valorado={favoritos[key].alto_valorado}
                                porcentaje_descuento={favoritos[key].porcentaje_descuento}
                                nivel={favoritos[key].nivel}
                                instructor={favoritos[key].instructor}
                                id_instructor={favoritos[key].id_instructor}
                                reviews_puntuacion={favoritos[key].reviews_puntuacion}
                                reviews_cantidad={favoritos[key].reviews_cantidad}
                                precio_actual={favoritos[key].precio_actual}
                                precio_anterior={favoritos[key].precio_anterior}
                                favorito={1}
                                col_lg={4}
                            />                            
                        ))}
                    </div>
                    <Paginador elemetosTotales={totalFavoritos} elementosPorPagina={9} paginaActual={paginaNavegacion} callbackCambioPagina={setPaginaNavegacion} />
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioFavoritos;