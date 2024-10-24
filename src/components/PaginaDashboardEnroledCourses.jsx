import {React} from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardArea from './DashboardArea';
import DashboardMenu from './DashboardMenu';
import FormularioDashboardEnroledCourses from './FormularioDashboardEnroledCourses';

function PaginaDashboardEnroledCourses() {      
    return (        
        <>              
            <DashboardHeader/>  
            <DashboardArea>
                {/* <DashboardMenu /> */}
                <FormularioDashboardEnroledCourses />
            </DashboardArea>                   
        </>);
}

export default PaginaDashboardEnroledCourses;