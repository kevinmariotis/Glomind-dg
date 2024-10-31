import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';

//para el date picker
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
//fin de para el date picker

export default function CrearEditarVideollamada({funcionMostrarPopUp, id_curso=-1, es_docente=false}) {
    const today = new Date();
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, permissions, esMovil, temaActual} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});                        
    const [todas, setTodas] = useState([]);
    const [popUpVideollamada, setPopupVideollamada] = useState({mostrar:true, formulario:'listado', id_editando:-1, fecha_hora_inicio:'', cantidad_minutos:-1, url:'', url_grabacion:'', fecha_inicio:today, hora_inicio:'', minuto_inicio:''});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    const [mostrarFechaInicio, setMostrarFechaInicio] = useState(false);    

    useEffect(() => {
        if(id_curso!=-1){
            handleVideollamada.getTodos();
        }
    }, [id_curso]);

    useEffect(() => {
        if(popUpVideollamada.id_editando!=-1){
            handleVideollamada.get();
        }
    }, [popUpVideollamada.id_editando]);
               
    useEffect(() => {        
        document.addEventListener('click', handleVideollamada.hideSelects);
        return () => {
            document.removeEventListener('click', handleVideollamada.hideSelects);
        };
    }, []);

    //Estados de los errores de campos
    const camposErrores = {                        
        'fecha_hora_inicio':[],
        'cantidad_minutos':[],
        'url':[],  
        'url_grabacion':[],  
        'fecha_inicio':[],
        'hora_inicio':[],
        'minuto_inicio':[],      
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
                handleVideollamada.close();
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
                          
    const handleVideollamada = {
        fecha_hora_inicio        : (event) => { setPopupVideollamada({...popUpVideollamada, fecha_hora_inicio:event.target.value});  },
        cantidad_minutos   : (event) => { setPopupVideollamada({...popUpVideollamada, cantidad_minutos:event.target.value});  },
        url   : (event) => { setPopupVideollamada({...popUpVideollamada, url:event.target.value});  },
        url_grabacion   : (event) => { setPopupVideollamada({...popUpVideollamada, url_grabacion:event.target.value});  },
        fecha_inicio   : (fecha_establecer) => { setPopupVideollamada({...popUpVideollamada, fecha_inicio:fecha_establecer});  },
        hora_inicio   : (event) => { setPopupVideollamada({...popUpVideollamada, hora_inicio:event.target.value});  },
        minuto_inicio   : (event) => { setPopupVideollamada({...popUpVideollamada, minuto_inicio:event.target.value});  },
        show          : (event) => { 

            setPopupVideollamada({...popUpVideollamada, mostrar: 1})

        },
        close          : (event) => { 

            funcionMostrarPopUp(false)

        },
        toogleMostrarFechaInicio : (event) => {
            setMostrarFechaInicio(!mostrarFechaInicio);            
        },
        hideSelects : (event) => {            
            if(event.target.name===undefined){                
                setMostrarFechaInicio(false);                                
            }
        },
        getTodos           : async (event) =>{
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try {               
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/curso/getVideollamadas/${id_curso}`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();
                    setTodas(datos);
                } else {      
                    const data = await response.json();          
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
                }
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
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
                const response = await fetch(`${urlBaseApi}/api/cursovideollamada/${popUpVideollamada.id_editando}`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();    
                    
                    const partes_inicio = datos.fecha_hora_inicio.split(" ");
                    const partes_inicio2 = partes_inicio[0].split("-"); 
                    const partes_inicio_hora = partes_inicio[1].split(":");
                                        
                    setPopupVideollamada({...popUpVideollamada, fecha_inicio:new Date(partes_inicio2[0], partes_inicio2[1]-1, partes_inicio2[2]), hora_inicio:partes_inicio_hora[0], minuto_inicio:partes_inicio_hora[1], fecha_hora_inicio:datos.fecha_hora_inicio, cantidad_minutos:datos.cantidad_minutos, url:datos.url, url_grabacion:datos.url_grabacion});
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
                        
            if(popUpVideollamada.id_editando != -1){                
                
                let resRowData = {
                    fecha_hora_inicio : format(popUpVideollamada.fecha_inicio, 'yyyy-MM-dd')+' '+popUpVideollamada.hora_inicio+':'+popUpVideollamada.minuto_inicio+':00',
                    cantidad_minutos : popUpVideollamada.cantidad_minutos.toString(),
                    url : popUpVideollamada.url,                    
                };

                if(popUpVideollamada.url_grabacion!=null && popUpVideollamada.url_grabacion!=''){
                    resRowData['url_grabacion'] = popUpVideollamada.url_grabacion;
                }
                                                                    
                const opcionesData = {   
                    method: 'PUT',
                    headers: {
                        'Authorization' : `Bearer ${jwt}`
                    },
                    body: JSON.stringify(resRowData)
                };
    
                setMostrarSpinner(true);                                                
                const responseRaw = await fetch(`${urlBaseApi}/api/cursovideollamada/${popUpVideollamada.id_editando}`, opcionesData);
                if (responseRaw.ok){                                            
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Videollamada guardada.', data_switch:''});
                    setPopupVideollamada({...popUpVideollamada, formulario:'listado'});
                    handleVideollamada.getTodos();
                } else {
                    const datos = await responseRaw.json();
                    mensajesDeError(setPopup, responseRaw.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                }
                setMostrarSpinner(false);                
                                
            }else{
                                                                
                const resData = new FormData(); 
                resData.append('id_curso', id_curso);
                resData.append('fecha_hora_inicio', format(popUpVideollamada.fecha_inicio, 'yyyy-MM-dd')+' '+popUpVideollamada.hora_inicio+':'+popUpVideollamada.minuto_inicio+':00');
                resData.append('cantidad_minutos', popUpVideollamada.cantidad_minutos.toString());
                resData.append('url', popUpVideollamada.url);
                resData.append('url_grabacion', popUpVideollamada.url_grabacion);                
                                                
                const opciones = {   
                    method: 'POST',
                    headers: {
                        'Authorization' : `Bearer ${jwt}`
                    },
                    body: resData
                };
    
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/cursovideollamada`, opciones);                
                setMostrarSpinner(false);
                if (response.ok){                                            
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Videollamada creada.', data_switch:'cerrar_ventana'});
                    setPopupVideollamada({...popUpVideollamada, formulario:'listado'});
                    return;
                } else {
                    const datos = await response.json();
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                }       

            }
            
        },
        delete           : async (event) =>{
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try {               
                const opciones = {
                    method: 'DELETE',
                    headers: headers,
                };
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/cursovideollamada/${popUpVideollamada.id_editando}`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Videollamada borrada.', data_switch:''});
                    setPopupVideollamada({...popUpVideollamada, formulario:'listado'});
                    handleVideollamada.getTodos();
                    return;
                } else {      
                    const data = await response.json();          
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
                }
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        },
    }

    const horas = Array.from({ length: 24 }, (_, index) => index);
    const minutos = Array.from({ length: 60 }, (_, index) => index);
    const porcentaje_en_total_curso = Array.from({ length: 100 }, (_, index) => index + 1);

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
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="tagModalTitle">Videoclases</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        {popUpVideollamada.formulario=='crear-editar' ?
                            <>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text" style={{display:'block'}}>Fecha de inicio</label>                                        
                                        <input onClick={handleVideollamada.toogleMostrarFechaInicio} value={format(popUpVideollamada.fecha_inicio, 'yyyy-MM-dd')} style={{width:'50%', float:'left'}} readOnly className="form-control form--control pl-3" type="text" name="fecha_inicio" maxLength="64" placeholder="" />
                                        <select onChange={handleVideollamada.hora_inicio} style={{width:'25%', height:'50px', float:'left'}} value={popUpVideollamada.hora_inicio} name="hora_inicio" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Hora --</option>   
                                            {horas.map((hora) => (
                                                <option key={`h-inicio-${hora}`} value={hora.toString().padStart(2, '0')}>
                                                    {hora.toString().padStart(2, '0')}
                                                </option>
                                            ))}                                                                                     
                                        </select>
                                        <select onChange={handleVideollamada.minuto_inicio} style={{width:'25%', height:'50px'}} value={popUpVideollamada.minuto_inicio} name="minuto_inicio" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Minuto --</option>                                                                                        
                                            {minutos.map((minuto) => (
                                                <option key={`m-inicio-${minuto}`} value={minuto.toString().padStart(2, '0')}>
                                                    {minuto.toString().padStart(2, '0')}
                                                </option>
                                            ))}
                                        </select>                                        
                                        <div style={{position:'absolute',  zIndex:'999', backgroundColor: temaActual ? '#ffffff' : '#1B1B1B', display:mostrarFechaInicio ? 'block' : 'none'}}>
                                            <DayPicker
                                                mode="single"
                                                selected={popUpVideollamada.fecha_inicio}
                                                onSelect={handleVideollamada.fecha_inicio} 
                                                locale={es}                       
                                            />
                                        </div>
                                        {erroresCampos['fecha_hora_inicio'].length > 0 && (<SpamError mensaje={erroresCampos['fecha_hora_inicio']} />)}
                                    </div>
                                </div>  

                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Minutos de duración</label>                                              
                                        <select 
                                                onChange={handleVideollamada.cantidad_minutos} 
                                                style={{ height: '50px' }} 
                                                value={popUpVideollamada.cantidad_minutos} 
                                                name="cantidad_minutos" 
                                                className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}
                                        >
                                            <option value={-1}> -- Seleccione -- </option>
                                            <option value={15}>15 minutos</option>
                                            <option value={30}>30 minutos</option>
                                            <option value={45}>45 minutos</option>
                                            <option value={60}>60 minutos</option>
                                            <option value={75}>75 minutos</option>
                                            <option value={90}>90 minutos</option>
                                            <option value={105}>105 minutos</option>
                                            <option value={120}>120 minutos</option>
                                        </select>
                                        {erroresCampos['cantidad_minutos'].length > 0 && (<SpamError mensaje={erroresCampos['cantidad_minutos']} />)}
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Url</label>
                                        <textarea value={popUpVideollamada.url} onChange={handleVideollamada.url} className="form-control form--control user-text-editor pl-3" name="url" ></textarea>
                                        {erroresCampos['url'].length > 0 && (<SpamError mensaje={erroresCampos['url']} />)}
                                    </div>
                                </div> 
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Url Grabación</label>
                                        <textarea value={popUpVideollamada.url_grabacion} onChange={handleVideollamada.url_grabacion} className="form-control form--control user-text-editor pl-3" name="url_grabacion" ></textarea>
                                        {erroresCampos['url_grabacion'].length > 0 && (<SpamError mensaje={erroresCampos['url_grabacion']} />)}
                                    </div>
                                </div> 
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <button type="button" className="btn theme-btn mb-2" onClick={handleVideollamada.save} >{popUpVideollamada.id_editando != -1 ? 'Guardar' : 'Crear'}</button>                             
                                        {popUpVideollamada.id_editando != -1 ? <>&nbsp;<button type="button" className="btn theme-btn mb-2" onClick={handleVideollamada.delete} >Eliminar</button></>: ''}
                                        &nbsp;<button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={()=>{ setPopupVideollamada({...popUpVideollamada, formulario:'listado', id_editando:-1}); }}>Volver</button>
                                    </div>
                                </div>
                            </>
                        :   <>
                                <div className="table-responsive">                                    
                                    <table className="table generic-table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="px-3">Fecha hora inicio</th>
                                                <th scope="col" className="px-3">Cantidad minutos</th>
                                                <th scope="col" className="px-3">Url grabación</th>
                                                <th scope="col" className="px-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {todas.map((videollamada) =>
                                                <tr key={`videollamada_${videollamada.id}`} className="px-3">
                                                    <td>{videollamada.fecha_hora_inicio}</td>
                                                    <td>{videollamada.cantidad_minutos}</td>
                                                    <td>{videollamada.url_grabacion ? <span style={{cursor:'pointer'}} onClick={() => window.open(videollamada.url_grabacion, '_blank')}>{videollamada.url_grabacion}</span>: 'No tiene'}</td>
                                                    <td>{es_docente ?  <div onClick={()=>{ setPopupVideollamada({...popUpVideollamada, formulario:'crear-editar', id_editando:videollamada.id});}} className="icon-element icon-element-sm shadow-sm cursor-pointer m-1 text-secondary" data-toggle="tooltip" data-placement="top" title="Editar Videollamada"><span data-toggle="modal" data-target="#resourceVideollamada" className="w-100 h-100 d-inline-block"><i className="la la-cog"></i></span></div> : ''}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {es_docente ? <button type="button" className="btn theme-btn mb-2" onClick={()=>{ setPopupVideollamada({...popUpVideollamada, formulario:'crear-editar', id_editando:-1, fecha_hora_inicio:'', cantidad_minutos:-1, url:'', url_grabacion:'', fecha_inicio:today, hora_inicio:'', minuto_inicio:''}); }} >Crear</button> : ''}
                            </>
                        }
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={handleVideollamada.close}> Cerrar </button>
                    </div>
                </div>
            </div>
        </div>        
        </>
    )
}
