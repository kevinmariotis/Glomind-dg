import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarContenidoCurso from './FormularioEditarContenidoCurso';

function PaginaEditarContenidoCurso() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioEditarContenidoCurso />
            </DashboardArea>                   
        </>);
}

export default PaginaEditarContenidoCurso;