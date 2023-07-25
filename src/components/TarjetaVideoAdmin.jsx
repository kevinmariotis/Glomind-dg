import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function TarjetaVideoAdmin(
    {
        idvideo=0,        
        nombre='Nombre video', 
        imagen_grande='/images/img8.jpg',   
        imagen_pequena='/images/img8.jpg',   
        duracion='00:00:00',
        videogrande='',
        permisoEditar=false
    }) {        
        const urlBase = import.meta.env.VITE_URL_BASE;    
        const urlBaseApi = import.meta.env.VITE_URL_BASE_API;    
        const [popUp, setPopup] = useState({mostrar:false, titulo:'Vista previa', contenido:''});            
        const [posterVistaPrevia, setPosterVistaPrevia] = useState('');    

        const handleFuncionCerrarPopUp = () => {        
            setPopup({...popUp, mostrar:false});
        };

        //console.log("Este es el favorito ", estadoFavorito);
        return (
                <>
                    <Modal show={popUp.mostrar} size="xl" onHide={handleFuncionCerrarPopUp} backdrop="static" keyboard={true} animation={true} centered>
                        {(popUp.titulo!='') && <Modal.Header>
                            <Modal.Title>{popUp.titulo}</Modal.Title>                   
                        </Modal.Header>}
                        <Modal.Body>   
                            <video controls crossOrigin="true" playsInline poster={`${posterVistaPrevia!='' ? `${urlBaseApi}/${posterVistaPrevia}` : `${urlBase}/images/pattern.png` }`} id="player" style={{'width':'100%'}}>                                
                                <source src={`${urlBaseApi}/${popUp.contenido}`} type="video/mp4"/>                                
                            </video>
                        </Modal.Body>
                        <Modal.Footer>                
                            <Button variant="secondary" onClick={handleFuncionCerrarPopUp}>Cerrar</Button>
                        </Modal.Footer>
                    </Modal>
                    <div className="col-lg-3 responsive-column-half">
                        <div className="card card-item">
                            <div className="card-image">
                                <div className="d-block" style={{cursor: 'pointer'}} onClick={()=>{ setPosterVistaPrevia(imagen_grande); setPopup({...popUp, mostrar:true, 'contenido':videogrande}); }}>
                                    <img className="card-img-top" src={imagen_pequena!='/images/img8.jpg' ? urlBaseApi+'/'+imagen_pequena : imagen_pequena} alt="Card image cap" />
                                    <div className="play-button">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="-307.4 338.8 91.8 91.8">                                                          
                                            <g>
                                                <circle style={{ opacity: '0.6', fill:'#000000', borderRadius: '100px'  }} cx="-261.5" cy="384.7" r="45.9"></circle><path style={{  fill:'#FFFFFF'}} d="M-272.9,363.2l35.8,20.7c0.7,0.4,0.7,1.3,0,1.7l-35.8,20.7c-0.7,0.4-1.5-0.1-1.5-0.9V364C-274.4,363.3-273.5,362.8-272.9,363.2z"></path>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title"><Link to={`${urlBase}/video/${idvideo}`}>{nombre}</Link></h5>                                                        
                                <p className="card-text lh-22 pt-2"><span>{duracion}</span></p>
                                <div className="rating-wrap d-flex align-items-center justify-content-between pt-3">                                
                                    {permisoEditar && <Link to={`${urlBase}/video/editar/${idvideo}`} className="btn theme-btn theme-btn-sm theme-btn-transparent" data-toggle="modal" data-target="#ratingModal"><i className="la la-gear"></i> Editar</Link>}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );          
}

export default TarjetaVideoAdmin;