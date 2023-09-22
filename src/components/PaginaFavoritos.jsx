import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioFavoritos from './FormularioFavoritos';

function PaginaHistorialDeCompras() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioFavoritos />
            </DashboardArea>                   
        </>);
}

export default PaginaHistorialDeCompras;