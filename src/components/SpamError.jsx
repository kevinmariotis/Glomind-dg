import React from 'react';

function SpamError({mensaje=''}) {
    const isArray = Array.isArray(mensaje);
    let mensajes = '';
    let encontrados = [];
    if(!isArray){
        mensajes = mensaje;
    }else{
      mensaje.forEach((element) => {
          if(!encontrados.includes(element)){
              encontrados.push(element);
              mensajes = mensajes+=" "+element;
          }
      });
    }

    return (<span className="badge badge-danger">{mensajes}</span>);
}

export default SpamError;