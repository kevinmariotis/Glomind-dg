import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioCrearExamenPreguntaFv from './FormularioCrearExamenPreguntaFv';

function PaginaCrearExamenPreguntaFv() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioCrearExamenPreguntaFv />
            </DashboardArea>                   
        </>);
}

export default PaginaCrearExamenPreguntaFv;