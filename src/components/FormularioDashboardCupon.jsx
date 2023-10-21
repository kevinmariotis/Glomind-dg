import React, {useContext, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import DashboardFooter from './DashboardFooter';
import BotonDashboardNavegacionMovil from './BotonDashboardNavegacionMovil';

export default function FormularioDashboardCupon() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const navigate = useNavigate();
    const {jwt, permissions, esMovil} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});            
                       
    const [cupones, setCupones] = useState([]);
    const [totalCupones, setTotalCupones] = useState(0);
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
            case 'eliminar_cupon':
                borrarCupon(popUp.data_id);
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
      
    const handleEliminarCupon = (id_cupon) => {        
        setPopup({...popUp, mostrar:true, tipo:3, titulo:'Confirmar?', contenido:'Confirma que desea borrar el cupón? También se eliminará el contador de redimidos.', data_switch:'eliminar_cupon', data_id:id_cupon, data_id_2:-1});
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
            const response = await fetch(`${urlBaseApi}/api/cupon/getTodos/${paginaNavegacion}/clave-desc`, opciones);
            setMostrarSpinner(false);
            if (response.ok){                           
                const datos = await response.json();   
                //setCategoriaaSistema(datos);
                setCupones(datos.cupones);
                setTotalCupones(datos.total_cupones);
            } else {      
                const data = await response.json();          
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }              
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const borrarCupon = async (id_cupon) => {         
        setMostrarSpinner(true);        
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'DELETE',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/cupon/${id_cupon}`, opciones);            
            setMostrarSpinner(false);            
            const datos = await response.json();
            if (response.ok){ 
                obtenerDatosServidor();
                setPopup({mostrar:true, titulo:'Listo', contenido:'Cupón borrado.'});                
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
                        <h3 className="fs-22 font-weight-semi-bold">Cupones</h3>                        
                    </div>                    
                    <div className="btn-box pt-30px">
                        {permissions[62] && <Link to="/cupon/crear" className="btn theme-btn"><i className="la la-plus mr-2"></i> Crear cupón</Link>}
                    </div>
                </div>
                
                <div className="table-responsive mb-5">                    
                    <table className="table generic-table">
                        <thead>
                        <tr>                            
                            <th scope="col">Código</th>
                            <th scope="col">Redimidos</th>
                            <th scope="col">Descuento</th>
                            <th scope="col">Fecha inicio</th>
                            <th scope="col">Fecha Fin</th>
                            <th scope="col">Estado</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                            {Object.keys(cupones).map((key) => (
                                <tr key={`cupon-${cupones[key].id}`}>                                    
                                    <td>
                                        {cupones[key].clave}
                                    </td>
                                    <td>
                                        {cupones[key].cantidad_redimidos}/{cupones[key].maximo_a_redimir!=0 ? cupones[key].maximo_a_redimir : 'Ilimitado'}
                                    </td>
                                    <td>
                                        {cupones[key].tipo==1 ? `${cupones[key].valor}%`: `-$ ${cupones[key].valor}`}
                                    </td>
                                    <td>
                                        {cupones[key].fecha_inicio}
                                    </td>
                                    <td>
                                        {cupones[key].fecha_fin}
                                    </td>
                                    <td>
                                        <ul className="generic-list-item">
                                            <li><span className={`badge bg-${estados_clases[cupones[key].estado]} text-white p-1`}>{estados[cupones[key].estado]}</span></li>
                                        </ul>
                                    </td>
                                    <td>
                                        {permissions[63] ? <div style={{float:'left'}} onClick={()=>{ navigate(`/cupon/editar/${cupones[key].id}`); }} className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Editar configuración"><i className="la la-gear"></i></div> : ''}
                                        {permissions[63] ? <div onClick={()=>{ handleEliminarCupon(cupones[key].id); }}  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger" data-toggle="tooltip" data-placement="top" title="Delete">
                                            <span data-toggle="modal" data-target="#itemDeleteModal" className="w-100 h-100 d-inline-block"><i className="la la-trash"></i></span>
                                        </div>: ''}
                                    </td>
                                </tr>
                            ))}                        
                        </tbody>
                    </table>
                    <Paginador elemetosTotales={totalCupones} elementosPorPagina={15} paginaActual={paginaNavegacion} callbackCambioPagina={setPaginaNavegacion} />
                </div>                
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}
