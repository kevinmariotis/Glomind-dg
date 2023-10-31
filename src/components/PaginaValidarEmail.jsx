import { React } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import FormularioValidarEmail from './FormularioValidarEmail';
import FooterArea from './FooterArea';

function PaginaValidarEmail() {  
  return (
        <>              
            <Header/>    
            <FormularioValidarEmail/>                             
            <FooterArea />
        </>    );
}

export default PaginaValidarEmail;