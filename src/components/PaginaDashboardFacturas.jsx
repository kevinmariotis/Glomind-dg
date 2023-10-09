import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioDashboardFacturas from './FormularioDashboardFacturas';

function PaginaDashboardFacturas() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioDashboardFacturas />
            </DashboardArea>                   
        </>);
}

export default PaginaDashboardFacturas;