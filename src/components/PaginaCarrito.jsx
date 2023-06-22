import {React} from 'react';
import Header from './Header';
import BreadCrumbArea from './BreadCrumbArea';
import FormularioCarrito from './FormularioCarrito';
import FooterArea from './FooterArea';

function PaginaCarrito() {  

    const breadCrumb = [{'link':'/carrito', 'nombre':'Carrito de compras'}];

    return (        
        <>              
            <Header/>
            <BreadCrumbArea nombreseccion="Carrito de compras" breadCrumbData={breadCrumb}/>
            <FormularioCarrito/>
            <FooterArea />
        </>    );
}

export default PaginaCarrito;