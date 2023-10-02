import React, {useContext, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import DashboardFooter from './DashboardFooter';

/*Import para el arbol de categorias*/
import { Tree, getBackendOptions, MultiBackend, } from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
/*Fin de los imports para el arbol de categorias*/

export default function FormularioCategoriasSistema() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const {jwt, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});    
    const [verPopUpCrearCategoria, setVerPopUpCrearCategoria] = useState(false);
    const [verPopUpEditarCategoria, setVerPopUpEditarCategoria] = useState(false);    
    const [verPopUpEditarImagenCategoria, setVerPopUpEditarImagenCategoria] = useState(false);    
    const [verPopUpCrearTag, setVerPopUpCrearTag] = useState(false);
    const [pestanaActivada, setPestanaActivada] = useState(1);    
           
    const [formNombre, setFormNombre] = useState('');  
    const [formIdCategoriaPadre, setFormIdCategoriaPadre] = useState(0);
    const [formIdCategoriaEditando, setFormIdCategoriaEditando] = useState(0);
    const [formEstado, setFormEstado] = useState(1);
    const [formNombreCategoriaPadre, setFormNombreCategoriaPadre] = useState('');
    const [imagenPequenaCategoriaSistema, setImagenPequenaCategoriaSistema] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [treeData, setTreeData] = useState([]);
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);
        switch(pestanaActivada){
            case 1:
                obtenerCategoriasSistema();
            break;
            case 2:
                obtenerPermisosDePerfiles();
            break;
        }        
    }, [pestanaActivada]);
           
    //Estados de los errores de campos
    const camposErrores = {                               
        'nombre':[],
        'estado':[],
        'imagen':[],
    }    
    const [erroresCampos, setErrorCampo] = useState(camposErrores);
    const setErrorCampoGlobal = (index, newValue) => {
        if (index in erroresCampos) {
            setErrorCampo((prevState) => ({
                ...prevState,
                [index]: [...(prevState[index] || []), newValue],
            }));
        }
    };
    const reiniciarErrorCampoGlobal = () => {
        for (let propiedad in erroresCampos) {
            if (Array.isArray(erroresCampos[propiedad])) {
                erroresCampos[propiedad] = [];
            }
        }
    };
        
    const handleCambiarPestana = (event, numero) =>{    
        event.preventDefault();   
        setPestanaActivada(numero);
    };
    
    const handleFuncionAceptarPopUp = () => {        
        switch(popUp.data_switch){
            case 'borrar-categoria':
                borrarCategoriaSistema(popUp.data_id);
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
      
    
    const handleDrop = (
        newTree,
        { dragSourceId, dropTargetId, dragSource, dropTarget }
    ) => {            
            setTreeData(newTree);
            if(dragSource.data.tipo=='curso' && dropTarget.data.tipo=='categoria'){
                moverCurso(dragSource.data.id_real, dropTarget.data.id_real);
            }else{
                if(dragSource.data.tipo=='categoria' && dropTarget.data.tipo=='categoria'){
                    moverCategoria(dragSource.data.id_real, dropTarget.data.id_real);
                }    
            }
    };
      
    const handleNombreChange = (event) =>{            
        setFormNombre(event.target.value);
    };     
    const handleEstadoChange = (event) =>{            
        setFormEstado(event.target.value);
    };    

    const handleDelete = (id_categoria) => {
        /*const deleteIds = [
          id,
          ...getDescendants(treeData, id).map((node) => node.id)
        ];
        const newTree = treeData.filter((node) => !deleteIds.includes(node.id));
    
        setTreeData(newTree);*/
    };

    const handleEdit = (id_categoria) => {

    }
    
    const handleClickCrear = (id_categoria_padre, nombre_categoria_padre) => {    
        reiniciarErrorCampoGlobal();
        setFormNombreCategoriaPadre(nombre_categoria_padre);
        setVerPopUpCrearCategoria(true);
        setFormNombre('');
        setFormEstado(-1);
        setFormIdCategoriaPadre(id_categoria_padre);        
    }
    
    const handleClickEditar = (tipo_elemento, id, nombre, estado) => {  
        reiniciarErrorCampoGlobal();
        switch(tipo_elemento){
            case 'categoria':
                setVerPopUpEditarCategoria(true);
                setFormNombre(nombre);
                setFormIdCategoriaEditando(id);
                setFormEstado(estado);                
            break;
        }
    }    

    const handleClickEditarImagen = (id, imagen_pequena) => {  
        reiniciarErrorCampoGlobal(); 
        setFormIdCategoriaEditando(id);
        setVerPopUpEditarImagenCategoria(true);              
        setImagenPequenaCategoriaSistema(imagen_pequena);           
    }

    const handleClickBorrarCategoriaSistema = async (id, nombre) => {         
        reiniciarErrorCampoGlobal();         
        setPopup({mostrar:true, tipo:3, titulo:'Confirmar', contenido:'Confirma que desea borrar la categorpia '+nombre+'?', data_switch:'borrar-categoria', data_id:id});
    };
    
    const onDrop = (acceptedFiles) => {
        // Lógica para procesar los archivos aceptados
        setSelectedImage(acceptedFiles[0]);
    };
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg', '.jpg'],
        }
    });    
    const fileList = acceptedFiles.map((file, index) => (
        <li key={`imagen-ajunta${index}`}>{file.name}</li>
    ));


    const obtenerCategoriasSistema = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {   
            if(permissions[40] || permissions[41] || permissions[42]){
                const opciones = {
                    method: 'GET',
                    headers: headers,
                };
                setMostrarSpinner(true);
                const response = await fetch(`${urlBaseApi}/api/categoriasistema/getTodas/1`, opciones);
                setMostrarSpinner(false);
                if (response.ok){                           
                    const datos = await response.json();   
                    //setCategoriaaSistema(datos);
                    setTreeData(datos);
                } else {      
                    const data = await response.json();          
                    mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
                }  
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const crearCategoria = async (event) => {
        event.preventDefault();
        reiniciarErrorCampoGlobal();
                
        const formData = new FormData();            
        formData.append('id_padre', formIdCategoriaPadre);       
        formData.append('nombre', formNombre);
        formData.append('estado', formEstado);
        
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: formData
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/categoriasistema`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){   
                setFormNombre('');
                setFormEstado(1);
                setFormIdCategoriaPadre(0);
                setVerPopUpCrearCategoria(false);
                obtenerCategoriasSistema();
                setPopup({mostrar:true, titulo:'Listo', contenido:'Categoría creada.'});
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    };  

    const editarCategoria = async () => {               
        const raw = {
            'nombre': formNombre,
            'estado': formEstado.toString(),
        };                            
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/categoriasistema/${formIdCategoriaEditando}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                setFormNombre('');
                setFormEstado(1);
                setVerPopUpEditarCategoria(false);
                obtenerCategoriasSistema();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }
    const editarImagenCategoria = async () => {   

        reiniciarErrorCampoGlobal();        
        if(selectedImage!=null){
            setMostrarSpinner(true);
            try{
                const formData = new FormData();
                formData.append('imagen', selectedImage);
                const opciones = {
                    method: 'POST',
                    headers: {
                        'Authorization' : `Bearer ${jwt}`
                    },
                    body: formData
                };
                const response = await fetch(`${urlBaseApi}/api/categoriasistema/actualizarImagen/${formIdCategoriaEditando}`, opciones);
                const datos = await response.json();            
                setMostrarSpinner(false);
                if (response.ok){ 
                    setVerPopUpEditarImagenCategoria(false);
                    obtenerCategoriasSistema();
                    setPopup({mostrar:true, titulo:'Listo', contenido:'Imagen actualizada.'});
                    return;
                } else {
                    if(datos.codigo=='no-puede-ser-redimensioada-a-1920-450'){
                        setPopup({mostrar:true, titulo:'Error', contenido:'La imagen no es de 1920 x 450 o no puede ser redimensionada equitativamente a este tamaño.'});
                    }else{   
                        mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
                    }                        
                }
            }catch(error){
                // Manejar el caso de error en la solicitud
                console.error('Error en la solicitud al servidor', error);
            }
        }else{
            setPopup({mostrar:true, titulo:'Mensaje', contenido:'Seleccione una imagen de su dispositivo.'});
        }

    }

    const borrarCategoriaSistema = async (id_categoria) => {         
        setMostrarSpinner(true);        
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'DELETE',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/categoriasistema/${id_categoria}`, opciones);            
            setMostrarSpinner(false);            
            const datos = await response.json();
            if (response.ok){ 
                obtenerCategoriasSistema();
                setPopup({mostrar:true, titulo:'Listo', contenido:'Categoría borrada.'});                
            } else {                     
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {});
            }     
                    
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };


    /*
        Mueve un curso de una categoria a otra
    */
    const moverCurso = async (id_curso, id_categoria_destino) => {               
        const raw = {
            'id_categoria': id_categoria_destino.toString(),
        };                            
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
        
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/curso/editarCursoCategoria/${id_curso}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                //obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'No es posible', 'contenido': 'Realizar este movimiento.'});                                                                    
                obtenerCategoriasSistema();     //se vuelve a cargar para deshacer el ultimo movimiento.
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    /*
        Mueve un curso de una categoria a otra
    */
    const moverCategoria = async (id_categoria, id_categoria_destino) => {
        const raw = {
            'id_categoria_padre': id_categoria_destino.toString(),
        };                            
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            },
            body: JSON.stringify(raw),
        };
    
        try {
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/categoriasistema/editarPadre/${id_categoria}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();            
            if (response.ok){    
                //obtenerDatosServidor();
                return;
            } else {
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': 'No es posible', 'contenido': 'Realizar este movimiento.'});                                                                    
                obtenerCategoriasSistema();     //se vuelve a cargar para deshacer el ultimo movimiento.
            }                
        }catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    return (
        <>
        {mostrarSpinner && <Spinner />}        
        <Popup 
            mostrarPopup={popUp.mostrar} 
            tamano="xx"
            tipo={popUp.tipo} 
            titulo={popUp.titulo} 
            mensaje={popUp.contenido} 
            funcionAceptar={handleFuncionAceptarPopUp} 
            funcionCerrar={handleFuncionCerrarPopUp}
            textoCerrar="Cerrar"
        />
        <div className={`modal fade modal-container ${verPopUpCrearCategoria==true ? 'show' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="asignarPerfil" tabIndex="-1" role="dialog" aria-labelledby="asignarPerfilTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="asignarPerfilTitle">Crear categoría {formNombreCategoriaPadre!='' && `en ${formNombreCategoriaPadre}`}</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Nombre</label>
                            <input onChange={handleNombreChange} value={formNombre} className="form-control form--control pl-3" type="text" name="nombre" maxLength="64" placeholder="" />
                            {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}
                        </div>
                        <div className="form-group">
                            <label className="label-text">Estado</label>
                            <select onChange={handleEstadoChange} value={formEstado} name="estado" className="form-control select-dark">
                                <option value=""> -- Seleccione --</option>                                            
                                <option value="1">Visible</option>
                                <option value="0">Oculta</option>                                
                            </select>                                        
                            {erroresCampos['estado'].length > 0 && (<SpamError mensaje={erroresCampos['estado']} />)}
                        </div>
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={crearCategoria}> Crear </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setVerPopUpCrearCategoria(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>
        <div className={`modal fade modal-container ${verPopUpEditarCategoria==true ? 'show' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="asignarPerfil" tabIndex="-1" role="dialog" aria-labelledby="asignarPerfilTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="asignarPerfilTitle">Editar categoría</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label-text">Nombre</label>
                            <input onChange={handleNombreChange} value={formNombre} className="form-control form--control pl-3" type="text" name="nombre" maxLength="64" placeholder="" />
                            {erroresCampos['nombre'].length > 0 && (<SpamError mensaje={erroresCampos['nombre']} />)}
                        </div>                        
                        <div className="form-group">
                            <label className="label-text">Estado</label>
                            <select onChange={handleEstadoChange} value={formEstado} name="estado" className="form-control select-dark">
                                <option value=""> -- Seleccione --</option>                                            
                                <option value="1">Visible</option>
                                <option value="0">Oculta</option>                                
                            </select>                                        
                            {erroresCampos['estado'].length > 0 && (<SpamError mensaje={erroresCampos['estado']} />)}
                        </div>
                        
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={editarCategoria}> Guardar </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setVerPopUpEditarCategoria(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>
        <div className={`modal fade modal-container ${verPopUpEditarImagenCategoria==true ? 'show' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="asignarPerfil" tabIndex="-1" role="dialog" aria-labelledby="asignarPerfilTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header border-bottom-gray">
                        <div className="pr-2">                            
                            <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="asignarPerfilTitle">Editar categoría</h5>
                        </div>                            
                    </div>
                    <div className="modal-body">                        
                        <div className="form-group">
                            <label className="label-text">Imágen (Solo 1920x450)</label>
                            
                            <div {...getRootProps()}>
                                {imagenPequenaCategoriaSistema!=null && 
                                    <><img className="mr-3" src={`${urlBaseApi}/${imagenPequenaCategoriaSistema}`} style={{width:'100%'}} alt="Imagen de la categoría sistema"/><br/></>
                                }                                                                                                        
                                <input {...getInputProps()} className="multi file-upload-input" />
                                <span className="file-upload-text"><i className="la la-cloud-upload mr-2 fs-18"></i>Selecciona o arrastra la imagen aquí.</span>
                            </div>
                            <ul>{fileList}</ul>                                        
                            {erroresCampos['imagen'].length > 0 && (<SpamError mensaje={erroresCampos['imagen']} />)}       
                        </div>
                    </div>
                    <div className="modal-footer border-top-gray">                        
                        <button type="button" className="btn theme-btn mb-2" onClick={editarImagenCategoria}> Guardar </button>
                        <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={() => { setVerPopUpEditarImagenCategoria(false); }}> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="dashboard-content-wrap">
            <div className="dashboard-menu-toggler btn theme-btn theme-btn-sm lh-28 theme-btn-transparent mb-4 ml-3">
                <i className="la la-bars mr-1"></i> Dashboard Nav
            </div>
            <div className="container-fluid">                
                <div className="dashboard-heading mb-5">
                    <h3 className="fs-22 font-weight-semi-bold">Categorías y tags</h3>
                </div>
                <ul className="nav nav-tabs generic-tab pb-30px" id="myTab" role="tablist">
                    {(permissions[14] || permissions[15] || permissions[16]) && <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==1 ? 'active': ''}`} onClick={event =>{ handleCambiarPestana(event, 1) }} id="edit-profile-tab" data-toggle="tab" href="#edit-profile" role="tab" aria-controls="edit-profile" aria-selected="false">
                            Categorías
                        </a>
                    </li>}
                    {(permissions[50] || permissions[51] || permissions[52] || permissions[53] || permissions[54] || permissions[55] || permissions[56] || permissions[57] || permissions[58]) && <li className="nav-item">
                        <a className={`nav-link ${pestanaActivada==2 ? 'active': ''}`} onClick={event =>handleCambiarPestana(event, 2) } id="password-tab" data-toggle="tab" href="#password" role="tab" aria-controls="password" aria-selected="true">
                            Tags
                        </a>
                    </li>}                                                     
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${pestanaActivada==1 ? 'show active': ''}`} id="edit-profile" role="tabpanel" aria-labelledby="edit-profile-tab">
                        <div className="setting-body">
                            <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                                <div className="media media-card align-items-center">                        
                                    <h3 className="fs-17 font-weight-semi-bold">Categorías del sistema</h3>                        
                                </div>                    
                                <div className="btn-box pt-30px">
                                    {permissions[15] && <button onClick={()=>{ setVerPopUpCrearCategoria(true); setFormNombre(''); setFormIdCategoriaPadre(0); setFormNombreCategoriaPadre(''); setFormEstado(1); setFormEstado(-1); reiniciarErrorCampoGlobal(); }} type="submit" className="btn theme-btn"><i className="la la-plus mr-2"></i> Crear categoría sistema</button>}
                                </div>
                            </div>                                                        
                            <div className="col-lg-12" style={{marginBottom:'100px'}}>                                                                                                         
                                <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                                    <Tree
                                        tree={treeData}
                                        rootId={0}
                                        onDrop={handleDrop}
                                        render={(node, { depth, isOpen, onToggle }) => (
                                            <div style={{ marginLeft: depth * 40 }}>
                                                {node.droppable && (
                                                    <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
                                                )}
                                                <CustomNode permiso_crear={permissions[15]} permiso_editar={permissions[16]} permiso_editar_imagen={permissions[75]} tipo={node.data.tipo} id_real={node.data.id_real} nombre={node.text} estado={node.data.estado} imagen_pequena={node.data.imagen_pequena} handleClickEditar={handleClickEditar} handleClickCrear={handleClickCrear} handleClickEditarImagen={handleClickEditarImagen} handleClickBorrar={handleClickBorrarCategoriaSistema} />
                                            </div>
                                        )}
                                    />
                                </DndProvider>
                            </div>                            
                        </div>
                    </div>
                    <div className={`tab-pane fade ${pestanaActivada==2 ? 'show active': ''}`} id="password" role="tabpanel" aria-labelledby="password-tab">
                        <div className="setting-body">
                            <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between mb-5">
                                <div className="media media-card align-items-center">                        
                                    <h3 className="fs-17 font-weight-semi-bold">Perfiles y permisos del sistema</h3>                        
                                </div>                    
                                <div className="btn-box pt-30px">
                                    {permissions[12] && <button onClick={()=>{ setVerPopUpCrearTag(true); }} type="submit" className="btn theme-btn"><i className="la la-plus mr-2"></i> Crear Tag</button>}
                                </div>
                            </div>     
                            <div className="col-lg-12">                                     
                                



                            </div>

                        </div>
                    </div>                                                           
                </div>
                <DashboardFooter />
            </div>
        </div>
        </>
    )
};


export const CustomNode = ({tipo, id_real, nombre, estado, imagen_pequena, handleClickEditar, handleClickCrear, handleClickEditarImagen, handleClickBorrar, permiso_crear, permiso_editar, permiso_editar_imagen}) => {
    const [hover, setHover] = useState(false);                    
    return (
        <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} >{nombre} {tipo=='categoria' && hover ? <> [{permiso_editar && <span style={{cursor:'pointer'}} onClick={()=> handleClickEditar(tipo, id_real, nombre, estado)}> Editar | </span>} {permiso_crear && <span onClick={()=> handleClickCrear(id_real, nombre)} style={{cursor:'pointer'}}>Crear | </span>} {permiso_editar && <span style={{cursor:'pointer'}} onClick={()=> handleClickBorrar(id_real, nombre)}>Borrar | </span>}  {permiso_editar_imagen && <span style={{cursor:'pointer'}} onClick={()=> handleClickEditarImagen(id_real, imagen_pequena)}>Imagen</span>} ]</> : ''}</span>
    );
};