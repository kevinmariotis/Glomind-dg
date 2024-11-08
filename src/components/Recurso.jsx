import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import Popup from './Popup';

function Recurso({id_contenido}){
    const {jwt, esMovil} = useContext(AuthContext);
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;              
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});    
    const [mimeType, setMimeType] = useState("");
    const [fileType, setFileType] = useState("");
    const [rutaArchivo, setRutaArchivo] = useState("");
    const [datos, setDatos] = useState({});

    useEffect(() => {        
        obtenerDatosServidor();        
    }, [id_contenido]);

    useEffect(() => {           
        
    }, []);
    
    const handleFuncionAceptarPopUp = () => {        
        /*switch(popUp.data_switch){
            
        }*/
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
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
            const response = await fetch(`${urlBaseApi}/api/cursocontenido/${id_contenido}`, opciones);            
            const datos = await response.json();   
            if (response.ok){                      
                setDatos(datos);

                let ruta_archivo = urlBaseApi + '/' + datos.ruta_archivo.replace('public/', '');
                let file_parts   = datos.ruta_archivo.split('/');
                let file_type    = (file_parts[2].split('.'))[1];
                setFileType(file_type);
                setMimeType(file_type);
                setRutaArchivo(ruta_archivo);
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});                    
            }     
                     
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const handleItemClick = async (item) => {                
        const response = await fetch(rutaArchivo);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${datos.nombre}.${rutaArchivo.split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setPopup({mostrar:true, titulo:'Mensaje', contenido:'El archivo está siendo descargado, por favor revise su carpeta de descargas.'});
    };

    
    let style_pdf = {
        height: '100%', 
        position: 'absolute', 
        top: '0', 
        left: '0', 
        width: '100%'
    }

    let style_nopdf  = {
        'display': 'flex',
        'flexDirection': 'column',
        'alignContent': 'center',
        'justifyContent': 'center',
        'alignItems': 'center',
        height: '100%', 
        position: 'relative', 
        top: '0', 
        left: '0', 
        width: '100%'
    } 

    return(
        <>
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
            <div style={ fileType == 'pdf' ? style_pdf : style_nopdf }>
                {(fileType == 'pdf' && !esMovil) && <iframe width="100%" height="100%" src={ rutaArchivo }  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>}
                {( (fileType != 'pdf' || (fileType == 'pdf' && esMovil)) && (fileType != 'jpg' && fileType != 'jpeg' && fileType != 'png')) && <div style={{marginBottom:'300px', marginTop:'150px'}}><div style={{marginBottom:'10px'}}>El archivo no se puede abrir en el navegador</div><button onClick={() => handleItemClick()} href="#" className="btn theme-btn">Descargar archivo</button></div>}
                {(fileType != 'pdf' && (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png')) && <div><img src={ rutaArchivo } className='img-fluid m-3'/></div>}
            </div>
        </>
    )   
}

export default Recurso;