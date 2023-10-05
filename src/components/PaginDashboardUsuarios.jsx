import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioDashboardUsuarios from './FormularioDashboardUsuarios';

function PaginDashboardUsuarios() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioDashboardUsuarios />
            </DashboardArea>                   
        </>);
}

export default PaginDashboardUsuarios;