import React, {useState} from 'react';
import { Link } from 'react-router-dom';

function BreadCrumbArea({nombreseccion='Sección', breadCrumbData=[], imagen='images/breadcrumb-bg.jpg'}) {   
    //const [breadCrumb, setBreadCrumb] = useState(breadCrumbData);
    const urlBase = import.meta.env.VITE_URL_BASE;
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;           

    return (<section className="breadcrumb-area section-padding img-bg-2" style={{'backgroundImage': `url(${imagen!='images/breadcrumb-bg.jpg' ? urlBaseApi : urlBase }/${imagen})`}}>
        <div className="overlay"></div>
        <div className="container">
            <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                <div className="section-heading">
                    <h2 className="section__title text-white">{nombreseccion}</h2>
                </div>
                <ul className="generic-list-item generic-list-item-white generic-list-item-arrow d-flex flex-wrap align-items-center">
                    {breadCrumbData.length>0 ? <li key="breadcrumb0" ><Link to="/">Inicio</Link></li> : ''}
                    {Object.keys(breadCrumbData).slice(0, 99).map((key) => (   
                        <li key={`breadcrumb${key}`}><Link to={breadCrumbData[key].link}>{breadCrumbData[key].nombre}</Link></li>                                                             
                    ))}                    
                </ul>
            </div>
        </div>
    </section>);
}

export default BreadCrumbArea;