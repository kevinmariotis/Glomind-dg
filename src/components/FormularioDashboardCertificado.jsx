import React, {useContext, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import BotonDashboardNavegacionMovil from './BotonDashboardNavegacionMovil';
import DashboardFooter from './DashboardFooter';

export default function FormularioDashboardCertificado() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const navigate = useNavigate();
    const {jwt, permissions, esMovil} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});            
                       
    const [certificados, setCertificados] = useState([]);
    const [totalCertificados, setTotalCertificados] = useState(0);
    const [paginaNavegacion, setPaginaNavegacion] = useState(1);

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
        
    useEffect(() => {           
        obtenerDatosServidor();
    }, []);
           
    //Estados de los errores de campos
    const camposErrores = {                                
        'nombre':[],
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
            case 'eliminar_certificado':
                borrarCertificado(popUp.data_id);
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
      
    const handleEliminarCertificado = (id_certificado) => {        
        setPopup({...popUp, mostrar:true, tipo:3, titulo:'Confirmar?', contenido:'Confirma que desea borrar el certificado?', data_switch:'eliminar_certificado', data_id:id_certificado, data_id_2:-1});
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
            const response = await fetch(`${urlBaseApi}/api/certificado/getTodos2/${paginaNavegacion}/created_at-desc`, opciones);
            setMostrarSpinner(false);
            if (response.ok){                           
                const datos = await response.json();                   
                setCertificados(datos.certificados);
                setTotalCertificados(datos.total_certificados);
            } else {      
                const data = await response.json();          
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }              
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const borrarCertificado = async (id_certificado) => {         
        setMostrarSpinner(true);        
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'DELETE',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/certificado/${id_certificado}`, opciones);            
            setMostrarSpinner(false);            
            const datos = await response.json();
            if (response.ok){ 
                obtenerDatosServidor();
                setPopup({mostrar:true, titulo:'Listo', contenido:'Certificado borrado.'});                
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});
            }     
                    
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleGenerarCertificado = async (id_certificado) => {                
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {                           
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/certificado/generarPrueba/${id_certificado}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.blob();            
            if (response.ok){                                                                                                                       
                const blob = new Blob([datos], { type: 'application/pdf' });                    
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `certificado_${id_certificado}.pdf`;                    
                document.body.appendChild(link);
                link.click();
                setPopup({mostrar:true, titulo:'Mensaje', contenido:'El certificado está siendo descargado, por favor revise su carpeta de descargas.'});
            } else {                
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }        
    };

    const estados = ['Desactivado', 'Activado'];
    const estados_clases = ['danger', 'success'];

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
        <div className="dashboard-content-wrap">
            {esMovil && <BotonDashboardNavegacionMovil />}
            <div className="container-fluid">                                                
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                    <div className="media media-card align-items-center">                        
                        <h3 className="fs-22 font-weight-semi-bold">Certificados</h3>                        
                    </div>                    
                    <div className="btn-box pt-30px">
                        {permissions[32] && <Link to="/certificado/crear" className="btn theme-btn"><i className="la la-plus mr-2"></i> Crear certificado</Link>}
                    </div>
                </div>
                
                <div className="table-responsive mb-5">                    
                    <table className="table generic-table">
                        <thead>
                        <tr>                            
                            <th scope="col"></th>
                            <th scope="col">Nombre</th>                            
                            <th scope="col">Estado</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                            {Object.keys(certificados).map((key) => (
                                <tr key={`certificado-${certificados[key].id}`}>                                    
                                    <td style={{width:'7%'}}>
                                        <div className="custom-control custom-checkbox media media-card">
                                            <div className="media-img" style={{ height: 'auto' }}>
                                                {certificados[key].imagen_pequena && certificados[key].imagen_pequena!=null ? <img src={`${urlBaseApi}/${certificados[key].imagen_pequena}`} alt={certificados[key].nombre} /> : <img src={`${urlBase}/images/course-no-image.png`} alt={certificados[key].nombre} /> }
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {certificados[key].nombre}
                                    </td>                                    
                                    <td>
                                        <ul className="generic-list-item">
                                            <li><span className={`badge bg-${estados_clases[certificados[key].estado]} text-white p-1`}>{estados[certificados[key].estado]}</span></li>
                                        </ul>
                                    </td>
                                    <td>
                                        {permissions[31] ? <div onClick={() => { handleGenerarCertificado(certificados[key].id); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-success" data-toggle="tooltip" data-placement="top" data-title="View"><i className="la la-eye"></i></div> : ''}
                                        {permissions[33] ? <div onClick={()=>{ navigate(`/certificado/editar/${certificados[key].id}`); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Editar configuración"><i className="la la-gear"></i></div> : ''}
                                        {permissions[33] ? <div onClick={()=>{ handleEliminarCertificado(certificados[key].id); }}  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Delete">
                                            <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                        </div>: ''}
                                    </td>
                                </tr>
                            ))}                        
                        </tbody>
                    </table>
                    <Paginador elemetosTotales={totalCertificados} elementosPorPagina={15} paginaActual={paginaNavegacion} callbackCambioPagina={setPaginaNavegacion} />
                </div>                
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}
