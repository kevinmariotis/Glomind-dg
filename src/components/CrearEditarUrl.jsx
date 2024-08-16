import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';

export default function CrearEditarUrl({funcionMostrarPopUp, id_curso, id_categoria, id_url=-1}) {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, permissions, esMovil} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});                        
    const [popUpObjeto, setPopupObjeto] = useState({mostrar:true, nombre:'', descripcion:'', url:'', archivo_vista_previa:null, ruta_imagen_preview_small:null, id_curso:-1, id_categoria: -1});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {
        if(id_url!=-1){
            handleObjeto.get();
        }
    }, [id_url]);
           
    //Estados de los errores de campos
    const camposErrores = {                        
        'nombre':[],
        'descripcion':[],
        'url':[],
        'archivo_vista_previa':[],        
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
                handleObjeto.close();
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
                          
    const handleObjeto = {
        nombre        : (event) => { setPopupObjeto({...popUpObjeto, nombre:event.target.value});  },
        descripcion   : (event) => { setPopupObjeto({...popUpObjeto, descripcion:event.target.value});  },
        url   : (event) => { setPopupObjeto({...popUpObjeto, url:event.target.value});  },
        show          : (event) => { 

            setPopupObjeto({...popUpObjeto, mostrar: 1})

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
                const response = await fetch(`${urlBaseApi}/api/url/${id_url}`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();                    
                    setPopupObjeto({...popUpObjeto, nombre:datos.nombre, descripcion:datos.descripcion.replace(/<br\s*\/?>/gi,'\n'), url:datos.url, archivo_vista_previa:null, ruta_imagen_preview_small:datos.ruta_imagen_preview_small});
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
                        
            if(id_url != -1){                
                                
                let resRowData = {
                    nombre      : popUpObjeto.nombre,
                    descripcion : popUpObjeto.descripcion,
                    url : popUpObjeto.url
                };
                let preview = document.querySelector('input[name=resourceVistaPrevia]').files[0]; 
                
                const opcionesData = {   
                    method: 'PUT',
                    headers: {
                        'Authorization' : `Bearer ${jwt}`
                    },
                    body: JSON.stringify(resRowData)
                };
                
    
                setMostrarSpinner(true);
                const responseRaw = await fetch(`${urlBaseApi}/api/url/${id_url}`, opcionesData);
                
                if (responseRaw.ok){                                                                
                    if(!preview){
                        setMostrarSpinner(false);
                        setPopup({mostrar:true, titulo:'Listo', contenido:'Url guardada.', data_switch:'cerrar_ventana'});
                    }
                } else {
                    const datos = await responseRaw.json();
                    mensajesDeError(setPopup, responseRaw.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                    setMostrarSpinner(false);
                    return;
                }
                
                //se envia la imagen de vista previa
                
                if(preview){
                    const previewData = new FormData();    
                    previewData.append('archivo_vista_previa', preview);
                    const opcionesPreview = {   
                        method: 'POST',
                        headers: {
                            'Authorization' : `Bearer ${jwt}`
                        },
                        body: previewData
                    };
                    const responsePreview = await fetch(`${urlBaseApi}/api/url/actualizarImagenVistaPrevia/${id_url}`, opcionesPreview);                    
                    setMostrarSpinner(false);
                    if (responsePreview.ok){                                                                    
                        setPopup({mostrar:true, titulo:'Listo', contenido:'Url guardada.', data_switch:'cerrar_ventana'});                        
                    }else{
                        const datos = await responsePreview.json();
                        mensajesDeError(setPopup, responsePreview.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});                        
                    }
                }
                
                                
            }else{
                   
                let preview = document.querySelector('input[name=resourceVistaPrevia]').files[0];

                const resData = new FormData(); 
                resData.append('nombre', popUpObjeto.nombre);   
                resData.append('descripcion', popUpObjeto.descripcion);
                resData.append('url', popUpObjeto.url);
                resData.append('id_curso', id_curso);
                resData.append('id_categoria', id_categoria);
                     
                if(preview){
                    resData.append('archivo_vista_previa', preview);
                }

                const opciones = {   
                    method: 'POST',
                    headers: {
                        'Authorization' : `Bearer ${jwt}`
                    },
                    body: resData
                };
    
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/url`, opciones);                
                setMostrarSpinner(false);
                if (response.ok){                                            
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Url creada.', data_switch:'cerrar_ventana'});
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
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="tagModalTitle">{id_url!=-1 ? 'Editar Url' : 'Crear Url' }</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="col-lg-12">
                            <div className="form-group">    
                                <label className="label-text">Nombre</label>                                                                    
                                <input value={popUpObjeto.nombre} onChange={handleObjeto.nombre} className="form-control form--control pl-3" type="text" name="nombre" maxLength="64" placeholder="Ej: Plantilla para cálculos" />
                                {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}                            
                            </div>
                        </div>    
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text">Descripción</label>
                                <textarea value={popUpObjeto.descripcion} onChange={handleObjeto.descripcion} className="form-control form--control user-text-editor pl-3" name="descripcion" ></textarea>
                                {erroresCampos['descripcion'].length > 0 && (<SpamError mensaje={erroresCampos['descripcion']} />)}
                            </div>
                        </div> 
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text">Url</label>
                                <input type="text" value={popUpObjeto.url} onChange={handleObjeto.url} maxLength="2048" className="form-control form--control user-text-editor pl-3" name="url" />
                                {erroresCampos['url'].length > 0 && (<SpamError mensaje={erroresCampos['url']} />)}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text">Vista previa</label>
                                <input type="file" name="resourceVistaPrevia" className="form-control form--control user-text-editor pl-3"></input>
                                {erroresCampos['archivo_vista_previa'].length > 0 && (<SpamError mensaje={erroresCampos['archivo_vista_previa']} />)}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-top-gray">
                        <button type="button" className="btn theme-btn mb-2" onClick={handleObjeto.save} >{id_url != -1 ? 'Guardar' : 'Crear'}</button>                             
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={handleObjeto.close}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>        
        </>
    )
}
