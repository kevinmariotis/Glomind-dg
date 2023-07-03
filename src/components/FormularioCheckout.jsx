import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import { mensajesDeError } from './utils';

function FormularioCheckout() {        
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const navigate = useNavigate();
    const formRef = useRef(null);            
    const {jwt, authenticated, setCargarContadorCarrito} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});
    const [popUpVolver, setPopupVolver] = useState({mostrar:false, titulo:'', contenido:''});
    const [popUpConfirmar, setPopupConfirmar] = useState({mostrar:false, titulo:'', contenido:''});

    const [productos, setProductos] = useState([]);
    const [factura, setFactura] = useState([]);
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);  
    
    const [formNombres, setFormNombres] = useState('');
    const [formApellidos, setFormApellidos] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formCedula, setFormCedula] = useState('');
    const [formIdPais, setFormIdPais] = useState('');
    const [formIdDepartamento, setFormIdDepartamento] = useState('');
    const [formCiudad, setFormCiudad] = useState('');
    const [formDireccion, setFormDireccion] = useState('');
   
    const [volanteAction, setVolanteAction] = useState('');
    const [volanteMerchantId, setVolanteMerchantId] = useState('');
    const [volanteAccountId, setVolanteAccountId] = useState('');
    const [volanteDescription, setVolanteDescription] = useState('');
    const [volanteReferenceCode, setVolanteReferenceCode] = useState('');
    const [volanteAmount, setVolanteAmount] = useState('');
    const [volanteTax, setVolanteTax] = useState('');
    const [volanteTaxReturnBase, setVolanteTaxReturnBase] = useState('');
    const [volanteCurrency, setVolanteCurrency] = useState('');
    const [volanteSignature, setVolanteSignature] = useState('');
    const [volanteTest, setVolanteTest] = useState('');
    const [volanteBuyerEmail, setVolanteBuyerEmail] = useState('');
    const [volanteResponseUrl, setVolanteResponseUrl] = useState('');
    const [volanteConfirmationUrl, setVolanteConfirmationUrl] = useState('');

    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    const [botonDesactivadoCheckout, setBotonDesactivadoCheckout] = useState(false); 

    //Estados de los errores de campos
    const camposErrores = {
        'nombres':[],
        'apellidos':[],
        'email':[],
        'id_pais':[],
        'id_departamento':[],
        'ciudad':[],
        'identificacion':[],        
        'direccion':[],    
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
    //fin de los estados de errores de campos
             
    useEffect(() => {    
        window.scrollTo(0, 0);
        obtenerDatosDelServidor();
    }, []);   
    
    useEffect(() => {    
        if(volanteConfirmationUrl!=''){
            formRef.current.submit();
        }
    }, [volanteConfirmationUrl]);   
    

    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    

    const handleFuncionAceptarPopUpVolver = () => {        
        setPopupVolver({...popUpVolver, mostrar:false});
        navigate('/');
    };

    const handleFuncionCerrarPopUpConfirmar = () => {        
        setPopupConfirmar({...popUp, mostrar:false});
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
                if(datos.productos.length!=0){
                    //hacemos la consulta de los datos de usaurio
                    const response = await fetch(`${urlBaseApi}/api/usuario`, opciones);
                    if(response.ok){ 
                        const datos2 = await response.json();                                                    
                        setFormNombres(datos2.usuario.nombres);
                        setFormApellidos(datos2.usuario.apellidos);
                        setFormEmail(datos2.usuario.email);
                        setFormCedula(datos2.usuario.identificacion);
                        setFormIdPais(datos2.usuario.id_pais);
                        setFormIdDepartamento(datos2.usuario.id_departamento);
                        setPaises(datos2.paises);   
                        setFormCiudad(datos2.usuario.ciudad);                  
                        getDepartamentos(datos2.usuario.id_pais).then(datos => {
                            setDepartamentos(datos);
                        });
                    }else{
                        const data2 = await response.json(); 
                        mensajesDeError(setPopup, response.status, (typeof data2.datos !== 'undefined') ? data2.datos : {});  
                    }
                }else{
                    setPopupVolver({mostrar:true, titulo:'Sin items', contenido:'En el momento no tienes ningún item en tu carrito de compras, te invitamos a navegar las categorías del sistema para encontrar cursos'});
                }
            } else {   
                const data = await response.json();             
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});  
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
    
    const handleCheckoutConfirmar = () => {      
        setPopupConfirmar({mostrar:true, titulo:'Tenga en cuenta', contenido:'Una vez pase a Checkout la compra pasa a modo de pago y se le redireccionará a la pasarela de pagos, ya no podrá editar la compra y en caso de necesitar editarla o acceder de nuevo a la pasarela de pagos deberá iniciar un nuevo carrito de compras.'});
    }    
    const handleCheckout = async () => {
        //event.preventDefault();      
        setPopupConfirmar({...popUpConfirmar, mostrar:false}); 
        reiniciarErrorCampoGlobal();        
        setBotonDesactivadoCheckout(true);
        setMostrarSpinner(true);
        const formData = new FormData();
        formData.append('nombres', formNombres);
        formData.append('apellidos', formApellidos);
        formData.append('email', formEmail);        
        formData.append('identificacion', formCedula);
        formData.append('id_pais', formIdPais);
        formData.append('id_departamento', formIdDepartamento);        
        formData.append('ciudad', formCiudad);
        formData.append('direccion', formDireccion);        

        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'POST',
                headers: headers,
                body: formData
            };
            
            const response = await fetch(`${urlBaseApi}/api/carrito/checkout/1`, opciones);
            const datos = await response.json();
            setBotonDesactivadoCheckout(false);
            setMostrarSpinner(false);
            if (response.ok){ 

                //datos.id_factura; //aqui esta el id de factura

                //se hace la consulta para obtener el volante de pago
                setMostrarSpinner(true);
                const opciones2 = {
                    method: 'GET',
                    headers: headers,                   
                };
                const response2 = await fetch(`${urlBaseApi}/api/carrito/solicitarVolanteDePago/${datos.id_factura}`, opciones2);
                setMostrarSpinner(false);
                if(response2.ok){ 
                    const datos2 = await response2.json();                                                    
                    setVolanteAction(datos2.action);
                    setVolanteMerchantId(datos2.merchantId);
                    setVolanteAccountId(datos2.accountId);
                    setVolanteDescription(datos2.description);
                    setVolanteReferenceCode(datos2.referenceCode);
                    setVolanteAmount(datos2.amount);
                    setVolanteTax(datos2.tax);
                    setVolanteTaxReturnBase(datos2.taxReturnBase);
                    setVolanteCurrency(datos2.currency);
                    setVolanteSignature(datos2.signature);
                    setVolanteTest(datos2.test);
                    setVolanteBuyerEmail(datos2.buyerEmail);
                    setVolanteResponseUrl(datos2.responseUrl);
                    setVolanteConfirmationUrl(datos2.confirmationUrl);                    
                }else{
                    const datos2 = await response2.json();
                    mensajesDeError(setPopup, response2.status, (typeof datos2.datos !== 'undefined') ? datos2.datos : {}); 
                    const statusCode = response2.status; 
                }                
            } else {                 
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Rellenar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});                                                                    
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
    /*Se obtiene los departamentos según el país*/
    const handleCambiarPais = (event) => {
        const seleccion = event.target.value;
        setFormIdPais(seleccion);
        if(seleccion!=''){            
            try{            
                getDepartamentos(seleccion).then(datos => {
                    setDepartamentos(datos);
                    setFormIdDepartamento('');
                });            
            } catch (error) {                
                console.log(error.message);           
            }
        }else{
            setDepartamentos([]);
        }
    };
    //fin de handles del formulario


    const getDepartamentos = (id_pais) => {
        return new Promise(async (resolve, reject) => {
            try{                            
                const opciones = {
                    method: 'GET',
                    headers: {                       
                    }
                };                                     
                const response = await fetch(`${urlBaseApi}/api/pais/getDepartamentos/${id_pais}`, opciones);
                const data = await response.json();
                if (response.status === 200) {                                              
                    resolve(data.departamentos);
                } else {                  
                    reject(null);
                }                          
            }catch(error){
                console.log("Error al tratar de obtener los paises ", error);
                //reject(null);
            }
        });
    };
    const handleDepartamentoChange = (event) => {   setFormIdDepartamento(event.target.value);    };    

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
            <Popup 
                mostrarPopup={popUpVolver.mostrar} 
                tamano="xx"
                tipo={2} 
                titulo={popUpVolver.titulo} 
                mensaje={popUpVolver.contenido} 
                funcionAceptar={handleFuncionAceptarPopUpVolver} 
                funcionCerrar={handleFuncionCerrarPopUp}
                textoCerrar="Aceptar"
            />
            <Popup 
                mostrarPopup={popUpConfirmar.mostrar} 
                tamano="xx"
                tipo={3} 
                titulo={popUpConfirmar.titulo} 
                mensaje={popUpConfirmar.contenido} 
                funcionAceptar={handleCheckout} 
                funcionCerrar={handleFuncionCerrarPopUpConfirmar}
                textoCerrar="Cancelar"
                textoAceptar="Proceder al pago"
            />
            <section className="cart-area section--padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-22 pb-3">Detalles de facturación</h3>
                                    <div className="divider"><span></span></div>
                                    <form method="post" className="row">
                                        <div className="input-box col-lg-6">
                                            <label className="label-text">Nombres</label>
                                            <div className="form-group">
                                                <input onChange={(event)=>{ setFormNombres(event.target.value); }} value={formNombres} className="form-control form--control" type="text" name="nombres" maxLength="128" placeholder="ej: Alex" />
                                                <span className="la la-user input-icon"></span>
                                                {erroresCampos['nombres'].length > 0 && (<SpamError mensaje={erroresCampos['nombres']} />)}
                                            </div>                                            
                                        </div>
                                        <div className="input-box col-lg-6">
                                            <label className="label-text">Apellidos</label>
                                            <div className="form-group">
                                                <input onChange={(event)=>{ setFormApellidos(event.target.value); }} value={formApellidos} className="form-control form--control" type="text" name="apellidos" maxLength="128" placeholder="ej: Pérez" />
                                                <span className="la la-user input-icon"></span>
                                                {erroresCampos['apellidos'].length > 0 && (<SpamError mensaje={erroresCampos['apellidos']} />)}
                                            </div>
                                        </div>
                                        <div className="input-box col-lg-12">
                                            <label className="label-text">Correo electrónico</label>
                                            <div className="form-group">
                                                <input onChange={(event)=>{ setFormEmail(event.target.value); }} value={formEmail} className="form-control form--control" type="email" name="email" placeholder="ej: alexperez@gmail.com" />
                                                <span className="la la-envelope input-icon"></span>
                                                {erroresCampos['email'].length > 0 && (<SpamError mensaje={erroresCampos['email']} />)}
                                            </div>
                                        </div>
                                        <div className="input-box col-lg-12">
                                            <label className="label-text">Cédula / Identificación</label>
                                            <div className="form-group">
                                                <input onChange={(event)=>{ setFormCedula(event.target.value); }} value={formCedula}  id="indentificacion" maxLength="20" className="form-control form--control" type="text" name="identificacion" />
                                                {erroresCampos['identificacion'].length > 0 && (<SpamError mensaje={erroresCampos['identificacion']} />)}
                                            </div>
                                        </div>                                                                          
                                        <div className="input-box col-lg-6">
                                            <label className="label-text">País</label>
                                            <div className="form-group">
                                                <div className="select-container w-auto">
                                                    <select value={formIdPais} onChange={handleCambiarPais} className="form-control form--control select-dark" type="text" name="id_pais">                                                        
                                                        <option value="">Seleccione País</option>
                                                        {paises.map((dato, index) => (
                                                            <option key={dato.id} value={dato.id} >{dato.nombre}</option>
                                                        ))}
                                                    </select>                                                                                            
                                                </div>
                                                {erroresCampos['id_pais'].length > 0 && (<SpamError mensaje={erroresCampos['id_pais']} />)}
                                            </div>
                                        </div>
                                        <div className="input-box col-lg-6">
                                            <label className="label-text">Departamento</label>
                                            <div className="form-group">
                                                <select value={formIdDepartamento} onChange={handleDepartamentoChange} className="form-control form--control select-dark" type="text" name="id_departamento">
                                                    <option value="" >Seleccione departamento</option>
                                                    {departamentos.map((dato, index) => (
                                                        <option key={dato.id} value={dato.id} >{dato.nombre}</option>
                                                    ))}
                                                </select>
                                                {erroresCampos['id_departamento'].length > 0 && (<SpamError mensaje={erroresCampos['id_departamento']} />)}
                                            </div>
                                        </div>                    
                                        <div className="input-box col-lg-12">
                                            <label className="label-text">Ciudad</label>
                                            <div className="form-group">
                                                <input value={formCiudad} onChange={(event)=>{ setFormCiudad(event.target.value); }} className="form-control form--control" type="text" name="ciudad" placeholder="Ciudad" maxLength="64" />
                                                <span className="la la-map input-icon"></span>
                                                {erroresCampos['ciudad'].length > 0 && (<SpamError mensaje={erroresCampos['ciudad']} />)}
                                            </div>
                                        </div>
                                        <div className="input-box col-lg-12">
                                            <label className="label-text">Dirección</label>
                                            <div className="form-group">
                                                <input value={formDireccion} onChange={(event)=>{ setFormDireccion(event.target.value); }} className="form-control form--control" type="text" name="direccion" placeholder="ej: Calle 12 # 34 - 56" />
                                                <span className="la la-map-marker input-icon"></span>
                                                {erroresCampos['direccion'].length > 0 && (<SpamError mensaje={erroresCampos['direccion']} />)}
                                            </div>
                                        </div>                                              
                                        <div className="btn-box col-lg-12">                                            
                                            <p className="pb-1 text-black-50"><i className="la la-lock fs-24 mr-1"></i>Conexion segura</p>
                                            <p className="fs-14">Su información está segura con nosotros!</p>
                                        </div>
                                    </form>
                                </div>
                            </div>                            
                        </div>
                        <div className="col-lg-5">
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-22 pb-3">Detalles del pedido</h3>
                                    <div className="divider"><span></span></div>
                                    <div className="order-details-lists">
                                        {Object.keys(productos).map((key) => (
                                            <div key={`producto-${productos[key].id_curso}-${productos[key].tipo_compra}`} className="media media-card border-bottom border-bottom-gray pb-3 mb-3">
                                                <Link to={`/curso/${productos[key].url_amigable}`} className="media-img">
                                                {productos[key].imagen_pequena!=null ? <img src={`${urlBaseApi}/${productos[key].imagen_pequena}`} style={{ height: 'auto' }} alt="Imagen del curso" /> : <img src="images/small-img.jpg" style={{ height: 'auto' }} alt="Imagen del curso" />}
                                                </Link>
                                                <div className="media-body">
                                                    <h5 className="fs-15 pb-2"><a href="course-details.html">{productos[key].nombre}</a></h5>
                                                    <p className="text-black font-weight-semi-bold lh-18">${productos[key].total_momento} {productos[key].precio_anterior!=0 && <span className="before-price fs-14">${productos[key].precio_anterior}</span>}</p>
                                                </div>
                                            </div>                                            
                                        ))}    
                                    </div>
                                    <Link to="/carrito" className="btn-text"><i className="la la-edit mr-1"></i>Editar</Link>
                                </div>
                            </div>
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-22 pb-3">Resumen del pedido</h3>
                                    <div className="divider"><span></span></div>
                                    <ul className="generic-list-item generic-list-item-flash fs-15">
                                        <li className="d-flex align-items-center justify-content-between font-weight-semi-bold">
                                            <span className="text-black">Sub total:</span>
                                            <span>${factura.subtotal}</span>
                                        </li>
                                        {factura.cupon_valor_descuento!=0 && <li className="d-flex align-items-center justify-content-between font-weight-semi-bold">
                                            <span className="text-black">Cupones de descuento:</span>
                                            <span>-${factura.cupon_valor_descuento}</span>
                                        </li>}
                                        <li className="d-flex align-items-center justify-content-between font-weight-bold">
                                            <span className="text-black">Total:</span>
                                            <span>${factura.total}</span>
                                        </li>
                                    </ul>
                                    <div className="btn-box border-top border-top-gray pt-3">                                        
                                        <p className="fs-14 lh-22 mb-3">Al completar su compra, usted acepta estos <a href="#" className="text-color hover-underline">Términos de servicio.</a></p>
                                        <button disabled={botonDesactivadoCheckout} onClick={handleCheckoutConfirmar} className="btn theme-btn w-100">Proceder al pago <i className="la la-arrow-right icon ml-1"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <form ref={formRef} method="post" action={volanteAction} style={{ display: 'none' }}>
                <input name="merchantId"    type="hidden"  value={volanteMerchantId} />
                $<input name="accountId"     type="hidden"  value={volanteAccountId} />
                <input name="description"   type="hidden"  value={volanteDescription}  />
                <input name="referenceCode" type="hidden"  value={volanteReferenceCode} />
                <input name="amount"        type="hidden"  value={volanteAmount}   />
                <input name="tax"           type="hidden"  value={volanteTax}  />
                <input name="taxReturnBase" type="hidden"  value={volanteTaxReturnBase} />
                <input name="currency"      type="hidden"  value={volanteCurrency} />
                <input name="signature"     type="hidden"  value={volanteSignature}  />
                <input name="test"  	  type="hidden"  value={volanteTest} />                       
                <input name="buyerEmail"    type="hidden"  value={volanteBuyerEmail} />
                <input name="responseUrl"    type="hidden"  value={volanteResponseUrl} />
                <input name="confirmationUrl"    type="hidden"  value={volanteConfirmationUrl} />
                <input name="Submit"        type="submit"  value="Enviar" />
            </form>
        </>
    );
}

export default FormularioCheckout;