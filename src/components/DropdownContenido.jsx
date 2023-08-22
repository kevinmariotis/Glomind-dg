// Dropdown.js
// Es el drowp dow que originalmente aparece para descargar recursos
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
/*

    Ejemplo de data; [{descripcion:"Descargable uno", id:7, nombre:"Descargable uno", ruta_archivo:"public/descargables/d_7_9dnBtuUWLady00d2.pdf"}]
*/

function DropdownContenido({data={}}) {
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API; 
    const [isOpen, setIsOpen] = useState(false);
    const [popUp, setPopup] = useState({mostrar:false, titulo:'', contenido:''});    
    const navigate = useNavigate(); 

    const dropdownRef = useRef(null);
    
    const handleFuncionAceptarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false});
    };


    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleCloseOnOutsideClick = (event) => {
        if (isOpen && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleCloseOnOutsideClick);
        return () => {
            document.removeEventListener('click', handleCloseOnOutsideClick);
        };
    }, [isOpen]);

    const handleItemClick2 = (item) => {     
        const parts = item.split("public/");        
        window.open(`${urlBaseApi}/${parts[1]}`, '_blank');
    };

    const handleItemClick = async (item) => {
        const parts = item.ruta_archivo.split("public/");      
        const url = `${urlBaseApi}/${parts[1]}`;
        
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${item.nombre}.${item.ruta_archivo.split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setPopup({mostrar:true, titulo:'Mensaje', contenido:'El archivo está siendo descargado, por favor revise su carpeta de descargas.'});
    };

    return ( 
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
            <div ref={dropdownRef} className={`dropdown ${isOpen ? 'show' : ''}`}>
                <a onClick={handleToggle} className="btn theme-btn theme-btn-sm theme-btn-transparent mt-1 fs-14 font-weight-medium" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded={isOpen ? 'true' : 'false'}>
                    <i className="la la-folder-open mr-1"></i> Recursos<i className="la la-angle-down ml-1"></i>
                </a>
                <div className={`dropdown-menu dropdown-menu-right ${isOpen ? 'show' : ''}`}>
                    {Object.keys(data).map((key) => (
                        <div className="dropdown-item" style={{cursor:'pointer'}} onClick={() => handleItemClick(data[key])}>
                            {data[key].nombre}.{data[key].ruta_archivo.split('.').pop()}
                        </div>
                    ))}
                </div>
            </div>
        </>
  );
}

export default DropdownContenido;