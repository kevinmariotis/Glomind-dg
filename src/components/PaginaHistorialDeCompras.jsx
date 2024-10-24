import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioHistorialDeCompras from './FormularioHistorialDeCompras';

function PaginaHistorialDeCompras() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioHistorialDeCompras />
            </DashboardArea>                   
        </>);
}

export default PaginaHistorialDeCompras;