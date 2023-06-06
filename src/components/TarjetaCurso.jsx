import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function TarjetaCurso(
    {
        idcurso=0,
        url_amigable='',
        nombre='Nombre curso', 
        imagen='/images/img8.jpg',
        bestseller=0, 
        promocionado=0, 
        gratis=0, 
        alto_valorado=0,
        porcentaje_descuento=0,
        nivel=1,
        instructor='',
        reviews_puntuacion=0.0,
        reviews_cantidad=0,
        precio_actual=0.00,
        precio_anterior=0.00,
        favorito=-1,
    }) {
        const {jwt} = useContext(AuthContext);
        const urlBase = import.meta.env.VITE_URL_BASE;    
        const urlBaseApi = import.meta.env.VITE_URL_BASE_API;    

        const [estadoFavorito, setEstadoFavorito] = useState(favorito);

        const niveles = {
            1: 'Básico',
            2: 'Intermedio',
            3: 'Experto',
        }
        const estrellas = [1, 2, 3, 4, 5];
        
        const handleSetFavorito = () =>{
            if(estadoFavorito==0){
                establecerFavorito();
            }else{
                retirarFavorito();
            }
        }

        const establecerFavorito = async (event) => {
                                   
            const formData = new FormData();
            formData.append('id_curso', idcurso);           
            const opciones = {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: formData
            };
            
            try {
                const response = await fetch(`${urlBaseApi}/api/cursofavorito`, opciones);
                const data = await response.json();
            
                if (response.ok) {
                    setEstadoFavorito(1);
                    return;
                } else {
                    // Obtener el código de error de la respuesta
                    const statusCode = response.status;                
                                           
                    // Mostrar mensaje de error según el código de error
                    switch (statusCode){
                        case 400:
                            console.error('Error 400: Bad Request');                        
                        break;
                        case 401:
                            console.error('Error 401: Unauthorized');
                            console.log('Datos de error:', data);
                        break;
                        case 404:
                            console.error('Error 404: Not Found');
                            console.log('Datos de error:', data);
                        break;
                        case 500:
                            console.error('Error 500: Internal Server Error');
                            console.log('Datos de error:', data);
                        break;
                        default:
                            console.error('Error desconocido');
                            console.log('Datos de error:', data);
                      break;
                    }                    
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }
        };    

        const retirarFavorito = async (event) => {
                                              
            const opciones = {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                }
            };
            
            try {
                const response = await fetch(`${urlBaseApi}/api/cursofavorito/${idcurso}`, opciones);
                const data = await response.json();
            
                if (response.ok) {
                    setEstadoFavorito(0);
                    return;
                } else {
                    // Obtener el código de error de la respuesta
                    const statusCode = response.status;                
                                           
                    // Mostrar mensaje de error según el código de error
                    switch (statusCode){
                        case 400:
                            console.error('Error 400: Bad Request');                        
                        break;
                        case 401:
                            console.error('Error 401: Unauthorized');
                            console.log('Datos de error:', data);
                        break;
                        case 404:
                            console.error('Error 404: Not Found');
                            console.log('Datos de error:', data);
                        break;
                        case 500:
                            console.error('Error 500: Internal Server Error');
                            console.log('Datos de error:', data);
                        break;
                        default:
                            console.error('Error desconocido');
                            console.log('Datos de error:', data);
                      break;
                    }                    
                }                
            }catch (error) {
                console.error('Error de conexión:', error);
            }
        };   

        //console.log("Este es el favorito ", estadoFavorito);
        return (<div className="col-lg-6 responsive-column-half">
                    <div className="card card-item card-preview" data-tooltip-content="#tooltip_content_1">
                        <div className="card-image">
                            <Link to={`${urlBase}/curso/${idcurso}/${url_amigable}`} className="d-block">
                                <img className="card-img-top lazy" src="/images/img-loading.png" data-src={imagen} alt={nombre} />
                            </Link>
                            <div className="course-badge-labels">
                                {bestseller==1 && <div className="course-badge">Más vendidos</div>}
                                {promocionado==1 && <div className="course-badge red">Promocionado</div>}
                                {gratis==1 && <div className="course-badge green">Gratis</div>}
                                {alto_valorado==1 && <div className="course-badge sky-blue">Mejores reseñas</div>}
                                {porcentaje_descuento!=0 && <div className="course-badge blue">-{porcentaje_descuento}%</div>}
                            </div>
                        </div>
                        <div className="card-body">
                            <h6 className="ribbon ribbon-blue-bg fs-14 mb-3">{niveles[nivel]}</h6>
                            <h5 className="card-title"><Link to={`${urlBase}/curso/${idcurso}/${url_amigable}`}>{nombre}</Link></h5>
                            {instructor!='' && <p className="card-text"><a href="teacher-detail.html">{instructor}</a></p>}
                            <div className="rating-wrap d-flex align-items-center py-2">
                                <div className="review-stars">
                                    <span className="rating-number">{reviews_puntuacion}</span>                                    
                                    {estrellas.map((number) => (                                                                                
                                        <span key={`estrella-${idcurso}-${number}`} className={`la la-star${reviews_puntuacion < number ? "-o" : ""}`}></span>
                                    ))}                                    
                                </div>
                                <span className="rating-total pl-1">({reviews_cantidad})</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="card-price text-black font-weight-bold">{precio_actual} {precio_anterior!=0 && <span className="before-price font-weight-medium">{precio_anterior}</span>}</p>
                                {estadoFavorito!=-1 && <div className="icon-element icon-element-sm shadow-sm cursor-pointer" title="Agregar a favoritos" onClick={handleSetFavorito}><i className={`la la-heart${estadoFavorito==0 ? '-o' : '' }`}></i></div>}
                            </div>
                        </div>
                    </div>
                </div>);          
}

export default TarjetaCurso;