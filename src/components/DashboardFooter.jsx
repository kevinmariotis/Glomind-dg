import React from 'react';
import HeaderTop from './HeaderTop';
import HeaderMenuContent from './HeaderMenuContent';

function DashboardFooter() {
  return (
    <div className="row align-items-center dashboard-copyright-content pb-4">
        <div className="col-lg-6">
            <p className="copy-desc">2024 Glomind &copy;. Todos los derechos reservados.</p>
        </div>
        <div className="col-lg-6">
            <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14 justify-content-end">
                <li className="mr-3"><a href="terms-and-conditions.html">Terminos y condiciones</a></li>
                <li><a href="privacy-policy.html">Políticas de privacidad</a></li>
            </ul>
        </div>
    </div>);
}

export default DashboardFooter;