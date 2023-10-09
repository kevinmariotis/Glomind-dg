import React, {useContext, useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';
import { mensajesDeError } from './utils';
import Spinner from './Spinner';
import SpamError from './SpamError';
import Popup from './Popup';
import Paginador from './Paginador';
import DashboardFooter from './DashboardFooter';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import TarjetaCurso from './TarjetaCurso';

export default function FormularioEstudianteDetalles() {
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;       
    const { id } = useParams();    
    const {jwt, permissions} = useContext(AuthContext);
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1, data_id_2:-1});    
                           
    const [datos, setDatos] = useState({nombres:'', apellidos:'', cantidad_cursos:0, cantidad_reviews:0, cantidad_comentarios:0, docente_descripcion:null,  imagen_pequena:null, miembro_desde:'', profesion:'', facebook:null, twitter:null, instagram:null, linkedin:null, youtube:null});
    const [cursos, setCursos] = useState({});
    const [totalCursos, setTotalCursos] = useState(0);
    const [paginaCursos, setPaginaCursos] = useState(1);    
    
    const [mostrarSpinner, setMostrarSpinner] = useState(false);    
    
    useEffect(() => {           
        window.scrollTo(0, 0);        
        obtenerDatosServidor();            
    }, [paginaCursos]);
           
    //Estados de los errores de campos
    const camposErrores = {                        
        'nombre':[],        
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
            
        }*/
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };

    const handleFuncionCerrarPopUp = () => {        
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1, data_id_2:-1});
    };
                      
    const obtenerDatosServidor = async () => {
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {               
            const opciones = {
                method: 'GET',
                headers: headers,
            };
            setMostrarSpinner(true);
            const response = await fetch(`${urlBaseApi}/api/usuario/presentacion/${id}/${paginaCursos}`, opciones);
            setMostrarSpinner(false);
            if (response.ok){                           
                const datos = await response.json();   
                //setCategoriaaSistema(datos);
                setCursos(datos.usuario.cursos);
                datos.usuario.cursos = null;
                setDatos(datos.usuario);                                
                setTotalCursos(datos.usuario.total_cursos);
            } else {      
                const data = await response.json();          
                mensajesDeError(setPopup, response.status, (typeof data.datos !== 'undefined') ? data.datos : {});                
            }
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }
    };

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
            <section className="breadcrumb-area py-5 bg-white pattern-bg">
                <div className="container">
                    <div className="breadcrumb-content">
                        <div className="media media-card align-items-center pb-4">
                            <div className="media-img media--img media-img-md rounded-full">
                                <img className="rounded-full lazy" src={datos.imagen_pequena==null ? `${urlBase}/images/avatar_docente.jpg` : `${urlBaseApi}/${datos.imagen_pequena}`} alt="Imagen del usuario" />
                            </div>
                            <div className="media-body">
                                <h2 className="section__title fs-30">{datos.nombres!='' ? datos.nombres+' '+datos.apellidos : <Skeleton width={'30%'} height={25} style={{marginTop: '0px'}}/> }</h2>
                                <span className="d-block lh-18 pt-1 pb-2">{datos.miembro_desde!='' ? `Miembro desde ${datos.miembro_desde}` : <Skeleton width={'25%'} height={20} /> }</span>
                                <p className="lh-18">{datos.profesion!='' ? datos.profesion : <Skeleton width={'30%'} height={20} /> }</p>
                            </div>
                        </div>
                        <ul className="social-icons social-icons-styled social--icons-styled">
                            <li>{datos.facebook!=null ? <a href={datos.facebook} target="_blank"><i className="la la-facebook"></i></a> : ''}</li>
                            <li>{datos.twitter!=null ? <a href={datos.twitter} target="_blank"><i className="la la-twitter"></i></a> : ''}</li>
                            <li>{datos.instagram!=null ? <a href={datos.instagram} target="_blank"><i className="la la-instagram"></i></a> : ''}</li>
                            <li>{datos.linkedin!=null ? <a href={datos.linkedin} target="_blank"><i className="la la-linkedin"></i></a> : ''}</li>
                            <li>{datos.youtube!=null ? <a href={datos.youtube} target="_blank"><i className="la la-youtube!"></i></a> : ''}</li>
                        </ul>
                    </div>
                </div>
            </section>
            
            <section className="teacher-details-area pt-50px">
                <div className="container">
                    <div className="student-details-wrap pb-20px">
                        {datos.docente_descripcion!=null ? <h3 className="fs-24 font-weight-semi-bold pb-2">Biografía</h3> : ''}
                        {datos.docente_descripcion!=null ? <p className="pb-5">{datos.docente_descripcion.split('<br />').map((line, index) => (<span key={`bio-parte-${index}`}>{line}<br /></span> ))}</p> : ''}
                        <div className="row">
                            <div className="col-lg-4 responsive-column-half">
                                <div className="counter-item">
                                    <div className="counter__icon icon-element mb-3 shadow-sm">
                                    <svg className="svg-icon-color-1" width="40" version="1.1" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
                                        <g>
                                            <g>
                                            <g>
                                                <path d="M405.333,42.667h-44.632c-4.418-12.389-16.147-21.333-30.035-21.333h-32.229C288.417,8.042,272.667,0,256,0
                                                    s-32.417,8.042-42.438,21.333h-32.229c-13.888,0-25.617,8.944-30.035,21.333h-44.631C83.146,42.667,64,61.802,64,85.333v384
                                                    C64,492.865,83.146,512,106.667,512h298.667C428.854,512,448,492.865,448,469.333v-384C448,61.802,428.854,42.667,405.333,42.667
                                                    z M170.667,53.333c0-5.885,4.792-10.667,10.667-10.667h37.917c3.792,0,7.313-2.021,9.208-5.302
                                                    c5.854-10.042,16.146-16.031,27.542-16.031s21.688,5.99,27.542,16.031c1.896,3.281,5.417,5.302,9.208,5.302h37.917
                                                    c5.875,0,10.667,4.781,10.667,10.667V64c0,11.76-9.563,21.333-21.333,21.333H192c-11.771,0-21.333-9.573-21.333-21.333V53.333z
                                                    M426.667,469.333c0,11.76-9.563,21.333-21.333,21.333H106.667c-11.771,0-21.333-9.573-21.333-21.333v-384
                                                    c0-11.76,9.563-21.333,21.333-21.333h42.667c0,23.531,19.146,42.667,42.667,42.667h128c23.521,0,42.667-19.135,42.667-42.667
                                                    h42.667c11.771,0,21.333,9.573,21.333,21.333V469.333z"/>
                                                <path d="M160,170.667c-17.646,0-32,14.354-32,32c0,17.646,14.354,32,32,32s32-14.354,32-32
                                                    C192,185.021,177.646,170.667,160,170.667z M160,213.333c-5.875,0-10.667-4.781-10.667-10.667
                                                    c0-5.885,4.792-10.667,10.667-10.667s10.667,4.781,10.667,10.667C170.667,208.552,165.875,213.333,160,213.333z"/>
                                                <path d="M160,277.333c-17.646,0-32,14.354-32,32c0,17.646,14.354,32,32,32s32-14.354,32-32
                                                    C192,291.688,177.646,277.333,160,277.333z M160,320c-5.875,0-10.667-4.781-10.667-10.667c0-5.885,4.792-10.667,10.667-10.667
                                                    s10.667,4.781,10.667,10.667C170.667,315.219,165.875,320,160,320z"/>
                                                <path d="M160,384c-17.646,0-32,14.354-32,32c0,17.646,14.354,32,32,32s32-14.354,32-32C192,398.354,177.646,384,160,384z
                                                    M160,426.667c-5.875,0-10.667-4.781-10.667-10.667c0-5.885,4.792-10.667,10.667-10.667s10.667,4.781,10.667,10.667
                                                    C170.667,421.885,165.875,426.667,160,426.667z"/>
                                                <path d="M373.333,192h-128c-5.896,0-10.667,4.771-10.667,10.667c0,5.896,4.771,10.667,10.667,10.667h128
                                                    c5.896,0,10.667-4.771,10.667-10.667C384,196.771,379.229,192,373.333,192z"/>
                                                <path d="M373.333,298.667h-128c-5.896,0-10.667,4.771-10.667,10.667c0,5.896,4.771,10.667,10.667,10.667h128
                                                    c5.896,0,10.667-4.771,10.667-10.667C384,303.438,379.229,298.667,373.333,298.667z"/>
                                                <path d="M373.333,405.333h-128c-5.896,0-10.667,4.771-10.667,10.667c0,5.896,4.771,10.667,10.667,10.667h128
                                                    c5.896,0,10.667-4.771,10.667-10.667C384,410.104,379.229,405.333,373.333,405.333z"/>
                                            </g>
                                            </g>
                                        </g>
                                        </svg>
                                    </div>
                                    <h4 className="counter__title counter text-color-2">{datos.cantidad_comentarios}</h4>
                                    <p className="counter__meta">Comentarios</p>
                                </div>
                            </div>
                            <div className="col-lg-4 responsive-column-half">
                                <div className="counter-item">
                                    <div className="counter__icon icon-element mb-3 shadow-sm">
                                        <svg className="svg-icon-color-2" width="40" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
                                            <g>
                                                <g>
                                                <path d="M472.208,201.712c9.271-9.037,12.544-22.3,8.544-34.613c-4.001-12.313-14.445-21.118-27.257-22.979l-112.03-16.279
                                                                    c-2.199-0.319-4.1-1.7-5.084-3.694L286.28,22.632c-5.729-11.61-17.331-18.822-30.278-18.822c-12.947,0-24.549,7.212-30.278,18.822
                                                                    l-50.101,101.516c-0.985,1.993-2.885,3.374-5.085,3.694L58.51,144.12c-12.812,1.861-23.255,10.666-27.257,22.979
                                                                    c-4.002,12.313-0.728,25.576,8.544,34.613l81.065,79.019c1.591,1.552,2.318,3.787,1.942,5.978l-19.137,111.576
                                                                    c-2.188,12.761,2.958,25.414,13.432,33.024c10.474,7.612,24.102,8.595,35.56,2.572l100.201-52.679
                                                                    c1.968-1.035,4.317-1.035,6.286,0l100.202,52.679c4.984,2.62,10.377,3.915,15.744,3.914c6.97,0,13.896-2.184,19.813-6.487
                                                                    c10.474-7.611,15.621-20.265,13.432-33.024l-19.137-111.576c-0.375-2.191,0.351-4.426,1.942-5.978L472.208,201.712z
                                                                    M362.579,291.276l19.137,111.578c0.64,3.734-1.665,5.863-2.686,6.604c-1.022,0.74-3.76,2.277-7.112,0.513l-100.202-52.679
                                                                    c-4.919-2.585-10.315-3.879-15.712-3.879c-5.397,0-10.794,1.294-15.712,3.878l-100.201,52.678
                                                                    c-3.354,1.763-6.091,0.228-7.112-0.513c-1.021-0.741-3.327-2.87-2.686-6.604l19.137-111.576
                                                                    c1.879-10.955-1.75-22.127-9.711-29.886l-81.065-79.019c-2.713-2.646-2.099-5.723-1.708-6.923
                                                                    c0.389-1.201,1.702-4.052,5.451-4.596l112.027-16.279c10.999-1.598,20.504-8.502,25.424-18.471l50.101-101.516
                                                                    c1.677-3.397,4.793-3.764,6.056-3.764c1.261,0,4.377,0.366,6.055,3.764v0.001l50.101,101.516
                                                                    c4.919,9.969,14.423,16.873,25.422,18.471l112.029,16.279c3.749,0.544,5.061,3.395,5.451,4.596
                                                                    c0.39,1.201,1.005,4.279-1.709,6.923l-81.065,79.019C364.329,269.149,360.7,280.321,362.579,291.276z"/>
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                <path d="M413.783,22.625c-6.036-4.384-14.481-3.046-18.865,2.988l-14.337,19.732c-4.384,6.034-3.047,14.481,2.988,18.865
                                                                    c2.399,1.741,5.176,2.58,7.928,2.58c4.177,0,8.295-1.931,10.937-5.567l14.337-19.732
                                                                    C421.155,35.456,419.818,27.009,413.783,22.625z"/>
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                <path d="M131.36,45.265l-14.337-19.732c-4.383-6.032-12.829-7.37-18.865-2.988c-6.034,4.384-7.372,12.831-2.988,18.865
                                                                    l14.337,19.732c2.643,3.639,6.761,5.569,10.939,5.569c2.753,0,5.531-0.839,7.927-2.581C134.407,59.747,135.745,51.3,131.36,45.265
                                                                    z"/>
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                <path d="M49.552,306.829c-2.305-7.093-9.924-10.976-17.019-8.671l-23.197,7.538c-7.095,2.305-10.976,9.926-8.671,17.019
                                                                    c1.854,5.709,7.149,9.337,12.842,9.337c1.383,0,2.79-0.215,4.177-0.666l23.197-7.538
                                                                    C47.975,321.543,51.857,313.924,49.552,306.829z"/>
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                <path d="M256.005,456.786c-7.459,0-13.506,6.047-13.506,13.506v24.392c0,7.459,6.047,13.506,13.506,13.506
                                                                    c7.459,0,13.506-6.047,13.506-13.506v-24.392C269.511,462.832,263.465,456.786,256.005,456.786z"/>
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                <path d="M502.664,305.715l-23.197-7.538c-7.092-2.303-14.714,1.577-17.019,8.672c-2.305,7.095,1.576,14.714,8.671,17.019
                                                                    l23.197,7.538c1.387,0.45,2.793,0.664,4.176,0.664c5.694,0,10.989-3.629,12.843-9.337
                                                                    C513.64,315.639,509.758,308.02,502.664,305.715z"/>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <h4 className="counter__title counter text-color-3">{datos.cantidad_reviews}</h4>
                                    <p className="counter__meta">Reseñas</p>
                                </div>
                            </div>
                            <div className="col-lg-4 responsive-column-half">
                                <div className="counter-item">
                                    <div className="counter__icon icon-element mb-3 shadow-sm">
                                        <svg className="svg-icon-color-3" width="40" viewBox="0 0 512.007 512.007" xmlns="http://www.w3.org/2000/svg"><g><path d="m228.761 34.225c.954 10.168 9.57 17.926 19.76 17.925.215 0 .432-.003.648-.01 24.572-.794 48.561 3.356 71.307 12.335 22.811 9.005 43.223 22.416 60.666 39.86 10.435 10.442 19.452 21.964 26.904 34.36l-11.222 1.255c-8.869.992-16.3 6.466-19.877 14.644-3.579 8.181-2.554 17.357 2.743 24.55l7.409 10.051c2.459 3.334 7.155 4.045 10.487 1.586 3.334-2.458 4.045-7.153 1.587-10.487l-7.407-10.047c-2.998-4.071-1.752-8.098-1.077-9.641.675-1.542 2.784-5.187 7.802-5.748l22.439-2.51c2.454-.274 4.616-1.74 5.78-3.918 1.165-2.179 1.182-4.791.046-6.984-9.045-17.466-20.821-33.519-35.006-47.715-18.907-18.907-41.035-33.444-65.768-43.208-24.662-9.735-50.648-14.239-77.299-13.375-2.583.086-4.755-1.818-4.99-4.333l-1.181-12.423c-.125-1.331.292-2.618 1.175-3.624.506-.576 1.619-1.553 3.393-1.619 29.825-1.094 58.949 3.851 86.583 14.696 27.706 10.873 52.492 27.124 73.669 48.302 19.071 19.071 34.16 41.072 44.848 65.394 1.319 3.003 4.445 4.803 7.698 4.437l26.247-2.931c5.013-.57 7.877 2.523 8.876 3.877.998 1.354 3.101 5.004 1.073 9.635l-35.321 80.782c-2.022 4.629-6.128 5.564-7.8 5.751-1.672.185-5.882.183-8.88-3.888l-27.2-36.9c-2.457-3.334-7.151-4.044-10.487-1.587-3.334 2.458-4.045 7.153-1.587 10.487l27.198 36.897c4.727 6.419 11.974 10.057 19.788 10.057.938 0 1.885-.053 2.836-.159 8.872-.993 16.303-6.47 19.877-14.65l35.318-80.777c3.582-8.182 2.557-17.358-2.741-24.547-5.297-7.187-13.758-10.88-22.621-9.884l-20.83 2.326c-11.267-24.038-26.617-45.857-45.685-64.926-22.646-22.646-49.157-40.026-78.796-51.658-29.564-11.604-60.726-16.891-92.613-15.725-5.402.2-10.549 2.648-14.118 6.718-3.579 4.08-5.34 9.518-4.832 14.926z"/><path d="m283.233 477.782c-.975-10.384-9.938-18.243-20.41-17.915-24.551.796-48.557-3.35-71.305-12.331-22.809-9.005-43.221-22.418-60.668-39.866-10.425-10.425-19.443-21.945-26.903-34.353l11.223-1.26c8.872-.992 16.304-6.468 19.88-14.649 3.576-8.179 2.549-17.351-2.746-24.535l-52.308-70.967c-5.293-7.189-13.744-10.888-22.624-9.898-8.872.993-16.303 6.47-19.877 14.65l-35.318 80.778c-3.581 8.179-2.558 17.354 2.737 24.542 5.295 7.19 13.758 10.89 22.628 9.898l20.823-2.333c1.24 2.647 2.545 5.295 3.899 7.915 1.902 3.679 6.427 5.118 10.107 3.217 3.679-1.903 5.119-6.428 3.217-10.107-2.07-4.003-4.012-8.071-5.771-12.091-1.316-3.01-4.439-4.812-7.706-4.447l-26.238 2.94c-5.022.564-7.885-2.531-8.882-3.886-.998-1.355-3.101-5.005-1.073-9.635l35.321-80.782c2.022-4.629 6.128-5.564 7.8-5.751 1.67-.186 5.882-.183 8.88 3.888l52.31 70.97c2.994 4.062 1.75 8.085 1.076 9.626-.674 1.542-2.783 5.189-7.806 5.75l-22.439 2.52c-2.454.275-4.615 1.742-5.779 3.92-1.163 2.179-1.179 4.79-.043 6.983 9.06 17.485 20.837 33.534 35.005 47.703 18.909 18.909 41.037 33.447 65.768 43.211 24.666 9.739 50.665 14.237 77.299 13.372 2.594-.085 4.755 1.818 4.99 4.333l1.181 12.423c.125 1.331-.292 2.618-1.175 3.624-.506.576-1.619 1.553-3.393 1.619-29.825 1.092-58.949-3.851-86.583-14.696-27.706-10.873-52.492-27.124-73.67-48.302-8.858-8.859-16.958-18.47-24.072-28.567-2.386-3.385-7.062-4.198-10.451-1.811-3.386 2.386-4.196 7.064-1.811 10.451 7.607 10.797 16.264 21.07 25.728 30.534 22.646 22.646 49.157 40.026 78.796 51.658 26.887 10.552 55.09 15.882 83.965 15.882 2.876 0 5.761-.053 8.649-.159 5.402-.2 10.549-2.648 14.118-6.718 3.579-4.08 5.34-9.518 4.832-14.926z"/><path d="m121.522 242.89c66.964 0 121.443-54.479 121.443-121.443s-54.479-121.444-121.443-121.444-121.443 54.48-121.443 121.444 54.479 121.443 121.443 121.443zm0-227.887c58.693 0 106.443 47.75 106.443 106.443s-47.749 106.444-106.443 106.444-106.443-47.75-106.443-106.443 47.75-106.444 106.443-106.444z"/><path d="m121.522 205.887c46.561 0 84.44-37.88 84.44-84.44s-37.88-84.44-84.44-84.44-84.44 37.88-84.44 84.44 37.88 84.44 84.44 84.44zm0-153.881c38.29 0 69.44 31.151 69.44 69.44s-31.15 69.44-69.44 69.44-69.44-31.151-69.44-69.44 31.15-69.44 69.44-69.44z"/><path d="m91.014 162.952c8.747 4.712 14.772 6.189 22.377 6.595v4.623c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-5.16c15.992-2.874 25.731-14.517 27.336-25.996 1.868-13.364-6.691-24.842-21.806-29.242-9.55-2.78-20.137-6.154-26.251-10.104-2.848-1.839-2.826-4.793-2.56-6.39.559-3.354 3.315-7.475 9.373-8.978 2.46-.61 4.757-.901 6.872-.974.042-.003.084-.003.126-.006 9.263-.279 14.988 3.695 15.374 3.971 3.294 2.452 7.959 1.797 10.448-1.48 2.506-3.298 1.863-8.003-1.435-10.509-.393-.298-6.888-5.115-17.479-6.571v-4.006c0-4.142-3.357-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v4.469c-.829.161-1.666.337-2.519.549-10.802 2.68-18.871 10.95-20.558 21.07-1.439 8.633 2.093 16.854 9.217 21.456 6.236 4.029 14.984 7.479 30.196 11.907 7.895 2.298 11.956 6.95 11.144 12.763-1.239 8.864-11.24 13.698-20.021 13.746-10.128.057-14.142-.315-22.721-4.937-3.648-1.967-8.196-.602-10.16 3.045-1.962 3.646-.599 8.195 3.047 10.159z"/><path d="m503.743 292.048c-.627-3.59-3.744-6.21-7.389-6.21h-186.162c-3.645 0-6.762 2.62-7.389 6.21-10.929 62.62-10.929 126.121 0 188.741.627 3.59 3.744 6.21 7.389 6.21h186.162c3.645 0 6.762-2.62 7.389-6.21 10.929-62.62 10.929-126.121 0-188.741zm-77.897 8.79v71.986l-18.572-11.708c-1.223-.77-2.611-1.155-4-1.155s-2.777.385-4 1.155l-18.572 11.708v-71.986zm64.167 171.161h-173.479c-9.234-56.819-9.234-114.342 0-171.162h49.167v85.581c0 2.731 1.485 5.247 3.877 6.567 2.391 1.318 5.311 1.234 7.623-.222l26.072-16.437 26.072 16.437c1.22.769 2.608 1.155 4 1.155 1.246 0 2.493-.31 3.623-.933 2.392-1.32 3.877-3.835 3.877-6.567v-85.581h49.167c9.235 56.82 9.235 114.343.001 171.162z"/></g></svg>
                                    </div>
                                    <h4 className="counter__title counter text-color-4">{datos.cantidad_cursos}</h4>
                                    <p className="counter__meta">Cursos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray py-5">
                    <div className="container">
                        <ul className="nav nav-tabs generic-tab justify-content-center" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="my-learning-tab" data-toggle="tab" href="#my-learning" role="tab" aria-controls="my-learning" aria-selected="false">
                                    Mi Aprendizaje
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="wishlist-tab" data-toggle="tab" href="#wishlist" role="tab" aria-controls="wishlist" aria-selected="false">
                                    Mis Favoritos
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content pt-40px" id="myTabContent">
                            <div className="tab-pane fade show active" id="my-learning" role="tabpanel" aria-labelledby="my-learning-tab">
                                <div className="my-course-body">
                                    <div className="my-course-cards">
                                        <div className="row">
                                            {Object.keys(cursos).map((key) => (                                
                                                <TarjetaCurso
                                                    key={`tarjeta${cursos[key].id}`}
                                                    idcurso={cursos[key].id}
                                                    url_amigable={cursos[key].url_amigable}
                                                    nombre={cursos[key].nombre}
                                                    imagen={cursos[key].imagen_pequena}
                                                    bestseller={cursos[key].bestseller}
                                                    promocionado={cursos[key].promocionado}
                                                    gratis={cursos[key].gratis}
                                                    alto_valorado={cursos[key].alto_valorado}
                                                    porcentaje_descuento={cursos[key].porcentaje_descuento}
                                                    nivel={cursos[key].nivel}
                                                    instructor={cursos[key].instructor}
                                                    id_instructor={cursos[key].id_instructor}
                                                    reviews_puntuacion={cursos[key].reviews_puntuacion}
                                                    reviews_cantidad={cursos[key].reviews_cantidad}
                                                    precio_actual={cursos[key].precio_actual}
                                                    precio_anterior={cursos[key].precio_anterior}
                                                    favorito={cursos[key].favorito}
                                                    col_lg={4}
                                                />
                                            ))}      
                                        </div>
                                        <Paginador elemetosTotales={totalCursos} elementosPorPagina={6} paginaActual={paginaCursos} callbackCambioPagina={setPaginaCursos} />
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="wishlist" role="tabpanel" aria-labelledby="wishlist-tab">
                                <div className="my-course-body">
                                    <div className="my-course-cards">
                                        <div className="row">
                                            <div className="col-lg-4 responsive-column-half">
                                                <div className="card card-item">
                                                    <div className="card-image">
                                                        <a href="course-details.html" className="d-block">
                                                            <img className="card-img-top lazy" src="images/img-loading.png" data-src="images/img8.jpg" alt="Card image cap" />
                                                        </a>
                                                        <div className="course-badge-labels">
                                                            <div className="course-badge">Bestseller</div>
                                                            <div className="course-badge blue">-39%</div>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <h6 className="ribbon ribbon-blue-bg fs-14 mb-3">All Levels</h6>
                                                        <h5 className="card-title"><a href="course-details.html">The Business Intelligence Analyst Course 2021</a></h5>
                                                        <p className="card-text"><a href="teacher-detail.html">Jose Portilla</a></p>
                                                        <div className="rating-wrap d-flex align-items-center py-2">
                                                            <div className="review-stars">
                                                                <span className="rating-number">4.4</span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star-o"></span>
                                                            </div>
                                                            <span className="rating-total pl-1">(20,230)</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p className="card-price text-black font-weight-bold">12.99 <span className="before-price font-weight-medium">129.99</span></p>
                                                            <div className="icon-element icon-element-sm shadow-sm cursor-pointer" title="Remove from Wishlist"><i className="la la-heart"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 responsive-column-half">
                                                <div className="card card-item">
                                                    <div className="card-image">
                                                        <a href="course-details.html" className="d-block">
                                                            <img className="card-img-top lazy" src="images/img-loading.png" data-src="images/img9.jpg" alt="Card image cap" />
                                                        </a>
                                                        <div className="course-badge-labels">
                                                            <div className="course-badge red">Featured</div>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <h6 className="ribbon ribbon-blue-bg fs-14 mb-3">All Levels</h6>
                                                        <h5 className="card-title"><a href="course-details.html">The Business Intelligence Analyst Course 2021</a></h5>
                                                        <p className="card-text"><a href="teacher-detail.html">Jose Portilla</a></p>
                                                        <div className="rating-wrap d-flex align-items-center py-2">
                                                            <div className="review-stars">
                                                                <span className="rating-number">4.4</span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star-o"></span>
                                                            </div>
                                                            <span className="rating-total pl-1">(20,230)</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p className="card-price text-black font-weight-bold">129.99</p>
                                                            <div className="icon-element icon-element-sm shadow-sm cursor-pointer" title="Remove from Wishlist"><i className="la la-heart"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 responsive-column-half">
                                                <div className="card card-item">
                                                    <div className="card-image">
                                                        <a href="course-details.html" className="d-block">
                                                            <img className="card-img-top lazy" src="images/img-loading.png" data-src="images/img10.jpg" alt="Card image cap" />
                                                        </a>
                                                    </div>
                                                    <div className="card-body">
                                                        <h6 className="ribbon ribbon-blue-bg fs-14 mb-3">All Levels</h6>
                                                        <h5 className="card-title"><a href="course-details.html">The Business Intelligence Analyst Course 2021</a></h5>
                                                        <p className="card-text"><a href="teacher-detail.html">Jose Portilla</a></p>
                                                        <div className="rating-wrap d-flex align-items-center py-2">
                                                            <div className="review-stars">
                                                                <span className="rating-number">4.4</span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star"></span>
                                                                <span className="la la-star-o"></span>
                                                            </div>
                                                            <span className="rating-total pl-1">(20,230)</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p className="card-price text-black font-weight-bold">129.99</p>
                                                            <div className="icon-element icon-element-sm shadow-sm cursor-pointer" title="Remove from Wishlist"><i className="la la-heart"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
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
