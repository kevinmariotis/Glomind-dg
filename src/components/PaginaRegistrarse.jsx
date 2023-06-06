import {React, Suspense} from 'react';
import LoadingAnimation from './LoadingAnimation';
import Header from './Header';
import BreadCrumbArea from './BreadCrumbArea';
import FormularioRegistrarse from './FormularioRegistarse';
import FooterArea from './FooterArea';

function PaginaRegistrarse() {

    const breadCrumb = [{'link':'/signup', 'nombre':'Registrarme'}];

    return (
        <>              
            <Header/>
            <BreadCrumbArea nombreseccion="Registrarse" breadCrumbData={breadCrumb}/>
            <FormularioRegistrarse />
            <FooterArea />
        </>    );
}

export default PaginaRegistrarse;