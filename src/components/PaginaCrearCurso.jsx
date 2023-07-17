import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioCrearCurso from './FormularioCrearCurso';

function PaginaCrearCurso() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioCrearCurso />
            </DashboardArea>                   
        </>);
}

export default PaginaCrearCurso;