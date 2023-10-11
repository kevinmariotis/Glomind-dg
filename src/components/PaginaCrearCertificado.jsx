import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioCrearCertificado from './FormularioCrearCertificado';

function PaginaCrearCertificado() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioCrearCertificado />
            </DashboardArea>                   
        </>);
}

export default PaginaCrearCertificado;