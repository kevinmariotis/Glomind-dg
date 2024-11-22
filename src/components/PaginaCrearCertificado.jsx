import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import FormularioCrearCertificado from './FormularioCrearCertificado';

function PaginaCrearCertificado() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioCrearCertificado />
            </DashboardArea>                   
        </>);
}

export default PaginaCrearCertificado;