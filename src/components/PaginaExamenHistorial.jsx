import {React} from 'react';
import HeaderMenuContent from './HeaderMenuContent';
import FooterArea from './FooterArea';
import FormularioExamenHistorial from './FormularioExamenHistorial';

function PaginaExamenHistorial() {      
    return (        
        <>              
            <HeaderMenuContent />
            <FormularioExamenHistorial />
            <FooterArea />            
        </>);
}

export default PaginaExamenHistorial;