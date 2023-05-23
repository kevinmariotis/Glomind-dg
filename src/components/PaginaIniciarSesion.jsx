import {React} from 'react';
import Header from './Header';
import BreadCrumbArea from './BreadCrumbArea';
import FormularioIniciarSesion from './FormularioIniciarSesion';
import FooterArea from './FooterArea';

function PaginaIniciarSesion() {  
  return (
        <>              
            <Header/>
            <BreadCrumbArea nombreseccion="Iniciar sesión"/>
            <FormularioIniciarSesion/>
            <FooterArea />
        </>    );
}

export default PaginaIniciarSesion;