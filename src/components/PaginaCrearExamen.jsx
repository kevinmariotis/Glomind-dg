import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioCrearExamen from './FormularioCrearExamen';

function PaginaCrearExamen() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioCrearExamen />
            </DashboardArea>                   
        </>);
}

export default PaginaCrearExamen;