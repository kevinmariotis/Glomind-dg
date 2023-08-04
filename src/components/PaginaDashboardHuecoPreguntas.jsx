import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioDashboardHuecoPreguntas from './FormularioDashboardHuecoPreguntas';

function PaginaDashboardHuecoPreguntas() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioDashboardHuecoPreguntas />
            </DashboardArea>                   
        </>);
}

export default PaginaDashboardHuecoPreguntas;