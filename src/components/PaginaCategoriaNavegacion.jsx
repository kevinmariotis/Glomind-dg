import {React, useState, useEffect} from 'react';
import Header from './Header';
import BreadCrumbArea from './BreadCrumbArea';
import FormularioCategoriaNavegacion from './FormularioCategoriaNavegacion';
import FooterArea from './FooterArea';

function PaginaCategoriaNavegacion() {

  const [breadCrumb, setBreadCrumb] = useState('Inicio');
  const actualizarBreadCrumb = (nuevoBreadCrumb) => {
      setBreadCrumb(nuevoBreadCrumb);
  };

  useEffect(() => {   
      window.scrollTo(0, 0);    
  }, []);
  

  return (
          <>              
              <Header/>
              <BreadCrumbArea nombreseccion="Explorar" breadCrumbData={breadCrumb}/>
              <FormularioCategoriaNavegacion actualizarBreadCrumb={actualizarBreadCrumb}/>
              <FooterArea />
          </>    );
}

export default PaginaCategoriaNavegacion;