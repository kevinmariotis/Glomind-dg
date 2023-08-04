import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError, calcularSegundosDeHorasMinutos, convertirSegundosAHorasMinutosSegundos } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioCrearExamenPreguntaSmur() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const navigate = useNavigate(); 
    const {jwt, permissions} = useContext(AuthContext);
    const { id, id_curso } = useParams();
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});                    

    const [pregunta, setPregunta] = useState('');    
    const [agrupacion, setAgrupacion] = useState(-1);    
    const [opciones, setOpciones] = useState([
        { respuesta: '', porcentaje: -1 },
        { respuesta: '', porcentaje: -1 },
        { respuesta: '', porcentaje: -1 },
    ]);        
    
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
        'id_agrupacion':[], 
        'pregunta_opcion.0':[], 
        'pregunta_opcion.1':[], 
        'pregunta_opcion.2':[], 
        'pregunta_opcion.3':[], 
        'pregunta_opcion.4':[], 
        'pregunta_opcion.5':[], 
        'pregunta_opcion.6':[], 
        'pregunta_opcion.7':[], 
        'pregunta_opcion.8':[], 
        'pregunta_opcion.9':[], 
        'pregunta_opcion.10':[], 
        'pregunta_opcion.11':[], 
        'pregunta_opcion.12':[], 
        'pregunta_opcion.13':[], 
        'pregunta_opcion.14':[], 
        'pregunta_opcion.15':[], 
        'porcentaje_opcion.0':[], 
        'porcentaje_opcion.1':[], 
        'porcentaje_opcion.2':[], 
        'porcentaje_opcion.3':[], 
        'porcentaje_opcion.4':[], 
        'porcentaje_opcion.5':[], 
        'porcentaje_opcion.6':[], 
        'porcentaje_opcion.7':[], 
        'porcentaje_opcion.8':[], 
        'porcentaje_opcion.9':[], 
        'porcentaje_opcion.10':[], 
        'porcentaje_opcion.11':[], 
        'porcentaje_opcion.12':[], 
        'porcentaje_opcion.13':[], 
        'porcentaje_opcion.14':[], 
        'porcentaje_opcion.15':[], 
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
            setOpciones([...opciones, { respuesta: '', porcentaje: -1 }]);
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
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleCrearPregunta = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
                
        const formData = new FormData();               
        formData.append('id_agrupacion', agrupacion);
        formData.append('tipo_pregunta', 1);
        formData.append('texto_pregunta', pregunta);

        opciones.forEach((item)=>{
            formData.append('pregunta_opcion[]', item.respuesta);
            formData.append('porcentaje_opcion[]', item.porcentaje);
        });
        
        const opcionesx = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/examenpregunta/crearpreguntacompleta/1`, opcionesx);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){   
                setPopup({mostrar:true, titulo:'Listo', contenido:'Pregunta creada correctamente.'});
                setOpciones([]);
                setPregunta([]);
                setAgrupacion(-1);                
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error al crear el examen', 'contenido': 'Revise los errores en el formulario.'});
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
                        &nbsp;<h3 className="fs-22 font-weight-semi-bold">Nueva pregunta de selección múltiple con única respuesta</h3>
                        <h5>&nbsp;|&nbsp;{nombreexamen}</h5>
                    </div>                                        
                    <div className="btn-box pt-30px">                                        
                        
                    </div>
                </div>                
                <form action="#">                      
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
                                            <option value="0"> -- Será una pregunta fija -- </option>
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
                                

                            </div>
                        </div>
                    </div> 
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Opciones</h3>
                            <div className="divider"><span></span></div>
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
                                            <label className="label-text">Porcentaje</label>                                        
                                            <select onChange={(e) => handlePorcentajeChange(index, e)} value={opcion.porcentaje} name={`porcentaje${index}`} className="form-control select-dark">
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
                        <button className="btn theme-btn" type="submit" onClick={handleCrearPregunta}>Crear pregunta</button>                        
                    </div>
                </form>
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioCrearExamenPreguntaSmur;