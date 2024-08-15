import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';

export default function CrearEditarEtiqueta({funcionMostrarPopUp, id_curso, id_categoria, id_etiqueta=-1}) {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, permissions, esMovil} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});                        
    const [popUpTag, setPopupTag] = useState({mostrar:true, nombre:'', descripcion:'', html:'', id_curso:-1, id_categoria: -1});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {
        if(id_etiqueta!=-1){
            handleTag.get();
        }
    }, [id_etiqueta]);
           
    //Estados de los errores de campos
    const camposErrores = {                        
        'nombre':[],
        'descripcion':[],
        'html':[],        
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
                
    const handleFuncionAceptarPopUp = () => {        
        switch(popUp.data_switch){
            case 'cerrar_ventana':
                handleTag.close();
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
                          
    const handleTag = {
        nombre        : (event) => { setPopupTag({...popUpTag, nombre:event.target.value});  },
        descripcion   : (event) => { setPopupTag({...popUpTag, descripcion:event.target.value});  },
        html   : (event) => { setPopupTag({...popUpTag, html:event.target.value});  },
        show          : (event) => { 

            setPopupTag({...popUpTag, mostrar: 1})

        },
        close          : (event) => { 

            funcionMostrarPopUp(false)

        },        
        get           : async (event) =>{
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try {               
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/etiqueta/${id_etiqueta}`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();                    
                    setPopupTag({...popUpTag, nombre:datos.nombre, descripcion:datos.descripcion, html:datos.html});
                } else {      
                    const data = await response.json();          
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
                }
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        },
        save          : async (event) => {

            reiniciarErrorCampoGlobal();
                        
            if(id_etiqueta != -1){                
                
                let resRowData = {
                    nombre      : popUpTag.nombre,
                    descripcion : popUpTag.descripcion,
                    html : popUpTag.html
                };
                                                                    
                const opcionesData = {   
                    method: 'PUT',
                    headers: {
                        'Authorization' : `Bearer ${jwt}`
                    },
                    body: JSON.stringify(resRowData)
                };
    
                setMostrarSpinner(true);                                                
                const responseRaw = await fetch(`${urlBaseApi}/api/etiqueta/${id_etiqueta}`, opcionesData);
                if (responseRaw.ok){                                            
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Etiqueta guardada.', data_switch:'cerrar_ventana'});
                } else {
                    const datos = await responseRaw.json();
                    mensajesDeError(setPopup, responseRaw.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                }
                setMostrarSpinner(false);                
                                
            }else{
                                                                
                const resData = new FormData(); 
                resData.append('nombre', popUpTag.nombre);   
                resData.append('descripcion', popUpTag.descripcion);
                resData.append('html', popUpTag.html);
                resData.append('id_curso', id_curso);
                resData.append('id_categoria', id_categoria);
                                                
                const opciones = {   
                    method: 'POST',
                    headers: {
                        'Authorization' : `Bearer ${jwt}`
                    },
                    body: resData
                };
    
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/etiqueta`, opciones);                
                setMostrarSpinner(false);
                if (response.ok){                                            
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Etiqueta creada.', data_switch:'cerrar_ventana'});
                    return;
                } else {
                    const datos = await response.json();
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                }       

            }
            
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
        <div className="modal fade modal-container show" style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="tagModal" tabIndex="-1" role="dialog" aria-labelledby="tagModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="tagModalTitle">{id_etiqueta!=-1 ? 'Editar etiqueta' : 'Crear etiqueta' }</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="col-lg-12">
                            <div className="form-group">    
                                <label className="label-text">Nombre</label>                                                                    
                                <input value={popUpTag.nombre} onChange={handleTag.nombre} className="form-control form--control pl-3" type="text" name="nombre" maxLength="64" placeholder="Ej: Plantilla para cálculos" />
                                {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}                            
                            </div>
                        </div>    
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text">Descripción</label>
                                <textarea value={popUpTag.descripcion} onChange={handleTag.descripcion} className="form-control form--control user-text-editor pl-3" name="descripcion" ></textarea>
                                {erroresCampos['descripcion'].length > 0 && (<SpamError mensaje={erroresCampos['descripcion']} />)}
                            </div>
                        </div> 
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text">Html</label>
                                <textarea value={popUpTag.html} onChange={handleTag.html} className="form-control form--control user-text-editor pl-3" name="html" ></textarea>
                                {erroresCampos['html'].length > 0 && (<SpamError mensaje={erroresCampos['html']} />)}
                            </div>
                        </div> 
                    </div>
                    <div className="modal-footer border-top-gray">
                        <button type="button" className="btn theme-btn mb-2" onClick={handleTag.save} >{id_etiqueta != -1 ? 'Guardar' : 'Crear'}</button>                             
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={handleTag.close}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>        
        </>
    )
}
