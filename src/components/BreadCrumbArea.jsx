import React, {useState} from 'react';
import { Link } from 'react-router-dom';

function BreadCrumbArea({nombreseccion='Sección', breadCrumbData=[]}) {   
    //const [breadCrumb, setBreadCrumb] = useState(breadCrumbData);
        
    return (<section className="breadcrumb-area section-padding img-bg-2">
        <div className="overlay"></div>
        <div className="container">
            <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                <div className="section-heading">
                    <h2 className="section__title text-white">{nombreseccion}</h2>
                </div>
                <ul className="generic-list-item generic-list-item-white generic-list-item-arrow d-flex flex-wrap align-items-center">
                    <li key="breadcrumb0" ><Link to="/">Inicio</Link></li>
                    {Object.keys(breadCrumbData).slice(0, 5).map((key) => (   
                        <li key={`breadcrumb${key}`}><Link to={breadCrumbData[key].link}>{breadCrumbData[key].nombre}</Link></li>                                                             
                    ))}                    
                </ul>
            </div>
        </div>
    </section>);
}

export default BreadCrumbArea;