import {React} from 'react';
import Header from './Header';
import FooterArea from './FooterArea';
import FormularioEstudianteDetalles from './FormularioEstudianteDetalles';

function PaginaEstudianteDetalles() {      
    return (   
        <>              
            <Header/>
            <FormularioEstudianteDetalles />
            <FooterArea />
        </>
    );
}

export default PaginaEstudianteDetalles;