import React, {useContext, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import BotonDashboardNavegacionMovil from './BotonDashboardNavegacionMovil';
import DashboardFooter from './DashboardFooter';

export default function FormularioDashboardUsuarios() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, permissions, esMovil} = useContext(AuthContext);
    const navigate = useNavigate(); 
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});    
    const [verPopUpAsignarPerfil, setVerPopUpAsignarPerfil] = useState(false);
    const [verPopUpCrearPerfil, setVerPopUpCrearPerfil] = useState(false);
    const [pestanaActivada, setPestanaActivada] = useState(1);    
    
    const [pagina, setPagina] = useState(1);
    const [usuarios, setUsuarios] = useState({});
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [buscarPorTexto, setBuscarPorTexto] = useState('');    
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        switch(pestanaActivada){
            case 1:
                obtenerDatosDelServidor();
            break;            
        }        
    }, [pestanaActivada]);

    useEffect(() => {                   
        obtenerDatosDelServidor();        
    }, [pagina, buscarPorTexto]);
           
    //Estados de los errores de campos
    const camposErrores = {                                
        'nombre':[],
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
            case 'enviar_email_validacion_email':
                enviarEmailValicacionEmail(popUp.data_id);
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
      
    const handleSetPalabraBuscar = (event) => {                
        event.preventDefault();   
        setBuscarPorTexto(event.target.value);
    };
    
    const handleEnviarEmailValidacionEmail = (id_usuario) => {
        setPopup({...popUp, mostrar:true, tipo:3, titulo:'Confirmar?', contenido:'Confirma que desea enviar un correo de confirmación de correo electrónico a este usuario?', data_switch:'enviar_email_validacion_email', data_id:id_usuario, data_id_2:-1});
    };    
    

    
    const obtenerDatosDelServidor = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {   
            if(permissions[17] || permissions[18] || permissions[19]){
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/usuario/getTodos/${pagina}/created_at-desc/${buscarPorTexto}`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();   
                    //setCategoriaaSistema(datos);
                    setUsuarios(datos.usuarios);
                    setTotalUsuarios(datos.total_usuarios);
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

    const enviarEmailValicacionEmail = async (id_usuario) => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {               
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/usuario/enviarEmailValidarEmail/${id_usuario}`, opciones);
            setMostrarSpinner(false);
            if (response.ok){                           
                setPopup({mostrar:true, tipo:2, titulo:'Listo', contenido:'Email enviado al correo electrónico del usuario'});
            } else {      
                const data = await response.json();          
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
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

                        </div>    
                        <div className="form-group">
                            <label className="label-text">Perfil</label>
                            

                        </div>
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={false}> Asignar </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setVerPopUpAsignarPerfil(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>        
        <div className="dashboard-content-wrap">
            {esMovil && <BotonDashboardNavegacionMovil />}
            <div className="container-fluid">                
                <div className="dashboard-heading mb-5">
                    <h3 className="fs-22 font-weight-semi-bold">Usuarios</h3>
                </div>
                <ul className="nav nav-tabs generic-tab pb-30px" id="myTab" role="tablist">
                    {(permissions[17] || permissions[18] || permissions[19]) && <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==1 ? 'active': ''}`} onClick={event =>{ handleCambiarPestana(event, 1) }} id="edit-profile-tab" data-toggle="tab" href="#edit-profile" role="tab" aria-controls="edit-profile" aria-selected="false">
                            Usuarios
                        </a>
                    </li>}                    
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${pestanaActivada==1 ? 'show active': ''}`} id="edit-profile" role="tabpanel" aria-labelledby="edit-profile-tab">
                        <div className="setting-body">
                            <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                                <div className="media media-card align-items-center">                        
                                    <h3 className="fs-17 font-weight-semi-bold">Usuarios en el sistema</h3>                        
                                </div>                    
                                <div className="btn-box pt-30px">
                                    {permissions[41] && <button style={{display:'none'}} onClick={()=>{ setVerPopUpAsignarPerfil(true); }} type="submit" className="btn theme-btn"><i className="la la-plus mr-2"></i> Subir usuarios masivamente</button>}
                                </div>
                            </div>                                                        
                            <div className="col-lg-12">     

                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label className="label-text">Buscar usuario por nombre o identificación</label>
                                            <input onChange={handleSetPalabraBuscar} className="form-control form--control pl-3" type="text" name="buscar_video" maxLength="32" placeholder="" />
                                        </div>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table generic-table">
                                        <thead>
                                        <tr>               
                                            <th scope="col"></th> 
                                            <th scope="col">Nombres y apellidos</th>
                                            <th scope="col">Indentificación</th>
                                            <th scope="col">Estado</th>
                                            <th scope="col"></th>
                                        </tr>
                                        </thead>
                                        <tbody >
                                            {Object.keys(usuarios).map((key) => (
                                                <tr key={`usuario-perfil-${key}-${usuarios[key].id}`}>
                                                    <th scope="row" width="5%">
                                                        <div className="media media-card  pb-2 mb-2" >
                                                            <div className="media-img mr-4 rounded-full">
                                                                <img className="rounded-full lazy" src={usuarios[key].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${usuarios[key].imagen_pequena}`} data-src={`${urlBase}/images/avatar_docente.jpg`} alt="User image" />
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th scope="row">
                                                        {usuarios[key].nombres} {usuarios[key].apellidos}
                                                    </th>
                                                    <th scope="row">
                                                        {usuarios[key].identificacion}
                                                    </th>
                                                    <th scope="row">
                                                        {usuarios[key].estado==1 ? <span className="badge badge-success text-white">Activo</span>: <span className="badge badge-danger text-white">Suspendido</span>}
                                                    </th>
                                                    <th scope="row" width="20%">
                                                        {permissions[19] ? <div style={{float:'left'}} onClick={()=>{ navigate(`/usuario/editar/${usuarios[key].id}`); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Editar configuración"><i className="la la-gear"></i></div> : ''}
                                                        {/* {permissions[76] ? <div onClick={()=>{ navigate(`/factura/historial/${usuarios[key].id}`); }}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Ver compras del usuario"><i className="la la-shopping-cart"></i></div></div> : ''} */ }
                                                        {permissions[19] ? <div onClick={()=>{ handleEnviarEmailValidacionEmail(usuarios[key].id); }}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Enviar correo de confirmación de email"><i className="la la-envelope-o"></i></div></div> : ''}
                                                    </th>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>                            
                                </div>
                                <Paginador elemetosTotales={totalUsuarios} elementosPorPagina={5} paginaActual={pagina} callbackCambioPagina={setPagina} />
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
