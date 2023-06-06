import React from 'react'
import Rutas from '../Routes';
import {AuthProvider} from '../AuthContext';
import LazyVerificarToken from './LazyVerificarToken';


function App() {     
    return (<React.StrictMode>                                          
                <AuthProvider>                                                  
                    <Rutas />                               
                </AuthProvider>                            
            </React.StrictMode>);  
}
export default App
