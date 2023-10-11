import React, {useContext, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

//para el date picker
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
//fin de para el date picker

function FormularioCrearCupon() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const navigate = useNavigate(); 
    const {jwt, permissions, temaActual} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});        
    
    const today = new Date();
    const [codigo, setCodigo] = useState('');
    const [fechaInicio, setFechaInicio] = useState(today);
    const [mostrarFechaInicio, setMostrarFechaInicio] = useState(false);
    const [fechaFin, setFechaFin] = useState(today);
    const [mostrarFechaFin, setMostrarFechaFin] = useState(false);
    const [compraMinima, setCompraMinima] = useState('');
    const [maximoRedimir, setMaximoRedimir] = useState('');
    const [tipo, setTipo] = useState('');
    const [valor, setValor] = useState('');
    const [estado, setEstado] = useState(-1);

    const [horaInicio, setHoraInicio] = useState(-1);
    const [minutoInicio, setMinutoInicio] = useState(-1);

    const [horaFin, setHoraFin] = useState(-1);    
    const [minutoFin, setMinutoFin] = useState(-1);
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {
        window.scrollTo(0, 0);        
        document.addEventListener('click', handleCloseOnOutsideClick);
        return () => {
            document.removeEventListener('click', handleCloseOnOutsideClick);
        };
    }, []);
         
            
    //Estados de los errores de campos
    const camposErrores = {        
        'clave':[],
        'fecha_inicio':[],
        'fecha_fin':[],
        'compra_minima':[],
        'maximo_a_redimir':[],
        'tipo':[],
        'valor':[],
        'estado':[],
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
          
    const handleCodigoChange = (event) => { setCodigo(event.target.value);    };      

    const handleFuncionAceptarPopUp = () => {        
        switch(popUp.data_switch){
            case 'cupon-creado':
                navigate('/cupon');
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

                
    const handleMostrarFechaInicio = (event) => {         
        setMostrarFechaInicio(!mostrarFechaInicio);
    };  

    const handleMostrarFechaFin = (event) => {         
        setMostrarFechaFin(!mostrarFechaFin);
    };  

    const handleCompraMinimaChange = (event) => { setCompraMinima(event.target.value); };
    const handleMaximoRedimirChange = (event) => { setMaximoRedimir(event.target.value); };
    const handleTipoChange = (event) => { setTipo(event.target.value); };
    const handleValorChange = (event) => { setValor(event.target.value); };
    const handleEstadoChange = (event) => { setEstado(event.target.value); };

    const handleHoraInicioChange = (event) => { setHoraInicio(event.target.value); };
    const handleMinutoInicioChange = (event) => { setMinutoInicio(event.target.value); };
    const handleHoraFinChange = (event) => { setHoraFin(event.target.value); };
    const handleMinutoFinChange = (event) => { setMinutoFin(event.target.value); };
    
    const handleCloseOnOutsideClick = (event) => {
        console.log("nombreee ", event.target.name);
        if(event.target.name===undefined){                
            setMostrarFechaInicio(false);            
            setMostrarFechaFin(false);
        }
    };    

    const handleCrearCupon = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
       
        const formData = new FormData();               
        formData.append('clave', codigo);
        formData.append('fecha_inicio', format(fechaInicio, 'yyyy-MM-dd')+' '+horaInicio+':'+minutoInicio+':00');
        formData.append('fecha_fin', format(fechaFin, 'yyyy-MM-dd')+' '+horaFin+':'+minutoFin+':00');
        formData.append('compra_minima', compraMinima);
        formData.append('maximo_a_redimir', maximoRedimir);
        formData.append('tipo', tipo);
        formData.append('valor', valor);
        formData.append('estado', estado);

        const opcionesx = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/cupon`, opcionesx);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){   
                setPopup({mostrar:true, titulo:'Listo', contenido:'Cupón creado correctamente.', data_switch:'cupon-creado'});
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error al crear el cupón', 'contenido': 'Revise los errores en el formulario.'});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }
          
    const horas = Array.from({ length: 24 }, (_, index) => index);
    const minutos = Array.from({ length: 60 }, (_, index) => index);

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
                <div className="dashboard-heading mb-5">                    
                    <h3 className="fs-22 font-weight-semi-bold"><Link to={`/cupon`}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la lista de cupones"><i className="la la-angle-left"></i></div></Link>&nbsp;Crear cupón</h3>                    
                </div>
                <form action="#">                      
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">General</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Código</label>
                                        <input onChange={handleCodigoChange} className="form-control form--control pl-3" type="text" name="clave" maxLength="64" value={codigo} placeholder="" />
                                        {erroresCampos['clave'].length > 0 && (<SpamError mensaje={erroresCampos['clave']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Valor de compra mínima</label>
                                        <input onChange={handleCompraMinimaChange} className="form-control form--control pl-3" type="text" name="compra_minima" maxLength="64" value={compraMinima} placeholder="" />
                                        {erroresCampos['compra_minima'].length > 0 && (<SpamError mensaje={erroresCampos['compra_minima']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text" style={{'display':'block'}}>Fecha de inicio</label>                                        
                                        <input onClick={handleMostrarFechaInicio} value={format(fechaInicio, 'yyyy-MM-dd')} style={{width:'50%', float:'left'}} readOnly className="form-control form--control pl-3" type="text" name="fecha_inicio" maxLength="64" placeholder="" />
                                        <select onChange={handleHoraInicioChange} style={{width:'25%', height:'50px', float:'left'}} value={horaInicio} name="hora_inicio" className="form-control select-dark">
                                            <option value=""> -- Hora --</option>   
                                            {horas.map((hora) => (
                                                <option key={`h-inicio-${hora}`} value={hora.toString().padStart(2, '0')}>
                                                    {hora.toString().padStart(2, '0')}
                                                </option>
                                            ))}                                                                                     
                                        </select>
                                        <select onChange={handleMinutoInicioChange} style={{width:'25%', height:'50px'}} value={minutoInicio} name="minuto_inicio" className="form-control select-dark">
                                            <option value=""> -- Minuto --</option>                                                                                        
                                            {minutos.map((minuto) => (
                                                <option key={`m-inicio-${minuto}`} value={minuto.toString().padStart(2, '0')}>
                                                    {minuto.toString().padStart(2, '0')}
                                                </option>
                                            ))}
                                        </select>                                        
                                        <div style={{position:'absolute',  zIndex:'999', backgroundColor: temaActual ? '#ffffff' : '#1B1B1B', display:mostrarFechaInicio ? 'block' : 'none'}}>
                                            <DayPicker
                                                mode="single"
                                                selected={fechaInicio}
                                                onSelect={setFechaInicio} 
                                                locale={es}                       
                                            />
                                        </div>
                                        {erroresCampos['fecha_inicio'].length > 0 && (<SpamError mensaje={erroresCampos['fecha_inicio']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text" style={{'display':'block'}}>Fecha de finalización</label>                                        
                                        <input onClick={handleMostrarFechaFin} value={format(fechaFin, 'yyyy-MM-dd')} style={{width:'50%', float:'left'}} readOnly className="form-control form--control pl-3" type="text" name="fecha_fin" maxLength="64" placeholder="" />
                                        <select onChange={handleHoraFinChange} style={{width:'25%', height:'50px', float:'left'}} value={horaFin} name="hora_fin" className="form-control select-dark">
                                            <option value=""> -- Hora --</option>   
                                            {horas.map((hora) => (
                                                <option key={`h-fin-${hora}`} value={hora.toString().padStart(2, '0')}>
                                                    {hora.toString().padStart(2, '0')}
                                                </option>
                                            ))}                                                                                     
                                        </select>
                                        <select onChange={handleMinutoFinChange} style={{width:'25%', height:'50px'}} value={minutoFin} name="minuto_fin" className="form-control select-dark">
                                            <option value=""> -- Minuto --</option>                                                                                        
                                            {minutos.map((minuto) => (
                                                <option key={`m-fin-${minuto}`} value={minuto.toString().padStart(2, '0')}>
                                                    {minuto.toString().padStart(2, '0')}
                                                </option>
                                            ))}
                                        </select>                                        
                                        <div style={{position:'absolute',  zIndex:'999', backgroundColor: temaActual ? '#ffffff' : '#1B1B1B', display:mostrarFechaFin ? 'block' : 'none'}}>
                                            <DayPicker
                                                mode="single"
                                                selected={fechaFin}
                                                onSelect={setFechaFin} 
                                                locale={es}                       
                                            />
                                        </div>
                                        {erroresCampos['fecha_fin'].length > 0 && (<SpamError mensaje={erroresCampos['fecha_fin']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Tipo descuento</label>
                                        <select onChange={handleTipoChange} value={tipo} name="tipo" className="form-control select-dark">
                                            <option value=""> -- Seleccione --</option>                                            
                                            <option value="1">Porcentaje (%)</option>
                                            <option value="2">Valor dinero específico ($)</option>
                                        </select>    
                                        {erroresCampos['tipo'].length > 0 && (<SpamError mensaje={erroresCampos['tipo']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Valor descuento (Según el tipo de decuento)</label>
                                        <input onChange={handleValorChange} className="form-control form--control pl-3" type="text" name="valor" maxLength="8" value={valor} placeholder="" />
                                        {erroresCampos['valor'].length > 0 && (<SpamError mensaje={erroresCampos['valor']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Cupones máximos a redimir</label>
                                        <input onChange={handleMaximoRedimirChange} className="form-control form--control pl-3" type="text" name="maximo_a_redimir" maxLength="5" value={maximoRedimir} placeholder="" />
                                        {erroresCampos['maximo_a_redimir'].length > 0 && (<SpamError mensaje={erroresCampos['maximo_a_redimir']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Estado</label>
                                        <select onChange={handleEstadoChange} value={estado} name="estado" className="form-control select-dark">
                                            <option value=""> -- Seleccione --</option>                                            
                                            <option value="1">Activado</option>
                                            <option value="0">Desactivado</option>
                                        </select>    
                                        {erroresCampos['estado'].length > 0 && (<SpamError mensaje={erroresCampos['estado']} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                            
                    <div className="course-submit-btn-box pb-4">
                        <button className="btn theme-btn" type="submit" onClick={handleCrearCupon}>Crear cupón</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default FormularioCrearCupon;