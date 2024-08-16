import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError, calcularSegundosDeHorasMinutos, convertirSegundosAHorasMinutosSegundos } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioEditarExamen() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const navigate = useNavigate(); 
    const {jwt, permissions, temaActual} = useContext(AuthContext);
    const { id, id_curso } = useParams();
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});                    

    const [nombre, setNombre] = useState('');    
    const [descripcion, setDescripcion] = useState('');
    const [dejarAvanzarSiFallido, setDejarAvanzarSiFallido] = useState('');    
    const [intentos, setIntentos] = useState(0);
    const [tipo, setTipo] = useState("");
    const [politicaDeRetroalimentacion, setPoliticaDeRetroalimentacion] = useState("");
    const [porcentajeEnTotalCurso, setPorcentajeEnTotalCurso] = useState(0);
    
    const [hora, setHora] = useState("");
    const [minuto, setMinuto] = useState("");
    const [bloquearTiempo, setBloquearTiempo] = useState(true);
    const [idExamenCreado, setIdExamenCreado] = useState(-1);
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        obtenerDatosServidor();
    }, []);

    useEffect(() => {           
        if(tipo==1 || tipo==""){            
            setHora(0);
            setMinuto(0);
            setPorcentajeEnTotalCurso(0);
            setBloquearTiempo(true);   
            setPoliticaDeRetroalimentacion(1);         
        }else{
            setBloquearTiempo(false);
        }
    }, [tipo, porcentajeEnTotalCurso]);
               
    //Estados de los errores de campos
    const camposErrores = {        
        'nombre':[],        
        'descripcion':[],   
        'dejar_avanzar_si_fallido':[],   
        'tiempo':[],   
        'intentos':[],   
        'tipo':[],
        'nota':[],
        'porcentaje_en_total_curso':[],        
        'politica_retroalimentacion':[],        
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
          
    const handleNombreChange = (event) => { setNombre(event.target.value);    };  
    const handleDescripcionChange = (event) => { setDescripcion(event.target.value);    };      
    const handleDejarAvanzarSiFallidoChange = (event) => { setDejarAvanzarSiFallido(event.target.value);    };      
    const handleHoraChange = (event) => { setHora(event.target.value);    };  
    const handleMinutoChange = (event) => { setMinuto(event.target.value);    };  
    const handleIntentosChange = (event) => { setIntentos(event.target.value);    };  
    const handleTipoChange = (event) => { setTipo(event.target.value);    };  
    const handlePoliticaRetroalimentacionChange = (event) => { setPoliticaDeRetroalimentacion(event.target.value);    };  
    const handlePorcentajeEnTotalCurso = (event) => { setPorcentajeEnTotalCurso(event.target.value);    };  

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    
    const handleFuncionHuecoPreguntas = () => { 
        if (typeof id_curso !== 'undefined') {
            navigate(`/examen/huecopreguntas/${id}/${id_curso}`); 
        }else{
            navigate(`/examen/huecopreguntas/${id}`); 
        }               
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
            
            const baseUrl = `${urlBaseApi}/api/examen/${id}`;
            let url = baseUrl;

            if (id_curso) {
                url += `/${id_curso}`;
            }
            const response = await fetch(url, opciones);            
            
            const datos = await response.json();   
            if (response.ok){     
                
                let desc_array = datos.descripcion.split("<br />");
                let desc = '';                
                desc_array.forEach((element) => {
                    desc = (desc!='') ? desc+='\n'+element : desc=element;
                });

                setNombre(datos.nombre);
                setDescripcion(desc);
                setTipo(datos.tipo);
                setPoliticaDeRetroalimentacion(datos.politica_retroalimentacion);
                setDejarAvanzarSiFallido(datos.dejar_avanzar_si_fallido);
                setIntentos(datos.intentos);
                const tiempo = convertirSegundosAHorasMinutosSegundos(datos.tiempo);
                setHora(parseInt(tiempo.horas));
                setMinuto(parseInt(tiempo.minutos));                
                if (typeof id_curso !== 'undefined') {
                    setPorcentajeEnTotalCurso(datos.porcentaje_en_total_curso);                    
                }                
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleEditarExamen = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
        
        const tiempo = calcularSegundosDeHorasMinutos(hora, minuto);

        const raw = {           
            'nombre': nombre.toString(),            
            'descripcion': descripcion.toString(),            
            'tipo': tipo,
            'politica_retroalimentacion':politicaDeRetroalimentacion,
            'tiempo': tiempo,
            'intentos': intentos,
        };
                
        if (typeof id_curso !== 'undefined') {
            raw.id_curso = id_curso;
            raw.porcentaje_en_total_curso = porcentajeEnTotalCurso;
        }    
        
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/examen/${id}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();                        
            if (response.ok){                
                if(Object.keys(datos).length>0){
                    mensajesDeError(setPopup, response.status, (typeof datos !== 'undefined') ? datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                }else{
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Examen editado.'});
                }
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error al editar el examen', 'contenido': 'Revise los errores en el formulario.'});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }

    }

    const horas = Array.from({ length: 4 }, (_, index) => index);
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
        <div className="dashboard-content-wrap">
            <div className="container-fluid">
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                    <div className="media media-card align-items-center">                        
                    {typeof id_curso !== 'undefined' ? <Link to={`/curso/contenido/${id_curso}`}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la edición de contenidos"><i className="la la-angle-left"></i></div></Link> : ''}
                        &nbsp;<h3 className="fs-22 font-weight-semi-bold">Editar examen</h3>                        
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
                                        <label className="label-text">Nombre</label>
                                        <input onChange={handleNombreChange} value={nombre} name="nombre" className="form-control form--control pl-3" type="text" maxLength="64" placeholder="Ej: Manipulación del dom" />
                                        {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}
                                    </div>
                                </div>                                
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Descripción</label>
                                        <textarea onChange={handleDescripcionChange} value={descripcion} name="descripcion" className="form-control form--control user-text-editor pl-3" ></textarea>
                                        {erroresCampos['descripcion'].length > 0 && (<SpamError mensaje={erroresCampos['descripcion']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Tipo de examen</label>
                                        <select onChange={handleTipoChange} value={tipo} name="tipo" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>                                            
                                            <option value="1">Básico, o control de aprendizaje</option>
                                            <option value="2">Nivel Medio (Ceritificación, Pago o no según configuración del curso)</option>
                                            <option value="3">Nivel Avanzado (Certificación, Pago o no según configuración del curso)</option>
                                        </select>                                        
                                        {erroresCampos['tipo'].length > 0 && (<SpamError mensaje={erroresCampos['tipo']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Política de retroalimentación</label>
                                        <select onChange={handlePoliticaRetroalimentacionChange} value={politicaDeRetroalimentacion} disabled={bloquearTiempo} name="politica_retroalimentacion" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>                                            
                                            <option value="0">No se muestra retroalimentaciones y respuestas correctas o incorrectas</option>
                                            <option value="1">Si se muestra retroalimentaciones y respuestas correctas o incorrectas en cada intento</option>
                                            <option value="2">Se muestran las retroalimentaciones y respuestas correctas o incorrectas cuando consuma todos los intentos.</option>
                                        </select>                                        
                                        {erroresCampos['politica_retroalimentacion'].length > 0 && (<SpamError mensaje={erroresCampos['politica_retroalimentacion']} />)}
                                    </div>
                                </div>
                                {(typeof id_curso !== 'undefined') ? 
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label className="label-text">Porcentaje en total del curso</label>
                                            <select onChange={handlePorcentajeEnTotalCurso} value={porcentajeEnTotalCurso} disabled={bloquearTiempo} name="porcentaje_en_total_curso" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                                <option value={0}> -- Seleccione --</option>                                            
                                                {porcentaje_en_total_curso.map((number) => (
                                                    <option key={number} value={number}>
                                                        {number} %
                                                    </option>
                                                ))}                                            
                                            </select>
                                            {erroresCampos['porcentaje_en_total_curso'].length > 0 && (<SpamError mensaje={erroresCampos['porcentaje_en_total_curso']} />)}
                                        </div>
                                    </div>
                                : ''}
                            </div>
                        </div>
                    </div>
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Opciones</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                                       
                                <div className="col-lg-12">
                                <label className="label-text">Tiempo para resolver el examen (Si es imimitado seleccione 0 horas con 0 minutos)</label>         
                                    <div className="input-box form-row">                                        
                                        <div className="form-group col-md-3">                                                       
                                            <label className="label-text">Horas</label>
                                            <select onChange={handleHoraChange} value={hora} disabled={bloquearTiempo} name="tiempo_horas" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                                <option value=""> -- Seleccione --</option>                                            
                                                {horas.map((number) => (
                                                    <option key={number} value={number}>
                                                        {number} horas
                                                    </option>
                                                ))}                                            
                                            </select>
                                            {erroresCampos['tiempo'].length > 0 && (<SpamError mensaje={erroresCampos['tiempo']} />)}
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label className="label-text">Minutos</label>
                                            <select onChange={handleMinutoChange} value={minuto} disabled={bloquearTiempo} name="tiempo_minutos" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                                <option value=""> -- Seleccione --</option>                                            
                                                {minutos.map((number) => (
                                                    <option key={number} value={number}>
                                                        {number} minutos
                                                    </option>
                                                ))}                                            
                                            </select>                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Intentos</label>
                                        <select onChange={handleIntentosChange} value={intentos} name="intentos" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value="0">Ilimitados</option>
                                            {[1, 2, 3, 4, 5, 6].map((number) => (
                                                <option key={number} value={number}>
                                                    {number} intentos
                                                </option>
                                            ))}                                            
                                        </select>
                                        {erroresCampos['intentos'].length > 0 && (<SpamError mensaje={erroresCampos['intentos']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6" style={{display:'none'}}>
                                    <div className="form-group">
                                        <label className="label-text">Dejar avanzar aún sin aprobar?</label>
                                        <select onChange={handleDejarAvanzarSiFallidoChange} value={dejarAvanzarSiFallido} name="dejar_avanzar_si_fallido" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value="0">No</option>
                                            <option value="1">Si</option>
                                        </select>
                                        {erroresCampos['dejar_avanzar_si_fallido'].length > 0 && (<SpamError mensaje={erroresCampos['dejar_avanzar_si_fallido']} />)}
                                        {erroresCampos['nota'].length > 0 && (<SpamError mensaje={erroresCampos['nota']} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="course-submit-btn-box pb-4">                        
                        <button className="btn theme-btn" type="submit" onClick={handleEditarExamen}>Guardar cambios</button>                        
                    </div>
                </form>
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioEditarExamen;