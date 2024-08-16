import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import TarjetaCursoAdmin from './TarjetaCursoAdmin';
import Paginador from './Paginador';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioEditarCurso() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const { id } = useParams();
    const {jwt, nombres, permissions, temaActual} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});    
    const [categorias, setCategorias] = useState({});    
    const [cursos, setCursos] = useState([]);    
    const [paginaNavegacion, setPaginaNavegacion] = useState(1);
    const [totalCursos, setTotalCursos] = useState(1);
    
    const [searchValueInstructor, setSearchValueInstructor] = useState('');
    const [optionsInstructor, setOptionsInstructor] = useState([]);
    const [instructorSeleccionado, setInstructorSeleccionado] = useState(null);
    
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nivel, setNivel] = useState('');
    const [promocionado, setPromocionado] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({nombre:'Ninguna', id:0}); //id y nombre
    const [expedirCerfificado, setExpedirCertificado] = useState('');
    const [notaMinimaSuperado, setNotaMinimaSuperado] = useState(permissions[69] ? '' : '0');
    const [estado, setEstado] = useState(permissions[65] ? '' : '0');
    const [precioActual, setPrecioActual] = useState(permissions[64] ? '' : '0');
    const [precioAnterior, setPrecioAnterior] = useState(permissions[64] ? '' : '0');
    const [examenesSoloPago, setExamenesSoloPago] = useState(permissions[64] ? '' : '0');
    const [precioAdicionalExamenes, setPrecioAdicionalExamenes] = useState(permissions[64] ? '' : '0');
    const [certificadoSoloPago, setCertificadoSoloPago] = useState(permissions[64] ? '' : '0');
    const [precioAdicionalCertificado, setPrecioAdicionalCertificado] = useState(permissions[64] ? '' : '0');
    const [descripcion, setDescripcion] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagenActual, setImagenActual] = useState('');

    const [searchValueCertificado, setSearchValueCertificado] = useState('');
    const [optionsCertificado, setOptionsCertificado] = useState([]);
    const [idCertificado, setIdCertificado] = useState(null);
    
    const [queAprenderas, setQueAprenderas] = useState([]);
    const [requierimientos, setRequerimientos] = useState([]);
        
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        obtenerDatosServidor();
        obtenerCategorias(0);
    }, []);

    useEffect(() => {         
        if(searchValueInstructor!=''){
            obtenerDatosDocentes();       
        } 
    }, [searchValueInstructor]);            

    useEffect(() => {         
        if(searchValueCertificado!=''){
            obtenerDatosCertificado();       
        } 
    }, [searchValueCertificado]);      

    const handleNombreChange = (event) => { setNombre(event.target.value);    };  
    const handleCodigoChange = (event) => { setCodigo(event.target.value);    };  
    const handleNivelChange = (event) => { setNivel(event.target.value);    };  
    const handlePromocionadoChange = (event) => { setPromocionado(event.target.value);    };  
    const handleExpedirCertiticadoChange = (event) => { setExpedirCertificado(event.target.value);    };  
    const handleIdCertificadoChange = (event) => { setIdCertificado(event.target.value);    };      
    const handleNotaMinimaSuperadoChange = (event) => { setNotaMinimaSuperado(event.target.value);    };  
    const handleEstadoChange = (event) => { setEstado(event.target.value);    };  
    const handlePrecioActualChange = (event) => { setPrecioActual(event.target.value);    };  
    const handlePrecioAnteriorChange = (event) => { setPrecioAnterior(event.target.value);    };  
    const handleExamenesSoloPagoChange = (event) => { setExamenesSoloPago(event.target.value);    };  
    const handlePrecioAdicionalExamenesChange = (event) => { setPrecioAdicionalExamenes(event.target.value);    };  
    const handleCertificadoSoloPagoChange = (event) => { setCertificadoSoloPago(event.target.value);    };  
    const handlePrecioAdicionalCertificadoChange = (event) => { setPrecioAdicionalCertificado(event.target.value);    };  
    const handleDescripcionChange = (event) => { setDescripcion(event.target.value);    };  
    
    //Estados de los errores de campos
    const camposErrores = {
        'nombre':[],
        'codigo':[],
        'nivel':[],
        'promocionado':[],
        'id_categoria':[],
        'expedir_certificado':[],
        'nota_minima_superado':[],
        'certificado_solo_pago':[],
        'precio_actual':[],
        'precio_anterior':[],
        'examenes_solo_pago':[],
        'precio_adicional_examenes':[],
        'certificado_solo_pago':[],
        'precio_adicional_certificado':[],
        'id_instructor':[],
        'id_certificado':[],
        'desc_general':[],
        'desc_que_aprenderas':[],
        'desc_requerimientos':[],
        'imagen':[],
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

    const onDrop = (acceptedFiles) => {
        // Lógica para procesar los archivos aceptados
        setSelectedImage(acceptedFiles[0]);
    };
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg', '.jpg'],
        }
    });    

    const handleInputChangeInstructor = (newValue) => {        
        setSearchValueInstructor(newValue);                        
    };

    const handleInputChangeCertificado = (newValue) => {        
        setSearchValueCertificado(newValue);                        
    };

    const addQueAprenderas = (event) => {
        event.preventDefault();
        setQueAprenderas(prevTextareas => [...prevTextareas, '']);
    };
    const handleQueAprenderasChange = (event, index) => {
        const updatedTextareas = [...queAprenderas];
        updatedTextareas[index] = event.target.value;
        setQueAprenderas(updatedTextareas);
    };

    const addRequerimiento = (event) => {
        event.preventDefault();
        setRequerimientos(prevTextareas => [...prevTextareas, '']);
    };
    const handleRequerimientoChange = (event, index) => {
        const updatedTextareas = [...requierimientos];
        updatedTextareas[index] = event.target.value;
        setRequerimientos(updatedTextareas);
    };


    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };

    const handleSeleccionarCategoria = (event) => {                
        event.preventDefault();    
        
        const selectedIndex = event.target.selectedIndex;
        const selectedOptionText = event.target.options[selectedIndex].text;    
        setCategoriaSeleccionada({id:event.target.value, nombre:(categoriaSeleccionada.nombre!='Ninguna') ? categoriaSeleccionada.nombre+' > '+selectedOptionText : selectedOptionText});
        obtenerCategorias(event.target.value);
    };
        
    const handleReiniciarCategoria = (event) => {                
        event.preventDefault();           
        setCategoriaSeleccionada({id:0, nombre:'Ninguna'});
        obtenerCategorias(0);
    };

    const obtenerDatosServidor = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try { 
            setMostrarSpinner(true);           
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/curso/${id}`, opciones);            
            setMostrarSpinner(false);
            if (response.ok){   
                const datos = await response.json();   
                setNombre(datos.curso.nombre);
                setCodigo(datos.curso.codigo);
                setNivel(datos.curso.nivel);
                setPromocionado(datos.curso.promocionado);
                setExpedirCertificado(datos.curso.expedir_certificado);                
                setNotaMinimaSuperado(datos.curso.nota_minima_superado);
                setEstado(datos.curso.estado);
                setPrecioActual(datos.curso.precio_actual.replace(/\D/g, ''));
                setPrecioAnterior(datos.curso.precio_anterior.replace(/\D/g, ''));
                setExamenesSoloPago(datos.curso.examenes_solo_pago);
                setPrecioAdicionalExamenes(datos.curso.precio_adicional_examenes.replace(/\D/g, ''));
                setCertificadoSoloPago(datos.curso.certificado_solo_pago);
                setPrecioAdicionalCertificado(datos.curso.precio_adicional_certificado.replace(/\D/g, ''));
                setDescripcion(datos.curso.desc_general);
                setImagenActual(datos.curso.imagen_pequena);
                if(datos.curso.id_instructor!=0){
                    setInstructorSeleccionado({value:datos.curso.id_instructor, label:datos.curso.instructor});
                    setOptionsInstructor([{'value':datos.curso.id_instructor, 'label':datos.curso.instructor}]);
                }
                if(datos.curso.id_certificado!==null){                    
                    setIdCertificado({value:datos.curso.id_certificado, label:`${datos.curso.certificado_nombre} (${datos.curso.id_certificado})`});
                    setOptionsCertificado([{'value':datos.curso.id_certificado, 'label':`${datos.curso.certificado_nombre} (${datos.curso.id_certificado})`}]);                    
                }    

                let queaprenderasx = datos.curso.desc_que_aprenderas.split("<separador>");
                queaprenderasx.forEach(function(element) {                    
                    setQueAprenderas((estadoActual) => {                        
                        if (!estadoActual.includes(element)) {                            
                            const nuevoEstado = new Set([...estadoActual, element]);                            
                            return Array.from(nuevoEstado);
                        }
                        return estadoActual; // El elemento ya existe, no se agrega
                    });                    
                });

                let requerimientosx = datos.curso.desc_requerimientos.split("<separador>");
                requerimientosx.forEach(function(element) {                    
                    setRequerimientos((estadoActual) => {                        
                        if (!estadoActual.includes(element)) {                            
                            const nuevoEstado = new Set([...estadoActual, element]);                            
                            return Array.from(nuevoEstado);
                        }
                        return estadoActual; // El elemento ya existe, no se agrega
                    });                    
                });
                
                let arbolx = datos.arbol;
                let arbol_text = '';            
                arbolx.forEach(function(element) {  
                    if(arbol_text!=''){
                        arbol_text = arbol_text+' > ';
                    }
                    arbol_text = arbol_text+element.nombre;
                });    
                setCategoriaSeleccionada({nombre:arbol_text, id:datos.curso.id_categoria});
                obtenerCategorias(datos.curso.id_categoria);
            } else {     
                const datos = await response.json();            
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerCategorias = async (id_padre) => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
                        
            //buscamos los datos de los cursos a mostrar
            //setMostrarSpinner(true);
            const response2 = await fetch(`${urlBaseApi}/api/categoriasistema/getCategoriasPorPadre/${id_padre}/1`, opciones);
            //setMostrarSpinner(false);
            if (response2.ok){   
                const datos2 = await response2.json();   
                setCategorias(datos2);                
            } else {     
                const datos2 = await response2.json();            
                mensajesDeError(setPopup, response2.status, (typeof datos2.datos !== 'undefined') ? datos2.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerDatosDocentes = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response2 = await fetch(`${urlBaseApi}/api/curso/buscardocente/${searchValueInstructor}/1`, opciones);            
            if (response2.ok){   
                const datos2 = await response2.json();   
                let opciones = [];
                datos2.forEach(function(element) {
                    opciones.push({'value':element.id, 'label':element.nombres+' '+element.apellidos+' ('+element.identificacion+')'});
                });                
                setOptionsInstructor(opciones);
            } else {     
                const datos2 = await response2.json();            
                mensajesDeError(setPopup, response2.status, (typeof datos2.datos !== 'undefined') ? datos2.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerDatosCertificado = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response2 = await fetch(`${urlBaseApi}/api/curso/buscarcertificado/${searchValueCertificado}/1`, opciones);            
            if (response2.ok){   
                const datos2 = await response2.json();   
                let opciones = [];
                datos2.forEach(function(element) {
                    opciones.push({'value':element.id, 'label':element.nombre+' ('+element.id+')'});
                });                
                setOptionsCertificado(opciones);
            } else {     
                const datos2 = await response2.json();            
                mensajesDeError(setPopup, response2.status, (typeof datos2.datos !== 'undefined') ? datos2.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleActualizarCurso = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
        let queaprenderasx = '';
        let requerimientosx = '';                

        queAprenderas.forEach(function(element) {
            if(element.trim()!=''){
                queaprenderasx = (queaprenderasx!='') ? queaprenderasx+'\n'+element.trim() : queaprenderasx=element.trim();                            
            }
        });
        requierimientos.forEach(function(element) {
            if(element.trim()!=''){
                requerimientosx = (requerimientosx!='') ? requerimientosx+'\n'+element.trim() : requerimientosx=element.trim();                            
            }
        });
        const raw = {
            'compartir_empresas': '0',            
            'nombre': nombre.toString(),
            'codigo' : codigo.toString(),
            'nivel' : nivel.toString(),
            'promocionado' : promocionado.toString(),
            'id_instructor' : instructorSeleccionado!=null ? instructorSeleccionado.value.toString() : '0',
            'id_certificado' : idCertificado!=null ? idCertificado.value.toString() : '0',
            'precio_anterior' : precioAnterior.toString(),
            'precio_actual' : precioActual.toString(),
            'id_categoria' : categoriaSeleccionada.id.toString(),
            'idiomas' : 'es',
            'expedir_certificado' : expedirCerfificado.toString(),
            'nota_minima_superado' : notaMinimaSuperado.toString(),
            'desc_general' : descripcion,
            'examenes_solo_pago' : examenesSoloPago.toString(),
            'precio_adicional_examenes' : precioAdicionalExamenes.toString(),
            'certificado_solo_pago': certificadoSoloPago.toString(),
            'precio_adicional_certificado': precioAdicionalCertificado.toString(),            
            'estado' : estado.toString(),
            'desc_que_aprenderas' : queaprenderasx,
            'desc_requerimientos' : requerimientosx,
        };
                            
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/curso/${id}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                //Se sube la imagen si se tuviera una adjunta             
                if(selectedImage!=null){
                    setMostrarSpinner(true);
                    const formData = new FormData();
                    formData.append('imagen', selectedImage);
                    const opciones = {
                        method: 'POST',
                        headers: {
                            'Authorization' : `Bearer ${jwt}`
                        },
                        body: formData
                    };
                    const response = await fetch(`${urlBaseApi}/api/curso/actualizarImagen/${id}`, opciones);
                    const datos = await response.json();            
                    setMostrarSpinner(false);
                    if (response.ok){                      
                        setPopup({mostrar:true, titulo:'Listo', contenido:'Curso guardado satisfactoriamente'});
                        return;
                    } else {
                        mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Rellenar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});                                                                    
                    }

                }else{
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Curso guardado satisfactoriamente'});
                }
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Revisar formulario', 'contenido': 'Por favor rellene todos los campos del formulario correctamente.'});                                                                    
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }

    }

    const nivelHabilidad = ['', 'Básico', 'Intermedio', 'Avanzado'];
    const options = [];
    for (let i = 0; i <= 5; i += 0.1) {
        const optionValue = i.toFixed(2);
        options.push(
            <option key={optionValue} value={optionValue}>
                {optionValue}
            </option>
        );
    }

    const fileList = acceptedFiles.map((file, index) => (
        <li key={`imagen-ajunta${index}`}>{file.name}</li>
    ));


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
                    <h3 className="fs-22 font-weight-semi-bold"><Link to={`/cursos`}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la edición de contenidos"><i className="la la-angle-left"></i></div></Link>&nbsp;  {nombre}</h3>
                    <span style={{marginLeft:'55px'}}>Configuración del curso</span>
                </div>
                <form action="#">
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Información básica</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Nombre del curso</label>
                                        <input onChange={handleNombreChange} className="form-control form--control pl-3" type="text" name="nombre" maxLength="128" value={nombre} placeholder="Ej: Curso de React Avanzado" />
                                        {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Código único</label>
                                        <input onChange={handleCodigoChange} className="form-control form--control pl-3" type="text" name="codigo" maxLength="32" value={codigo} placeholder="Ej: 25T56-20231" />
                                        {erroresCampos['codigo'].length > 0 && (<SpamError mensaje={erroresCampos['codigo']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Nivel</label>                                        
                                        <select value={nivel} onChange={handleNivelChange} name="nivel" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value="1">Básico</option>
                                            <option value="2">Medio</option>
                                            <option value="3">Avanzado</option>
                                        </select>
                                        {erroresCampos['nivel'].length > 0 && (<SpamError mensaje={erroresCampos['nivel']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Promocionado?</label>                                        
                                        <select value={promocionado} onChange={handlePromocionadoChange} name="promocionado" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value="0">No</option>
                                            <option value="1">Si</option>                                            
                                        </select>
                                        {erroresCampos['promocionado'].length > 0 && (<SpamError mensaje={erroresCampos['promocionado']} />)}
                                    </div>
                                </div>
                                
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Categoría: </label>&nbsp;
                                        <label className="label-text">{categoriaSeleccionada.nombre}</label>&nbsp;
                                        {categoriaSeleccionada.id!=0 && <span onClick={handleReiniciarCategoria}>(Reiniciar)</span>}
                                        <select name="id_categoria" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`} onChange={handleSeleccionarCategoria}>
                                            <option value=""> -- Seleccionar sub categoría --</option>                                            
                                            {Object.keys(categorias).map((key) => (
                                                <option key={`catop-${categorias[key].id}`} value={categorias[key].id}>{categorias[key].nombre}</option>                                                
                                            ))}
                                        </select>
                                        {erroresCampos['id_categoria'].length > 0 && (<SpamError mensaje={erroresCampos['id_categoria']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Expedir ceritificado</label>                                        
                                        <select value={expedirCerfificado} onChange={handleExpedirCertiticadoChange} name="expedir_certificado" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value="0">No</option>
                                            <option value="1">Si</option>                                            
                                        </select>
                                        {erroresCampos['expedir_certificado'].length > 0 && (<SpamError mensaje={erroresCampos['expedir_certificado']} />)}
                                    </div>
                                </div>                                
                                {permissions[69] ? <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Nota mínima para superar el curso</label>
                                        <select value={notaMinimaSuperado} onChange={handleNotaMinimaSuperadoChange} name="nota_minima_superado" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value="0"> -- No aplica --</option>
                                            {options}                                  
                                        </select>
                                        {erroresCampos['nota_minima_superado'].length > 0 && (<SpamError mensaje={erroresCampos['nota_minima_superado']} />)}
                                    </div>
                                </div>: ''}
                                {permissions[65] ? <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Estado</label>
                                        <select value={estado} onChange={handleEstadoChange} name="estado" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value="1">Disponible para nuevas compras</option>
                                            <option value="0">No disponible para comprar</option>
                                        </select>
                                        {erroresCampos['estado'].length > 0 && (<SpamError mensaje={erroresCampos['estado']} />)}
                                    </div>
                                </div> : ''}
                                {permissions[74] ? <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Certificado</label>
                                        <input type="hidden" name="id_certificado" />                                        
                                        <Select
                                            name="certificado"
                                            value={idCertificado}
                                            onChange={(selectedOption) => setIdCertificado(selectedOption)}
                                            onInputChange={handleInputChangeCertificado}
                                            options={optionsCertificado}
                                            isClearable
                                            isSearchable
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: '#333',
                                                    borderColor: '#666',
                                                    color: '#fff',
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor: state.isSelected ? '#444' : '#333',
                                                    color: state.isSelected ? '#fff' : '#ccc',
                                                }),
                                                singleValue: (provided) => ({
                                                    ...provided,
                                                    color: '#fff',
                                                }),
                                                input: (provided) => ({
                                                    ...provided,
                                                    color: '#fff', // Asegura que el color del texto sea blanco
                                                }),
                                              }}
                                        />
                                        {erroresCampos['id_certificado'].length > 0 && (<SpamError mensaje={erroresCampos['id_certificado']} />)}
                                    </div>
                                </div> : ''}
                            </div>
                        </div>
                    </div>    
                    {permissions[64] && <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Costos</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                
                            <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Precio actual (Si es gratis colocar 0)</label>
                                        <input value={precioActual} onChange={handlePrecioActualChange} className="form-control form--control pl-3" type="text" name="precio_actual" maxLength="8" placeholder="Ej: 123000" />
                                        {erroresCampos['precio_actual'].length > 0 && (<SpamError mensaje={erroresCampos['precio_actual']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Precio anterior (Si no tiene, dejar en 0)</label>
                                        <input value={precioAnterior} onChange={handlePrecioAnteriorChange} className="form-control form--control tags-input" type="text" name="precio_anterior" maxLength="8" placeholder="Ej: 170000" />
                                        {erroresCampos['precio_anterior'].length > 0 && (<SpamError mensaje={erroresCampos['precio_anterior']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Exámenes solo pago</label>                                        
                                        <select value={examenesSoloPago} onChange={handleExamenesSoloPagoChange} name="examenes_solo_pago" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value="0">No</option>
                                            <option value="1">Si</option>                                            
                                        </select>
                                        {erroresCampos['examenes_solo_pago'].length > 0 && (<SpamError mensaje={erroresCampos['examenes_solo_pago']} />)}
                                    </div>
                                </div>   
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Precio adicional para exámenes</label>
                                        <input  value={precioAdicionalExamenes} onChange={handlePrecioAdicionalExamenesChange} className="form-control form--control tags-input" type="text" name="precio_adicional_examenes" maxLength="8" placeholder="Ej: 90000" />
                                        {erroresCampos['precio_adicional_examenes'].length > 0 && (<SpamError mensaje={erroresCampos['precio_adicional_examenes']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Certificado solo pago</label>                                        
                                        <select value={certificadoSoloPago} onChange={handleCertificadoSoloPagoChange} name="certificado_solo_pago" className={`form-control ${temaActual==1 ? '' : 'select-dark'}`}>
                                            <option value=""> -- Seleccione --</option>
                                            <option value="0">No</option>
                                            <option value="1">Si</option>                                            
                                        </select>
                                        {erroresCampos['certificado_solo_pago'].length > 0 && (<SpamError mensaje={erroresCampos['certificado_solo_pago']} />)}
                                    </div>
                                </div>   
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Precio adicional certificado</label>
                                        <input value={precioAdicionalCertificado} onChange={handlePrecioAdicionalCertificadoChange} className="form-control form--control tags-input" type="text" name="precio_adicional_certificado" maxLength="8" placeholder="Ej: 90000" />
                                        {erroresCampos['precio_adicional_certificado'].length > 0 && (<SpamError mensaje={erroresCampos['precio_adicional_certificado']} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {permissions[68] ? <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Instructor</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Instructor</label>
                                        <input type="hidden" name="id_instructor" />                                        
                                        <Select
                                            name="instructor"
                                            value={instructorSeleccionado}
                                            onChange={(selectedOption) => setInstructorSeleccionado(selectedOption)}
                                            onInputChange={handleInputChangeInstructor}
                                            options={optionsInstructor}
                                            isClearable
                                            isSearchable
                                            styles={{
                                                control: (provided) => ({
                                                  ...provided,
                                                  backgroundColor: '#333',
                                                  borderColor: '#666',
                                                  color: '#fff',
                                                }),
                                                option: (provided, state) => ({
                                                  ...provided,
                                                  backgroundColor: state.isSelected ? '#444' : '#333',
                                                  color: state.isSelected ? '#fff' : '#ccc',
                                                }),
                                                singleValue: (provided) => ({
                                                  ...provided,
                                                  color: '#fff',
                                                }),
                                                input: (provided) => ({
                                                  ...provided,
                                                  color: '#fff', // Asegura que el color del texto sea blanco
                                                }),
                                              }}
                                        />
                                        {erroresCampos['id_instructor'].length > 0 && (<SpamError mensaje={erroresCampos['id_instructor']} />)}
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>: ''}
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Descripción</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Descripción del curso</label>
                                        <textarea value={descripcion} onChange={handleDescripcionChange} className="form-control form--control user-text-editor pl-3" name="desc_general" ></textarea>
                                        {erroresCampos['desc_general'].length > 0 && (<SpamError mensaje={erroresCampos['desc_general']} />)}
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>                    
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Qué aprenderás</h3>
                            <div className="divider"><span></span></div>
                            {erroresCampos['desc_que_aprenderas'].length > 0 && (<SpamError mensaje={erroresCampos['desc_que_aprenderas']} />)}
                            <div className="row">                                
                                {queAprenderas.map((value, index) => (
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <textarea
                                                key={index}
                                                value={value}
                                                onChange={event => handleQueAprenderasChange(event, index)}
                                                className="form-control form--control user-text-editor pl-3"
                                                name="desc_que_aprenderas[]"
                                            />
                                        </div>
                                    </div>
                                ))}                                
                            </div>                            
                            <button className="btn theme-btn" onClick={addQueAprenderas}><i className="la la-plus mr-2"></i> Agregar otra</button>                            
                        </div>
                    </div>
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Requerimientos</h3>
                            <div className="divider"><span></span></div>
                            {erroresCampos['desc_requerimientos'].length > 0 && (<SpamError mensaje={erroresCampos['desc_requerimientos']} />)}
                            <div className="row">                                
                                {requierimientos.map((value, index) => (
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <textarea
                                                key={index}
                                                value={value}
                                                onChange={event => handleRequerimientoChange(event, index)}
                                                className="form-control form--control user-text-editor pl-3"
                                                name="desc_requerimientos[]"
                                            />
                                        </div>
                                    </div>
                                ))}                                
                            </div>
                            <button className="btn theme-btn" onClick={addRequerimiento}><i className="la la-plus mr-2"></i> Agregar otro</button>
                        </div>
                    </div>
                    {permissions[66] ? <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Imágen del curso</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                                                
                                <div className="col-lg-12">
                                    <div className="form-group mb-0">
                                        <label className="label-text">Imágen del curso</label>
                                        <div {...getRootProps()}>
                                            {imagenActual!='' && 
                                                <><img className="mr-3" src={`${urlBaseApi}/${imagenActual}`} alt="Imagen del curso"/><br/></>
                                            }                                                                                                        
                                            <input {...getInputProps()} className="multi file-upload-input" />
                                            <span className="file-upload-text"><i className="la la-cloud-upload mr-2 fs-18"></i>Seleccona o arrastra la imagen aquí.</span>
                                        </div>
                                        <ul>{fileList}</ul>                                        
                                        {erroresCampos['imagen'].length > 0 && (<SpamError mensaje={erroresCampos['imagen']} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : ''}                   
                    <div className="course-submit-btn-box pb-4">
                        <button className="btn theme-btn" type="submit" onClick={handleActualizarCurso}>Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default FormularioEditarCurso;