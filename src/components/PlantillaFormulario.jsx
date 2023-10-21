import React, {useContext, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import BotonDashboardNavegacionMovil from './BotonDashboardNavegacionMovil';
import DashboardFooter from './DashboardFooter';

/*Import para el arbol de categorias*/
import { Tree, getBackendOptions, MultiBackend, } from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
/*Fin de los imports para el arbol de categorias*/

export default function PlantillaFormulario() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, permissions, esMovil} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});    
    const [verPopUpAsignarPerfil, setVerPopUpAsignarPerfil] = useState(false);
    const [verPopUpCrearPerfil, setVerPopUpCrearPerfil] = useState(false);
    const [pestanaActivada, setPestanaActivada] = useState(1);    
                       
    const [treeData, setTreeData] = useState([]);
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        switch(pestanaActivada){
            case 1:
                obtenerCategoriasSistema();
            break;
            case 2:
                obtenerPermisosDePerfiles();
            break;
        }        
    }, [pestanaActivada]);
           
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
        /*switch(popUp.data_switch){
            
        }*/
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
      
    
    const handleDrop = (
        newTree,
        { dragSourceId, dropTargetId, dragSource, dropTarget }
    ) => {
            console.log("arrastrando "+dragSource.data.tipo+" hacia "+dropTarget.data.tipo);
            
        
            setTreeData(newTree);
    };
        
    const obtenerCategoriasSistema = async () => {
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
                const response = await fetch(`${urlBaseApi}/api/categoriasistema/getTodas/1`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();   
                    //setCategoriaaSistema(datos);
                    setTreeData(datos);
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
                    <h3 className="fs-22 font-weight-semi-bold">Categorías y tags</h3>
                </div>
                <ul className="nav nav-tabs generic-tab pb-30px" id="myTab" role="tablist">
                    {(permissions[14] || permissions[15] || permissions[16]) && <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==1 ? 'active': ''}`} onClick={event =>{ handleCambiarPestana(event, 1) }} id="edit-profile-tab" data-toggle="tab" href="#edit-profile" role="tab" aria-controls="edit-profile" aria-selected="false">
                            Categorías
                        </a>
                    </li>}
                    {(permissions[50] || permissions[51] || permissions[52] || permissions[53] || permissions[54] || permissions[55] || permissions[56] || permissions[57] || permissions[58]) && <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==2 ? 'active': ''}`} onClick={event =>handleCambiarPestana(event, 2) } id="password-tab" data-toggle="tab" href="#password" role="tab" aria-controls="password" aria-selected="true">
                            Tags
                        </a>
                    </li>}                                                     
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${pestanaActivada==1 ? 'show active': ''}`} id="edit-profile" role="tabpanel" aria-labelledby="edit-profile-tab">
                        <div className="setting-body">
                            <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                                <div className="media media-card align-items-center">                        
                                    <h3 className="fs-17 font-weight-semi-bold">Categorías del sistema</h3>                        
                                </div>                    
                                <div className="btn-box pt-30px">
                                    {permissions[41] && <button onClick={()=>{ setVerPopUpAsignarPerfil(true); }} type="submit" className="btn theme-btn"><i className="la la-plus mr-2"></i> Asignar perfil a usuario</button>}
                                </div>
                            </div>                                                        
                            <div className="col-lg-12">                                     
                                
                                    
                            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                                <Tree
                                    tree={treeData}
                                    rootId={0}
                                    onDrop={handleDrop}
                                    render={(node, { depth, isOpen, onToggle }) => (
                                    <div style={{ marginLeft: depth * 40 }}>
                                        {node.droppable && (
                                            <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
                                        )}
                                        {node.text}
                                    </div>
                                    )}
                                />
                            </DndProvider>



                            </div>                            
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
