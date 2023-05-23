import React, { useState, useEffect } from 'react';

function HeaderMenuContent() {
    const [datos, setDatos] = useState({"datos":{},"fechahora":0});
    const urlBase = import.meta.env.VITE_URL_BASE;    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;        
    
    useEffect(() => {
        // Verificar si los datos están almacenados en la caché local
        const categoriasistema = localStorage.getItem('categoriasistema');
    
        if (categoriasistema) {   
            console.log('las categorias ya estaban guardadas');
            setDatos(JSON.parse(categoriasistema));                          
            if(Math.floor(new Date().getTime()/1000)-parseInt(JSON.parse(categoriasistema).fechahora)>=3600){                
                obtenerDatosDelServidor();
            }
        } else {
            // Los datos no están en la caché local, obtenerlos del servidor
            console.log('las categorias NO existen');
            obtenerDatosDelServidor();
        }
    }, []);
    
    const obtenerDatosDelServidor = async () => {
        try {            
            const opciones = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',             
                },
            };
                
            const response = await fetch(`${urlBaseApi}/api/categoriasistema/getCategoriasPorPadre/0/1`, opciones);

            if (response.ok) {                
                console.log('Categorías recuperadas del servidor:');
                const categoriasistema = await response.json();                    
                localStorage.setItem('categoriasistema', JSON.stringify({"datos":categoriasistema, "fechahora":Math.floor(new Date().getTime() / 1000)}));
                setDatos({"datos":categoriasistema, "fechahora":Math.floor(new Date().getTime() / 1000)});                                                  
            } else {                
                console.error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    return (<div className="header-menu-content pr-150px pl-150px bg-white">
        <div className="container-fluid">
            <div className="main-menu-content">
                <a href="#" className="down-button"><i className="la la-angle-down"></i></a>
                <div className="row align-items-center">
                    <div className="col-lg-2">
                        <div className="logo-box">
                            <a href="index.html" className="logo"><img src="images/logo.png" alt="logo" /></a>
                            <div className="user-btn-action">
                                <div className="search-menu-toggle icon-element icon-element-sm shadow-sm mr-2" data-toggle="tooltip" data-placement="top" title="Search">
                                    <i className="la la-search"></i>
                                </div>
                                <div className="off-canvas-menu-toggle cat-menu-toggle icon-element icon-element-sm shadow-sm mr-2" data-toggle="tooltip" data-placement="top" title="Category menu">
                                    <i className="la la-th-large"></i>
                                </div>
                                <div className="off-canvas-menu-toggle main-menu-toggle icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="top" title="Main menu">
                                    <i className="la la-bars"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-10">
                        <div className="menu-wrapper">
                            <div className="menu-category">
                                <ul>
                                    <li>
                                        <a href="#">Categorías <i className="la la-angle-down fs-12"></i></a>
                                        <ul className="cat-dropdown-menu">
                                            {Object.keys(datos.datos).map((key) => (
                                                <li key={datos.datos[key].id}>
                                                    <a href={`${urlBase}/categoria/${datos.datos[key].id}/${datos.datos[key].url_amigable}`}>{datos.datos[key].nombre} {datos.datos[key].categorias_hijas.length > 0 && (<i className="la la-angle-right"></i>)}</a>
                                                    { }{
                                                        datos.datos[key].categorias_hijas.length > 0 && (
                                                            <ul className="sub-menu">
                                                                {datos.datos[key].categorias_hijas.map((sub_categoria) => {                                                                    
                                                                    return <li key={sub_categoria.id}><a href={`${urlBase}/categoria/${sub_categoria.id}/${sub_categoria.url_amigable}`}>{sub_categoria.nombre}</a></li>
                                                                })}
                                                            </ul>
                                                        )
                                                    }
                                                </li>
                                            ))}                                            
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <form method="post">
                                <div className="form-group mb-0">
                                    <input className="form-control form--control pl-3" type="text" name="search" placeholder="Buscar cursos" />
                                    <span className="la la-search search-icon"></span>
                                </div>
                            </form>
                            <nav className="main-menu">
                                <ul>
                                    <li>
                                        <a href="#">Home <i className="la la-angle-down fs-12"></i></a>
                                        <ul className="dropdown-menu-item">
                                            <li><a href="index.html">Home One</a></li>
                                            <li><a href="home-2.html">Home Two</a></li>
                                            <li><a href="home-3.html">Home Three</a></li>
                                            <li><a href="home-4.html">Home four</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="#">courses <i className="la la-angle-down fs-12"></i></a>
                                        <ul className="dropdown-menu-item">
                                            <li><a href="course-grid.html">course grid</a></li>
                                            <li><a href="course-list.html">course list</a></li>
                                            <li><a href="course-grid-left-sidebar.html">grid left sidebar</a></li>
                                            <li><a href="course-grid-right-sidebar.html">grid right sidebar</a></li>
                                            <li><a href="course-list-left-sidebar.html">list left sidebar <span className="ribbon ribbon-blue-bg">New</span></a></li>
                                            <li><a href="course-list-right-sidebar.html">list right sidebar <span className="ribbon ribbon-blue-bg">New</span></a></li>
                                            <li><a href="course-details.html">course details</a></li>
                                            <li><a href="lesson-details.html">lesson details</a></li>
                                            <li><a href="my-courses.html">My courses</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="#">Student <i className="la la-angle-down fs-12"></i></a>
                                        <ul className="dropdown-menu-item">
                                            <li><a href="student-detail.html">student detail</a></li>
                                            <li><a href="student-quiz.html">take quiz</a></li>
                                            <li><a href="student-quiz-results.html">quiz results</a></li>
                                            <li><a href="student-quiz-result-details.html">quiz details</a></li>
                                            <li><a href="student-quiz-result-details-2.html">quiz details 2</a></li>
                                            <li><a href="student-path.html">path details</a></li>
                                            <li><a href="student-path-assessment.html">Skill Assessment</a></li>
                                            <li><a href="student-path-assessment-result.html">Skill result</a></li>
                                        </ul>
                                    </li>
                                    <li className="mega-menu-has">
                                        <a href="#">pages <i className="la la-angle-down fs-12"></i></a>
                                        <div className="dropdown-menu-item mega-menu">
                                            <ul className="row no-gutters">
                                                <li className="col-lg-3">
                                                    <a href="dashboard.html">dashboard <span className="ribbon">Hot</span></a>
                                                    <a href="about.html">about</a>
                                                    <a href="teachers.html">Teachers</a>
                                                    <a href="teacher-detail.html">Teacher detail</a>
                                                    <a href="categories.html">categories</a>
                                                    <a href="terms-and-conditions.html">Terms & conditions</a>
                                                    <a href="privacy-policy.html">privacy policy</a>
                                                    <a href="invite.html">invite friend</a>
                                                </li>
                                                <li className="col-lg-3">
                                                    <a href="careers.html">careers</a>
                                                    <a href="career-details.html">career details</a>
                                                    <a href="become-a-teacher.html">become an instructor</a>
                                                    <a href="faq.html">FAQs</a>
                                                    <a href="admission.html">admission</a>
                                                    <a href="gallery.html">gallery</a>
                                                    <a href="pricing-table.html">pricing tables</a>
                                                    <a href="contact.html">contact</a>
                                                </li>
                                                <li className="col-lg-3">
                                                    <a href="for-business.html">for business</a>
                                                    <a href="sign-up.html">sign-up</a>
                                                    <a href="login.html">login</a>
                                                    <a href="recover.html">recover</a>
                                                    <a href="shopping-cart.html">cart</a>
                                                    <a href="checkout.html">checkout</a>
                                                    <a href="error.html">page 404</a>
                                                </li>
                                                <li className="col-lg-3">
                                                    <div className="menu-banner position-relative h-100">
                                                        <div className="overlay rounded-rounded opacity-4"></div>
                                                        <div className="menu-banner-content p-4 position-absolute bottom-0 left-0">
                                                            <h4 className="fs-20 font-weight-bold pb-3 text-white">30 days free trail for new users</h4>
                                                            <a href="sign-up.html" className="btn theme-btn theme-btn-sm theme-btn-white">Start Learning <i className="la la-arrow-right icon ml-1"></i></a>
                                                        </div>
                                                        <img src="images/menu-banner-img.jpg" alt="menu banner image" className="w-100 h-100 rounded-rounded" />
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="#">blog <i className="la la-angle-down fs-12"></i></a>
                                        <ul className="dropdown-menu-item">
                                            <li><a href="blog-full-width.html">blog full width </a></li>
                                            <li><a href="blog-no-sidebar.html">blog no sidebar</a></li>
                                            <li><a href="blog-left-sidebar.html">blog left sidebar</a></li>
                                            <li><a href="blog-right-sidebar.html">blog right sidebar</a></li>
                                            <li><a href="blog-single.html">blog detail</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                            <div className="shop-cart mr-4">
                                <ul>
                                    <li>
                                        <p className="shop-cart-btn d-flex align-items-center">
                                            <i className="la la-shopping-cart"></i>
                                            <span className="product-count">2</span>
                                        </p>
                                        <ul className="cart-dropdown-menu">
                                            <li className="media media-card">
                                                <a href="shopping-cart.html" className="media-img">
                                                    <img src="images/small-img.jpg" alt="Cart image" />
                                                </a>
                                                <div className="media-body">
                                                    <h5><a href="course-details.html">The Complete JavaScript Course 2021: From Zero to Expert!</a></h5>
                                                    <span className="d-block lh-18 py-1">Kamran Ahmed</span>
                                                    <p className="text-black font-weight-semi-bold lh-18">$12.99 <span className="before-price fs-14">$129.99</span></p>
                                                </div>
                                            </li>
                                            <li className="media media-card">
                                                <a href="shopping-cart.html" className="media-img">
                                                    <img src="images/small-img.jpg" alt="Cart image" />
                                                </a>
                                                <div className="media-body">
                                                    <h5><a href="course-details.html">The Complete JavaScript Course 2021: From Zero to Expert!</a></h5>
                                                    <span className="d-block lh-18 py-1">Kamran Ahmed</span>
                                                    <p className="text-black font-weight-semi-bold lh-18">$12.99 <span className="before-price fs-14">$129.99</span></p>
                                                </div>
                                            </li>
                                            <li className="media media-card">
                                                <div className="media-body fs-16">
                                                    <p className="text-black font-weight-semi-bold lh-18">Total: <span className="cart-total">$12.99</span> <span className="before-price fs-14">$129.99</span></p>
                                                </div>
                                            </li>
                                            <li>
                                                <a href="shopping-cart.html" className="btn theme-btn w-100">Got to cart <i className="la la-arrow-right icon ml-1"></i></a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div className="nav-right-button">
                                <a href="admission.html" className="btn theme-btn d-none d-lg-inline-block"><i className="la la-user-plus mr-1"></i> Admission</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default HeaderMenuContent;