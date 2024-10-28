import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import Popup from './Popup';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';

function Calendario({id_curso=-1, funcionCargarContenido=null}) {        
    const { jwt, temaActual } = useContext(AuthContext);
    const urlBase = import.meta.env.VITE_URL_BASE;  
    const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
    
    const [popUp, setPopup] = useState({mostrar:false, tipo:2, titulo:'', contenido:'', data_switch:'', data_id:-1});
    const [events, setEvents] = useState([]); 
    
    const navigate = useNavigate(); 

    useEffect(() => {        
        if(id_curso!=-1){
            obtenerDatosServidor();
        }
    }, [id_curso]);
    
    const handleFuncionAceptarPopUp = () => {                
        switch(popUp.data_switch){
            case 'abrir_curso_contenido':                
                funcionCargarContenido(popUp.data_id, true);                
            break;            
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };
    const handleFuncionCerrarPopUp = () => {        
        switch(popUp.data_switch){
            case 'example':                
            break;
        }
        setPopup({...popUp, mostrar:false, tipo:2, data_switch:'', data_id:-1});
    };

    const obtenerDatosServidor = async () => {            
        const headers = {
            'Authorization':`Bearer ${jwt}`,
        }        
        try {             
            //buscamos los datos de los cursos a mostrar                       
            const opciones = {
                method: 'GET',
                headers: headers,
            };                                    
            const response = await fetch(`${urlBaseApi}/api/curso/getCalendario/${id_curso}`, opciones);            
            if (response.ok){                 
                const datos = await response.json();
                let eventos = [];
                datos.forEach((rango, index) => {
                    let fecha_inicio_formateada = rango.fecha_hora_inicio.replace(" ", "T");
                    let fecha_fin_formateada = rango.fecha_hora_fin.replace(" ", "T");

                    // Crear un objeto Date para fecha_inicio_formateada
                    /*let fechaInicio = new Date(fecha_inicio_formateada);
                    
                    // Crear una nueva fecha para fecha_fin_formateada agregando 30 minutos
                    let fechaFin = new Date(fechaInicio);
                    fechaFin.setMinutes(fechaInicio.getMinutes() + 30);
                    
                    // Convertir la fecha fin en una cadena con el formato esperado (ISO)
                    let fecha_fin_formateada = fechaFin.toISOString();*/

                    var evento = {
                        id_curso_contenido: rango.id,
						title: `${rango.nombre}`,
                        fecha_hora_inicio_esp: rango.fecha_hora_inicio_esp,
                        fecha_hora_fin_esp: rango.fecha_hora_fin_esp,
                        tipo_evento : tiposEventos[rango.tipo_contenido],
						description: '',													
						constraint:{
							start: fecha_inicio_formateada,   //Ya viene con el 'T00:00:00'
							end: fecha_fin_formateada
						},
						start: new Date(fecha_inicio_formateada),
						end: new Date(fecha_fin_formateada),							
						backgroundColor:'#358FF7',
						color:'#FFFFFF',
						textColor:'#FFFFFF',
						allDay: false,						
						editable:false,
						startEditable:false,
                        backgroundColor: coloresEventos[rango.tipo_contenido]
					};
                    eventos.push(evento);
                    //console.log('Elemento:', element);
                    //console.log('Índice:', index);
                });
                console.log("colocando eventos ", eventos);
                setEvents(eventos);
            }                          
        }catch(error){
            // Manejar el caso de error en la solicitud
            console.error('Error en la solicitud al servidor', error);
        }        
    };
      
    const tiposEventos = {
        '2' : 'Examen',
        '5' : 'Tarea',
        '6' : 'Foro'
    }

    const coloresEventos = {
        '2' : '#e074ad',
        '5' : '#73B746',
        '6' : '#ffa042'
    }

    // a custom render function
    function renderEventContent(eventInfo) {
        return (
            <>                
                <i>{eventInfo.event.extendedProps.tipo_evento}: {eventInfo.event.title}</i><br/>
                <i>{eventInfo.event.extendedProps.description}</i>
                <i>{eventInfo.event.extendedProps.fecha_hora_inicio_esp} a {eventInfo.event.extendedProps.fecha_hora_fin_esp}</i>
            </>
        )
    }

    const renderDayHeader = (date) => {
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return dayNames[date.getUTCDay()]; // Devuelve el nombre del día en español
    };

    return (
        <>
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
            <div className="table-responsive mb-5">
                <div>                            
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        locale={esLocale}
                        initialView='dayGridMonth'
                        height="auto"
                        contentHeight={600}
                        weekends={true}
                        events={events}
                        eventContent={renderEventContent}
                        slotDuration='00:15:00'
                        slotLabelInterval={15}
                        nowIndicator={true}
                        timeZone="local"
                        headerToolbar={
                            {
                                left: 'prev,next',  // Agrega los botones de navegación aquí
                                center: 'title',     // Muestra el título del mes y año en el centro
                                right: 'today'       // Agrega el botón "Hoy" para volver al mes actual
                            }                                    
                        }		            					            
                        firstDay={1}						
                        businessHours={{
                                daysOfWeek: [ 1, 2, 3, 4, 5, 6],
                                startTime: '8:00',
                                endTime: '18:00',
                        }}
                        scrollTime='06:00:00'
                        buttonText= {{
                            prev: "Anterior",
                            next: "Siguiente",
                            today: "Hoy",
                            month: "Mes",
                            week: "Semana",
                            day: "Día",
                            list: "Agenda"
                        }}
                        dayHeaderContent={({ date }) => {
                            const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
                            return (
                                <div style={{  color: '#1d0959', textAlign: 'center' }}>
                                    {dayName.charAt(0).toUpperCase() + dayName.slice(1)} {/* Capitaliza la primera letra */}
                                </div>
                            );
                        }}
                        allDayText="Todo el día"
                        //dayHeaderContent={({ date }) => renderDayHeader(date)}                             
                        dayCellContent={arg => {
                            const today = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD
                            const cellDate = arg.date.toISOString().split('T')[0]; // Obtener la fecha de la celda
                            return (
                                <div style={{ 
                                    backgroundColor: today === cellDate ? '#d0e0ff' : 'transparent', // Color de fondo si es el día actual
                                    padding: '5px', 
                                    borderRadius: '5px',
                                    color: today === cellDate ? '#1d0959' : temaActual==1 ? '#1d0959' : 'white'
                                }}>
                                    {arg.dayNumberText}
                                </div>
                            );
                        }}
                        eventClick={(info)=>{
                            setPopup({...popUp, mostrar:true, tipo:3, titulo:'Abrir la actividad?', data_switch:'abrir_curso_contenido', contenido:`${info.event.title}, ${info.event.extendedProps.fecha_hora_inicio_esp} a ${info.event.extendedProps.fecha_hora_fin_esp}`, data_id: info.event.extendedProps.id_curso_contenido});                            
                        }}                           
                    />
                </div>                        
            </div>
        </>
    );
}

export default Calendario;