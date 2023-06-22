import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReCAPTCHA from "react-google-recaptcha";

import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';


function FormularioCarrito() {        
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const navigate = useNavigate();            
    const {jwt, authenticated, setCargarContadorCarrito} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});

    const [productos, setProductos] = useState([]);
    const [factura, setFactura] = useState([]);
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    

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
            if (response.ok){                           
                const datos = await response.json();                                    
                setProductos(datos.productos);
                setFactura(datos.factura);
                if(datos.productos.length==0){
                    setPopup({mostrar:true, titulo:'Sin items', contenido:'En el momento no tienes ningún item en tu carrito de compras, te invitamos a navegar las categorías del sistema para encontrar cursos'});
                }
            } else {                
                console.error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
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
                // Obtener el código de error de la respuesta
                const statusCode = response.status;                
                                        
                // Mostrar mensaje de error según el código de error
                switch (statusCode){
                    case 400:
                        console.error('Error 400: Bad Request');                        
                    break;
                    case 401:
                        console.error('Error 401: Unauthorized');
                        console.log('Datos de error:', data);
                    break;
                    case 404:
                        console.error('Error 404: Not Found');
                        console.log('Datos de error:', data);
                    break;
                    case 500:
                        console.error('Error 500: Internal Server Error');
                        console.log('Datos de error:', data);
                    break;
                    default:
                        console.error('Error desconocido');
                        console.log('Datos de error:', data);
                    break;
                }  
                
                //recopilamos y mostramos cualquien mensaje de error
                let errores = {};          
                if (typeof data.datos !== 'undefined') {
                    errores = data.datos;                      
                }
                Object.entries(errores).forEach(([clave, mensajes]) => {                                        
                    mensajes.forEach((mensaje) => {
                        setPopup({mostrar:true, titulo:'Mensaje', contenido:mensaje+'.'});
                    });
                });    
                //fin de recopirar y mostrar cualquier mensaje de error

            }            
        }catch (error) {
            console.error('Error de conexión:', error);
        }       
    };

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
                                    <input className="form-control form--control pl-3" type="text" name="search" placeholder="Código de cupón" />
                                    <div className="input-group-append">
                                        <button className="btn theme-btn">Aplicar código</button>
                                    </div>
                                </div>
                            </form>
                            <button onClick={obtenerDatosDelServidor} className="btn theme-btn mb-2">Actualizar carrito</button>
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
                                <li className="d-flex align-items-center justify-content-between font-weight-semi-bold">
                                    <span className="text-black">Total:</span>
                                    <span>${factura.total}</span>
                                </li>
                            </ul>
                            <a href="checkout.html" className="btn theme-btn w-100">Checkout <i className="la la-arrow-right icon ml-1"></i></a>
                        </div>
                    </div>
                </div>
            </section>
        
        </>
    );
}

export default FormularioCarrito;