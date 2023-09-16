import { React } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import FormularioValidarCertificado from './FormularioValidarCertificado';
import FooterArea from './FooterArea';

function PaginaValidarCertificado() {  
  return (
        <>              
            <Header/>    
            <FormularioValidarCertificado/>                             
            <FooterArea />
        </>    );
}

export default PaginaValidarCertificado;