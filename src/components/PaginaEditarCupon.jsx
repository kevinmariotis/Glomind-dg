import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarCupon from './FormularioEditarCupon';

function PaginaEditarCupon() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioEditarCupon/>
            </DashboardArea>                   
        </>);
}

export default PaginaEditarCupon;