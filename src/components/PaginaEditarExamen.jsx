import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarExamen from './FormularioEditarExamen';

function PaginaEditarExamen() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioEditarExamen />
            </DashboardArea>                   
        </>);
}

export default PaginaEditarExamen;