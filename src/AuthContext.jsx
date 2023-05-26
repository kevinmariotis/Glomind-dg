import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Crea el contexto de autenticación
export const AuthContext = createContext();

// Crea el proveedor de autenticación
export const AuthProvider = ({ children }) => {    
    const [authenticated, setAuthenticated] = useState(false);
    const [permissions, setPermissions] = useState('');
    const [jwt, setJwt] = useState(false);    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const [isMounted, setIsMounted] = useState(false);
    // Función para dar la sesion por iniciada
    const login = ({jwt, permisos}) => {
        // Lógica para autenticar al usuario        
        setAuthenticated(true);        
        setPermissions(permisos);                          
        setJwt(jwt);          
    };

    // Función para dar la sesion por cerrada
    const logout = () => {
        // Lógica para cerrar la sesión del usuario
        setAuthenticated(false);
        setPermissions('');
        setJwt(null);  
    };


    useEffect(() => {   //El objetivo de este effect es establecer si se esta autenticado, recobrar los permisos y establecer el jwt en el contexto cuando el sitio se ejecute por primera vez.        
        if(isMounted){
            //validarToken();                
        }else{
            setIsMounted(true);
        }
        return () => {
            // Limpieza del efecto secundario (opcional)
        };
    }, []);
    
    
    const validarToken = () => {
        return new Promise(async (resolve, reject) => {
            try {

                const jwt = Cookies.get('jwt');
                if(jwt){

                    //primero miramos si esta cookie ya está expirada y el navegador no la ha eliminado            
                    const isExpired = jwt ? new Date(jwt.expires) < new Date() : true;
                    if(isExpired){
                        Cookies.remove('jwt');     
                        reject(new Error('Token expirado'));           
                    }else{

                        const opciones = {
                            method: 'PUT',
                            headers: { 
                                'Authorization':`Bearer ${jwt}`
                            }
                        };                        
                        // Realizar la lógica de validación del token aquí, por ejemplo, una petición fetch
                        const response = await fetch(`${urlBaseApi}/api/sesion/validarToken`, opciones);
                        const data = await response.json();
                        if (response.status === 200) {                            
                            login({'token':jwt, 'permisos':JSON.stringify(data.permisos)});
                            resolve(); // Resuelve la promesa si el token es válido
                        } else {
                            Cookies.remove('jwt');
                            reject(new Error('El token no es válido')); // Rechaza la promesa si el token no es válido
                        }
                    }
                }else{
                    //reject(new Error('No está el token establecido'));
                    reject(new Error('No está el token establecido'));
                }
            } catch (error) {
                reject(error); // Rechaza la promesa si ocurre algún error en la petición
            }
        });
    };
       
    return (
        <AuthContext.Provider value={{jwt, authenticated, permissions, setJwt, logout, validarToken}}>
            {children}
        </AuthContext.Provider>
    );
};