import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioCrearVideo from './FormularioCrearVideo';

function PaginaCrearVideo() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                <DashboardMenu />
                <FormularioCrearVideo />
            </DashboardArea>                   
        </>);
}

export default PaginaCrearVideo;