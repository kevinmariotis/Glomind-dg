import React, {useEffect, useContext, Suspense} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from './AuthContext';

import PaginaRegistrarse from './components/PaginaRegistrarse';
import PaginaIniciarSesion from './components/PaginaIniciarSesion';
import Pagina404 from './components/Pagina404';
//import About from './components/About';
//import Home from './components/Home';

const Rutas = () => {    
    const {authenticated, permissions} = useContext(AuthContext);  //se obtiene los datos del contexto de la sesion (AuthContext)
    
    const permisos = (permissions!='') ? JSON.parse(permissions) : Array(150).fill(0);    
    console.log("permisos ", permisos);
    const publicRoutes = ['/', '/login', '/signup']; // Rutas abiertas al público

    useEffect(() => {        
        const currentPath = window.location.pathname;
        // Verificar si la ruta actual no está en las rutas abiertas al público
        /*if (!publicRoutes.includes(currentPath)) {
            validateJWT();
        }*/
    }, []);
        
    return (        
        <BrowserRouter>            
            <Routes>                                
                {!authenticated && <Route path="/login" element={<PaginaIniciarSesion/>} />}
                {!authenticated && <Route path="/signup" element={<PaginaRegistrarse/>} />}
                <Route path="/usuario/:id" element={<Pagina404/>} />
                <Route path="/usuario" element={<Pagina404/>} />
                <Route path="/curso/favoritos" element={<Pagina404/>} />
                <Route path="/curso/comprados" element={<Pagina404/>} />          
                <Route path="/curso/:id" element={<Pagina404/>} />                      
                <Route path="/curso" element={<Pagina404/>} />
                <Route path="/categoria/:id/:url_amigable" element={<Pagina404/>} />          
                <Route path="/carrito/finalizadas" element={<Pagina404/>} />          
                <Route path="/carrito/checkout" element={<Pagina404/>} />          
                <Route path="/carrito" element={<Pagina404/>} />
                <Route path="/factura/:id" element={<Pagina404/>} />          
                <Route path="/video/:id" element={<Pagina404/>} />          
                <Route path="/video" element={<Pagina404/>} />          
                <Route path="/examen/:id" element={<Pagina404/>} />          
                <Route path="/examen" element={<Pagina404/>} />
                <Route path="/permisos" element={<Pagina404/>} />
                <Route exact path="/" element={<Pagina404/>} />          
                <Route path="*" component={<Pagina404/>} />
            </Routes>            
      </BrowserRouter>
  );
};

export default Rutas;