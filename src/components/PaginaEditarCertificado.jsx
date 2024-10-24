import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarCertificado from './FormularioEditarCertificado';

function PaginaEditarCertificado() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioEditarCertificado />
            </DashboardArea>                   
        </>);
}

export default PaginaEditarCertificado;