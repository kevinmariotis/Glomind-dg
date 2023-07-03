import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReCAPTCHA from "react-google-recaptcha";

import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import { mensajesDeError } from './utils';


function FormularioCarrito() {        
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const navigate = useNavigate();            
    const {jwt, authenticated, setCargarContadorCarrito} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});

    const [productos, setProductos] = useState([]);
    const [factura, setFactura] = useState([]);
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    

    const [valorCupon, setValorCupon] = useState('');    

    const handleTogglePassword = () => {
        
    };
             
    useEffect(() => {    
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {    
        if(!mostrarSpinner){
            obtenerDatosDelServidor();
        }
    }, [mostrarSpinner]);
    
    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
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
            
            const response = await fetch(`${urlBaseApi}/api/carrito/1`, opciones);
            const datos = await response.json();
            if (response.ok){                                                                               
                setProductos(datos.productos);
                setFactura(datos.factura);
                if(datos.productos.length==0){
                    setPopup({mostrar:true, titulo:'Sin items', contenido:'En el momento no tienes ningún item en tu carrito de compras, te invitamos a navegar las categorías del sistema para encontrar cursos'});
                }
            } else {                
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const quitarItem = async ({id_curso, tipo_compra}) => {  
        setMostrarSpinner(true); 
                
        const raw = {
            'tipo_compra': tipo_compra.toString(),            
        };
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },    
            body: JSON.stringify(raw),        
        };
        
        try {
            const response = await fetch(`${urlBaseApi}/api/carrito/${id_curso}/0`, opciones);
            const data = await response.json();
            setMostrarSpinner(false);       //al quitar el spinner se recargan los datos            
            setCargarContadorCarrito(true);
            if (response.ok){                                               
                return;
            } else {                           
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }            
        }catch (error) {
            console.error('Error de conexión:', error);
        }       
    };

    const descripcion_tipo_compra = ['', 'Acceso a los videos, las descargas, y las actividades que tuviera el curso (No exámenes).', 'Incluye los exámenes que se hacen a lo largo del curso, incluyendo el exámen final.', 'Posibilidad de descargar el certificado en PDF con QR de validación de autenticidad.'];

    const handleAplicarCupon = async (event) =>{
        event.preventDefault();        
        if(valorCupon!=''){
            event.target.disabled = true;        
            setMostrarSpinner(true);
                                                
            const formData = new FormData();
            formData.append('clave', valorCupon);               
            const opciones = {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`,                    
                },
                body: formData,
            };

            try {
                const response = await fetch(`${urlBaseApi}/api/carrito/aplicarcupon/1`, opciones);
                const data = await response.json();
                setMostrarSpinner(false);   
                event.target.disabled = false;
                if (response.ok){
                    obtenerDatosDelServidor();                        
                    setValorCupon("");
                    setPopup({mostrar:true, titulo:'Listo', contenido:'El cupon ha sido aplicado al carrito, si el carrito cumple las condiciones de precio mínimo, se aplicará automáticamente el cupón.'});
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});  
                }            
            }catch (error) {
                console.error('Error de conexión:', error);
            }      

        }
    }

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
            <section className="cart-area section-padding">
                <div className="container">
                    <div className="table-responsive">
                        <table className="table generic-table">
                            <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Detalles de producto</th>
                                <th scope="col">Precio</th>                                
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>
                                {Object.keys(productos).map((key) => (
                                    <tr key={`producto-${productos[key].id_curso}-${productos[key].tipo_compra}`}>
                                        <th scope="row">
                                            <div className="media media-card">
                                                <Link to={`/curso/${productos[key].url_amigable}`} className="media-img mr-0">
                                                    {productos[key].imagen_pequena!=null ? <img src={`${urlBaseApi}/${productos[key].imagen_pequena}`} style={{ height: 'auto' }} alt="Imagen del curso" /> : <img src="images/small-img.jpg" style={{ height: 'auto' }} alt="Imagen del curso" />}
                                                </Link>
                                            </div>
                                        </th>
                                        <td>
                                            <Link to={`/curso/${productos[key].url_amigable}`} className="text-black font-weight-semi-bold">{productos[key].nombre}</Link>
                                            <p className="fs-14 text-gray lh-20">{descripcion_tipo_compra[productos[key].tipo_compra]}</p>
                                        </td>
                                        <td>
                                            <ul className="generic-list-item font-weight-semi-bold">
                                                <li className="text-black lh-18">${productos[key].total_momento}</li>
                                                {productos[key].precio_anterior!=0 && <li className="before-price lh-18">${productos[key].precio_anterior}</li>}
                                            </ul>
                                        </td>                                        
                                        <td>
                                            <button type="button"  onClick={() => {quitarItem({'id_curso':productos[key].id_curso, 'tipo_compra':productos[key].tipo_compra}) } } className="icon-element icon-element-xs shadow-sm border-0" data-toggle="tooltip" data-placement="top" title="Remove">
                                                <i className="la la-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}                                
                            </tbody>
                        </table>
                        {Object.keys(productos).length>0 && <div className="d-flex flex-wrap align-items-center justify-content-between pt-4">
                            <form method="post">
                                <div className="input-group mb-2">
                                    <input onChange={(event)=>{ setValorCupon(event.target.value); }} value={valorCupon} className="form-control form--control pl-3" type="text" name="search" placeholder="Código de cupón" />
                                    <div className="input-group-append">
                                        <button className="btn theme-btn" onClick={handleAplicarCupon}>Aplicar código</button>
                                    </div>
                                </div>
                            </form>                            
                        </div>}
                    </div>
                    <div className="col-lg-4 ml-auto">
                        <div className="bg-gray p-4 rounded-rounded mt-40px">
                            <h3 className="fs-18 font-weight-bold pb-3">Totales</h3>
                            <div className="divider"><span></span></div>
                            <ul className="generic-list-item pb-4">
                                <li className="d-flex align-items-center justify-content-between font-weight-semi-bold">
                                    <span className="text-black">Subtotal:</span>
                                    <span>${factura.subtotal}</span>
                                </li>
                                {factura.cupon_valor_descuento!=0 && <li className="d-flex align-items-center justify-content-between font-weight-semi-bold">
                                    <span className="text-black">Descuento del cupón:</span>
                                    <span>-${factura.cupon_valor_descuento}</span>
                                </li>}
                                <li className="d-flex align-items-center justify-content-between font-weight-semi-bold">
                                    <span className="text-black">Total:</span>
                                    <span>${factura.total}</span>
                                </li>
                            </ul>
                            <Link to="/carrito/checkout" className="btn theme-btn w-100">Checkout <i className="la la-arrow-right icon ml-1"></i></Link>
                        </div>
                    </div>
                </div>
            </section>
        
        </>
    );
}

export default FormularioCarrito;