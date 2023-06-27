import {React} from 'react';
import Header from './Header';
import BreadCrumbArea from './BreadCrumbArea';
import FormularioCheckout from './FormularioCheckout';
import FooterArea from './FooterArea';

function PaginaCheckout() {  

    const breadCrumb = [{'link':'/checkout', 'nombre':'Checkout'}];

    return (        
        <>              
            <Header/>
            <BreadCrumbArea nombreseccion="Checkout" breadCrumbData={breadCrumb}/>
            <FormularioCheckout/>
            <FooterArea />
        </>    );
}

export default PaginaCheckout;