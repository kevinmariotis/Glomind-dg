import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Buscador({class_name=""}) {        
    const { jwt, temaActual } = useContext(AuthContext);
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
    const [buscar, setBuscar] = useState('');
    const [resultados, setResultados] = useState({});
    const [indexSeleccionado, setIndexSeleccionado] = useState(0);

    const navigate = useNavigate(); 

    useEffect(() => {        
        if(buscar!=''){
            buscarCursos();
        }
    }, [buscar]);

    useEffect(() => {        
        const handleClick = (event) => {                           
            setResultados({});
            setIndexSeleccionado(0);
        };            
        document.addEventListener('click', handleClick);
    
        return () => {
            document.removeEventListener('click', handleClick);
        };
      }, []);

    const buscarCursos = async () => {    
        if(buscar!=''){
            const headers = {
                'Authorization':`Bearer ${jwt}`,
            }        
            try { 
                console.log("intentanto buscar ", buscar);
                //buscamos los datos de los cursos a mostrar                       
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };                                    
                const response = await fetch(`${urlBaseApi}/api/curso/buscar/${buscar}/1`, opciones);            
                if (response.ok){                 
                    const datos = await response.json();
                    setResultados(datos);    
                    setIndexSeleccionado(0);            
                }                          
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        }
    };

    const handleEscribir = (event) => { setBuscar(event.target.value);  };  
    const handleKeyDown = (event) => { 
        //event.preventDefault();  
        switch (event.keyCode) {
            case 38:                
                console.log("subiendo ", ((indexSeleccionado - 1) % resultados.length) < 0 ? resultados.length-1 : (indexSeleccionado - 1) % resultados.length);
                setIndexSeleccionado(((indexSeleccionado - 1) % resultados.length) < 0 ? resultados.length-1 : (indexSeleccionado - 1) % resultados.length);                
                break;
            case 40:
                console.log("bajando", (indexSeleccionado + 1) % resultados.length);
                setIndexSeleccionado((indexSeleccionado + 1) % resultados.length);
                break;
            case 13:    
                event.preventDefault();  
                if(Object.keys(resultados).length>0){                    
                    for(let i = 0; i < resultados.length; i++) {
                        if(i==indexSeleccionado){
                            setBuscar('');
                            setResultados({});
                            setIndexSeleccionado(0);
                            navigate(`/curso/${resultados[i].url_amigable}`); 
                        }
                    }                       
                }
                break;
        }
    };  

    const handleMouseEnter = (event) => {
        const dataIdValue = event.target.dataset.key;
        //console.log("el key es", dataIdValue);
        setIndexSeleccionado(dataIdValue);
    };

    const handleClickElement = (event) => {                
        const url_amigable = event.target.dataset.url_amigable;        
        //console.log("la url encontrada es ", url_amigable);
        setBuscar('');        
        setResultados({});
        setIndexSeleccionado(0);
        navigate(`/curso/${url_amigable}`);
    };
    
    return (
        <form method="post" className={class_name}>
            <div className="form-group mb-0">                                        
                <input onKeyDown={handleKeyDown} onChange={handleEscribir} onClick={buscarCursos}  value={buscar} className="form-control form--control pl-3" type="text" name="buscador" placeholder="Buscar cursos" />
                <span className="la la-search search-icon"></span>
                <div style={{position:'absolute', width:'100%'}}>
                    <ul style={{width:'100%', borderRadius: '5px'}} class={`suggestions ${temaActual==0 ? 'dark-theme' : 'light-fondo-li'}`}>
                        {Object.keys(resultados).map((key) => (
                            <li onClick={e => handleClickElement(e) } onMouseEnter={handleMouseEnter} data-url_amigable={resultados[key].url_amigable} data-key={key} class={`${key==indexSeleccionado ? 'ul_seleccionado' : ''}`} style={{cursor:'pointer', borderRadius: '5px', paddingLeft:'5px', paddingTop:'5px', paddingBottom:'5px', paddingRight:'10px'}}>
                                <>                                
                                    <img className="mr-3" style={{ height: '20px', borderRadius: '10%', cursor:'pointer' }} src={`${resultados[key].imagen_pequena!=null ? `${urlBaseApi}/${resultados[key].imagen_pequena}` : `${urlBase}/images/course-no-image.png`}`} alt="imagen de producto" />                                
                                    {resultados[key].nombre}
                                </>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </form>
    );
}

export default Buscador;