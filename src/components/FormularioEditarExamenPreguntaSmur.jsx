import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError, calcularSegundosDeHorasMinutos, convertirSegundosAHorasMinutosSegundos } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioEditarExamenPreguntaSmur() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const navigate = useNavigate(); 
    const {jwt, permissions, temaActual} = useContext(AuthContext);
    const { id, id_examen_pregunta, id_curso } = useParams();
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});                    
    
    const [pregunta, setPregunta] = useState('');    
    const [retroalimentacionAfirmativa, setRetroalimentacionAfirmativa] = useState('');    
    const [retroalimentacionNegativa, setRetroalimentacionNegativa] = useState('');     
    const [agrupacion, setAgrupacion] = useState(-1);    
    const [media, setMedia] = useState(null);
    const [estado, setEstado] = useState(0);        
    const [opciones, setOpciones] = useState([]);        
    const [idPreguntaFija, setIdPreguntaFija] = useState(0);        
    
    const [agrupaciones, setAgrupaciones] = useState({});        
    const [nombreexamen, setNombreExamen] = useState('');
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);  
        obtenerDatosServidor();         
    }, []);
                   
    //Estados de los errores de campos
    const camposErrores = {        
        'texto_pregunta':[],
        'texto_retro_afirmativa':[],
        'texto_retro_negativa':[],    
        'error_general':[],
        'id_agrupacion':[], 
        'estado':[], 
        'tipo_pregunta':[],         
        'id_examen_pregunta':[],
        'pregunta_opcion':[],         
        'archivo':[],         
    }    
    for (let i = 0; i <= 15; i++) {
        camposErrores[`pregunta_opcion.${i}`] = [];
        camposErrores[`porcentaje_opcion.${i}`] = [];
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
        
    const handlePreguntaChange = (event) => { setPregunta(event.target.value);    };  
    const handleRetroAfirmativaChange = (event) => { setRetroalimentacionAfirmativa(event.target.value);    };  
    const handleRetroNevativaChange = (event) => { setRetroalimentacionNegativa(event.target.value);    };  
    const handleAgrupacionChange = (event) => { setAgrupacion(event.target.value);    };      
    const handleEstadoChange = (event) => { setEstado(event.target.value);    };          

    const handleOpcionChange = (index, event) => {
        const newOptions = [...opciones];
        newOptions[index].respuesta = event.target.value;
        setOpciones(newOptions);
    };
    
    const handlePorcentajeChange = (index, event) => {
        const newOptions = [...opciones];
        newOptions[index].porcentaje = parseInt(event.target.value);
        setOpciones(newOptions);
    };


    const handleAgregarOpcion = (event) => {
        if(opciones.length<16){
            event.preventDefault();        
            setOpciones([...opciones, { id: 0, respuesta: '', porcentaje: -1 }]);
        }
    };

    const handleQuitarOpcion = (index) => {
        const newOptions = [...opciones];
        newOptions.splice(index, 1);
        setOpciones(newOptions);
    };
    
    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
     
    const obtenerDatosServidor = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {                        
            const opciones = {
                method: 'GET',
                headers: headers,
            };                        
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/examenpregunta/getFormularioCrear/${id}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){     
                setAgrupaciones(datos.agrupaciones);                
                setNombreExamen(datos.nombre_examen);
                                
                const response2 = await fetch(`${urlBaseApi}/api/examenpregunta/${id_examen_pregunta}`, opciones);
                setMostrarSpinner(false);
                const datos2 = await response2.json();   
                if (response.ok){
                      
                    if(datos2.pregunta.id_examen==id){
                        const desc_array = datos2.pregunta.texto_pregunta.split("<br />");
                        let desc = '';                
                        desc_array.forEach((element) => {
                            desc = (desc!='') ? desc+='\n'+element : desc=element;
                        });
                        setPregunta(desc);

                        const desc2_array = datos2.pregunta.texto_retro_afirmativa.split("<br />");
                        let desc2 = '';                
                        desc2_array.forEach((element) => {
                            desc2 = (desc2!='') ? desc2+='\n'+element : desc2=element;
                        });
                        setRetroalimentacionAfirmativa(desc2);

                        const desc3_array = datos2.pregunta.texto_retro_negativa.split("<br />");
                        let desc3 = '';                
                        desc3_array.forEach((element) => {
                            desc3 = (desc3!='') ? desc3+='\n'+element : desc3=element;
                        });
                        setRetroalimentacionNegativa(desc3);

                        setEstado(datos2.pregunta.estado);
                        if(datos2.pregunta.pregunta_fija==1){
                            setIdPreguntaFija(datos2.pregunta.id_agrupacion);                            
                        }else{
                            setIdPreguntaFija(0);
                        }
                        setAgrupacion(datos2.pregunta.id_agrupacion);                        
                        let nuevas_opciones = [];
                        datos2.opciones.forEach(function(element){     
                            const desc_array = element.texto_opcion.split("<br />");
                            desc = '';                
                            desc_array.forEach((element) => {
                                desc = (desc!='') ? desc+='\n'+element : desc=element;
                            });                   
                            nuevas_opciones.push({ id: element.id, respuesta: desc, porcentaje: element.porcentaje_puntuacion });
                        });
                        setOpciones(nuevas_opciones); 
                        
                        setMedia(datos2.pregunta.media);

                    }else{
                        setPopup({mostrar:true, titulo:'Error', contenido:'El examen no corresponde a la pregunta.'});
                    }
                }else{
                    mensajesDeError(setPopup, response2.status, (typeof datos2.datos !== 'undefined') ? datos2.datos : {}, false, {'titulo': '', 'contenido': ''});
                }    


            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleBorrarMedia = async (event) => {
        event.preventDefault();
        const opcionesArchivo = {   
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },            
        };
        setMostrarSpinner(true);
        const response = await fetch(`${urlBaseApi}/api/examenpregunta/borrarMedia/${id_examen_pregunta}`, opcionesArchivo);                    
        setMostrarSpinner(false);
        if (response.ok){                                                        
            setPopup({mostrar:true, titulo:'Listo', contenido:'Media borrado.'});
            obtenerDatosServidor();
        }else{            
            const datos = await response.json();
            mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            return;
        }
    }

    const handleEditarPregunta = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
        
        const raw = {
            'id_agrupacion': agrupacion.toString(),   
            'texto_pregunta': pregunta,
            'texto_retro_afirmativa': retroalimentacionAfirmativa,
            'texto_retro_negativa': retroalimentacionNegativa,
            'estado': estado,
        };
        if(agrupacion=='0'){
            raw.id_examen = id;            
        }
        if(typeof id_curso !== 'undefined'){
            raw.id_curso = id_curso;        
        }
        raw.id_opcion = opciones.map(item => item.id.toString());  
        raw.pregunta_opcion = opciones.map(item => item.respuesta);  
        raw.porcentaje_opcion = opciones.map(item => item.porcentaje);  
               
        const opcionesx = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/examenpregunta/editarpreguntacompleta/${id_examen_pregunta}${typeof id_curso !== 'undefined' ? `/${id_curso}` : ''}`, opcionesx);            
            const datos = await response.json();            
            if (response.ok){   

                //Actualizamos el archivo
                let file = document.querySelector('input[name=archivo]').files[0]; 
                if(file){
                    const resData = new FormData();                     
                    resData.append('archivo', file);
                    const opcionesArchivo = {   
                        method: 'POST',
                        headers: {
                            'Authorization' : `Bearer ${jwt}`
                        },
                        body: resData
                    };
                    const response = await fetch(`${urlBaseApi}/api/examenpregunta/actualizarMedia/${id_examen_pregunta}`, opcionesArchivo);                    
                    if (!response.ok){                                            
                        setMostrarSpinner(false);
                        const datos = await response.json();
                        mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                        return;
                    }
                }
                //Fin de actualizar el archivo

                setMostrarSpinner(false);
                obtenerDatosServidor();
                setPopup({mostrar:true, titulo:'Listo', contenido:'Pregunta guardada correctamente.'});                
                return;
            } else {
                setMostrarSpinner(false);
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error al editar el examen', 'contenido': 'Revise los errores en el formulario.'});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }

    }

    const renderMedia = () => {
        if (!media) {
          return <p>La pregunta no tiene media.</p>;
        }
        
        let processedMedia = media;
        if (media.startsWith("public/")) {
            processedMedia = `${urlBaseApi}/${media.replace("public/", "")}`;
        }            
        const fileExtension = processedMedia.split('.').pop().toLowerCase();
            
        if (['png', 'jpeg', 'jpg'].includes(fileExtension)) {
            return <img src={processedMedia} alt="Imagen" style={{ maxWidth: '300px' }} />;
        }
            
        if (fileExtension === 'mp4') {
            return (
                <video controls style={{ maxWidth: '100%' }}>
                    <source src={processedMedia} type="video/mp4" />
                    Tu navegador no soporta la reproducción de videos.
                </video>
            );
        }
            
        return (
            <a href={processedMedia} target="_blank" rel="noopener noreferrer">
                <button>Ver archivo en nueva pestaña</button>
            </a>
        );
    };

    const porcentajesx = Array.from({ length: 101 }, (_, index) => index);

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
        <div className="dashboard-content-wrap">
            <div className="container-fluid">
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">                
                    <div className="media media-card align-items-center">                        
                        {typeof id_curso !== 'undefined' ? <Link to={`/examen/huecopreguntas/${id}${typeof id_curso !== 'undefined' ? `/${id_curso}` : ''}`}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la edición de contenidos"><i className="la la-angle-left"></i></div></Link> : ''}                        
                        &nbsp;<h3 className="fs-22 font-weight-semi-bold">Editar pregunta de selección múltiple con única respuesta</h3>
                        <h5>&nbsp;|&nbsp;{nombreexamen}</h5>
                    </div>                                        
                    <div className="btn-box pt-30px">                                        
                        
                    </div>
                </div>                
                <form action="#">   
                    {erroresCampos['id_examen_pregunta'].length > 0 && (<SpamError mensaje={erroresCampos['id_examen_pregunta']} />)}                   
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">General</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">    
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">A que agrupación pertenecerá esta pregunta?</label>                                        
                                        <select onChange={handleAgrupacionChange} value={agrupacion} name="id_agrupacion" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value={idPreguntaFija}> -- Pregunta fija -- </option>
                                            {Object.keys(agrupaciones).map((key) => (
                                                <option key={`agru-sel-${agrupaciones[key].id}`} value={agrupaciones[key].id}>{agrupaciones[key].nombre}</option>
                                            ))}
                                        </select>
                                        {erroresCampos['id_agrupacion'].length > 0 && (<SpamError mensaje={erroresCampos['id_agrupacion']} />)}
                                    </div>
                                </div>                            
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Pregunta</label>
                                        <textarea onChange={handlePreguntaChange} value={pregunta} name="pregunta" className="form-control form--control user-text-editor pl-3" ></textarea>
                                        {erroresCampos['texto_pregunta'].length > 0 && (<SpamError mensaje={erroresCampos['texto_pregunta']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Retroalimentación al contestar correctramente</label>
                                        <textarea onChange={handleRetroAfirmativaChange} value={retroalimentacionAfirmativa} name="texto_retro_afirmativa" className="form-control form--control user-text-editor pl-3" ></textarea>
                                        {erroresCampos['texto_retro_afirmativa'].length > 0 && (<SpamError mensaje={erroresCampos['texto_retro_afirmativa']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Retroalimentación al contestar incorrectamente</label>
                                        <textarea onChange={handleRetroNevativaChange} value={retroalimentacionNegativa} name="texto_retro_negativa" className="form-control form--control user-text-editor pl-3" ></textarea>
                                        {erroresCampos['texto_retro_negativa'].length > 0 && (<SpamError mensaje={erroresCampos['texto_retro_negativa']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">                                        
                                    <label className="label-text" style={{display:'block'}}>Media Imagen (Opcional)</label>
                                        {renderMedia()}   
                                        {media!=null &&
                                            <button className="btn theme-btn" style={{marginLeft:'20px'}} type="button" onClick={handleBorrarMedia}><i className="la la-trash mr-2"></i> Borrar media</button>
                                        }                                     
                                        <input type="file" name="archivo" className="form-control form--control user-text-editor pl-3"></input>
                                        {erroresCampos['archivo'].length > 0 && (<SpamError mensaje={erroresCampos['archivo']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Estado</label>
                                        <select onChange={handleEstadoChange} value={estado} name="estado" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value="1">Activada</option>
                                            <option value="0">Desactivada</option>                                            
                                        </select>
                                        {erroresCampos['estado'].length > 0 && (<SpamError mensaje={erroresCampos['estado']} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Opciones</h3>
                            <div className="divider"><span></span></div>
                            {erroresCampos['error_general'].length > 0 && (<SpamError mensaje={erroresCampos['error_general']} />)}                      
                            {erroresCampos['pregunta_opcion'].length > 0 && (<SpamError mensaje={erroresCampos['pregunta_opcion']} />)}
                            {erroresCampos['tipo_pregunta'].length > 0 && (<SpamError mensaje={erroresCampos['tipo_pregunta']} />)}                            
                            {opciones.map((opcion, index) => (
                                <div className="row">    
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label className="label-text">Opción {index+1}</label>
                                            <textarea onChange={(e) => handleOpcionChange(index, e)} value={opcion.respuesta} name={`opcion${index}`} className="form-control form--control user-text-editor pl-3" ></textarea>
                                            {erroresCampos['pregunta_opcion.'+index].length > 0 && (<SpamError mensaje={erroresCampos['pregunta_opcion.'+index]} />)}
                                        </div>
                                    </div>                    
                                    <div className="col-lg-5">
                                        <div className="form-group">
                                            <label className="label-text">Calificación</label>                                        
                                            <select onChange={(e) => handlePorcentajeChange(index, e)} value={opcion.porcentaje} name={`porcentaje${index}`} className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                                <option value=""> -- Seleccione --</option>
                                                <option value="0">Incorrecta</option>
                                                <option value="100">Correcta</option>
                                            </select>
                                            {erroresCampos['porcentaje_opcion.'+index].length > 0 && (<SpamError mensaje={erroresCampos['porcentaje_opcion.'+index]} />)}
                                        </div>
                                    </div>  
                                    <div className="col-lg-1">
                                    <label className="label-text" style={{visibility:'hidden'}}>Quitar</label><br/>
                                        <div onClick={() => handleQuitarOpcion(index)} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Borrar">
                                            <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                        </div>      
                                    </div>
                                    
                                </div>
                            ))}
                            <button className="btn theme-btn" style={{marginTop:'20px'}} type="submit" onClick={handleAgregarOpcion}><i className="la la-plus mr-2"></i> Agregar opción</button>
                        </div>
                    </div>                   
                    <div className="course-submit-btn-box pb-4">                          
                        <button className="btn theme-btn" type="submit" onClick={handleEditarPregunta}>Guardar cambios</button>                                                
                    </div>
                </form>
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioEditarExamenPreguntaSmur;