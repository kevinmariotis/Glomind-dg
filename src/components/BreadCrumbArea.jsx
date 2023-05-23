import React from 'react';

function BreadCrumbArea({nombreseccion='Sección'}) {
  return (<section className="breadcrumb-area section-padding img-bg-2">
    <div className="overlay"></div>
    <div className="container">
        <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
            <div className="section-heading">
                <h2 className="section__title text-white">{nombreseccion}</h2>
            </div>
            <ul className="generic-list-item generic-list-item-white generic-list-item-arrow d-flex flex-wrap align-items-center">
                <li><a href="index.html">Home</a></li>
                <li>Pages</li>
                <li>Sign Up</li>
            </ul>
        </div>
    </div>
</section>);
}

export default BreadCrumbArea;