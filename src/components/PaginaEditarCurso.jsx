import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarCurso from './FormularioEditarCurso';

function PaginaEditarCurso() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioEditarCurso />
            </DashboardArea>                   
        </>);
}

export default PaginaEditarCurso;