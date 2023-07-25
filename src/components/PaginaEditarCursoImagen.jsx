import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarCursoImagen from './FormularioEditarCursoImagen';

function PaginaEditarCursoImagen() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioEditarCursoImagen />
            </DashboardArea>                   
        </>);
}

export default PaginaEditarCursoImagen;