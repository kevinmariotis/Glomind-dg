import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioDashboardVideo from './FormularioDashboardVideo';

function PaginaDashboardVideo() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioDashboardVideo />
            </DashboardArea>                   
        </>);
}

export default PaginaDashboardVideo;