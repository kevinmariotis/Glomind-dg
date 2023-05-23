
import Cookies from 'js-cookie';
const urlBaseApi = import.meta.env.VITE_URL_BASE_API;  

export const validateJWT = async (jwt) => {
    try {
        const jwt = Cookies.get('jwt');
        if(jwt){
          // Realizar la lógica de validación del JWT en el servidor
          const response = await fetch(`${urlBaseApi}/api/sesion/validarToken`, {
              method: 'GET',
              headers: {                  
              },
              body: JSON.stringify({ jwt }),
          });
          if (response.ok) {
              // El JWT es válido, continuar con la aplicación
          } else {
              // El JWT no es válido, redireccionar a la página de inicio de sesión
              window.location.href = '/login';
          }
        }else{
            window.location.href = '/login';
        }
    } catch (error) {
      console.log(error);
      // Manejo de errores en la validación del JWT
      // Redireccionar a la página de inicio de sesión u otra acción apropiada
    }
};