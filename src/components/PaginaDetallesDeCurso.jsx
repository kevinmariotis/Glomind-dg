import {React} from 'react';
import Header from './Header';
import FooterArea from './FooterArea';
import FormularioDetallesDeCurso from './FormularioDetallesDeCurso';

function PaginaDetallesDeCurso() {      
    return (        
        <>              
            <Header/>            
            <FormularioDetallesDeCurso/>
            <FooterArea />
        </>    );
}

export default PaginaDetallesDeCurso;