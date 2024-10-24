import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioEditarVideo from './FormularioEditarVideo';

function PaginaEditarVideo() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioEditarVideo />
            </DashboardArea>                   
        </>);
}

export default PaginaEditarVideo;