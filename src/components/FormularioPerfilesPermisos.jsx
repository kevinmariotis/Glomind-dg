import React, {useContext, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import DashboardFooter from './DashboardFooter';

function FormularioPerfilesPermisos() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, permissions, nombres, setImagenPequena} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});
    const [paginaAsignacionesPerfiles, setPaginaAsignacionesPerfiles] = useState(1);
    const [verPopUpAsignarPerfil, setVerPopUpAsignarPerfil] = useState(false);
    const [verPopUpCrearPerfil, setVerPopUpCrearPerfil] = useState(false);
    const [pestanaActivada, setPestanaActivada] = useState(1);    
    
    const [asignacionPerfiles, setAsignacionPerfiles] = useState({});
    const [totalAsignacionPerfiles, setTotalAsignacionPerfiles] = useState(0);  
    const [perfiles, setPerfiles] = useState({});
    const [perfilesConPermisos, setPerfilesConPermisos] = useState({});
    const [perfilesPermisos, setPerfilesPermisos] = useState({});
    const [permisos, setPermisos] = useState({});

    const [formUsuario, setFormUsuario] = useState('');  
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [optionsUsuario, setOptionsUsuario] = useState([]);   
    const [perfilSeleccionado, setPerfilSeleccionado] = useState(-1);   
    const [formNombrePerfil, setformNombrePerfil] = useState('');  


    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        switch(pestanaActivada){
            case 1:
                obtenerAsignacionPerfiles();
            break;
            case 2:
                obtenerPermisosDePerfiles();
            break;
        }        
    }, [pestanaActivada]);
           
    useEffect(() => {         
        if(formUsuario!=''){
            buscarUsuario();       
        } 
    }, [formUsuario]);


    //Estados de los errores de campos
    const camposErrores = {                        
        'id_usuario':[],
        'id_perfil':[],
        'nombre':[],
        'id_perfil_copiar':[],
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
        
    const handleCambiarPestana = (event, numero) =>{    
        event.preventDefault();   
        setPestanaActivada(numero);
    };
    
    const handleFuncionAceptarPopUp = () => {        
        switch(popUp.data_switch){
            case 'borrar-usuario-perfil':
                quitarPerfilUsuario({'id_usuario':popUp.data_id, 'id_perfil':popUp.data_id_2});
            break;            
            case 'borrar-perfil':
                quitarPerfil(popUp.data_id);
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
        
    const handleUsuarioChange = (newValue) => {        
        setFormUsuario(newValue);                        
    };
    const handlePerfilSeleccionadoChange = (event) => { setPerfilSeleccionado(event.target.value);    };

    const handleBorrarPerfilUsuario = (id_usuario, id_perfil) => {                
        setPopup({mostrar:true, tipo:3, titulo:'Confimar', contenido:'Confima que desea retirar el perfil de este usuario?', data_switch:'borrar-usuario-perfil', data_id:id_usuario, data_id_2:id_perfil});
    };

    const handleBorrarPerfil = (id_perfil, nombre) => {                
        setPopup({mostrar:true, tipo:3, titulo:'Confimar', contenido:'Confima que desea borrar el perfil de '+nombre+' del sistema?', data_switch:'borrar-perfil', data_id:id_perfil});
    };

    const handleNombrePerfilChange = (event) =>{            
        setformNombrePerfil(event.target.value);
    };
    

    const obtenerAsignacionPerfiles = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {   
            if(permissions[40] || permissions[41] || permissions[42]){
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/perfilusuario/getTodos/${paginaAsignacionesPerfiles}/usuario.nombre-asc`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();   
                    setAsignacionPerfiles(datos.asignaciones);
                    setTotalAsignacionPerfiles(datos.total_asignaciones);
                    setPerfiles(datos.perfiles);
                } else {      
                    const data = await response.json();          
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
                }  
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
    
    const obtenerPermisosDePerfiles = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {   
            if(permissions[11] || permissions[12] || permissions[13] || permissions[37] || permissions[38] || permissions[39]){
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/perfil/getTodos/1`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();   
                    //setPerfilesPermisos(datos.perfiles_permisos);                    
                    setPerfilesConPermisos(datos.perfiles);
                    setPermisos(datos.nombres_permisos);
                } else {      
                    const data = await response.json();          
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
                }  
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const buscarUsuario = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response2 = await fetch(`${urlBaseApi}/api/perfilusuario/buscarUsuario/${formUsuario}/1`, opciones);            
            if (response2.ok){   
                const datos2 = await response2.json();   
                let opciones = [];
                datos2.forEach(function(element) {
                    opciones.push({'value':element.id, 'label':element.nombres+' '+element.apellidos+' ('+element.identificacion+')'});
                });                
                setOptionsUsuario(opciones);
            } else {     
                const datos2 = await response2.json();            
                mensajesDeError(setPopup, response2.status, (typeof datos2.datos !== 'undefined') ? datos2.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
    
    const asignarPermiso = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
                
        const formData = new FormData();     
        if(usuarioSeleccionado!=null){
            formData.append('id_usuario', usuarioSeleccionado.value.toString());
        }
        formData.append('id_perfil', perfilSeleccionado);
        
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/perfilusuario`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){   
                setVerPopUpAsignarPerfil(false);
                setUsuarioSeleccionado(null);
                setPerfilSeleccionado(-1);
                obtenerAsignacionPerfiles(); 
                setPopup({mostrar:true, titulo:'Listo', contenido:'Perfil asignado.'});
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };    
    
    const crearPerfil = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
                
        const formData = new FormData();     
        if(perfilSeleccionado!=-1){
            formData.append('id_perfil_copiar', perfilSeleccionado.toString());
        }
        formData.append('nombre', formNombrePerfil);
        
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/perfil`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){   
                setVerPopUpCrearPerfil(false);
                setformNombrePerfil('');
                setPerfilSeleccionado(-1);
                obtenerPermisosDePerfiles();
                setPopup({mostrar:true, titulo:'Listo', contenido:'Perfil crae.'});
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };    

    const quitarPerfilUsuario = async ({id_usuario, id_perfil}) => {  
                
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        
        try {
            setMostrarSpinner(true); 
            const response = await fetch(`${urlBaseApi}/api/perfilusuario/${id_usuario}/${id_perfil}`, opciones);
            const data = await response.json();
            setMostrarSpinner(false);       //al quitar el spinner se recargan los datos                        
            if (response.ok){                  
                obtenerAsignacionPerfiles();
                setPopup({mostrar:true, titulo:'Listo', contenido:'El usuario ya no tiene el perfil.'});
                return;
            } else {                           
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch (error) {
            console.error('Error de conexión:', error);
        }       
    };

    /* Borra un perfil del sistema */
    const quitarPerfil = async (id_perfil) => {  
                
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        
        try {
            setMostrarSpinner(true); 
            const response = await fetch(`${urlBaseApi}/api/perfil/${id_perfil}`, opciones);
            const data = await response.json();
            setMostrarSpinner(false);
            if (response.ok){                  
                obtenerPermisosDePerfiles();                
                setPopup({mostrar:true, titulo:'Listo', contenido:'Perfil borrado.'});
                return;
            } else {                           
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch (error) {
            console.error('Error de conexión:', error);
        }       
    };

    const crearPerfilPermiso = async (id_perfil, id_permiso) => {
        //event.preventDefault();
        reiniciarErrorCampoGlobal();
                
        const formData = new FormData();     
        formData.append('id_perfil', id_perfil);
        formData.append('id_permiso', id_permiso);
        
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/perfilpermiso`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            obtenerPermisosDePerfiles();
            if (response.ok){                  
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };    

    const quitarPerfilPermiso = async (id_perfil, id_permiso) => {  
                
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        
        try {
            setMostrarSpinner(true); 
            const response = await fetch(`${urlBaseApi}/api/perfilpermiso/${id_perfil}/${id_permiso}`, opciones);
            const data = await response.json();
            setMostrarSpinner(false);       //al quitar el spinner se recargan los datos                        
            obtenerPermisosDePerfiles();
            if (response.ok){                                  
                return;
            } else {                           
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch (error) {
            console.error('Error de conexión:', error);
        }       
    };

    const handleModificarPerfilPermiso = (event, key_perfil, key_permiso) => {        
        const newPerfilesConPermisos = [...perfilesConPermisos];        
        newPerfilesConPermisos[key_perfil].permisos[key_permiso] = !newPerfilesConPermisos[key_perfil].permisos[key_permiso];            
        setPerfilesConPermisos(newPerfilesConPermisos);
        //console.log("colcoando el perfil "+newPerfilesConPermisos[key_perfil].id+" con permiso "+key_permiso+" a:"+event.target.checked);
        if(event.target.checked){
            crearPerfilPermiso(newPerfilesConPermisos[key_perfil].id, key_permiso);
        }else{
            quitarPerfilPermiso(newPerfilesConPermisos[key_perfil].id, key_permiso);
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
        <div className={`modal fade modal-container ${verPopUpAsignarPerfil==true ? 'show' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="asignarPerfil" tabIndex="-1" role="dialog" aria-labelledby="asignarPerfilTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="asignarPerfilTitle">Asignar perfil</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Buscar usuario</label>
                            <input type="hidden" name="id_usuario" />  
                            <Select
                                name="usuario"
                                value={usuarioSeleccionado}
                                onChange={(selectedOption) => setUsuarioSeleccionado(selectedOption)}
                                onInputChange={handleUsuarioChange}
                                options={optionsUsuario}
                                isClearable
                                isSearchable
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#333',
                                        borderColor: '#666',
                                        color: '#fff',
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected ? '#444' : '#333',
                                        color: state.isSelected ? '#fff' : '#ccc',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: '#fff',
                                    }),
                                    input: (provided) => ({
                                        ...provided,
                                        color: '#fff', // Asegura que el color del texto sea blanco
                                    }),
                                    }}
                            />                             
                            {erroresCampos['id_usuario'].length > 0 && (<SpamError mensaje={erroresCampos['id_usuario']} />)}
                        </div>    
                        <div className="form-group">
                            <label className="label-text">Perfil</label>
                            <select onChange={handlePerfilSeleccionadoChange} value={perfilSeleccionado} name="tipo" className="form-control select-dark">
                                <option value=""> -- Seleccione --</option>
                                {Object.keys(perfiles).map((key) => (
                                    <option key={`perfil-seleccionar-${perfiles[key].id}`} value={perfiles[key].id}>{perfiles[key].nombre}</option>                                                
                                ))}
                            </select>                                        
                            {erroresCampos['id_perfil'].length > 0 && (<SpamError mensaje={erroresCampos['id_perfil']} />)}
                        </div>
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={asignarPermiso}> Asignar </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setVerPopUpAsignarPerfil(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>
        <div className={`modal fade modal-container ${verPopUpCrearPerfil==true ? 'show' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="crearPerfil" tabIndex="-1" role="dialog" aria-labelledby="crearPerfilTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="crearPerfilTitle">Crear perfil</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Nombre</label>
                            <input onChange={handleNombrePerfilChange} value={formNombrePerfil} className="form-control form--control pl-3" type="text" name="nombre_nuevo_perfil" maxLength="64" placeholder="" />                        
                            {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}
                        </div>    
                        <div className="form-group">
                            <label className="label-text">Copiar de</label>
                            <select onChange={handlePerfilSeleccionadoChange} value={perfilSeleccionado} name="tipo" className="form-control select-dark">
                                <option value={-1}> -- Ninguno --</option>
                                {Object.keys(perfiles).map((key) => (
                                    <option key={`perfil-seleccionar-${perfiles[key].id}`} value={perfiles[key].id}>{perfiles[key].nombre}</option>                                                
                                ))}
                            </select>                                        
                            {erroresCampos['id_perfil_copiar'].length > 0 && (<SpamError mensaje={erroresCampos['id_perfil_copiar']} />)}
                        </div>
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={crearPerfil}> Crear </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setVerPopUpCrearPerfil(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>  
        <div className="dashboard-content-wrap">
            <div className="dashboard-menu-toggler btn theme-btn theme-btn-sm lh-28 theme-btn-transparent mb-4 ml-3">
                <i className="la la-bars mr-1"></i> Dashboard Nav
            </div>
            <div className="container-fluid">                
                <div className="dashboard-heading mb-5">
                    <h3 className="fs-22 font-weight-semi-bold">Perfiles y permisos</h3>
                </div>
                <ul className="nav nav-tabs generic-tab pb-30px" id="myTab" role="tablist">
                    {(permissions[40] || permissions[41] || permissions[42]) && <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==1 ? 'active': ''}`} onClick={event =>{ handleCambiarPestana(event, 1) }} id="edit-profile-tab" data-toggle="tab" href="#edit-profile" role="tab" aria-controls="edit-profile" aria-selected="false">
                            Asignar perfil
                        </a>
                    </li>}
                    {(permissions[11] || permissions[12] || permissions[13] || permissions[37] || permissions[38] || permissions[39]) && <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==2 ? 'active': ''}`} onClick={event =>handleCambiarPestana(event, 2) } id="password-tab" data-toggle="tab" href="#password" role="tab" aria-controls="password" aria-selected="true">
                            Perfiles
                        </a>
                    </li>}                                                     
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${pestanaActivada==1 ? 'show active': ''}`} id="edit-profile" role="tabpanel" aria-labelledby="edit-profile-tab">
                        <div className="setting-body">
                            <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                                <div className="media media-card align-items-center">                        
                                    <h3 className="fs-17 font-weight-semi-bold">Asignación de perfiles</h3>                        
                                </div>                    
                                <div className="btn-box pt-30px">
                                    {permissions[41] && <button onClick={()=>{ setVerPopUpAsignarPerfil(true); }} type="submit" className="btn theme-btn"><i className="la la-plus mr-2"></i> Asignar perfil a usuario</button>}
                                </div>
                            </div>                                                        
                            <div className="col-lg-12">                                     
                                <div className="table-responsive">
                                    <table className="table generic-table">
                                        <thead>
                                        <tr>               
                                            <th scope="col"></th> 
                                            <th scope="col">Usuario</th>
                                            <th scope="col">Cédula</th>
                                            <th scope="col">Perfil</th>                                                
                                            <th scope="col"></th>
                                        </tr>
                                        </thead>
                                        <tbody >
                                            {Object.keys(asignacionPerfiles).map((key) => (
                                                <tr key={`asginacion-perfil-${key}-${asignacionPerfiles[key].id_usuario}`}>
                                                    <th scope="row" width="5%">
                                                        <div className="media media-card  pb-2 mb-2" >
                                                            <div className="media-img mr-4 rounded-full">
                                                                <img className="rounded-full lazy" src={asignacionPerfiles[key].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${asignacionPerfiles[key].imagen_pequena}`} data-src={`${urlBase}/images/avatar_docente.jpg`} alt="User image" />
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th scope="row" width="40%">
                                                        {asignacionPerfiles[key].nombres} {asignacionPerfiles[key].apellidos}
                                                    </th>
                                                    <th scope="row" width="10%">
                                                        {asignacionPerfiles[key].identificacion}
                                                    </th>
                                                    <th scope="row">
                                                        {asignacionPerfiles[key].nombre}
                                                    </th>
                                                    <th scope="row" width="5%">
                                                        {permissions[42] && <div onClick={()=>{ handleBorrarPerfilUsuario(asignacionPerfiles[key].id_usuario, asignacionPerfiles[key].id_perfil); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Delete">
                                                            <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                                        </div>}
                                                    </th>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>                            
                                </div>
                            </div>
                            <Paginador elemetosTotales={totalAsignacionPerfiles} elementosPorPagina={20} paginaActual={paginaAsignacionesPerfiles} callbackCambioPagina={setPaginaAsignacionesPerfiles} />
                        </div>
                    </div>
                    <div className={`tab-pane fade ${pestanaActivada==2 ? 'show active': ''}`} id="password" role="tabpanel" aria-labelledby="password-tab">
                        <div className="setting-body">
                            <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                                <div className="media media-card align-items-center">                        
                                    <h3 className="fs-17 font-weight-semi-bold">Perfiles y permisos del sistema</h3>                        
                                </div>                    
                                <div className="btn-box pt-30px">
                                    {permissions[12] && <button onClick={()=>{ setVerPopUpCrearPerfil(true); }} type="submit" className="btn theme-btn"><i className="la la-plus mr-2"></i> Crear perfil</button>}
                                </div>
                            </div>     
                            <div className="col-lg-12">                                     
                                <div className="table-responsive">
                                    <table className="table generic-table">
                                        <thead>
                                        <tr>               
                                            <th scope="col"></th> 
                                            {Object.keys(perfilesConPermisos).map((key) => (
                                                <th key={`encabezado-perfil-${perfilesConPermisos[key].id}`} scope="col">{perfilesConPermisos[key].nombre}</th>
                                            ))}                                                                   
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(permisos).slice(2, Object.keys(permisos).length).map((key) => (
                                                <tr key={`fila-permiso-${key}`}>
                                                    <th scope="row" width="15%">{permisos[key]}</th>
                                                    {Object.keys(perfilesConPermisos).map((key2) => (
                                                        <th scope="row" key={`th-permiso-${key2}-${key}`}>                                                            
                                                            <div class="custom-control custom-checkbox mb-4 fs-15">
                                                                <input type="checkbox" onClick={(event)=>handleModificarPerfilPermiso(event, key2, key)} checked={perfilesConPermisos[key2].permisos[key]} />
                                                            </div>
                                                        </th>
                                                    ))}                                                       
                                                </tr>
                                            ))}
                                            <tr>
                                                <th scope="row" width="15%"></th>   
                                                {Object.keys(perfilesConPermisos).map((key2) => (
                                                    <th scope="row">
                                                        {permissions[13] && <div onClick={()=>{ handleBorrarPerfil(perfilesConPermisos[key2].id, perfilesConPermisos[key2].nombre); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Delete">
                                                            <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                                        </div>} 
                                                    </th>    
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>                            
                                </div>
                            </div>

                        </div>
                    </div>                                                           
                </div>
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioPerfilesPermisos;