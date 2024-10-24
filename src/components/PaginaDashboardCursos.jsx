import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioDashboardCursos from './FormularioDashboardCursos';

function PaginaDashboardCursos() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioDashboardCursos />
            </DashboardArea>                   
        </>);
}

export default PaginaDashboardCursos;