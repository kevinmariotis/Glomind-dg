import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioCategoriasSistema from './FormularioCategoriasSistema';

function PaginaCategoriasSistema() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioCategoriasSistema />
            </DashboardArea>                   
        </>);
}

export default PaginaCategoriasSistema;