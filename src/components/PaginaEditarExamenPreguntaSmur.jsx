import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarExamenPreguntaSmur from './FormularioEditarExamenPreguntaSmur';

function PaginaEditarExamenPreguntaSmur() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioEditarExamenPreguntaSmur />
            </DashboardArea>                   
        </>);
}

export default PaginaEditarExamenPreguntaSmur;