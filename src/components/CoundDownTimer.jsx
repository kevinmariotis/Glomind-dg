import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

function CountdownTimer({ segundosRestantesInicio, segundosRestantesFin, functionTimeUp }) {
    const { temaActual } = useContext(AuthContext);

    const [timerState, setTimerState] = useState('Quedan');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [colorFuente, setColorFuente] = useState('#004080');
    const [colorEspera, setColorEspera] = useState('#F286BB');
    const [ejecutadaFuncion, setEjecutadaFuncion] = useState(false);
    const [activarFuncion, setActivarFuncion] = useState(false);

    useEffect(() => {
        setColorFuente(temaActual==0 ? '#99FF00' : '#99FF00');
    }, [temaActual]);

    useEffect(() => {
        let segundosInicio = segundosRestantesInicio;
        let segundosFin = segundosRestantesFin;

        const interval = setInterval(() => {
            segundosInicio--;
            segundosFin--;

            if (segundosInicio > 0) {
                setTimerState('Quedan');                
            } else if (segundosFin > 0) {
                setTimerState('En proceso');
            } else {
                setTimerState('Terminado');                    
                clearInterval(interval);
            }

            const days = Math.max(0, Math.floor(segundosInicio / (24 * 60 * 60)));
            const hours = Math.max(0, Math.floor((segundosInicio % (24 * 60 * 60)) / (60 * 60)));
            const minutes = Math.max(0, Math.floor((segundosInicio % (60 * 60)) / 60));
            const seconds = Math.max(0, segundosInicio % 60);            
            setTimeLeft({ days, hours, minutes, seconds });
            setActivarFuncion(true);
        }, 1000);

        return () => clearInterval(interval);
    }, [segundosRestantesInicio, segundosRestantesFin]);


    useEffect(() => {
        if(activarFuncion && !ejecutadaFuncion){
            if(timeLeft.days==0 && timeLeft.hours==0 && timeLeft.minutes==0 && timeLeft.seconds==0 && timerState=='En proceso'){
                setEjecutadaFuncion(true);
                functionTimeUp();
            }
        }
    }, [timeLeft]);


    return (
        <div>
            {timerState === 'Quedan' && (
                <span style={{color:colorEspera}} >{`Quedan ${timeLeft.days} días, ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s para iniciar.`}</span>
            )}
            {timerState === 'En proceso' && <span style={{ color: colorFuente }}>En vivo, te estamos esperando.</span>}
            {timerState === 'Terminado' && <span>Terminado</span>}
        </div>
    );
}

export default CountdownTimer;