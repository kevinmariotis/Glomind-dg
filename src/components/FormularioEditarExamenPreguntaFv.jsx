import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError, calcularSegundosDeHorasMinutos, convertirSegundosAHorasMinutosSegundos } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioEditarExamenPreguntaFv() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const navigate = useNavigate(); 
    const {jwt, permissions} = useContext(AuthContext);
    const { id, id_examen_pregunta, id_curso } = useParams();
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});                    
    
    const [pregunta, setPregunta] = useState('');    
    const [agrupacion, setAgrupacion] = useState(-1);    
    const [estado, setEstado] = useState(0);        
    const [falsoVerdadero, setFalsoVerdadero] = useState(-1);
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
        'error_general':[],
        'id_agrupacion':[], 
        'estado':[], 
        'tipo_pregunta':[],         
        'respuesta':[],    
        'id_examen_pregunta':[],    
    }        
    
    const [erroresCampos, setErrorCampo] = useState(camposErrores);
    const setErrorCampoGlobal = (index, newValue) => {
        if (index in erroresCampos) {
            const nuevoObjeto = erroresCampos[index].concat(newValue);            
            let objeto = erroresCampos;
            objeto[index] = nuevoObjeto;        
            setErrorCampo(objeto);      
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
    const handleAgrupacionChange = (event) => { setAgrupacion(event.target.value);    };      
    const handleFalsoVerdaderoChange = (event) => { setFalsoVerdadero(event.target.value);    };          
    const handleEstadoChange = (event) => { setEstado(event.target.value);    };              
        
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
                        setEstado(datos2.pregunta.estado);
                        if(datos2.pregunta.pregunta_fija==1){
                            setIdPreguntaFija(datos2.pregunta.id_agrupacion);                            
                        }else{
                            setIdPreguntaFija(0);
                        }
                        setAgrupacion(datos2.pregunta.id_agrupacion);                                                
                        datos2.opciones.forEach(function(element){    
                            if(element.porcentaje_puntuacion==100){
                                if(element.texto_opcion=='Falso'){
                                    setFalsoVerdadero(0);
                                }else{
                                    setFalsoVerdadero(1);
                                }
                            }                            
                        });                        
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

    const handleEditarPregunta = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
        
        const raw = {
            'id_agrupacion': agrupacion.toString(),   
            'texto_pregunta': pregunta,
            'respuesta': falsoVerdadero,
            'estado': estado,
        };
        if(agrupacion=='0'){
            raw.id_examen = id;            
        }
        if(typeof id_curso !== 'undefined'){
            raw.id_curso = id_curso;        
        }
                       
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
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){   
                obtenerDatosServidor();
                setPopup({mostrar:true, titulo:'Listo', contenido:'Pregunta guardada correctamente.'});                
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error al editar el examen', 'contenido': 'Revise los errores en el formulario.'});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }

    }

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
                        &nbsp;<h3 className="fs-22 font-weight-semi-bold">Editar pregunta de falso o verdadero</h3>
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
                                        <select onChange={handleAgrupacionChange} value={agrupacion} name="id_agrupacion" className="form-control select-dark">
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
                                        <label className="label-text">Falso o verdadero?</label>                                        
                                        <select onChange={handleFalsoVerdaderoChange} value={falsoVerdadero} name="respuesta" className="form-control select-dark">
                                            <option value={-1}> -- Seleccione --</option>
                                            <option value={0}>Falso</option>
                                            <option value={1}>Verdadero</option>                                            
                                        </select>
                                        {erroresCampos['respuesta'].length > 0 && (<SpamError mensaje={erroresCampos['respuesta']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Estado</label>
                                        <select onChange={handleEstadoChange} value={estado} name="estado" className="form-control select-dark">
                                            <option value="1">Activada</option>
                                            <option value="0">Desactivada</option>                                            
                                        </select>
                                        {erroresCampos['estado'].length > 0 && (<SpamError mensaje={erroresCampos['estado']} />)}
                                    </div>
                                </div>
                            </div>
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

export default FormularioEditarExamenPreguntaFv;