import React from 'react';

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
    }) {
        const urlBase = import.meta.env.VITE_URL_BASE;    
        const niveles = {
            1: 'Básico',
            2: 'Intermedio',
            3: 'Experto',
        }
        const estrellas = [1, 2, 3, 4, 5];

        return (<div className="col-lg-6 responsive-column-half">
                    <div className="card card-item card-preview" data-tooltip-content="#tooltip_content_1">
                        <div className="card-image">
                            <a href={`${urlBase}/curso/${idcurso}/${url_amigable}`} className="d-block">
                                <img className="card-img-top lazy" src="/images/img-loading.png" data-src={imagen} alt={nombre} />
                            </a>
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
                            <h5 className="card-title"><a href={`${urlBase}/curso/${idcurso}/${url_amigable}`}>{nombre}</a></h5>
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
                                <div className="icon-element icon-element-sm shadow-sm cursor-pointer" title="Agregar a favoritos"><i className="la la-heart-o"></i></div>
                            </div>
                        </div>
                    </div>
                </div>);
}

export default TarjetaCurso;