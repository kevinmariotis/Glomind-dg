import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

/*
    endPointBusqueda: debe ser la url completa del endpoint de búsqueda: https://urla.pi/recurso/funcionBusqueda 
                    NOTA: El endpoint NO debe terminar en /
                    Se nececita que el endpoint aparezca por aparte por que dependiendo de donde se ejecute el usuariopicket se necesita uno u otro permiso que estária asociado a un endpoint
    exluirIds: es un array de ids de usuarios que no se mostrarán en la lista.                   
*/
function UsuarioPicker({funcionMostrarPopUp, funcionSetUsuarioSeleccionado, endPointBusqueda, exluirIds=[]}) {    
    const {jwt} = useContext(AuthContext);
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const urlBase = import.meta.env.VITE_URL_BASE;     
    const [optionsUsuario, setOptionsUsuario] = useState({});
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [palabraBuscar, setPalabraBuscar] = useState('');
    const [popUp, setPopup] = useState({mostrar:false, titulo:'Vista previa', contenido:''});    
    const [posterVistaPrevia, setPosterVistaPrevia] = useState('');    
        
    useEffect(() => {   
        if(palabraBuscar!=''){
            obtenerDatosUsuarios();         
        }
    }, [palabraBuscar]);

    useEffect(() => {
        if(usuarioSeleccionado!==null){
            funcionSetUsuarioSeleccionado(usuarioSeleccionado);
            funcionMostrarPopUp(false);
        }
    }, [usuarioSeleccionado]);

    const handleSetPalabraBuscar = (event) => {                
        event.preventDefault();   
        setPalabraBuscar(event.target.value);
    };
    
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const obtenerDatosUsuarios = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            let buscartext = (palabraBuscar!='') ? palabraBuscar : 'ultimos';            
            const response = await fetch(`${endPointBusqueda}/${palabraBuscar}/1`, opciones);            
            if (response.ok){   
                const datos = await response.json();
                setOptionsUsuario(datos);
            } else {     
                const datos = await response.json();            
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
   
    return (        
        <div className="modal fade modal-container show" style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="comprarModal3" tabIndex="-1" role="dialog" aria-labelledby="comprarModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="comprarModalTitle">Seleccionar usuario</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Buscar usuario por nombres, apellidos o identificación</label>
                            <input onChange={handleSetPalabraBuscar} className="form-control form--control pl-3" type="text" name="buscar_curso" maxLength="32" placeholder="Ej: Luis Eduardo" />
                        </div>

                        <div className="table-responsive" style={{ maxHeight: '250px', overflowY:'scroll'}}>
                            <table className="table generic-table">
                                <thead>
                                <tr>                                    
                                    <th scope="col">Nombres y apellidos</th>
                                    <th scope="col">Identificación</th>
                                    <th scope="col">Seleccionar</th>
                                </tr>
                                </thead>
                                <tbody >
                                    {Object.keys(optionsUsuario).map((key) => (
                                        <tr key={`usuario-seleccion-${optionsUsuario[key].id}`}>
                                            <th scope="row">
                                                {optionsUsuario[key].nombres} {optionsUsuario[key].apellidos} 
                                            </th>
                                            <td>
                                                {optionsUsuario[key].identificacion}
                                            </td>
                                            <td>
                                                <button type="button"  onClick={() => { setUsuarioSeleccionado(optionsUsuario[key].id) } } className="icon-element icon-element-xs shadow-sm border-0" data-toggle="tooltip" data-placement="top" title="Seleccionar">
                                                    <i className="la la-check"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}                                
                                </tbody>
                            </table>                            
                        </div>

                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { funcionMostrarPopUp(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>        
    );
}

export default UsuarioPicker;