import React, {useContext, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioCrearCertificado() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const navigate = useNavigate(); 
    const {jwt, permissions, temaActual} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});        
        
    const [nombre, setNombre] = useState('');
    const [html, setHtml] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [estado, setEstado] = useState('');
        
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
         
            
    //Estados de los errores de campos
    const camposErrores = {        
        'nombre':[],
        'html':[],
        'imagen':[],
        'mensaje':[],
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
              
    const handleFuncionAceptarPopUp = () => {        
        switch(popUp.data_switch){
            case 'certificado-creado':
                navigate('/certificado');
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
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
    const fileList = acceptedFiles.map((file, index) => (
        <li key={`imagen-ajunta${index}`}>{file.name}</li>
    ));

    const handleNombreChange = (event) => { setNombre(event.target.value);    };                      
    const handleHtmlChange = (event) => { setHtml(event.target.value); };
    const handleEstadoChange = (event) => { setEstado(event.target.value); };
         
    const handleCrearCertificado = async (event) => {
        event.preventDefault();        
        reiniciarErrorCampoGlobal();
        if(selectedImage!=null){    
            const formData = new FormData();               
            formData.append('nombre', nombre);        
            formData.append('html', html);        
            formData.append('estado', estado);
            formData.append('imagen', selectedImage);

            const opcionesx = {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: formData
            };
            
            try {
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/certificado`, opcionesx);
                setMostrarSpinner(false);
                const datos = await response.json();            
                if (response.ok){   
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Certificado creado correctamente.', data_switch:'certificado-creado'});
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error al crear el certificado', 'contenido': 'Revise los errores en el formulario.'});
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }
        }else{
            setPopup({mostrar:true, titulo:'Seleccione la imagen', contenido:'El certificado se debe crear con la imagen'});
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
        <div className="dashboard-content-wrap">
            <div className="container-fluid">
                <div className="dashboard-heading mb-5">                    
                    <h3 className="fs-22 font-weight-semi-bold"><Link to={`/certificado`}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la lista de certificados"><i className="la la-angle-left"></i></div></Link>&nbsp;Crear certificado</h3>                    
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
                                        <input onChange={handleNombreChange} className="form-control form--control pl-3" type="text" name="nombre" maxLength="64" value={nombre} placeholder="" />
                                        {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="label-text">Html</label>
                                        <textarea rows={12} onChange={handleHtmlChange} value={html} className="form-control form--control user-text-editor pl-3" name="desc_general"></textarea>                                        
                                        {erroresCampos['html'].length > 0 && (<SpamError mensaje={erroresCampos['html']} />)}
                                    </div>
                                </div>  
                                <div className="col-lg-6">
                                    <div className="form-group mb-0">
                                        <label className="label-text">Imágen de fondo del certificado (3560 x 2512 px)</label>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} className="multi file-upload-input" />
                                            <span className="file-upload-text"><i className="la la-cloud-upload mr-2 fs-18"></i>Seleccona o arrastra la imagen aquí.</span>
                                        </div>
                                        <ul>{fileList}</ul>                                        
                                        {erroresCampos['imagen'].length > 0 && (<SpamError mensaje={erroresCampos['imagen']} />)}
                                        {erroresCampos['mensaje'].length > 0 && (<SpamError mensaje={erroresCampos['mensaje']} />)}
                                    </div>
                                </div>                                                              
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label className="label-text">Estado</label>
                                        <select onChange={handleEstadoChange} value={estado} name="estado" className="form-control select-dark">
                                            <option value=""> -- Seleccione --</option>                                            
                                            <option value="0">Desactivado</option>
                                            <option value="1">Activado</option>                                            
                                        </select>    
                                        {erroresCampos['estado'].length > 0 && (<SpamError mensaje={erroresCampos['estado']} />)}
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>                            
                    <div className="course-submit-btn-box pb-4">
                        <button className="btn theme-btn" type="submit" onClick={handleCrearCertificado}>Crear certificado</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default FormularioCrearCertificado;