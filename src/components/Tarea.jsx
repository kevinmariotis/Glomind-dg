import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import Skeleton from 'react-loading-skeleton'

export default function Tarea({id_contenido, id_curso, es_docente}) {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, permissions, esMovil} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});                        
    const [popUpObjeto, setPopupObjeto] = useState({mostrar:true, id:-1, consumo_estado:0, consumo_puntuacion:-1, nombre:'', descripcion:'',  fecha_hora_inicio:'', fecha_hora_fin:'', reenviar_post_calificacion:0, permitir_enviar:'no', id_curso:-1, id_categoria: -1});
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
        
    const [entregas, setEntregas] = useState([]);    //Se cargan el listado de todas las entregas    
    const [totalEntregas, setTotalEntregas] = useState(0);
    const [paginaNavegacion, setPaginaNavegacion] = useState(1);  

    const [idEntregaViendo, setIdEntregaViendo] = useState(-1);    //El id de la entrega que se está viendo.
    const [entregaViendo, setEntregaViendo] = useState({});         //La entrega que se está viendo

    const [idTarea, setIdTarea] = useState(-1);
    
    useEffect(() => {
        if(id_contenido!=-1){
            handleObjeto.get();
        }
    }, [id_contenido]);

    useEffect(() => {
        if(idEntregaViendo!=-1){
            handleEntrega.get();
            reiniciarErrorCampoGlobal();
        }
    }, [idEntregaViendo]);
           
    //Estados de los errores de campos
    const camposErrores = {                        
        'calificacion':[],
        'retroalimentacion':[],
        'archivo':[],
        'id_tarea_entrega':[],
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
        //setErrorCampo(erroresCampos);
    };
                
    const handleFuncionAceptarPopUp = () => {        
        switch(popUp.data_switch){
            case 'cerrar_ventana':
                handleObjeto.close();
            break;
            case 'eliminar_tarea_entrega':
                handleEntrega.delete(popUp.data_id);
            break;
            case 'volver_a_entregas':
                handleEntrega.close();
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
    
    const handleEntrega = {
        calificacion : (event) => { setEntregaViendo({...entregaViendo, calificacion:event.target.value});  },
        retroalimentacion: (event) => { setEntregaViendo({...entregaViendo, retroalimentacion:event.target.value}); },
        close : (event) => { 
            setIdEntregaViendo(-1);
            setEntregaViendo({});
            handleObjeto.getEnvios();
        },        
        get : async (event) =>{
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try {               
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                //setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/tareaentrega/${idEntregaViendo}`, opciones);
                //setMostrarSpinner(false);
                if (response.ok){
                    const datos = await response.json();       
                    datos.calificacion = '';
                    datos.retroalimentacion = datos.retroalimentacion==null ? '' : datos.retroalimentacion;
                    setEntregaViendo(datos);
                } else {      
                    const data = await response.json();
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});
                }
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        },
        create : async (event) => {
            let file = document.querySelector('input[name=archivoEntrega]').files[0];  
            
            if(!file){
                setErrorCampoGlobal('archivo', 'Por favor adjunte un archivo.');
                return;
            }

            const resData = new FormData();             
            resData.append('id_tarea', idTarea);
            resData.append('archivo', file);
                        
            const opciones = {   
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: resData
            };

            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/tareaentrega`, opciones);                
            setMostrarSpinner(false);
            if (response.ok){                                            
                setPopup({mostrar:true, titulo:'Listo', contenido:'Su tarea fue entregada.'});
                handleObjeto.getEnvios();
                return;
            } else {
                const datos = await response.json();
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            }       

        },
        save : async (event) => {

            reiniciarErrorCampoGlobal();
                                                                    
            let resRowData = {
                calificacion      : entregaViendo.calificacion,
                retroalimentacion : entregaViendo.retroalimentacion,                
                id_curso : id_curso.toString(),
            };
                        
            const opcionesData = {   
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: JSON.stringify(resRowData)
            };
            
            //setMostrarSpinner(true);
            const responseRaw = await fetch(`${urlBaseApi}/api/tareaentrega/${idEntregaViendo}`, opcionesData);            
            if (responseRaw.ok){                                                                                
                //setMostrarSpinner(false);
                setPopup({mostrar:true, titulo:'Listo', contenido:'Entrega calificada.', data_switch:'volver_a_entregas'});                                
            } else {
                const datos = await responseRaw.json();
                mensajesDeError(setPopup, responseRaw.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                //setMostrarSpinner(false);
                return;
            }                                                                                                
        },
        delete : async (id_tarea_entrega) =>{
            //setMostrarSpinner(true);        
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try {            
                const opciones = {
                    method: 'DELETE',
                    headers: headers,
                };            
                const response = await fetch(`${urlBaseApi}/api/tareaentrega/${id_tarea_entrega}/${id_curso}`, opciones);            
                //setMostrarSpinner(false);            
                const datos = await response.json();
                if (response.ok){ 
                    handleObjeto.getEnvios();
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Entrega invalidada.'});
                } else {                     
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});
                }     
                        
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        },
    }

    const handleObjeto = {                
        get : async (event) =>{
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try {               
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                //setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/cursocontenido/${id_contenido}`, opciones);
                //setMostrarSpinner(false);
                if (response.ok){
                    const datos = await response.json();       
                    if(datos.tipo_contenido==5){                              
                        setPopupObjeto({...popUpObjeto, 
                            id: datos.id,
                            consumo_estado:datos.consumo_estado, 
                            consumo_puntuacion: datos.consumo_puntuacion,                        
                            nombre:datos.nombre, 
                            descripcion:datos.descripcion.replace(/<br\s*\/?>/gi,'\n'),                            
                            fecha_hora_inicio:datos.fecha_hora_inicio, 
                            fecha_hora_fin:datos.fecha_hora_fin, 
                            reenviar_post_calificacion:datos.reenviar_post_calificacion,
                            permitir_enviar:datos.permitir_enviar
                        });  
                        handleObjeto.getEnvios(datos.id);   
                        setIdTarea(datos.id);                   
                    }else{
                        return;
                    }
                } else {      
                    const data = await response.json();
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});
                }
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        },
        getEnvios : async (id_tarea_obtener=-1) =>{
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try {               
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                //setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/tarea/getEnvios/${id_tarea_obtener!=-1 ? id_tarea_obtener : idTarea}/${paginaNavegacion}/tarea_entrega.fecha_hora_entrega-asc/filter_by_id_tarea=0`, opciones);
                //setMostrarSpinner(false);
                if (response.ok){
                    const datos = await response.json();       
                    setEntregas(datos.items);
                    setTotalEntregas(datos.total_items);
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

    const handleEliminarEntrega = (id_tarea_entrega) => {        
        setPopup({...popUp, mostrar:true, tipo:3, titulo:'Confirmar?', contenido:'Confirma que desea invalidar la entrega?', data_switch:'eliminar_tarea_entrega', data_id:id_tarea_entrega, data_id_2:-1});
    };
    
    const abrirArchivoEnNuevaPestana = (ruta_archivo) => {        
        const rutaCorregida = ruta_archivo.replace('public/', '');
        const urlCompleta = urlBaseApi + '/' + rutaCorregida;      
        window.open(urlCompleta, '_blank');
    };

    const handleItemClick = async (item) => {                
        const parts = item.ruta_archivo.split("public/");      
        const url = `${urlBaseApi}/${parts[1]}`;
        
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `tarea_${item.id_tarea}_${item.nombres} ${item.apellidos}.${item.ruta_archivo.split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setPopup({mostrar:true, titulo:'Mensaje', contenido:'El archivo está siendo descargado, por favor revise su carpeta de descargas.'});
    };

    const mentajesNoEnvio = {
        'fuera-de-tiempo' : 'No es posible enviar la tarea por estar por fuera del rango de tiempo establecido.',
        'tarea-pendiente-por-calificar' : 'Tienes un envío pendiente por calificar.',
        'no-mas-envios' : 'No se te permiten más envíos.',
        'no' : 'No es posible enviar la tarea en este momento.',
    }

    const estadoTarea = {
        '1' : 'Entregada.',
        '2' : 'Calificada',
        '3' : 'Invalidada',        
    }

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
        {popUpObjeto.id=-1 ? 
        <>
            <div className="pt-60px pb-60px">
                <div className="container">                    
                    <div className="breadcrumb-content pt-40px ">
                        <div className="section-heading">
                            <h2 className="section__title fs-30 pb-2"><i className="la la-pencil-square-o mr-2"></i>{popUpObjeto.nombre}</h2>
                            {popUpObjeto.descripcion=='' ? 
                                <>
                                    <Skeleton width={'60%'} height={20} />
                                    <Skeleton width={'55%'} height={20}  />
                                    <Skeleton width={'45%'} height={20}  />
                                </>
                                : <p className="section__desc">{popUpObjeto.descripcion.split('<br />').map((line, index) => (<span key={`description-e-${index}`}>{line}<br /></span> ))}</p>
                            }
                        </div>                            
                    </div>
                </div>                
            </div>  
            {!es_docente ?
                <>
                  <div className="pt-60px pb-60px">
                        <div className="container">                    
                            <div className="breadcrumb-content pt-40px text-center">
                                <div className="section-heading">                                    
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            {popUpObjeto.permitir_enviar=='si' ?
                                                <>
                                                    <label className="label-text"><p className="section__desc pb-2">Subir entrega</p></label>
                                                    <input type="file" name="archivoEntrega" className="form-control form--control user-text-editor pl-3"></input>
                                                    {erroresCampos['archivo'].length > 0 && (<SpamError mensaje={erroresCampos['archivo']} />)}
                                                </>
                                            : <label className="label-text"><p className="section__desc pb-2">{mentajesNoEnvio[popUpObjeto.permitir_enviar]}</p></label>}
                                        </div>
                                    </div> 
                                    {popUpObjeto.permitir_enviar=='si' && <div className="col-lg-12">
                                        <button type="button" className="btn theme-btn mb-2" onClick={handleEntrega.create} >Enviar archivo</button> 
                                    </div>}
                                </div>                            
                            </div>
                        </div>
                    </div> 
                </>
            : ''}
            {idEntregaViendo==-1 ?  
            <>
                <div className="bg-dark pt-60px pb-60px">
                    <div className="container">                        
                        <div className="row">
                            <div className="col-lg-4 responsive-column-half">
                                <div className="quiz-result-content text-center">
                                    <p className="section__desc text-white-50 pb-2">Entregas</p>
                                    <h2 className="section__title text-white">{totalEntregas}</h2>
                                </div>
                            </div>
                            <div className="col-lg-4 responsive-column-half">
                                <div className="quiz-result-content text-center">
                                    <p className="section__desc text-white-50 pb-2">Fecha hora inicio</p>
                                    <h2 className="section__title text-white">{popUpObjeto.fecha_hora_inicio}</h2>
                                </div>
                            </div>
                            <div className="col-lg-4 responsive-column-half">
                                <div className="quiz-result-content text-center">
                                    <p className="section__desc text-white-50 pb-2">Fecha hora finalización</p>
                                    <h2 className="section__title text-white">{popUpObjeto.fecha_hora_fin}</h2>
                                </div>
                            </div>                        
                        </div>
                    </div>
                </div> 
                <div className="pt-60px pb-60px">
                    <div className="container">                    
                        <div className="breadcrumb-content pt-40px text-center">
                            <div className="section-heading">                                    
                                <div className="col-lg-12"></div>
                                    {Object.keys(entregas).length>0 ?
                                    <div className="table-responsive mb-5">                    
                                        <table className="table generic-table">
                                            <thead>
                                            <tr>                            
                                                <th scope="col"></th>
                                                <th scope="col">Nombres y apellidos</th>
                                                <th scope="col">Fecha hora entrega</th>
                                                <th scope="col">Calificación</th>                        
                                                <th scope="col">Archivo</th>
                                                <th scope="col"></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(entregas).map((key) => (
                                                    <tr key={`entrega-${entregas[key].id}`}>                                    
                                                        <td>
                                                            <div className="media media-card  pb-2 mb-2" >
                                                                <div className="media-img mr-4 rounded-full">
                                                                    <img className="rounded-full lazy" src={entregas[key].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${entregas[key].imagen_pequena}`} data-src={`${urlBase}/images/avatar_docente.jpg`} alt="User image" />
                                                                </div>
                                                            </div>                                                            
                                                        </td>
                                                        <td>
                                                            {entregas[key].nombres} {entregas[key].apellidos}
                                                        </td>
                                                        <td>
                                                            {entregas[key].fecha_hora_entrega}
                                                        </td>
                                                        <td>
                                                            {entregas[key].estado!=2 ? estadoTarea[entregas[key].estado] : entregas[key].calificacion}                                                            
                                                        </td>
                                                        <td>
                                                            {es_docente ?
                                                                entregas[key].estado==1 ? <button key={`calificar-${entregas[key].id}`} className="btn theme-btn" onClick={(event) => { event.preventDefault(); setIdEntregaViendo(entregas[key].id); }}> Calificar</button> : ''
                                                                    :
                                                                <button key={`descargable-${entregas[key].id}`} className="btn theme-btn" onClick={(event) => { event.preventDefault(); handleItemClick(entregas[key]); }}><i className="la la-download"></i> Descargar</button>
                                                            }
                                                        </td>                                
                                                        <td>                                    
                                                            {permissions[93] && entregas[key].estado!=3 ? <div onClick={()=>{ handleEliminarEntrega(entregas[key].id); }}  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Delete">
                                                                <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                                            </div>: ''}
                                                        </td>
                                                    </tr>
                                                ))}                        
                                            </tbody>
                                        </table>
                                        <Paginador elemetosTotales={totalEntregas} elementosPorPagina={20} paginaActual={paginaNavegacion} callbackCambioPagina={setPaginaNavegacion} />
                                    </div>
                                    : <p className="section__desc pb-2">No hay entregas</p>}
                                </div>
                            </div>
                        </div>
                    </div>
            </>
            : 
                entregaViendo.id && es_docente ?
                    <>   
                    <div className="pt-60px pb-60px">
                        <div className="container">
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <label className="label-text">Archivo</label><br/>
                                    <button key={`descargable-x-${entregaViendo.id}`} className="btn theme-btn" onClick={(event) => { event.preventDefault(); }}><i className="la la-download"></i> Descargar</button>
                                </div>
                            </div> 
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <label className="label-text">Retroalimentación</label>
                                    <textarea value={entregaViendo.retroalimentacion} onChange={handleEntrega.retroalimentacion} className="form-control form--control user-text-editor pl-3" name="retroalimentacion" ></textarea>
                                    {erroresCampos['retroalimentacion'].length > 0 && (<SpamError mensaje={erroresCampos['retroalimentacion']} />)}
                                </div>
                            </div> 
                            <div className="col-lg-6">
                                <div className="form-group">    
                                    <label className="label-text">Calificación</label>                                                                    
                                    <input value={entregaViendo.calificacion} onChange={handleEntrega.calificacion} className="form-control form--control pl-3" type="text" name="calificacion" maxLength="3" placeholder="Ej: 3.4" />
                                    {erroresCampos['calificacion'].length > 0 && (<SpamError mensaje={erroresCampos['calificacion']} />)}
                                </div>
                            </div>
                            <div className="modal-footer ">
                                <button type="button" className="btn theme-btn mb-2" onClick={handleEntrega.save} >{id_contenido != -1 ? 'Guardar' : 'Crear'}</button>                             
                                <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={handleEntrega.close}> Volver </button>
                            </div>
                        </div>
                    </div>
                    </>
                : 'Espere'
            }                            
        </>
        : ''}   
        </>
    )
}
