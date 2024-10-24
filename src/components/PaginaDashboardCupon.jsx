import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioDashboardCupon from './FormularioDashboardCupon';

function PaginaDashboardCupon() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioDashboardCupon />
            </DashboardArea>                   
        </>);
}

export default PaginaDashboardCupon;