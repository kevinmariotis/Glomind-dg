import React, {useEffect, useContext, Suspense} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from './AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import PaginaRegistrarse from './components/PaginaRegistrarse';
import PaginaIniciarSesion from './components/PaginaIniciarSesion';
import PaginaCategoriaNavegacion from './components/PaginaCategoriaNavegacion';
import PaginaDetallesDeCurso from './components/PaginaDetallesDeCurso';
import PaginaCarrito from './components/PaginaCarrito';
import PaginaCheckout from './components/PaginaCheckout';
import PaginaDashboardHome from './components/PaginaDashboardHome';
import PaginaDashboardEnroledCourses from './components/PaginaDashboardEnroledCourses';
import PaginaDashboardCursos from './components/PaginaDashboardCursos';

import Pagina404 from './components/Pagina404';

//import About from './components/About';
//import Home from './components/Home';

const Rutas = () => {    
    const {authenticated, permissions} = useContext(AuthContext);  //se obtiene los datos del contexto de la sesion (AuthContext)                    
    const validarPermisos = (lista=[]) => {        
        let retornar = false;
        lista.forEach(function(element) {                        
            if(permissions[element]===1){
                retornar = true;
            }
        });
        return retornar;
    };
    
    return (        
        <BrowserRouter>            
            <Routes>                                
                <Route path="/login" element={<ProtectedRoute permiso={!authenticated} ><PaginaIniciarSesion/></ProtectedRoute>} />
                <Route path="/signup" element={<ProtectedRoute permiso={!authenticated} ><PaginaRegistrarse/></ProtectedRoute>} />
                <Route path="/usuario/:id" element={<Pagina404/>} />
                <Route path="/usuario" element={<Pagina404/>} />
                <Route path="/cursos" element={<ProtectedRoute permiso={validarPermisos([20, 21, 22])} ><PaginaDashboardCursos/></ProtectedRoute>} />
                <Route path="/curso/favoritos" element={<Pagina404/>} />
                <Route path="/curso/comprados" element={<Pagina404/>} />          
                <Route path="/curso/:url_amigable" element={<PaginaDetallesDeCurso/>} />                      
                <Route path="/curso" element={<Pagina404/>} />
                <Route path="/categoria/:url_amigable" element={<PaginaCategoriaNavegacion/>} />          
                <Route path="/carrito/finalizadas" element={<Pagina404/>} />          
                <Route path="/carrito/checkout" element={<ProtectedRoute permiso={authenticated} ><PaginaCheckout/></ProtectedRoute>} />          
                <Route path="/carrito" element={<ProtectedRoute permiso={authenticated} ><PaginaCarrito/></ProtectedRoute>} />
                <Route path="/factura/:id" element={<Pagina404/>} />          
                <Route path="/video/:id" element={<Pagina404/>} />          
                <Route path="/video" element={<Pagina404/>} />          
                <Route path="/examen/:id" element={<Pagina404/>} />          
                <Route path="/examen" element={<Pagina404/>} />
                <Route path="/permisos" element={<Pagina404/>} />
                <Route path="/home" element={<ProtectedRoute permiso={authenticated} ><PaginaDashboardHome/></ProtectedRoute>} />
                <Route path="/cursos-matriculados" element={<ProtectedRoute permiso={authenticated} ><PaginaDashboardEnroledCourses/></ProtectedRoute>} />
                <Route exact path="/" element={<Pagina404/>} />          
                <Route path="*" component={<Pagina404/>} />
            </Routes>            
      </BrowserRouter>
  );
};

export default Rutas;