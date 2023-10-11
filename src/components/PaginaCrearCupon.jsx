import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioCrearCupon from './FormularioCrearCupon';

function PaginaCrearCupon() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioCrearCupon />
            </DashboardArea>                   
        </>);
}

export default PaginaCrearCupon;