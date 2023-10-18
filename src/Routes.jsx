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
import PaginaCrearCurso from './components/PaginaCrearCurso';
import PaginaEditarCurso from './components/PaginaEditarCurso';
import PaginaEditarContenidoCurso from './components/PaginaEditarContenidoCurso';
import PaginaEditarCursoVideoPreview from './components/PaginaEditarCursoVideoPreview';
import PaginaEditarCursoImagen from './components/PaginaEditarCursoImagen';
import PaginaDashboardVideo from './components/PaginaDashboardVideo';
import PaginaCrearVideo from './components/PaginaCrearVideo';
import PaginaEditarVideo from './components/PaginaEditarVideo';
import PaginaCrearExamen from './components/PaginaCrearExamen';
import PaginaEditarExamen from './components/PaginaEditarExamen';
import PaginaDashboardHuecoPreguntas from './components/PaginaDashboardHuecoPreguntas';
import PaginaCrearExamenPreguntaSmur from './components/PaginaCrearExamenPreguntaSmur';
import PaginaEditarExamenPreguntaSmur from './components/PaginaEditarExamenPreguntaSmur';
import PaginaCrearExamenPreguntaFv from './components/PaginaCrearExamenPreguntaFv';
import PaginaEditarExamenPreguntaFv from './components/PaginaEditarExamenPreguntaFv';
import PaginaPlay from './components/PaginaPlay';
import PaginaExamenPresentacion from './components/PaginaExamenPresentacion';
import PaginaExamenIntento from './components/PaginaExamenIntento';
import PaginaExamenIntentoResultados from './components/PaginaExamenIntentoResultados';
import PaginaExamenHistorial from './components/PaginaExamenHistorial';
import PaginaValidarCertificado from './components/PaginaValidarCertificado';
import PaginaEditarPerfil from './components/PaginaEditarPerfil';
import PaginaHistorialDeCompras from './components/PaginaHistorialDeCompras';
import PaginaFavoritos from './components/PaginaFavoritos';
import PaginaPerfilesPermisos from './components/PaginaPerfilesPermisos';
import PaginaCategoriasSistema from './components/PaginaCategoriasSistema';
import PaginDashboardUsuarios from './components/PaginDashboardUsuarios';
import PaginaDashboardFacturas from './components/PaginaDashboardFacturas';
import PaginaEstudianteDetalles from './components/PaginaEstudianteDetalles';
import PaginaDashboardCupon from './components/PaginaDashboardCupon';
import PaginaCrearCupon from './components/PaginaCrearCupon';
import PaginaEditarCupon from './components/PaginaEditarCupon';
import PaginaDashboardCertificado from './components/PaginaDashboardCertificado';
import PaginaCrearCertificado from './components/PaginaCrearCertificado';
import PaginaEditarCertificado from './components/PaginaEditarCertificado';
import PaginaCursoUsuarios from './components/PaginaCursoUsuarios';
import PaginaTagNavegacion from './components/PaginaTagNavegacion';

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
                <Route path="/cursos/matriculados" element={<ProtectedRoute permiso={authenticated} ><PaginaDashboardEnroledCourses/></ProtectedRoute>} />
                <Route path="/cursos/:busqueda?" element={<ProtectedRoute permiso={validarPermisos([20, 21, 22, 66, 67, 44])} ><PaginaDashboardCursos/></ProtectedRoute>} />
                <Route path="/cursos/favoritos" element={<ProtectedRoute permiso={authenticated} ><PaginaFavoritos/></ProtectedRoute>} />                                
                <Route path="/categoria/:url_amigable" element={<PaginaCategoriaNavegacion/>} />
                <Route path="/tag/:url_amigable" element={<PaginaTagNavegacion/>} />
                <Route path="/carrito/checkout" element={<ProtectedRoute permiso={authenticated} ><PaginaCheckout/></ProtectedRoute>} />          
                <Route path="/carrito" element={<ProtectedRoute permiso={authenticated} ><PaginaCarrito/></ProtectedRoute>} />                
                <Route path="/video/crear" element={<ProtectedRoute permiso={validarPermisos([27])} ><PaginaCrearVideo/></ProtectedRoute>} />          
                <Route path="/video/editar/:id" element={<ProtectedRoute permiso={validarPermisos([28, 70, 71, 72])} ><PaginaEditarVideo/></ProtectedRoute>} />                                          
                <Route path="/video" element={<ProtectedRoute permiso={validarPermisos([26, 27, 28])} ><PaginaDashboardVideo/></ProtectedRoute>} />          
                <Route path="/examen/crear/:id_curso?/:id_categoria?" element={<ProtectedRoute permiso={validarPermisos([46])} ><PaginaCrearExamen/></ProtectedRoute>} />
                <Route path="/examen/huecopreguntas/:id/:id_curso?" element={<ProtectedRoute permiso={validarPermisos([47])} ><PaginaDashboardHuecoPreguntas/></ProtectedRoute>} />
                <Route path="/examen/editar/:id/:id_curso?" element={<ProtectedRoute permiso={validarPermisos([47])} ><PaginaEditarExamen/></ProtectedRoute>} />
                <Route path="/examen/crearpregunta/seleccion_multiple_unica_respuesta/:id/:id_curso?" element={<ProtectedRoute permiso={validarPermisos([47])} ><PaginaCrearExamenPreguntaSmur/></ProtectedRoute>} />
                <Route path="/examen/editarpregunta/seleccion_multiple_unica_respuesta/:id/:id_examen_pregunta/:id_curso?" element={<ProtectedRoute permiso={validarPermisos([47])} ><PaginaEditarExamenPreguntaSmur/></ProtectedRoute>} />
                <Route path="/examen/crearpregunta/falso_verdadero/:id/:id_curso?" element={<ProtectedRoute permiso={validarPermisos([47])} ><PaginaCrearExamenPreguntaFv/></ProtectedRoute>} />
                <Route path="/examen/editarpregunta/falso_verdadero/:id/:id_examen_pregunta/:id_curso?" element={<ProtectedRoute permiso={validarPermisos([47])} ><PaginaEditarExamenPreguntaFv/></ProtectedRoute>} />
                <Route path="/examen/presentacion/:id_examen/:id_curso" element={<ProtectedRoute permiso={authenticated} ><PaginaExamenPresentacion/></ProtectedRoute>} />                
                <Route path="/examen/intento/:id_examen_intento/:id_curso" element={<ProtectedRoute permiso={authenticated} ><PaginaExamenIntento/></ProtectedRoute>} />                                
                <Route path="/examen/resultados/:id_examen_intento/:id_curso" element={<ProtectedRoute permiso={authenticated} ><PaginaExamenIntentoResultados/></ProtectedRoute>} />
                <Route path="/examen/historial/:id_examen/:id_curso" element={<ProtectedRoute permiso={authenticated} ><PaginaExamenHistorial/></ProtectedRoute>} />                
                <Route path="/home" element={<ProtectedRoute permiso={authenticated} ><PaginaDashboardHome/></ProtectedRoute>} />                
                <Route path="/curso/crear" element={<ProtectedRoute permiso={validarPermisos([21])} ><PaginaCrearCurso/></ProtectedRoute>} />
                <Route path="/curso/editar/:id" element={<ProtectedRoute permiso={validarPermisos([22])} ><PaginaEditarCurso/></ProtectedRoute>} />
                <Route path="/curso/contenido/:id" element={<ProtectedRoute permiso={validarPermisos([29, 25, 24])} ><PaginaEditarContenidoCurso/></ProtectedRoute>} />
                <Route path="/curso/videopreview/:id" element={<ProtectedRoute permiso={validarPermisos([67])} ><PaginaEditarCursoVideoPreview/></ProtectedRoute>} />
                <Route path="/curso/imagen/:id" element={<ProtectedRoute permiso={validarPermisos([66])} ><PaginaEditarCursoImagen/></ProtectedRoute>} />                
                <Route path="/curso/usuarios/:id" element={<ProtectedRoute permiso={validarPermisos([44])} ><PaginaCursoUsuarios/></ProtectedRoute>} />                                
                <Route path="/curso/:url_amigable" element={<PaginaDetallesDeCurso/>} />                                      
                <Route path="/play/:url_amigable" element={<ProtectedRoute permiso={authenticated} ><PaginaPlay/></ProtectedRoute>} />                
                <Route path="/v/:codigo_registro" element={<ProtectedRoute permiso={true} ><PaginaValidarCertificado/></ProtectedRoute>} />                
                <Route path="/usuario/editar/:id?" element={<ProtectedRoute permiso={authenticated} ><PaginaEditarPerfil/></ProtectedRoute>} />                
                <Route path="/usuario/:id/:refer_url?" element={<PaginaEstudianteDetalles/>} />                
                <Route path="/usuario" element={<ProtectedRoute permiso={validarPermisos([17, 18, 19])} ><PaginDashboardUsuarios/></ProtectedRoute>} />                
                <Route path="/factura/historial/:id?" element={<ProtectedRoute permiso={authenticated} ><PaginaHistorialDeCompras/></ProtectedRoute>} />
                <Route path="/permisos" element={<ProtectedRoute permiso={validarPermisos([11, 12, 13, 37, 38, 39, 40, 41, 42])} ><PaginaPerfilesPermisos/></ProtectedRoute>} />                
                <Route path="/categoriasistema" element={<ProtectedRoute permiso={validarPermisos([14, 15, 16, 50, 5, 52, 53, 54, 55, 56, 57, 58])} ><PaginaCategoriasSistema/></ProtectedRoute>} />                                
                <Route path="/factura" element={<ProtectedRoute permiso={validarPermisos([76])} ><PaginaDashboardFacturas/></ProtectedRoute>} />                
                <Route path="/cupon/crear" element={<ProtectedRoute permiso={validarPermisos([62])} ><PaginaCrearCupon/></ProtectedRoute>} />          
                <Route path="/cupon/editar/:id" element={<ProtectedRoute permiso={validarPermisos([63])} ><PaginaEditarCupon/></ProtectedRoute>} />          
                <Route path="/cupon" element={<ProtectedRoute permiso={validarPermisos([61, 62, 63])} ><PaginaDashboardCupon/></ProtectedRoute>} />                                
                <Route path="/certificado/crear" element={<ProtectedRoute permiso={validarPermisos([32])} ><PaginaCrearCertificado/></ProtectedRoute>} />                                
                <Route path="/certificado/editar/:id" element={<ProtectedRoute permiso={validarPermisos([33])} ><PaginaEditarCertificado/></ProtectedRoute>} />                                                
                <Route path="/certificado" element={<ProtectedRoute permiso={validarPermisos([31, 32, 33])} ><PaginaDashboardCertificado/></ProtectedRoute>} />                                
                <Route exact path="/" element={<Pagina404/>} />          
                <Route path="*" component={<Pagina404/>} />
            </Routes>            
      </BrowserRouter>
  );
};

export default Rutas;