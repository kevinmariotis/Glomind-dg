import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarExamenPreguntaFv from './FormularioEditarExamenPreguntaFv';

function PaginaEditarExamenPreguntaFv() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioEditarExamenPreguntaFv />
            </DashboardArea>                   
        </>);
}

export default PaginaEditarExamenPreguntaFv;