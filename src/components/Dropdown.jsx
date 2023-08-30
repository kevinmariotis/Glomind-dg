// Dropdown.js
// Aparece en la parte superior de la presentacion del curso "/play" para marcar como favorito el curso o archivarlo, originalmente boostrap-jquery, no se econtro el codigo fuente js que lo hacia funcionar y toco crearlo como componente
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
/*

    Ejemplo de data 1; [{nombre:'Hola', tipo_link:'link', 'href':'/carrito'}]
    Ejemplo de data 2; [{nombre:'Hola', tipo_link:'funcion', 'href':()=>{ alert("hola"); }}
*/

function Dropdown({data=[]}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate(); 

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

    const handleItemClick = (item) => {
        if (item.tipo_link === 'link') {
            navigate(item.href);            
        } else if (item.tipo_link === 'funcion') {
            item.href();
        }
    };

    return (
        <div ref={dropdownRef} className={`dropdown ${isOpen ? 'show' : ''}`}>            
            <a onClick={handleToggle}  aria-expanded={isOpen ? 'true' : 'false'} className="action-btn" href="#" role="button" data-toggle="dropdown" aria-haspopup="true">
                <i className="la la-ellipsis-v"></i>
            </a>
            <div className={`dropdown-menu dropdown-menu-right ${isOpen ? 'show' : ''}`} aria-labelledby="dropdownButton">
                {data.map((item, index) =>
                    <div key={`drop-key-${index}`} className="dropdown-item" style={{cursor:'pointer'}} onClick={() => handleItemClick(item)}>{item.nombre}</div>
                )}                                
            </div>
        </div>
  );
}

export default Dropdown;