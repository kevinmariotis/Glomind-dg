import {React} from 'react';
import HeaderMenuContent from './HeaderMenuContent';
import FooterArea from './FooterArea';
import FormularioCursoNotas from './FormularioCursoNotas';

function PaginaCursoNotas() {      
    return (        
        <>              
            <HeaderMenuContent />
            <FormularioCursoNotas />
            <FooterArea />            
        </>);
}

export default PaginaCursoNotas;