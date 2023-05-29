import React from 'react'
import Rutas from '../Routes';
import {AuthProvider} from '../AuthContext';
import LazyVerificarToken from './LazyVerificarToken';


function App() {     
    return (<React.StrictMode>                                          
                <AuthProvider>                              
                    <LazyVerificarToken>
                    <Rutas />           
                    </LazyVerificarToken> 
                </AuthProvider>                            
            </React.StrictMode>);  
}
export default App
