import React, {useEffect, Suspense, lazy, useContext, useState} from 'react';
import { AuthContext } from '../AuthContext';
import LoadingAnimation from './LoadingAnimation';

function LazyVerificarToken({ children }) {    
    const {validarToken} = useContext(AuthContext);
    const [cargado, setCargado] = useState(false);

    useEffect(() => {   //El objetivo de este effect es establecer si se esta autenticado, recobrar los permisos y establecer el jwt en el contexto cuando el sitio se ejecute por primera vez.        
        //setCargado(true);
        return () => {
            // Limpieza del efecto secundario (opcional)
        };
    }, []);

    const verificarToken = async () => {        
        try{            
            if(!cargado){
                setCargado(true);
                return await validarToken();        
            }else{
                return null;
            }    
        } catch (error) {
            console.log(error.message);
            return null;
        }
    }
      
    const LazyComponent = lazy(() => verificarToken().then(data => ({ default: () => null }))); //retorna un componente con contenido nulo cuando termina de verificar el token
    
    return (
        <Suspense fallback={<LoadingAnimation />}>     
            <LazyComponent/>
            {children}
        </Suspense>
    );
}

export default LazyVerificarToken;