import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function TarjetaCursoAdmin(
    {
        idcurso=0,
        url_amigable='',
        nombre='Nombre curso', 
        imagen='/images/img8.jpg',                
        instructor='',
        id_instructor=0,
        descripcion_instructor='',
        reviews_puntuacion=0.0,        
        porcentaje_progreso=0,
    }) {
        const {jwt} = useContext(AuthContext);
        const urlBase = import.meta.env.VITE_URL_BASE;    
        const urlBaseApi = import.meta.env.VITE_URL_BASE_API;    
        
        const estrellas = [1, 2, 3, 4, 5];

        //console.log("Este es el favorito ", estadoFavorito);
        return (<div className="col-lg-4 responsive-column-half">
                    <div className="card card-item">
                        <div className="card-image">
                            <Link to={`${urlBase}/play/${url_amigable}`} className="d-block">
                                <img className="card-img-top" src={imagen!='/images/img8.jpg' ? urlBaseApi+'/'+imagen : imagen} alt="Card image cap" />
                                <div className="play-button">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="-307.4 338.8 91.8 91.8">                                                          
                                        <g>
                                            <circle style={{ opacity: '0.6', fill:'#000000', borderRadius: '100px'  }} cx="-261.5" cy="384.7" r="45.9"></circle><path style={{  fill:'#FFFFFF'}} d="M-272.9,363.2l35.8,20.7c0.7,0.4,0.7,1.3,0,1.7l-35.8,20.7c-0.7,0.4-1.5-0.1-1.5-0.9V364C-274.4,363.3-273.5,362.8-272.9,363.2z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </Link>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title"><Link to={`${urlBase}/play/${url_amigable}`}>{nombre}</Link></h5>
                            {instructor!='' && <p className="card-text lh-22 pt-2"><Link to={`${urlBase}/usuario/${id_instructor}`}>{instructor}</Link><span>{descripcion_instructor!='' ? '. ':''} {descripcion_instructor}</span></p>}                            
                            <div className="my-course-progress-bar-wrap d-flex align-items-center pt-3">
                                <p className="skillbar-title">Completado:</p>
                                <div className="skillbar-box">
                                    <div className="skillbar skillbar-skillbar-2" data-percent={`${porcentaje_progreso}%`}>
                                        <div className="skillbar-bar skillbar--bar-2 bg-1" style={{width:`${porcentaje_progreso}%`}}></div>
                                    </div>
                                </div>
                                <div className="skill-bar-percent">{porcentaje_progreso}%</div>
                            </div>
                            { /*<div className="rating-wrap d-flex align-items-center justify-content-between pt-3">
                                <div className="review-stars">
                                    {estrellas.map((number) => (                                                                                
                                        <span key={`estrella-${idcurso}-${number}`} className={`la la-star${reviews_puntuacion < number ? "-o" : ""}`}></span>
                                    ))}   
                                </div>
                                <Link to={`${urlBase}/curso/${url_amigable}`} className="btn theme-btn theme-btn-sm theme-btn-transparent" data-toggle="modal" data-target="#ratingModal">Dejar una reseña</Link>
                            </div> */ }
                        </div>
                    </div>
                </div>
            );          
}

export default TarjetaCursoAdmin;