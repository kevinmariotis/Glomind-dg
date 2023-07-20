import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioEditarContenidoCurso() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const { id } = useParams();
    const {jwt, nombres, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});    
    const [popUpConfirmarBorrarSeccion, setPopupConfirmarBorrarSeccion] = useState({mostrar:false, titulo:'', contenido:'', id_categoria:''});    
    const [popUpConfirmarBorrarContenido, setPopupConfirmarBorrarContenido] = useState({mostrar:false, titulo:'', contenido:'', id_contenido:''});    
    const [contenido, setContenido] = useState({});        
    const [mostrarPopUpCrearSeccion, setMostrarPopUpCrearSeccion] = useState(false);                    
    const [mostrarPopUpEditarSeccion, setMostrarPopUpEditarSeccion] = useState(false);                    
    const [mostrarPopUpAgregarContenido, setMostrarPopUpAgregarContenido] = useState(false);
    const [nombreSeccion, setNombreSeccion] = useState('');
    const [idSeccionEditando, setIdSeccionEditando] = useState(-1);
            
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        obtenerDatosServidor();        
    }, []);
          
    const handleNombreChange = (event) => { setNombre(event.target.value);    };      
    
    //Estados de los errores de campos
    const camposErrores = {
        'imagen':[],        
        'nombre':[],
    }    
    const [erroresCampos, setErrorCampo] = useState(camposErrores);
    const setErrorCampoGlobal = (index, newValue) => {
        if (index in erroresCampos) {
            const nuevoObjeto = erroresCampos[index].concat(newValue);            
            let objeto = erroresCampos;
            objeto[index] = nuevoObjeto;        
            setErrorCampo(objeto);      
        }
    };
    const reiniciarErrorCampoGlobal = () => {
        for (let propiedad in erroresCampos) {
            if (Array.isArray(erroresCampos[propiedad])) {
                erroresCampos[propiedad] = [];
            }
        }
    };

    const handleNombreSeccionChange = (event) => { setNombreSeccion(event.target.value);    };  

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };


    const handleAbrirCrearSeccion = (event) => {         
        event.preventDefault();
        setNombreSeccion('');
        setMostrarPopUpCrearSeccion(true);
    }
    const handleCerrarCrearSeccion = () => {                 
        setMostrarPopUpCrearSeccion(!mostrarPopUpCrearSeccion);                    
    }

    const obtenerDatosServidor = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/curso/getcontenidos/${id}`, opciones);            
            if (response.ok){   
                const datos = await response.json();                   
                setContenido(datos);
            } else {     
                const datos = await response.json();            
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleMoverContenido = async (event, id_contenido, direccion) => {
        event.preventDefault();                
        const raw = {
            'direccion': direccion,                        
        };                            
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/cursocontenido/mover/${id_contenido}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'No es posible', 'contenido': 'Realizar este movimiento.'});                                                                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }

    }

    const handleCrearSeccion = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
        
        const formData = new FormData();        
        formData.append('nombre', nombreSeccion);   
        formData.append('id_curso', id);
               
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/cursocategoria`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){  
                //se guardó satisfactoriamente el curso
                setNombreSeccion('');
                setMostrarPopUpCrearSeccion(false);
                setPopup({mostrar:true, titulo:'Listo', contenido:'Sección creada correctamente.'});
                obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {titulo:'', contenido:''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }

    }
    
    const handleBorrarCategoria = (event, id_categoria) => {         
        event.preventDefault();     
        setPopupConfirmarBorrarSeccion({mostrar:true, titulo:'Confirmar', contenido:'Confirma que desea borrar la sección?', id_categoria:id_categoria});   
    }
    const handleFuncionAceptarPopUpConfirmarBorrarSeccion = () => {        
        setPopupConfirmarBorrarSeccion({...popUpConfirmarBorrarSeccion, mostrar:false});
        borrarCategoria(popUpConfirmarBorrarSeccion.id_categoria);
    };
    const handleFuncionCerrarPopUpConfirmarBorrarSeccion = () => {        
        setPopupConfirmarBorrarSeccion({...popUpConfirmarBorrarSeccion, mostrar:false});
    };
    const borrarCategoria = async (id_categoria) => {        
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/cursocategoria/${id_categoria}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});                                                                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    const handleBorrarContenido = (event, id_contenido) => {         
        event.preventDefault();     
        setPopupConfirmarBorrarContenido({mostrar:true, titulo:'Confirmar', contenido:'Confirma que desea borrar el contenido? Se borrarán también la guía de consumos realizados para todos los usuarios.', id_contenido:id_contenido});   
    }
    const handleFuncionAceptarPopUpConfirmarBorrarContenido = () => {        
        setPopupConfirmarBorrarContenido({...popUpConfirmarBorrarContenido, mostrar:false});
        borrarContenido(popUpConfirmarBorrarContenido.id_contenido);
    };
    const handleFuncionCerrarPopUpConfirmarBorrarContenido = () => {        
        setPopupConfirmarBorrarContenido({...popUpConfirmarBorrarContenido, mostrar:false});
    };
    const borrarContenido = async (id_contenido) => {        
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/cursocontenido/${id_contenido}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){                    
                obtenerDatosServidor();
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});                                                                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    
    const handleEditarSeccion = (event, id_categoria, nombre_actual) => {         
        event.preventDefault();
        setNombreSeccion(nombre_actual);
        setIdSeccionEditando(id_categoria);
        setMostrarPopUpEditarSeccion(true);
    }

    const editarSeccion = async (event) => {        
        const raw = {
            'nombre': nombreSeccion,                        
        }; 
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/cursocategoria/${idSeccionEditando}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                setMostrarPopUpEditarSeccion(false);
                setPopup({mostrar:true, titulo:'Listo', contenido:'Sección editada correctamente.'});
                obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});                                                                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }  
        
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
        <Popup 
            mostrarPopup={popUpConfirmarBorrarSeccion.mostrar} 
            tamano="xx"
            tipo={3} 
            titulo={popUpConfirmarBorrarSeccion.titulo} 
            mensaje={popUpConfirmarBorrarSeccion.contenido} 
            funcionAceptar={handleFuncionAceptarPopUpConfirmarBorrarSeccion} 
            funcionCerrar={handleFuncionCerrarPopUpConfirmarBorrarSeccion}
            textoCerrar="Cancelar"
        />
        <Popup 
            mostrarPopup={popUpConfirmarBorrarContenido.mostrar} 
            tamano="xx"
            tipo={3} 
            titulo={popUpConfirmarBorrarContenido.titulo} 
            mensaje={popUpConfirmarBorrarContenido.contenido} 
            funcionAceptar={handleFuncionAceptarPopUpConfirmarBorrarContenido} 
            funcionCerrar={handleFuncionCerrarPopUpConfirmarBorrarContenido}
            textoCerrar="Cancelar"
        />
        {mostrarPopUpCrearSeccion && <div className="modal fade modal-container show" style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="comprarModal" tabIndex="-1" role="dialog" aria-labelledby="comprarModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="comprarModalTitle">Crear sección</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Nombre</label>                                                                    
                            <input onChange={handleNombreSeccionChange} className="form-control form--control pl-3" type="text" name="nombre" maxLength="128" value={nombreSeccion} placeholder="Ej: Manipulación del DOM con React" />
                            {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}                            
                        </div>
                    </div>
                    <div className="modal-footer border-top-gray">
                        <button type="button" className="btn theme-btn mb-2" onClick={event => { handleCrearSeccion(event); }}>Crear</button>                             
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={handleCerrarCrearSeccion}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>}
        {mostrarPopUpEditarSeccion && <div className="modal fade modal-container show" style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="comprarModal2" tabIndex="-1" role="dialog" aria-labelledby="comprarModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="comprarModalTitle">Editar sección</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Nombre</label>                                                                    
                            <input onChange={handleNombreSeccionChange} className="form-control form--control pl-3" type="text" name="nombre" maxLength="128" value={nombreSeccion} placeholder="Ej: Manipulación del DOM con React" />
                            {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}                            
                        </div>
                    </div>
                    <div className="modal-footer border-top-gray">
                        <button type="button" className="btn theme-btn mb-2" onClick={event => { editarSeccion(event); }}>Guardar</button>                             
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setMostrarPopUpEditarSeccion(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>}
        <div className="dashboard-content-wrap">
            <div className="container-fluid">
                <div className="dashboard-heading mb-5">
                    <h3 className="fs-22 font-weight-semi-bold">Editar contenido del curso</h3>
                </div>
                <form action="#">    
                    {Object.keys(contenido).map((key) => (                
                        <div className="card card-item" key={`contenido-cat-${contenido[key].id_categoria}`}>
                            <div className="card-body">
                                <h3 className="fs-22 font-weight-semi-bold pb-2">{contenido[key].nombre} {contenido[key].id_categoria} {permissions[25] ? <div onClick={event=>{ handleEditarSeccion(event, contenido[key].id_categoria, contenido[key].nombre); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Editar sección"><i className="la la-edit"></i></div> : ''} {(contenido[key].curso_contenido.length==0 && permissions[25]) ? <div onClick={event => { handleBorrarCategoria(event, contenido[key].id_categoria); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Borrar"><span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span></div>: ''}</h3>                            
                                <div className="divider"><span></span></div>
                                <div className="row">                                                                
                                    <div className="col-lg-12">
                                        <ul className="curriculum-sidebar-list">
                                            {contenido[key].curso_contenido.map((tema) => 
                                                <li className="course-item-link active" key={`cotenido-${tema.id_contenido}`}>
                                                    <div className="course-item-content-wrap">
                                                        <div className="custom-control custom-checkbox media media-card">                                                                                                                                                                            
                                                            {tema.tipo_contenido==1 ? 
                                                                <Link to="/" className="media-img" style={{ height: 'auto' }}>
                                                                    {tema.imagen_preview_pequena && tema.imagen_preview_pequena!=null ? <img src={`${urlBaseApi}/${tema.imagen_preview_pequena}`} alt={tema.nombre} /> : <img src="images/course-no-image.png" alt={tema.nombre} /> }
                                                                </Link> : ''}                                                                            
                                                        </div>
                                                        <div className="course-item-content">
                                                            <h4 className="fs-15">{tema.nombre} {tema.id_contenido} - {tema.posicion}</h4>
                                                            <div className="courser-item-meta-wrap">
                                                                {tema.tipo_contenido==1 ? <p className="course-item-meta"><i className="la la-play-circle"></i>{tema.cantidad_horas_de_video}</p> : ''}
                                                            </div>
                                                            {permissions[29] ? <a href="#" className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-success" data-toggle="tooltip" data-placement="top" data-title="Subir" onClick={event => handleMoverContenido(event, tema.id_contenido, '1')} ><i className="la la-sort-up"></i></a> : ''}
                                                            {permissions[29] ? <a href="#" className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-success" data-toggle="tooltip" data-placement="top" data-title="Bajar" onClick={event => handleMoverContenido(event, tema.id_contenido, '2')}><i className="la la-sort-down"></i></a> : ''}
                                                            {permissions[29] ? <div onClick={event => { handleBorrarContenido(event, tema.id_contenido); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Borrar"><span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span></div>: ''}
                                                        </div>
                                                    </div>
                                                </li>
                                             )}
                                        </ul>                                          
                                        <div className="course-submit-btn-box pb-4">
                                            <button className="btn theme-btn" type="submit" onClick={event => handleAbrirCrearSeccion(event)}><i className="la la-plus mr-2"></i>Agregar actividad o recurso</button>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                    ))}
                    {permissions[24] ? <div className="course-submit-btn-box pb-4">
                        <button className="btn theme-btn" type="submit" onClick={event => handleAbrirCrearSeccion(event)}><i className="la la-plus mr-2"></i>Agregar sección</button>
                    </div> : ''}
                </form>
            </div>
        </div>
        </>
    )
}

export default FormularioEditarContenidoCurso;