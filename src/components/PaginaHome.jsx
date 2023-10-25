import { React } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import FooterArea from './FooterArea';
import FormularioHome from './FormularioHome';

function PaginaHome() {  
  return (
        <>              
            <Header/>                     
                <FormularioHome />
            <FooterArea />
        </>    );
}

export default PaginaHome;