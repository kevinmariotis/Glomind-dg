import React from 'react';

function CompaniasAliadas() {
    const urlBase = import.meta.env.VITE_URL_BASE;  

    return (
        <section className="cta-area py-5 position-relative overflow-hidden bg-gray">
            <span className="stroke-shape stroke-shape-1"></span>
            <span className="stroke-shape stroke-shape-2"></span>
            <span className="stroke-shape stroke-shape-3"></span>
            <span className="stroke-shape stroke-shape-4"></span>
            <span className="stroke-shape stroke-shape-5"></span>
            <span className="stroke-shape stroke-shape-6"></span>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="cta-content-wrap">
                            <h3 className="fs-20 font-weight-semi-bold lh-28">Las mejores empresas confían en <div className="text-color">Glomind</div> para desarrollar habilidades profesionales.</h3>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="client-logo-wrap text-right">
                            <a href="https://google.com/" target="_blank" className="client-logo-item client--logo-item-2 pr-3"><img src={`${urlBase}/images/empresas/litoral.png`} alt="Logo de Litoral"/></a>
                            <a href="https://google.com/" target="_blank" className="client-logo-item client--logo-item-2 pr-3"><img src={`${urlBase}/images/empresas/system_center.png`} alt="Logo de System Center"/></a>
                            <a href="https://google.com" className="client-logo-item client--logo-item-2 pr-3"><img src={`${urlBase}/images/empresas/americana.png`} alt="Logo de Americana"/></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CompaniasAliadas;