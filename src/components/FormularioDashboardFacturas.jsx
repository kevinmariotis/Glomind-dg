import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import BotonDashboardNavegacionMovil from './BotonDashboardNavegacionMovil';
import DashboardFooter from './DashboardFooter';

function FormularioDashboardFacturas() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;           
    const {jwt, esMovil, nombres, setImagenPequena} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});        
    const [paginaNavegacion, setPaginaNavegacion] = useState(1);
    
    const [datosUsuario, setDatosUsuario] = useState({docente_rating:99.9, docente_reviews:0});     //datos estaticos que no se editarán
    const [facturas, setFacturas] = useState({});    
    const [itemsFactura, setItemsFactura] = useState({});
    const [detallesFacturacion, setDetallesFacturacion] = useState({});
    const [totalesFactura, setTotalesFactura] = useState({});
    const [totalFacturas, setTotalFacturas] = useState(1);
    const [verDetallesId, setVerDetallesId] = useState(-1);
    
    const [opcionesDeFiltradoActivado, setOpcionesDeFiltradoActivado] = useState(false);
    const [filtrarPorCarrito, setFiltrarPorCarrito] = useState(false);
    const [filtrarPorEnProcesoDePago, setFiltrarPorEnProcesoDePago] = useState(false);
    const [filtrarPorErrorTransaccion, setFiltrarPorErrorTransaccion] = useState(false);
    const [filtrarPorPagado, setFiltrarPorPagado] = useState(true);
    const [filtrarPorEsperaRespuestaPasarela, setFiltrarPorEsperaRespuestaPasarela] = useState(false);

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        //window.scrollTo(0, 0);
        obtenerDatosDelServidor();        
    }, []);
       
    useEffect(() => {      
        window.scrollTo(0, 0);   
        obtenerFacturas();
    }, [paginaNavegacion, filtrarPorCarrito, filtrarPorEnProcesoDePago, filtrarPorErrorTransaccion, filtrarPorPagado, filtrarPorEsperaRespuestaPasarela]);

    useEffect(() => {      
        if(verDetallesId!=-1){
            setItemsFactura({});
            setTotalesFactura({});
            obtenerItemsFactura();
        }                
    }, [verDetallesId]);
    

    //Estados de los errores de campos
    const camposErrores = {        
        'nombres':[],        
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
           
    const handleDetallesIdChange = (id_factura) => { console.log("esableciendo ", id_factura); setVerDetallesId(id_factura);    };
        
    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
        

    const handleFiltrarPorCarrito = (event) => {                        
        const { checked } = event.target;
        setFiltrarPorCarrito(checked ? true: false);        
    };
    const handleFiltrarPorEnProcesoDePago = (event) => {                        
        const { checked } = event.target;
        setFiltrarPorEnProcesoDePago(checked ? true: false);        
    };
    const handleFiltrarPorErrorTransaccion = (event) => {                        
        const { checked } = event.target;
        setFiltrarPorErrorTransaccion(checked ? true: false);        
    };
    const handleFiltrarPorPagado = (event) => {                        
        const { checked } = event.target;
        setFiltrarPorPagado(checked ? true: false);        
    };
    const handleFiltrarPorEsperaRespuestaPasarela = (event) => {                        
        const { checked } = event.target;
        setFiltrarPorEsperaRespuestaPasarela(checked ? true: false);        
    };


    const obtenerDatosDelServidor = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/usuario`, opciones);
            setMostrarSpinner(false);
            if (response.ok){                           
                const datos = await response.json();   
                setDatosUsuario(datos.usuario);                   
            } else {      
                const data = await response.json();          
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerFacturas = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {    
            
            let opciones_estado = '';
            if(filtrarPorCarrito){
                opciones_estado = '1';
            }
            if(filtrarPorEnProcesoDePago){
                if(opciones_estado!=''){ opciones_estado+=','; }
                opciones_estado+='2';
            }
            if(filtrarPorErrorTransaccion){
                if(opciones_estado!=''){ opciones_estado+=','; }
                opciones_estado+='3';
            }
            if(filtrarPorPagado){
                if(opciones_estado!=''){ opciones_estado+=','; }
                opciones_estado+='4';
            }
            if(filtrarPorEsperaRespuestaPasarela){
                if(opciones_estado!=''){ opciones_estado+=','; }
                opciones_estado+='7';
            }
            opciones_estado = opciones_estado=='' ? 'none' : opciones_estado;

            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/factura/getTodas/${opciones_estado}/${paginaNavegacion}/factura.id-desc/none`, opciones);
            setMostrarSpinner(false);
            if (response.ok){                           
                const datos = await response.json();   
                setFacturas(datos.facturas);                
                setTotalFacturas(datos.tamano_total);
            } else {      
                const data = await response.json();          
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
      
    const obtenerItemsFactura = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/factura/getItems/${verDetallesId}`, opciones);
            setMostrarSpinner(false);
            if (response.ok){                                           
                const datos = await response.json();   
                setItemsFactura(datos.productos);
                setTotalesFactura(datos.factura);                                
                setDetallesFacturacion(datos.factura.detalles_facturacion);                
            } else {      
                const data = await response.json();          
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    //2 en proceso de pago, 3 error transaccion, 4 pagado, 7 en espera de la respuesta de la pasarela de pagos
    const estados = ['', 'Carrito', 'Esperando pago', 'Error transacción', 'Pagado', '', '', 'Esperando respuesta'];
    const estados_clases = ['', '', 'warning', 'danger', 'success', '', '', 'warning'];
    const descripcion_tipo_compra = ['', 'Acceso a los videos, las descargas, y las actividades que tuviera el curso (No exámenes).', 'Incluye los exámenes que se hacen a lo largo del curso, incluyendo el exámen final.', 'Posibilidad de descargar el certificado en PDF con QR de validación de autenticidad.'];

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
            {esMovil && <BotonDashboardNavegacionMovil />}
            <div className="container-fluid">                
                
                <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                    <div className="media media-card align-items-center">                        
                        <h3 className="fs-22 font-weight-semi-bold">Compras y facturas</h3>
                    </div>                    
                    <div className="btn-box pt-300px">         
                        {verDetallesId==-1 ? 
                        <div className="question-overview-filter-item">
                            <div className="generic-action-wrap">
                                <div className="dropdown">
                                    <div onClick={e=>setOpcionesDeFiltradoActivado(!opcionesDeFiltradoActivado) }className="btn theme-btn theme-btn-transparent w-100" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Filtrar por&nbsp;&nbsp;&nbsp;&nbsp;
                                    </div>
                                    <div className="dropdown-menu" style={{right:0, left:"inherit", display:opcionesDeFiltradoActivado ? 'block' : 'none'}}>
                                        <div className="dropdown-item">
                                            <div className="custom-control custom-checkbox fs-15">
                                                <input onChange={handleFiltrarPorCarrito} checked={filtrarPorCarrito} type="checkbox" className="custom-control-input" id="questionsCheckbox" required />
                                                <label className="custom-control-label custom--control-label" htmlFor="questionsCheckbox">
                                                    En carrito
                                                </label>
                                            </div>
                                        </div>
                                        <div className="dropdown-item">
                                            <div className="custom-control custom-checkbox fs-15">
                                                <input onChange={handleFiltrarPorEnProcesoDePago} checked={filtrarPorEnProcesoDePago} type="checkbox" className="custom-control-input" id="questionsCheckbox2" required />
                                                <label className="custom-control-label custom--control-label" htmlFor="questionsCheckbox2">
                                                    En proceso de pago
                                                </label>
                                            </div>
                                        </div>
                                        <div className="dropdown-item">
                                            <div className="custom-control custom-checkbox fs-15">
                                                <input onChange={handleFiltrarPorErrorTransaccion} checked={filtrarPorErrorTransaccion} type="checkbox" className="custom-control-input" id="questionsCheckbox3" required />
                                                <label className="custom-control-label custom--control-label" htmlFor="questionsCheckbox3">
                                                    Error transacción
                                                </label>
                                            </div>
                                        </div>
                                        <div className="dropdown-item">
                                            <div className="custom-control custom-checkbox fs-15">
                                                <input onChange={handleFiltrarPorPagado} checked={filtrarPorPagado} type="checkbox" className="custom-control-input" id="questionsCheckbox4" required />
                                                <label className="custom-control-label custom--control-label" htmlFor="questionsCheckbox4">
                                                    Pagado
                                                </label>
                                            </div>
                                        </div>
                                        <div className="dropdown-item">
                                            <div className="custom-control custom-checkbox fs-15">
                                                <input onChange={handleFiltrarPorEsperaRespuestaPasarela} checked={filtrarPorEsperaRespuestaPasarela} type="checkbox" className="custom-control-input" id="questionsCheckbox5" required />
                                                <label className="custom-control-label custom--control-label" htmlFor="questionsCheckbox5">
                                                    Espera en respuesta de pasarela
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>:''}                      
                    </div>
                </div>  

                {verDetallesId==-1 ? <>                
                <div className="table-responsive mb-5">
                    <table className="table generic-table">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Total</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Estado</th>
                        </tr>
                        </thead>
                        <tbody>
                            {Object.keys(facturas).map((key) => (
                                <tr key={`factura-${facturas[key].id}`}>
                                    <th scope="row">
                                        <ul className="generic-list-item">
                                            <li><a onClick={() => {handleDetallesIdChange(facturas[key].id)} } href="#">#{facturas[key].consecutivo==null ? '?' : facturas[key].consecutivo}</a></li>
                                        </ul>
                                    </th>
                                    <td>
                                        <div className="media media-card align-items-center">                                            
                                            <div className="media-body">
                                                <h5 className="fs-15"><a onClick={() => {handleDetallesIdChange(facturas[key].id)} } href="#">{facturas[key].nombres} {facturas[key].apellidos}</a></h5>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <ul className="generic-list-item">
                                            <li>${facturas[key].total}</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul className="generic-list-item">
                                            <li>{facturas[key].fecha_checkout}</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul className="generic-list-item">
                                            <li><span className={`badge bg-${estados_clases[facturas[key].estado]} text-white p-1`}>{estados[facturas[key].estado]}</span></li>
                                        </ul>
                                    </td>
                                </tr>
                            ))}                        
                        </tbody>
                    </table>
                    <Paginador elemetosTotales={totalFacturas} elementosPorPagina={10} paginaActual={paginaNavegacion} callbackCambioPagina={setPaginaNavegacion} />
                </div></> 
                : 
                    Object.keys(itemsFactura).length>0 ?
                        <div className="table-responsive mb-5">
                            <h3 className="fs-18 font-weight-semi-bold pb-4"><a href="#" onClick={() => { handleDetallesIdChange(-1); } }><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la lista de compras"><i className="la la-angle-left"></i></div></a>&nbsp;Detalle de orden</h3>                                                                                    
                            <div className="col-lg-12">                                
                                <div className="card-body"></div>
                                <form method="post" className="row">
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">Nombres</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{detallesFacturacion.nombres}</span>
                                        </div>                                            
                                    </div>
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">Apellidos</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{detallesFacturacion.apellidos}</span>
                                        </div>
                                    </div>
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">Correo electrónico</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{detallesFacturacion.email}</span>
                                        </div>
                                    </div>
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">Cédula / Identificación</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{detallesFacturacion.identificacion}</span>
                                        </div>
                                    </div>                                                                          
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">Teléfono</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{detallesFacturacion.telefono}</span>
                                        </div>
                                    </div>                                                                          
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">País</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{detallesFacturacion.pais}</span>
                                        </div>
                                    </div>
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">Estado</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{detallesFacturacion.departamento}</span>
                                        </div>
                                    </div>                    
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">Ciudad</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{detallesFacturacion.ciudad}</span>
                                        </div>
                                    </div>
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">Dirección</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{detallesFacturacion.direccion}</span>
                                        </div>
                                    </div>
                                    <div className="input-box col-lg-6">
                                        <label className="label-text">Fecha checkout</label>
                                        <div className="form-group">
                                            <span className="rating-total pl-1">{totalesFactura.fecha_checkout}</span>
                                        </div>
                                    </div>
                                </form>                                                                            
                            </div>
                            <div className="divider"><span></span></div>
                            <table className="table generic-table">
                                <thead>
                                <tr>
                                    <th scope="col">Producto</th>                                
                                    <th scope="col">Total</th>                                                                                                                                
                                </tr>
                                </thead>
                                <tbody>
                                {Object.keys(itemsFactura).map((key) => (
                                    <tr key={`imtem-factura-${itemsFactura[key].id_curso}-${itemsFactura[key].tipo_compra}`}>
                                        <th scope="row">
                                            <div className="media media-card align-items-center">
                                                <Link to={`${urlBase}/curso/${itemsFactura[key].url_amigable}`} className="media-img">
                                                    <img className="mr-3" style={{ height: 'auto', cursor:'pointer' }} src={`${itemsFactura[key].imagen_pequena!=null ? `${urlBaseApi}/${itemsFactura[key].imagen_pequena}` : 'images/small-img.jpg'}`} alt="imagen de producto" />
                                                </Link>
                                                <div className="media-body">
                                                    <h5 className="fs-15"><Link to={`${urlBase}/curso/${itemsFactura[key].url_amigable}`}>{itemsFactura[key].nombre}</Link></h5>
                                                    <p className="fs-14 text-gray lh-20">{descripcion_tipo_compra[itemsFactura[key].tipo_compra]}</p>
                                                </div>
                                            </div>
                                        </th>                                
                                        <td>
                                            <ul className="generic-list-item">
                                                <li>${itemsFactura[key].total_momento}</li>
                                            </ul>
                                        </td>
                                    </tr>  
                                ))}                          
                                </tbody>
                                <tfoot>
                                <tr>                                    
                                    <td>
                                        <ul className="generic-list-item">
                                            <li className="font-weight-semi-bold text-black fs-18">Sub-Total:</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul className="generic-list-item">
                                            <li className="font-weight-semi-bold text-black fs-18">${totalesFactura.subtotal}</li>
                                        </ul>
                                    </td>
                                </tr>
                                {totalesFactura.cupon_valor_descuento!=0 && <tr>                                    
                                    <td>
                                        <ul className="generic-list-item">
                                            <li className="font-weight-semi-bold text-black fs-18">Descuento cupón:</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul className="generic-list-item">
                                            <li className="font-weight-semi-bold text-black fs-18">${totalesFactura.cupon_valor_descuento}</li>
                                        </ul>
                                    </td>
                                </tr>}
                                <tr>                                    
                                    <td>
                                        <ul className="generic-list-item">
                                            <li className="font-weight-semi-bold text-black fs-18">Total:</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul className="generic-list-item">
                                            <li className="font-weight-semi-bold text-black fs-18">${totalesFactura.total}</li>
                                        </ul>
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div> 
                    : ''
                }              
                <DashboardFooter />
            </div>
        </div>
        </>
    )
}

export default FormularioDashboardFacturas;