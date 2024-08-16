import React, {useContext, useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import DashboardFooter from './DashboardFooter';
import UsuarioPicker from './UsuarioPicker';

export default function FormularioCursoUsuarios() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const { id } = useParams();
    const {jwt, permissions, temaActual} = useContext(AuthContext);
    const navigate = useNavigate(); 
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});    
    const [verPopUpMatricular, setVerPopUpMatricular] = useState(false);
    const [verPopUpMatricularDetalles, setVerPopUpMatricularDetalles] = useState(false);
    const [idUsuarioSeleccionado, setIdUsuarioSeleccionado] = useState(-1);
    const [formExamenes, setFormExamenes] = useState(-1);
    const [formCertificado, setFormCertificado] = useState(-1);    
    const [nombreCurso, setNombreCurso] = useState('');
    const [pestanaActivada, setPestanaActivada] = useState(1);        
    
    const [pagina, setPagina] = useState(1);
    const [usuarios, setUsuarios] = useState({});
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [buscarPorTexto, setBuscarPorTexto] = useState('');    
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        switch(pestanaActivada){
            case 1:
                obtenerDatosServidor();                
            break;            
        }        
    }, [pestanaActivada]);

    useEffect(() => {                   
        obtenerMatriculados();
    }, [pagina, buscarPorTexto]);


    useEffect(() => {   
        if(idUsuarioSeleccionado!=-1){
            verificarCommpletado();
        }
    }, [formExamenes, formCertificado]);
           
    //Estados de los errores de campos
    const camposErrores = {                                
        'examenes':[],
        'certificado':[],
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
        
    const handleCambiarPestana = (event, numero) =>{    
        event.preventDefault();   
        setPestanaActivada(numero);
    };
    
    const handleFuncionAceptarPopUp = () => {        
        switch(popUp.data_switch){
            case 'desmatricular_usuario':
                desmatricular(popUp.data_id);
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleUsuarioSeleccionado = (id_usuario) => {                
        setIdUsuarioSeleccionado(id_usuario);
        setVerPopUpMatricularDetalles(true);
    };

    const handleExamenesChange = (event) => {                
        event.preventDefault();   
        setFormExamenes(event.target.value);
    };

    const handleCertificadoChange = (event) => {                
        event.preventDefault();   
        setFormCertificado(event.target.value);
    };
    
    const handleMatricular = (event) => {                
        event.preventDefault();
        reiniciarErrorCampoGlobal();        
        if(formExamenes!=-1 && formCertificado!=-1){
            setMostrarSpinner(true);
            setVerPopUpMatricularDetalles(false);
            matricular(idUsuarioSeleccionado, 1);            
        }else{
            if(formExamenes==-1){
                setErrorCampoGlobal('examenes', 'Seleccione si tendrá derecho a realizar los exámenes (No de tipo actividad).');
            }else{
                setErrorCampoGlobal('certificado', 'Seleccione si podrá descargar el certificado (Si aplica las condiciones del curso).');
            }    
        }                
    };

    const handleMatriculaSecundaria = () => {                
        if(formExamenes==1){
            matricular(idUsuarioSeleccionado, 2);
        }else{
            setFormExamenes(-1);
        }
        if(formCertificado==1){
            matricular(idUsuarioSeleccionado, 3);
        }else{
            setFormCertificado(-1);
        }        
    };

    const verificarCommpletado = (event) => {
        if(formExamenes==-1 && formCertificado==-1){
            setMostrarSpinner(false);
            setIdUsuarioSeleccionado(-1);
            setPopup({mostrar:true, titulo:'Listo', contenido:'Usuario matriculado.'});
        }
    }     
    
    const handleSetPalabraBuscar = (event) => {                
        event.preventDefault();   
        setBuscarPorTexto(event.target.value);
    };
  
    const handleDesmatricular = (id_usuario, nombre) => {        
        setPopup({...popUp, mostrar:true, tipo:3, titulo:'Confirmar?', contenido: `Confirma que desea desmatricular a ${nombre}?`, data_switch:'desmatricular_usuario', data_id:id_usuario});
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
            const response = await fetch(`${urlBaseApi}/api/curso/informacionBasica/${id}`, opciones);            
            const datos = await response.json();   
            if (response.ok){      
                setNombreCurso(datos.nombre);                               
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
    
    const obtenerMatriculados = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {   
            if(permissions[17] || permissions[18] || permissions[19]){
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/curso/getMatriculadosLista/${id}/${pagina}/usuario.nombres-asc/${buscarPorTexto}`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();   
                    //setCategoriaaSistema(datos);
                    setUsuarios(datos.matriculados);
                    setTotalUsuarios(datos.total_matriculados);
                } else {      
                    const data = await response.json();          
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
                }  
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const matricular = async (id_usuario, tipo_compra) => {
        const formData = new FormData();        
        formData.append('id_curso', id);   
        formData.append('id_usuario', id_usuario);
        formData.append('tipo_compra', tipo_compra);
                       
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            //setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/cursomatriculacion`, opciones);
            //setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){                  
                obtenerDatosServidor();
                switch(tipo_compra){
                    case 1:                        
                        handleMatriculaSecundaria();
                    break;
                    case 2:
                        setFormExamenes(-1);
                    break;
                    case 3:
                        setFormCertificado(-1);
                    break;
                }                
                return;
            } else {
                setMostrarSpinner(false);
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {titulo:'', contenido:''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }     

    const desmatricular = async (id_usuario) => {        
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'DELETE',
                headers: headers,
            };            
            setMostrarSpinner(true);        
            const response = await fetch(`${urlBaseApi}/api/cursomatriculacion/${id}/${id_usuario}`, opciones);            
            setMostrarSpinner(false);            
            const datos = await response.json();
            if (response.ok){ 
                obtenerMatriculados();
                setPopup({mostrar:true, titulo:'Listo', contenido:'Usuario desmatriculado.'});                
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});
            }     
                    
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

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
        {verPopUpMatricular && 
            <UsuarioPicker funcionMostrarPopUp={setVerPopUpMatricular} funcionSetUsuarioSeleccionado={handleUsuarioSeleccionado} endPointBusqueda={`${urlBaseApi}/api/curso/buscarDocente`} />
        } 

        {verPopUpMatricularDetalles && <div className="modal fade modal-container show" style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="matricularModal3" tabIndex="-1" role="dialog" aria-labelledby="matricularDetalles" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="matricularDetalles">Seleccione items adicionales de la matriculación</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Exámenes</label>
                            <select onChange={handleExamenesChange} value={formExamenes} name="examenes" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                <option value="-1"> -- Seleccione --</option>                                            
                                <option value="1">Si</option>
                                <option value="0">No</option>
                            </select>                                        
                            {erroresCampos['examenes'].length > 0 && (<SpamError mensaje={erroresCampos['examenes']} />)}
                        </div>
                        <div className="form-group">
                            <label className="label-text">Certificado</label>
                            <select onChange={handleCertificadoChange} value={formCertificado} name="certificado" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                <option value="-1"> -- Seleccione --</option>                                            
                                <option value="1">Si</option>
                                <option value="0">No</option>
                            </select>                                        
                            {erroresCampos['certificado'].length > 0 && (<SpamError mensaje={erroresCampos['certificado']} />)}
                        </div>                        
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={handleMatricular}> Matricular </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setVerPopUpMatricularDetalles(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>}

        <div className="dashboard-content-wrap">
            <div className="dashboard-menu-toggler btn theme-btn theme-btn-sm lh-28 theme-btn-transparent mb-4 ml-3">
                <i className="la la-bars mr-1"></i> Dashboard Nav
            </div>
            <div className="container-fluid">                                                               
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                    <div className="dashboard-heading mb-5 align-items-center ">                         
                        <h3 className="fs-22 font-weight-semi-bold"><Link to={`/cursos`}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la lista de cursos"><i className="la la-angle-left"></i></div></Link>&nbsp;{nombreCurso}</h3>
                        <span style={{marginLeft:'55px'}}>Matriculados del curso</span>                   
                    </div>                    
                    <div className="btn-box">
                        {permissions[30] && <button onClick={()=>{ setVerPopUpMatricular(true); setIdUsuarioSeleccionado(-1); setFormExamenes(-1); setFormCertificado(-1); }} type="submit" className="btn theme-btn"><i className="la la-plus mr-2"></i> Matricular usaurios</button>}
                    </div>
                </div>                                             
                
                <div className="row mt-5">
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label className="label-text">Buscar usuario matriculado por nombre o identificación</label>
                            <input onChange={handleSetPalabraBuscar} className="form-control form--control pl-3" type="text" name="buscar_video" maxLength="32" placeholder="" />
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table generic-table">
                        <thead>
                        <tr>               
                            <th scope="col"></th> 
                            <th scope="col">Nombres y apellidos</th>                            
                            <th scope="col">Indentificación</th>
                            <th scope="col">Exámenes</th>
                            <th scope="col">Certificado</th>
                            <th scope="col">Fecha de matriculación</th>
                            <th scope="col">Estado</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody >
                            {Object.keys(usuarios).map((key) => (
                                <tr key={`usuario-perfil-${key}-${usuarios[key].id}`}>
                                    <th scope="row" width="5%">
                                        <div className="media media-card  pb-2 mb-2" >
                                            <div className="media-img mr-4 rounded-full">
                                                <img className="rounded-full lazy" src={usuarios[key].imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${usuarios[key].imagen_pequena}`} data-src={`${urlBase}/images/avatar_docente.jpg`} alt="User image" />
                                            </div>
                                        </div>
                                    </th>
                                    <th scope="row">
                                        {usuarios[key].nombres} {usuarios[key].apellidos}
                                    </th>
                                    <th scope="row">
                                        {usuarios[key].identificacion}
                                    </th>
                                    <th scope="row">
                                        {usuarios[key].matricula_examenes ? 'Si' : 'No'}
                                    </th>
                                    <th scope="row">
                                        {usuarios[key].matricula_certificado ? 'Si' : 'No'}
                                    </th>
                                    <th scope="row">
                                        {usuarios[key].fecha_matriculacion}
                                    </th>                                    
                                    <th scope="row">
                                        {usuarios[key].estado==1 ? <span className="badge badge-success text-white">Activo</span>: <span className="badge badge-danger text-white">Suspendido</span>}
                                    </th>
                                    <th scope="row" width="5%">
                                        {permissions[43] ? <div onClick={()=>{ handleDesmatricular(usuarios[key].id_usuario, usuarios[key].nombres+' '+usuarios[key].apellidos); }}  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Delete">
                                            <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                        </div>: ''}
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>                            
                </div>
                <Paginador elemetosTotales={totalUsuarios} elementosPorPagina={20} paginaActual={pagina} callbackCambioPagina={setPagina} />                                                                   
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}
