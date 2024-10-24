import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioCursoUsuarios from './FormularioCursoUsuarios';

function PaginaCursoUsuarios() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioCursoUsuarios />
            </DashboardArea>                   
        </>);
}

export default PaginaCursoUsuarios;