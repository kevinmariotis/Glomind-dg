
   
    /*
        mensaeSiErrorCamposGlobal: es un popup opcional que aparecería si existen mensajes de campos global (que son los mensajes pequeños que aparecen por debajo de cada imput)
    */
    export const mensajesDeError = (setPopPup, codigoError, errores={}, setErrorCampoGlobal=false, mensaeSiErrorCamposGlobal={titulo:'', contenido:''}) => {
        let mostrar_errores_data = false;
        switch(codigoError){
            case 200:   //aveces se muestran mensajes a pesar de que el estado es 200 ok
                mostrar_errores_data = true;
            break;
            case 400:       //bad-request
                if(Object.entries(errores).length==0 || !setErrorCampoGlobal){  //si no llego error y no se ha establecido una funcion para mostrar errores de campos especificos, se coloca mensaje generico
                    mostrar_errores_data = true;
                }else{
                    Object.entries(errores).forEach(([clave, mensajes]) => {                                                           
                        mensajes.forEach((mensaje) => {                        
                            setErrorCampoGlobal(clave, mensaje);                                               
                        });                   
                    });
                    if(Object.entries(errores).length>0 && mensaeSiErrorCamposGlobal.titulo!='' && mensaeSiErrorCamposGlobal.contenido!=''){
                        setPopPup({mostrar:true, titulo:mensaeSiErrorCamposGlobal.titulo, contenido:mensaeSiErrorCamposGlobal.contenido});                
                    }
                }
            break;            
            case 401:       //No autorizado
                setPopPup({mostrar:true, titulo:'Sesión finalizada', contenido:'La sesión ha vencido, inicia sesión de nuevo.'});                
                setTimeout(function(){
                    document.location.reload();
                }, 3000);
            break;
            case 404:       //no encontrado
                setPopPup({mostrar:true, titulo:'No encontrado', contenido:'El recurso no ha sido encontrado.'});                
            break;
            case 500:       //error en servidor
                setPopPup({mostrar:true, titulo:'Ops', contenido:'Hubo un error interno al obtener la información, por favor inténtalo más tarde.'});                
            break;
        }
        if(mostrar_errores_data){
            //recopilamos y mostramos cualquien mensaje de error que haya llegado en un popup            
            Object.entries(errores).forEach(([clave, mensajes]) => {                                        
                mensajes.forEach((mensaje) => {
                    setPopPup({mostrar:true, titulo:'Mensaje', contenido:mensaje+'.'});
                });
            });    
            //fin de recopirar y mostrar cualquier mensaje de error
        }

    };