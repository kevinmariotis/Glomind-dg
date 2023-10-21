import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function BotonDashboardNavegacionMovil() {    
    const {jwt} = useContext(AuthContext);
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const urlBase = import.meta.env.VITE_URL_BASE;     
           
    useEffect(() => {              
        //document.addEventListener('DOMContentLoaded', function () {
            
            var dashboardMenuToggle = document.querySelector('.dashboard-menu-toggler');
          
            dashboardMenuToggle.addEventListener('click', function () {
                var offCanvasMenu = document.querySelector('.off--canvas-menu');
                var bodyOverlay = document.querySelector('.body-overlay');
                offCanvasMenu.classList.add('active');
                bodyOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
                      
            var dashboardMenuClose = document.querySelectorAll('.dashboard-menu-close, .body-overlay');
          
            dashboardMenuClose.forEach(function (element) {
                element.addEventListener('click', function () {
                    var offCanvasMenu = document.querySelector('.off--canvas-menu');
                    var bodyOverlay = document.querySelector('.body-overlay');
                    offCanvasMenu.classList.remove('active');
                    bodyOverlay.classList.remove('active');
                    document.body.style.overflow = 'inherit';
                });
            });
        //});
    }, []);

    return (
        <div className="dashboard-menu-toggler btn theme-btn theme-btn-sm lh-28 theme-btn-transparent mb-4 ml-3">
             <i className="la la-bars mr-1"></i>  Menú Navegación
        </div>
    );
}

export default BotonDashboardNavegacionMovil;