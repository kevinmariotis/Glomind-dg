import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

function ThemePicker({ children, tipo, titulo }) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    const {temaActual, setTemaActual} = useContext(AuthContext);
    
    const handleThemeToggle = () => {
        if(temaActual==1){
            setTemaActual(0);
        }else{
            setTemaActual(1);
        }
    }  

    return (
        <div>
            <button className={`theme-picker-btn ${tipo}`} title={titulo} onClick={handleThemeToggle}>
                {children}
            </button>
        </div>
    );
}

export default ThemePicker;