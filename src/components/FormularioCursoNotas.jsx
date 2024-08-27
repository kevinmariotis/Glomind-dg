import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import 'react-loading-skeleton/dist/skeleton.css'

function FormularioCursoNotas() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const { id_curso } = useParams();
    const {jwt, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
    
    const [datos, setDatos] = useState({tiempo:0, cantidad_preguntas:0, tipo:0, intentos:'', nombre:'', descripcion:'', mejor_intento:'', peor_intento:'', promedio_intentos:'', promedio_global:'', intentos_realizados:''});
    const [curso, setCurso] = useState({nombre:'', instructor:'', url_amigable:'', imagen_pequena:null});
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    const [editarNota, setEditarNota] = useState({mostrar:false, id_usuario:-1, id_curso_contenido:0, puntuacion_fija:''});

    useEffect(() => {           
        window.scrollTo(0, 0);    
        obtenerDatosDelServidor();
        obtenerDatosCurso();        
    }, []);
    
    //Estados de los errores de campos
    const camposErrores = {                        
        'puntuacion_fija':[],        
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

    const handleFuncionAceptarPopUp = () => {        
        /*switch(popUp.data_switch){
            case 'iniciar_intento':
                
            break;
        }*/
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    
    const obtenerDatosDelServidor = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/curso/getNotas/${id_curso}`, opciones);
            setMostrarSpinner(false);
            const datos = await response.json();   
            if (response.ok){                                                                           
                setDatos(datos.datos);                                   
            } else {                      
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

    const obtenerDatosCurso = async () => {                  
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {            
            const opciones = {
                method: 'GET',
                headers: headers,
            };            
            const response = await fetch(`${urlBaseApi}/api/curso/informacionBasica/${id_curso}`, opciones);            
            const datos = await response.json();   
            if (response.ok){                                           
                setCurso(datos);                       
            } else {                      
                mensajesDeError(setPopup, response.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, false, {'titulo': '', 'contenido': ''});
            }            
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };
        
    /*const handleConfirmarIntento = (event) => {        
        event.preventDefault(); 
        setPopup({mostrar:true, titulo:'Confirmar', tipo:3, contenido:'Confirma que desea iniciar un intento?', data_switch:'iniciar_intento'});
    };*/
       
    
    const handleEditarNota = {
        puntuacion_fija        : (event) => { setEditarNota({...editarNota, puntuacion_fija:event.target.value});  },        
        show          : (event) => { 
            setEditarNota({...editarNota, mostrar: true})
        },
        close          : (event) => {             
            setEditarNota({...editarNota, mostrar: false})
        },
        load : (id_curso_contenido, id_usuario, puntuacion_fija) => {            
            if(curso.es_docente==1 || permissions[102]){
                setEditarNota({...editarNota, mostrar:true, id_usuario:id_usuario, id_curso_contenido:id_curso_contenido, puntuacion_fija:puntuacion_fija})
            }
        },
        save          : async (event) => {
            reiniciarErrorCampoGlobal();                                                    
            let raw = {
                puntuacion_fija      : editarNota.puntuacion_fija!='' ? editarNota.puntuacion_fija : null,                
            };            
            const opcionesData = {   
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${jwt}`
                },
                body: JSON.stringify(raw)
            };

            setMostrarSpinner(true);                                                
            const responseRaw = await fetch(`${urlBaseApi}/api/cursocontenidoconsumo/editarPuntaucionFija/${editarNota.id_curso_contenido}/${editarNota.id_usuario}`, opcionesData);
            if (responseRaw.ok){    
                obtenerDatosDelServidor();         
                handleEditarNota.close();                               
                setPopup({mostrar:true, titulo:'Listo', contenido:'Nota fija guardada.', data_switch:'cerrar_ventana'});
            } else {
                const datos = await responseRaw.json();
                mensajesDeError(setPopup, responseRaw.status, (typeof datos.datos !== 'undefined') ? datos.datos : {}, setErrorCampoGlobal, {'titulo': '', 'contenido': ''});
            }
            setMostrarSpinner(false);                                                                        
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
            <div className={`modal fade modal-container ${editarNota.mostrar==true ? 'show': ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="tagModal" tabIndex="-1" role="dialog" aria-labelledby="tagModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header border-bottom-gray">
                            <div className="pr-2">                            
                                <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="tagModalTitle">Editar puntuación</h5>
                            </div>                            
                        </div>
                        <div className="modal-body">
                            <div className="col-lg-12">
                                <div className="form-group">    
                                    <label className="label-text">Puntuación</label>                                                                    
                                    <input value={editarNota.puntuacion_fija} onChange={handleEditarNota.puntuacion_fija} className="form-control form--control pl-3" type="text" name="puntuacion_fija" maxLength="4" placeholder="" />
                                    {erroresCampos['puntuacion_fija'].length > 0 && (<SpamError mensaje={erroresCampos['puntuacion_fija']} />)}                            
                                </div>
                            </div>                                
                        </div>
                        <div className="modal-footer border-top-gray">
                            <button type="button" className="btn theme-btn mb-2" onClick={handleEditarNota.save} >Guardar</button>
                            <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={handleEditarNota.close}> Cancelar </button>
                        </div>
                    </div>
                </div>
            </div>
            <section >
                <div className="bg-white py-3 pattern-bg" style={{zIndex:'0'}}>
                    <div className="container">
                        <div className="breadcrumb-content">
                            <ul className="quiz-nav d-flex flex-wrap align-items-center">
                                <li><Link to={`${urlBase}/play/${curso.url_amigable}`}><i className="la la-arrow-left mr-2"></i>Volver al curso</Link></li>
                                <li>
                                    <div className="d-flex align-items-center">
                                        <div className="media media-card">
                                        {curso.url_amigable=='' ? <Skeleton width={82} height={48} /> : 
                                            <Link to={`/play/${curso.url_amigable}`} className="media-img" style={{ height: 'auto' }}>
                                                {curso.imagen_pequena!=null ? <img src={`${urlBaseApi}/${curso.imagen_pequena}`} alt={curso.nombre} /> : <img src="/images/course-no-image.png" alt={curso.nombre} /> }
                                            </Link>
                                        }
                                        </div>
                                        <p>
                                            {curso.nombre=='' ?  <Skeleton width={300}  style={{marginLeft: '15px'}} /> : <Link to={`/play/${curso.url_amigable}`}>{curso.nombre}</Link>}
                                            {curso.nombre=='' ? <Skeleton width={150}  style={{marginLeft: '15px'}} /> : <span className="d-block fs-13">{curso.instructor}</span>}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>  
                <div className="dashboard-content-wrap" style={{width:'auto'}}>
                    <div className="container-fluid">
                        <div className="dashboard-heading mb-5">                                                                                                        
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="fs-22 font-weight-semi-bold pb-2">Notas de {curso.nombre ? curso.nombre : ''}</h3>                            
                                    <div className="divider"><span></span></div>
                                    <div className="row">                                                                
                                        <div className="col-lg-12">
                                            <div className="table-responsive">
                                                {datos.categorias && 
                                                <table className="table generic-table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="text-nowrap px-3">Estudiante</th>
                                                            <th scope="col" className="text-nowrap px-3">Calificación curso</th>
                                                            {datos.categorias.map((categoria) =>
                                                                categoria.curso_contenido.map((curso_contenido, indexcc) => (
                                                                    <th key={`curso_cont_${curso_contenido.tipo_contenido}_${curso_contenido.id_tipo_contenido}_`} className="text-nowrap px-3">{curso_contenido.nombre} ({curso_contenido.porcentaje_en_total_curso}%)</th>
                                                                ))
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody >
                                                        {datos.usuarios.map((usuario) =>
                                                            <tr key={`usuario_${usuario.id_usuario}`} className="text-nowrap px-3">
                                                                <td>{usuario.nombres} {usuario.apellidos}</td>
                                                                <td>{usuario.calificacion_curso}</td>
                                                                {datos.categorias.map((categoria) =>
                                                                    categoria.curso_contenido.map((curso_contenido, indexcc) => {
                                                                        const notaUsuario = usuario.notas.find(
                                                                            (nota) =>
                                                                                nota.tipo_contenido === curso_contenido.tipo_contenido &&
                                                                                nota.id_tipo_contenido === curso_contenido.id_tipo_contenido
                                                                        );
                                                                        return (
                                                                            <td key={`usuario_nota_${usuario.id_usuario}_${curso_contenido.tipo_contenido}_${curso_contenido.id_tipo_contenido}`} className="text-nowrap px-3">
                                                                                <span style={{cursor:'pointer'}} onClick={()=> { handleEditarNota.load(curso_contenido.id_contenido, usuario.id_usuario, notaUsuario ? notaUsuario.puntuacion_fija!=null ? notaUsuario.puntuacion_fija : notaUsuario.puntuacion : '')}}>{notaUsuario ? notaUsuario.puntuacion_fija!=null ? <span style={{backgroundColor:'#FFE365'}}>{notaUsuario.puntuacion_fija}</span>: notaUsuario.puntuacion : '-'}</span>
                                                                            </td>
                                                                        );
                                                                    })
                                                                )}
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>               
            </section>                                                               
        </>
    )
}

export default FormularioCursoNotas;