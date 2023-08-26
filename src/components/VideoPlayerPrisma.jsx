
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player'
import { mensajesDeError, convertirSegundosAHorasMinutosSegundos } from './utils';

function VideoPlayerPrisma({url_video='', url_imagen_preview='', mostrar_controles=true, posision_actual=0, estado_consumo=0, funcion_reportar_posicion_actual=false, funcion_reportar_visto_completo=false}) {
           
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);    
    const [duration, setDuration] = useState(0);
    const [played, setPlayed] = useState(0);
    const [playedMaximo, setPlayedMaximo] = useState(0);            //Lo maximo que el usario está permitido adelantar en este video.
    const [showPlayButton, setShowPlayButton] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(false);
    const [showAnimationAdelantar, setShowAnimationAdelantar] = useState(false);
    const [showAnimationAtrasar, setShowAnimationAtrasar] = useState(false);    
    const [posicionActualEstablecida, setPosicionActualEstablecida] = useState(false);            
    const [preguntarContinuar, setPreguntarContinuar] = useState(false);
    const [iniciarDesdeUltimaPosicion, setIniciarDesdeUltimaPosicion] = useState(false);
    const [volume, setVolume] = useState(1);    
    const [soloVolumen, setSoloVolumen] = useState(false);   

    useEffect(() => {  

        setPlayedMaximo(0);  
        setIniciarDesdeUltimaPosicion(false);
        setPosicionActualEstablecida(false);
        setPlayed(0);
        setDuration(0);
        playerRef.current.seekTo(0);
        
        if(!mostrar_controles){
            setSoloVolumen(true);
        }

        if(posision_actual!=0){            //&& playedMaximo==0
            setPlayedMaximo(posision_actual);
            console.log("played maximo", posision_actual);
            if(estado_consumo==0){
                setPreguntarContinuar(true);
            }else{
                setPosicionActualEstablecida(true);     //se evita que se coloque la posicion actual, al haberlo terminado todo puede empezar desde el comienzo y seleccionar el segmento deseado.
            }
        }
    }, [url_video]);

    useEffect(() => {
        handleOnStart();        
    }, [iniciarDesdeUltimaPosicion]);     

    useEffect(() => {   
        if(playedMaximo!=0) {            
            if(playedMaximo % 10 === 0){
                if(funcion_reportar_posicion_actual!==false && playedMaximo>posision_actual){
                    funcion_reportar_posicion_actual(playedMaximo);                    
                }
            }
        }
    }, [playedMaximo]);

    useEffect(() => {                 
        const areaButtons = document.querySelectorAll('.area-button, .video-info');
        if (areaButtons && controlsVisible) {  
            areaButtons.forEach(areaButton => {
                areaButton.addEventListener('mousemove', handleShowPlayButton);
                areaButton.addEventListener('mouseleave', handleHidePlayButton);
            });     
        }                    
        return () => {
            if (areaButtons) {
                areaButtons.forEach(areaButton => {
                    areaButton.removeEventListener('mousemove', handleShowPlayButton );
                    areaButton.removeEventListener('mouseleave', handleHidePlayButton);
                });  
            }
        };
    }, [controlsVisible]);
        

    const handleShowPlayButton = () => {                        
        setShowPlayButton(true);        
    };

    const handleHidePlayButton = () => {                        
        setShowPlayButton(false);        
    };

    const handleOnStart = () => {         
        if(posision_actual!=0 && isPlaying===true && posicionActualEstablecida===false && iniciarDesdeUltimaPosicion){            
            playerRef.current.seekTo(posision_actual);                                    
            setPosicionActualEstablecida(true);
        }    
    };

    const handlePlayPause = () => {        
        setIsPlaying(!isPlaying);           
        setControlsVisible(true);        
    };
        
    const handleSeekBackward = () => {
        if(!soloVolumen){
            const currentTime = playerRef.current.getCurrentTime();        
            playerRef.current.seekTo(currentTime - 10);
            
            setShowAnimationAtrasar(true);
            setTimeout(() => setShowAnimationAtrasar(false), 1000);
        }
    };

    const handleSeekForward = () => {        
        const currentTime = playerRef.current.getCurrentTime();
        if(currentTime + 10 <= playedMaximo && !soloVolumen){            
            playerRef.current.seekTo(currentTime + 10);        
            setShowAnimationAdelantar(true);
            setTimeout(() => setShowAnimationAdelantar(false), 1000);
        }
    };

    const handleFullscreen = () => {
        const playerWrapper = playerRef.current.wrapper;
        if (playerWrapper.requestFullscreen) {
            playerWrapper.requestFullscreen();
        } else if (playerWrapper.mozRequestFullScreen) { // Firefox
            playerWrapper.mozRequestFullScreen();
        } else if (playerWrapper.webkitRequestFullscreen) { // Chrome, Safari and Opera
            playerWrapper.webkitRequestFullscreen();
        } else if (playerWrapper.msRequestFullscreen) { // IE/Edge
            playerWrapper.msRequestFullscreen();
        }
    };

    const handleProgress = (progress) => {
        setPlayed(progress.played);
        if(parseInt(progress.playedSeconds)>playedMaximo){
            setPlayedMaximo(parseInt(progress.playedSeconds));
        }
    };
    
    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handleCerrarPreguntar = () => {
        setPreguntarContinuar(false);
    };

    const handleContinuarUltimaPosicion = () => {
        setIniciarDesdeUltimaPosicion(true);
        setPreguntarContinuar(false);    
    };

    const handleOnEnded = () => {
        setShowPlayButton(true); 
        setIsPlaying(false);
        if(funcion_reportar_visto_completo!=false){
            funcion_reportar_visto_completo();
        }
    };
        
    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };
    
    return (
        <>
            <ReactPlayer   
                ref={playerRef}                                     
                className='react-player'
                url={url_video}
                width='100%'
                height='100%' 
                volume={volume}           
                light={<img src={url_imagen_preview} style={{width:'100%'}} alt='Minuatura' />}
                controls={false}
                playing={isPlaying}
                onStart={handleOnStart}
                onClick={handlePlayPause}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onEnded={handleOnEnded}
                onPlay={() => setShowPlayButton(false)}
                onPause={() => { setShowPlayButton(true); setIsPlaying(false); } }                
            />
            {controlsVisible && (
                <>
                    <div className="area-button play-pause-area" onClick={handlePlayPause}>
                        <div className="transparent-button" style={{display:`${showPlayButton && !soloVolumen ? '' : 'none'}`}}>
                            <i className={`${isPlaying ? 'la la-pause' : 'la la-play' }`}></i>
                        </div>
                    </div>
                    <div className="area-button seek-backward-area" onDoubleClick={handleSeekBackward}>
                        <div className="transparent-button" style={{display:`${showPlayButton && !soloVolumen ? '' : 'none'}`}} onClick={handleSeekBackward}>
                            <i className="la la-backward"></i>
                        </div>
                        {showAnimationAtrasar && (
                            <div className="animation-overlay" style={{marginTop:'-60px'}}>- 10 seg</div>
                        )} 
                    </div>
                    <div className="area-button seek-forward-area" onDoubleClick={handleSeekForward}>
                        <div className="transparent-button" style={{display:`${showPlayButton && !soloVolumen ? '' : 'none'}`}} onClick={handleSeekForward}>
                            <i className="la la-forward"></i>
                        </div>
                        {showAnimationAdelantar && (
                            <div className="animation-overlay" style={{marginTop:'-60px'}}>+ 10 seg</div>
                        )} 
                    </div>
                    <div className="area-button fullscreen-area" onClick={handleFullscreen}>
                        <div className="transparent-button" style={{display:`${showPlayButton && !soloVolumen ? '' : 'none'}`, fontSize:'24px'}}>
                            <i className="la la-arrows"></i>
                        </div>
                    </div>  
                    <div className="video-info" >
                        <i style={{fontSize:'24px', display:`${showPlayButton ? '' : 'none'}`}} className="la la-volume-up"></i>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            className="volume-slider transparent-button"
                            onChange={handleVolumeChange}
                            style={{display:`${showPlayButton ? '' : 'none'}`}}
                        />&nbsp;&nbsp;
                        <span style={{display:`${showPlayButton && !soloVolumen ? '' : 'none'}`}}>{`${
                            convertirSegundosAHorasMinutosSegundos(Math.floor(played * duration), true)
                        } / ${
                            convertirSegundosAHorasMinutosSegundos(Math.floor(duration), true)
                        }`}</span>
                    </div>                    
                </> 
            )}
            {preguntarContinuar && <div className="modal fade modal-container show" style={{ background: 'rgba(0, 0, 0, 0.7)' }} id="decargableModal" tabIndex="-1" role="dialog" aria-labelledby="decargableModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header border-bottom-gray">
                            <div className="pr-2">                            
                                <h5 className="modal-title fs-19 font-weight-semi-bold lh-24" id="decargableModalTitle">Continuar?</h5>
                            </div>                            
                        </div>
                        <div className="modal-body">                    
                            Desea continuar el video desde la última posición vista?
                        </div>
                        <div className="modal-footer border-top-gray">                        
                            <button type="button" className="btn theme-btn mb-2" onClick={handleContinuarUltimaPosicion}>Claro que si</button>                             
                            <button type="button" className="btn theme-btn theme-btn-white mb-2" onClick={handleCerrarPreguntar}> Desde el comienzo </button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
  );
}

export default VideoPlayerPrisma;