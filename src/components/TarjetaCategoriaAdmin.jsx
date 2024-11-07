import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';

function TarjetaCategoriaAdmin(
    {
        id_categoria=0,        
        nombre='Nombre categoría', 
        imagen=null,   
        funcionNavegar=null,
        funcionCantidadCursos=null,
    }) {
        const {jwt} = useContext(AuthContext);
        const urlBase = import.meta.env.VITE_URL_BASE;    
        const urlBaseApi = import.meta.env.VITE_URL_BASE_API;    
        const [cantidadCursos, setCantidadCursos] = useState(0); 

        useEffect(() => {    
            if(funcionCantidadCursos!=null){
                let cantidad = funcionCantidadCursos(id_categoria);
                setCantidadCursos(cantidad);
            }
        }, []);

        /*const handleNavegar = () => {            

        }*/

        //console.log("Este es el favorito ", estadoFavorito);
        return (<div className="col-lg-4 responsive-column-half">
                    <div className="category-item" onClick={()=>{ funcionNavegar(id_categoria) }} style={{cursor:'pointer'}}>
                        <img  className="cat__img lazy" src={imagen!=null ? urlBaseApi+'/'+imagen : '/images/img8.jpg'} data-src={imagen!=null ? urlBaseApi+'/'+imagen : '/images/img8.jpg'} alt="Category image" />
                        <div className="category-content">
                            <div className="category-inner">
                                <h3 className="cat__title"><a href="#">{nombre}</a></h3>
                                <p className="cat__meta">{cantidadCursos} {cantidadCursos>1 ? 'cursos' : 'curso'}</p>
                                <button onClick={()=>{ funcionNavegar(id_categoria) }} className="btn theme-btn theme-btn-sm theme-btn-white">Ver<i className="la la-arrow-right icon ml-1"></i></button>
                            </div>
                        </div>
                    </div>
                </div>                    
            );          
}

export default TarjetaCategoriaAdmin;