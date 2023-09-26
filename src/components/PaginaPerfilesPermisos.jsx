import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioPerfilesPermisos from './FormularioPerfilesPermisos';

function PaginaPerfilesPermisos() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioPerfilesPermisos />
            </DashboardArea>                   
        </>);
}

export default PaginaPerfilesPermisos;