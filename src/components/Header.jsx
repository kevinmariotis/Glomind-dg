import React from 'react';
import HeaderTop from './HeaderTop';
import HeaderMenuContent from './HeaderMenuContent';

function Header() {
  return (
    <header className="header-menu-area bg-white">        
        <HeaderTop/>
        <HeaderMenuContent/>
    </header>);
}

export default Header;