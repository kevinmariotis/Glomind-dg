import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import LoadingAnimation from './components/LoadingAnimation';
// Crea el contexto de autenticación
export const AuthContext = createContext();

// Crea el proveedor de autenticación
export const AuthProvider = ({ children }) => {    
    const [authenticated, setAuthenticated] = useState(false);
    const [permissions, setPermissions] = useState('');
    const [temaActual, setTemaActual] = useState(0);    //1 'light-theme', 0 'dark-theme'
    const [cargarContadorCarrito, setCargarContadorCarrito] = useState(true);   //setCargarContadorCarrito debe ser usado por cualquier parte del programa para dar la orden de que se recarge el contador de items en el carrito

    const [jwt, setJwt] = useState('');    
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;      
    const [cargado, setCargado] = useState(false);
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

    useEffect(() => {    
        //se establece el nuevo tema
        if(temaActual==1){
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }else{
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        }

    }, [temaActual]);

    useEffect(() => {   //El objetivo de este effect es establecer si se esta autenticado, recobrar los permisos y establecer el jwt en el contexto cuando el sitio se ejecute por primera vez.        
        
        async function cargarUsuario(){
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
                            login({'jwt':jwt, 'permisos':JSON.stringify(data.permisos)});                           
                            setCargado(true);
                        } else {
                            Cookies.remove('jwt');
                            console.log('El token no es valido');
                            setCargado(true);
                        }
                    }
                }else{
                    //reject(new Error('No está el token establecido'));                
                    console.log('No está el token establecido');
                    setCargado(true);
                }
            } catch (error) {
                console.log(error);
                setCargado(true);
            }

        }

        cargarUsuario();

        return () => {
            // Limpieza del efecto secundario (opcional)
        };
    }, []);           
       
    return (
        <>{cargado==1 ? <AuthContext.Provider value={{jwt, authenticated, permissions, setJwt, logout, cargarContadorCarrito, setCargarContadorCarrito, temaActual, setTemaActual}}>
            {children}
        </AuthContext.Provider> : <LoadingAnimation />}</>
    );
};