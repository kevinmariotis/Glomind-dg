import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioDashboardHome from './FormularioDashboardHome';

function PaginaDashboardHome() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioDashboardHome />
            </DashboardArea>                   
        </>);
}

export default PaginaDashboardHome;