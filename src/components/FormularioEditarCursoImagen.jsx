import React, {useContext, useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import DashboardFooter from './DashboardFooter';

function FormularioEditarCursoImagen() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;   
    const { id } = useParams();
    const {jwt, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});        
    const [selectedImage, setSelectedImage] = useState(null);
    
    const [nombre, setNombre] = useState('');    
    const [imagenActual, setImagenActual] = useState('');
        
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        obtenerDatosServidor();        
    }, []);
              
    //Estados de los errores de campos
    const camposErrores = {        
        'imagen':[],        
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
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
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


    const obtenerDatosServidor = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/curso/${id}`, opciones);            
            const datos = await response.json();   
            if (response.ok){      
                setNombre(datos.curso.nombre);               
                setImagenActual(datos.curso.imagen_pequena);
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleActualizarCurso = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
        
        if(selectedImage!=null){
            setMostrarSpinner(true);
            try{
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
                    obtenerDatosServidor();                    
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Imagen guardada satisfactoriamente'});
                    return;
                } else {
                    mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'Error', 'contenido': 'Hubo un error al subir la imagen, revise el formulario.'});                                                                    
                }
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        }else{
            setPopup({mostrar:true, titulo:'Mensaje', contenido:'Seleccione una imagen de su dispositivo.'});
        }

    }
        
    const handleQuitarImagen = (event) => {         
        event.preventDefault();                               
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
                    <h3 className="fs-22 font-weight-semi-bold"><Link to={`/cursos`}><div className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary" data-toggle="tooltip" data-placement="top" data-title="Volver a la edición de contenidos"><i className="la la-angle-left"></i></div></Link>&nbsp;{nombre}</h3>
                    <span style={{marginLeft:'55px'}}>Editar imagen del curso</span>
                </div>
                <form action="#">                                                                                
                    {permissions[66] ? <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-22 font-weight-semi-bold pb-2">Imagen del curso</h3>
                            <div className="divider"><span></span></div>
                            <div className="row">                                                                
                                <div className="col-lg-12">
                                    <div className="form-group mb-0">
                                        <label className="label-text">Tenga en cuenta si la imagen no es del tamaño 1920px x 450px el sistema intentará re-dimensionarla a este tamaño, si la escala (o aspec ratio) no permite redimensionarla a este tamaño no se guardará, debe de tener el tamaño suficiente para poder ser re-dimensionada a este tamaño o ser especificamente de este tamaño. Esta imagen se mostrará en las tarjetas del curso en la navegación por categorías, en las tarjetas de la página de inicio y el carrito de compras.</label>
                                        <div {...getRootProps()}>
                                            {imagenActual!=null && 
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

export default FormularioEditarCursoImagen;