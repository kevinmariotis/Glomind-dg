import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
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