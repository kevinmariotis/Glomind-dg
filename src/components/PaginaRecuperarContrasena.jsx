import {React} from 'react';
import Header from './Header';
import BreadCrumbArea from './BreadCrumbArea';
import FormularioRecuperarContrasena from './FormularioRecuperarContrasena';
import FooterArea from './FooterArea';

function PaginaRecuperarContrasena() {  

    const breadCrumb = [{'link':'/recover', 'nombre':'Recuperar cuenta'}];

    return (        
        <>              
            <Header/>            
            <FormularioRecuperarContrasena/>
            <FooterArea />
        </>    );
}

export default PaginaRecuperarContrasena;