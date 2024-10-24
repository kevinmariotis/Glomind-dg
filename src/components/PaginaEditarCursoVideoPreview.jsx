import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarCursoVideoPreview from './FormularioEditarCursoVideoPreview';

function PaginaEditarCursoVideoPreview() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioEditarCursoVideoPreview />
            </DashboardArea>                   
        </>);
}

export default PaginaEditarCursoVideoPreview;