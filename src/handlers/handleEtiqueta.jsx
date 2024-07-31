

export const handleTag = {
    nombre      : (event) => { setPopupTag({...popUpTag, nombre:event.target.value});  },
    html        : (event) => { setPopupTag({...popUpTag, html:event.target.value});  },
    descripcion : (event) => { setPopupTag({...popUpTag, descripcion:event.target.value})},
    show        : (event) => { 
        setPopupTag({...popUpTag, mostrar: 1})
    },
    showEdit : (event, data, setPopupTag) => {
        console.log(data);
        setPopupTag({
            nombre : data.nombre, 
            html   : data.html,
            mostrar: 1,
            i_tag  : data.id_tipo_contenido,
            descripcion: data.descripcion
        });
    },
    save   : async (event) => { 

       setMostrarSpinner(true);

       if(popUpTag.i_tag != -1){

            let dataTag = {
                nombre       : popUpTag.nombre,
                descripcion  : popUpTag.descripcion,
                html         : popUpTag.html
            }

            const opciones = {   
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: JSON.stringify(dataTag)
            };

            const response = await fetch(`${urlBaseApi}/api/etiqueta/${popUpTag.i_tag}`, opciones);
            setMostrarSpinner(false);
            obtenerDatosServidor();

            const datos = await response.json();            
            
            if (response.ok){  
                console.log(datos);
            }

       }else{
            const tagData = new FormData();        
            tagData.append('nombre', popUpTag.nombre);   
            tagData.append('descripcion', popUpTag.descripcion);
            tagData.append('html', popUpTag.html)
            tagData.append('id_curso', id);
            tagData.append('id_categoria', idSeccionAgregarContenido);
                
            const opciones = {   
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: tagData
            };

            const response = await fetch(`${urlBaseApi}/api/etiqueta`, opciones);
            setMostrarSpinner(false);
            obtenerDatosServidor();

            const datos = await response.json();            
            
            if (response.ok){  
            console.log(datos);
            }
       }

       setPopupTag({...popUpTag, mostrar: 0});
       
    }
}

