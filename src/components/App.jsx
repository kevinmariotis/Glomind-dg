import React, {useEffect} from 'react'
import Rutas from '../Routes';
import {AuthProvider} from '../AuthContext';
import { fijarHeader } from './comun';


function App() {   
    
    useEffect(() => {
        fijarHeader();        
    }, []);

    return (<React.StrictMode>                                          
                <AuthProvider>                                                  
                    <Rutas />                               
                </AuthProvider>                            
            </React.StrictMode>);  
}
export default App
