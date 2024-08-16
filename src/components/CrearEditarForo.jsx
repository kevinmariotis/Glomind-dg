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

export default function CrearEditarForo({funcionMostrarPopUp, id_curso, id_categoria, id_foro=-1}) {

    const today = new Date();

    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, permissions, esMovil, temaActual} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});                        
    const [datos, setDatos] = useState({mostrar:true, nombre:'', descripcion:'', fecha_hora_inicio:'', fecha_inicio:today, hora_inicio:'', minuto_inicio:'', fecha_hora_fin:'', fecha_fin:today, hora_fin:'', minuto_fin:'', modo_calificacion:0, porcentaje_en_total_curso:-1, id_curso:-1, id_categoria: -1, mostrar_fecha_inicio:false, mostrar_fecha_fin:false, });
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    

    const [mostrarFechaInicio, setMostrarFechaInicio] = useState(false);    
    const [mostrarFechaFin, setMostrarFechaFin] = useState(false);    
    
    useEffect(() => {        
        if(id_foro!=-1){
            handleObjeto.get();
        }        
    }, [id_foro]);
            
    useEffect(() => {        
        document.addEventListener('click', handleObjeto.hideSelects);
        return () => {
            document.removeEventListener('click', handleObjeto.hideSelects);
        };
    }, []);

    //Estados de los errores de campos
    const camposErrores = {                        
        'nombre':[],
        'descripcion':[],
        'fecha_hora_inicio':[],
        'fecha_inicio':[],
        'hora_inicio':[],
        'minuto_inicio':[],
        'fecha_hora_fin':[],        
        'fecha_fin':[],
        'hora_fin':[],
        'minuto_fin':[],
        'modo_calificacion':[],
        'porcentaje_en_total_curso':[],
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
        nombre        : (event) => { setDatos({...datos, nombre:event.target.value});  },
        descripcion   : (event) => { setDatos({...datos, descripcion:event.target.value});  },
        fecha_hora_inicio   : (event) => { setDatos({...datos, fecha_hora_inicio:event.target.value});  },
        fecha_inicio   : (fecha_establecer) => { setDatos({...datos, fecha_inicio:fecha_establecer});  },
        hora_inicio   : (event) => { setDatos({...datos, hora_inicio:event.target.value});  },
        minuto_inicio   : (event) => { setDatos({...datos, minuto_inicio:event.target.value});  },
        fecha_hora_fin   : (event) => { setDatos({...datos, fecha_hora_fin:event.target.value});  },        
        fecha_fin   : (fecha_establecer) => { setDatos({...datos, fecha_fin:fecha_establecer});  },
        hora_fin   : (event) => { setDatos({...datos, hora_fin:event.target.value});  },
        minuto_fin   : (event) => { setDatos({...datos, minuto_fin:event.target.value});  },
        modo_calificacion   : (event) => { setDatos({...datos, modo_calificacion:event.target.value});  },
        porcentaje_en_total_curso   : (event) => { setDatos({...datos, porcentaje_en_total_curso:event.target.value});  },
        show          : (event) => { 

            setDatos({...datos, mostrar: 1})

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
                const response = await fetch(`${urlBaseApi}/api/foro/${id_foro}/${id_curso}`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();   
                    
                    const partes_inicio = datos.fecha_hora_inicio.split(" ");
                    const partes_inicio2 = partes_inicio[0].split("-"); 
                    const partes_inicio_hora = partes_inicio[1].split(":");
                    
                    const partes_fin = datos.fecha_hora_fin.split(" ");
                    const partes_fin2 = partes_fin[0].split("-");
                    const partes_fin_hora = partes_fin[1].split(":");

                    const modo_calificacion = datos.modo_calificacion==1  ? 'mas_alta' : 'promedio';

                    setDatos({...datos, fecha_inicio:new Date(partes_inicio2[0], partes_inicio2[1]-1, partes_inicio2[2]), hora_inicio:partes_inicio_hora[0], minuto_inicio:partes_inicio_hora[1], fecha_fin:new Date(partes_fin2[0], partes_fin2[1]-1, partes_fin2[2]), hora_fin:partes_fin_hora[0], minuto_fin:partes_fin_hora[1], nombre:datos.nombre, descripcion:datos.descripcion, fecha_hora_inicio:datos.fecha_hora_inicio, fecha_hora_fin:datos.fecha_hora_fin, modo_calificacion:modo_calificacion, porcentaje_en_total_curso:datos.porcentaje_en_total_curso});
                                        
                } else {      
                    const data = await response.json();          
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
                }
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        },
        toogleMostrarFechaInicio : (event) => {
            setMostrarFechaInicio(!mostrarFechaInicio);
            //setDatos({...datos, mostrar_fecha_inicio:!datos.mostrar_fecha_inicio});            
        },
        toogleMostrarFechaFin : (event) => {
            setMostrarFechaFin(!mostrarFechaFin);
            //setDatos({...datos, mostrar_fecha_fin:!datos.mostrar_fecha_fin});
        },
        hideSelects : (event) => {            
            if(event.target.name===undefined){
                console.log("ejecutandso");
                //setDatos({...datos, mostrar_fecha_inicio:false, mostrar_fecha_fin:false});                
                setMostrarFechaInicio(false);
                setMostrarFechaFin(false);
            }
        },
        save          : async (event) => {

            reiniciarErrorCampoGlobal();
                        
            if(id_foro != -1){                
                
                let resRowData = {
                    nombre      : datos.nombre,
                    descripcion : datos.descripcion,
                    fecha_hora_inicio : format(datos.fecha_inicio, 'yyyy-MM-dd')+' '+datos.hora_inicio+':'+datos.minuto_inicio+':00',
                    fecha_hora_fin : format(datos.fecha_fin, 'yyyy-MM-dd')+' '+datos.hora_fin+':'+datos.minuto_fin+':00',
                    modo_calificacion: datos.modo_calificacion,
                    id_curso : id_curso,
                    porcentaje_en_total_curso : datos.porcentaje_en_total_curso
                };
                                                                    
                const opcionesData = {   
                    method: 'PUT',
                    headers: {
                        'Authorization' : `Bearer ${jwt}`
                    },
                    body: JSON.stringify(resRowData)
                };
    
                setMostrarSpinner(true);                                                
                const responseRaw = await fetch(`${urlBaseApi}/api/foro/${id_foro}`, opcionesData);
                if (responseRaw.ok){                                            
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Foro guardado.', data_switch:'cerrar_ventana'});
                } else {
                    const datos = await responseRaw.json();
                    mensajesDeError(setPopup, responseRaw.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                }
                setMostrarSpinner(false);                
                                
            }else{
                                                                
                const resData = new FormData(); 
                resData.append('nombre', datos.nombre);   
                resData.append('descripcion', datos.descripcion);
                resData.append('fecha_hora_inicio', format(datos.fecha_inicio, 'yyyy-MM-dd')+' '+datos.hora_inicio+':'+datos.minuto_inicio+':00');
                resData.append('fecha_hora_fin', format(datos.fecha_fin, 'yyyy-MM-dd')+' '+datos.hora_fin+':'+datos.minuto_fin+':00');
                resData.append('modo_calificacion', datos.modo_calificacion);
                resData.append('porcentaje_en_total_curso', datos.porcentaje_en_total_curso);
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
                const response = await fetch(`${urlBaseApi}/api/foro`, opciones);                
                setMostrarSpinner(false);
                if (response.ok){                                            
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Foro creado.', data_switch:'cerrar_ventana'});
                    return;
                } else {
                    const datos = await response.json();
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                }       
            }            
        }   
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
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="tagModalTitle">{id_foro!=-1 ? 'Editar foro' : 'Crear foro' }</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="col-lg-12">
                            <div className="form-group">    
                                <label className="label-text">Nombre</label>                                                                    
                                <input value={datos.nombre} onChange={handleObjeto.nombre} className="form-control form--control pl-3" type="text" name="nombre" maxLength="64" placeholder="Ej: Plantilla para cálculos" />
                                {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}                            
                            </div>
                        </div>    
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text">Descripción</label>
                                <textarea value={datos.descripcion} onChange={handleObjeto.descripcion} className="form-control form--control user-text-editor pl-3" name="descripcion" ></textarea>
                                {erroresCampos['descripcion'].length > 0 && (<SpamError mensaje={erroresCampos['descripcion']} />)}
                            </div>
                        </div> 
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text" style={{'display':'block'}}>Fecha de inicio</label>                                        
                                <input onClick={handleObjeto.toogleMostrarFechaInicio} value={format(datos.fecha_inicio, 'yyyy-MM-dd')} style={{width:'50%', float:'left'}} readOnly className="form-control form--control pl-3" type="text" name="fecha_inicio" maxLength="64" placeholder="" />
                                <select onChange={handleObjeto.hora_inicio} style={{width:'25%', height:'50px', float:'left'}} value={datos.hora_inicio} name="hora_inicio" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                    <option value=""> -- Hora --</option>   
                                    {horas.map((hora) => (
                                        <option key={`h-inicio-${hora}`} value={hora.toString().padStart(2, '0')}>
                                            {hora.toString().padStart(2, '0')}
                                        </option>
                                    ))}                                                                                     
                                </select>
                                <select onChange={handleObjeto.minuto_inicio} style={{width:'25%', height:'50px'}} value={datos.minuto_inicio} name="minuto_inicio" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
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
                                        selected={datos.fecha_inicio}
                                        onSelect={handleObjeto.fecha_inicio} 
                                        locale={es}                       
                                    />
                                </div>
                                {erroresCampos['fecha_hora_inicio'].length > 0 && (<SpamError mensaje={erroresCampos['fecha_hora_inicio']} />)}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text" style={{'display':'block'}}>Fecha de finalización</label>                                        
                                <input onClick={handleObjeto.toogleMostrarFechaFin} value={format(datos.fecha_fin, 'yyyy-MM-dd')} style={{width:'50%', float:'left'}} readOnly className="form-control form--control pl-3" type="text" name="fecha_fin" maxLength="64" placeholder="" />
                                <select onChange={handleObjeto.hora_fin} style={{width:'25%', height:'50px', float:'left'}} value={datos.hora_fin} name="hora_fin" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                    <option value=""> -- Hora --</option>   
                                    {horas.map((hora) => (
                                        <option key={`h-fin-${hora}`} value={hora.toString().padStart(2, '0')}>
                                            {hora.toString().padStart(2, '0')}
                                        </option>
                                    ))}                                                                                     
                                </select>
                                <select onChange={handleObjeto.minuto_fin} style={{width:'25%', height:'50px'}} value={datos.minuto_fin} name="minuto_fin" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                    <option value=""> -- Minuto --</option>                                                                                        
                                    {minutos.map((minuto) => (
                                        <option key={`m-fin-${minuto}`} value={minuto.toString().padStart(2, '0')}>
                                            {minuto.toString().padStart(2, '0')}
                                        </option>
                                    ))}
                                </select>                                        
                                <div style={{position:'absolute',  zIndex:'999', backgroundColor: temaActual ? '#ffffff' : '#1B1B1B', display:mostrarFechaFin ? 'block' : 'none'}}>
                                    <DayPicker
                                        mode="single"
                                        selected={datos.fecha_fin}
                                        onSelect={handleObjeto.fecha_fin} 
                                        locale={es}                       
                                    />
                                </div>
                                {erroresCampos['fecha_hora_fin'].length > 0 && (<SpamError mensaje={erroresCampos['fecha_hora_fin']} />)}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text">Modo calificación</label>                                              
                                <select onChange={handleObjeto.modo_calificacion} style={{height:'50px'}} value={datos.modo_calificacion} name="modo_calificacion" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                    <option value={0}> -- Seleccione --</option>
                                    <option value="promedio">Promedio de calificaciones</option>
                                    <option value="mas_alta">Calificación más alta</option>                                    
                                </select>
                                {erroresCampos['modo_calificacion'].length > 0 && (<SpamError mensaje={erroresCampos['modo_calificacion']} />)}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="label-text">Porcentaje en total del curso</label>
                                <select onChange={handleObjeto.porcentaje_en_total_curso} value={datos.porcentaje_en_total_curso} name="porcentaje_en_total_curso" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                    <option value={-1}> -- Seleccione --</option>                                            
                                    {porcentaje_en_total_curso.map((number) => (
                                        <option key={number} value={number}>
                                            {number} %
                                        </option>
                                    ))}                                            
                                </select>
                                {erroresCampos['porcentaje_en_total_curso'].length > 0 && (<SpamError mensaje={erroresCampos['porcentaje_en_total_curso']} />)}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-top-gray">
                        <button type="button" className="btn theme-btn mb-2" onClick={handleObjeto.save} >{id_foro != -1 ? 'Guardar' : 'Crear'}</button>                             
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={handleObjeto.close}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>        
        </>
    )
}
