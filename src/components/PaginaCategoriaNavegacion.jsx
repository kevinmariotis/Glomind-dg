import {React, Suspense} from 'react';
import LoadingAnimation from './LoadingAnimation';
import Header from './Header';
import BreadCrumbArea from './BreadCrumbArea';
import FormularioCategoriaNavegacion from './FormularioCategoriaNavegacion';
import FooterArea from './FooterArea';

function PaginaCategoriaNavegacion() {
  return (
        <>              
            <Header/>
            <BreadCrumbArea nombreseccion="Explorar"/>
            <FormularioCategoriaNavegacion />
            <FooterArea />
        </>    );
}

export default PaginaCategoriaNavegacion;