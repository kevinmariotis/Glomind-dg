import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

/*
        Tamano puede ser sm, ls, xl
    */
function Paginador({elemetosTotales, elementosPorPagina, paginaActual, callbackCambioPagina=()=>{},}){
    const totalPaginas = Math.ceil(elemetosTotales/elementosPorPagina);
    const posiciones = calcularPosicionesPaginador(paginaActual, totalPaginas);    
    const elementoInicial = ((elementosPorPagina*paginaActual)-(elementosPorPagina))+1;
    const elementoFinal = (paginaActual!=totalPaginas) ? elementosPorPagina*paginaActual : elemetosTotales;

    const handlePageChange = (pagina) => {
        if (pagina !== paginaActual) {
            callbackCambioPagina(pagina);
        }
    };
    
    if (elemetosTotales == 0) {
        return null;
    }

    return (<div className="text-center pt-3">
                <nav aria-label="Page navigation example" className="pagination-box">
                    <ul className="pagination justify-content-center">
                        {paginaActual != 1 && <li className="page-item" key={`paginador-li-1`}>
                            <a className="page-link cursor-pointer" key={`paginador-anchor-1`} onClick={() => handlePageChange(1)} aria-label="Primera">
                                <span aria-hidden="true"><i className="la la-arrow-left"></i></span>
                                <span className="sr-only">Primera</span>
                            </a>
                        </li>}                        
                        {posiciones.map((posicion) => (
                            <li className={`page-item ${posicion==paginaActual ? 'active' : ''}`} key={`paginador-li-${posicion}`}><a className="page-link cursor-pointer" key={`paginador-anchor-${posicion}`} onClick={() => handlePageChange(posicion)}>{posicion}</a></li>
                        ))}                       
                        {paginaActual != totalPaginas && <li className="page-item" key={`paginador-li-${totalPaginas}`}>
                            <a className="page-link cursor-pointer" key={`paginador-anchor-${totalPaginas}`} onClick={() => handlePageChange(totalPaginas)} aria-label="Última">
                                <span aria-hidden="true"><i className="la la-arrow-right"></i></span>
                                <span className="sr-only">Última</span>
                            </a>
                        </li>}
                    </ul>
                </nav>
                <p className="fs-14 pt-2">Mostrando {elementoInicial}-{elementoFinal} de {elemetosTotales} resultados</p>
            </div>);    
}

function calcularPosicionesPaginador(paginaActual, totalPaginas) {
    var posiciones = [];
  
    var paginasAntes = Math.floor((5 - 1) / 2);
    var paginasDespues = Math.ceil((5 - 1) / 2);
  
    var primeraPagina = 1;
    var ultimaPagina = totalPaginas;
  
    var paginaAnterior = paginaActual - 1;
    if (paginaAnterior < primeraPagina) {
      paginaAnterior = null;
    }
  
    var paginaSiguiente = paginaActual + 1;
    if (paginaSiguiente > ultimaPagina) {
      paginaSiguiente = null;
    }
  
    var inicio = Math.max(paginaActual - paginasAntes, primeraPagina);
    var fin = Math.min(paginaActual + paginasDespues, ultimaPagina);
  
    for (var i = inicio; i <= fin; i++) {
      posiciones.push(i);
    }
  
    return posiciones;
  }

export default Paginador;
