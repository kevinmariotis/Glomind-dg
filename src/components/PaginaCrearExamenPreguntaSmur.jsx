import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioCrearExamenPreguntaSmur from './FormularioCrearExamenPreguntaSmur';

function PaginaCrearExamenPreguntaSmur() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioCrearExamenPreguntaSmur />
            </DashboardArea>                   
        </>);
}

export default PaginaCrearExamenPreguntaSmur;