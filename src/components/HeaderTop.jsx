import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import ThemePicker from './ThemePicker';
function HeaderTop() {

    const {authenticated, permissions} = useContext(AuthContext);


    return (
    <div className="header-top pr-150px pl-150px border-bottom border-bottom-gray py-1">
        <div className="container-fluid">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <div className="header-widget">
                        <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14">
                            <li className="d-flex align-items-center pr-3 mr-3 border-right border-right-gray"><i className="la la-phone mr-1"></i><a href="tel:018000181027"> 01 8000 181 027</a></li>
                            <li className="d-flex align-items-center"><i className="la la-envelope-o mr-1"></i><a href="mailto:comunicacionesbq@coruniamericana.edu.co"> comunicacionesbq@coruniamericana.edu.co</a></li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="header-widget d-flex flex-wrap align-items-center justify-content-end">
                        <div className="theme-picker d-flex align-items-center">
                            <ThemePicker tipo="dark-mode-btn" titulo="Dark Mode">
                                <svg id="moon" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            </ThemePicker>
                            <ThemePicker tipo="light-mode-btn" titulo="Light Mode">                            
                                <svg id="sun" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>                            
                            </ThemePicker>
                        </div>
                        <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14 border-left border-left-gray pl-3 ml-3">
                            {!authenticated && <li className="d-flex align-items-center pr-3 mr-3 border-right border-right-gray"><i className="la la-sign-in mr-1"></i><Link to="/login">Iniciar sesión</Link></li>}
                            {!authenticated && <li className="d-flex align-items-center"><i className="la la-user mr-1"></i><Link to="/signup">Registarme</Link></li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default HeaderTop;