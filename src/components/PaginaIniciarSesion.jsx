import {React} from 'react';
import Header from './Header';
import BreadCrumbArea from './BreadCrumbArea';
import FormularioIniciarSesion from './FormularioIniciarSesion';
import FooterArea from './FooterArea';

function PaginaIniciarSesion() {  

    const breadCrumb = [{'link':'/login', 'nombre':'Iniciar sesión'}];

    return (        
        <>              
            <Header/>
            <BreadCrumbArea nombreseccion="Iniciar sesión" breadCrumbData={breadCrumb}/>
            <FormularioIniciarSesion/>
            <FooterArea />
        </>    );
}

export default PaginaIniciarSesion;