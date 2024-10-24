import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioDashboardCertificado from './FormularioDashboardCertificado';

function PaginaDashboardCertificado() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioDashboardCertificado />
            </DashboardArea>                   
        </>);
}

export default PaginaDashboardCertificado;