import {React, useState, useEffect} from 'react';
import Header from './Header';
import BreadCrumbArea from './BreadCrumbArea';
import FormularioTagNavegacion from './FormularioTagNavegacion';
import FooterArea from './FooterArea';

function PaginaTagNavegacion() {

    const [breadCrumb, setBreadCrumb] = useState('Explorar');
    const [breadCrumbImagen, setBreadCrumbImagen] = useState('');
    const [breadCrumbData, setBreadCrumbData] = useState({});

    const actualizarBreadCrumb = (nuevoBreadCrumb) => {
        setBreadCrumb(nuevoBreadCrumb);
    };
    const actualizarBreadCrumbData = (nuevoBreadCrumbData) => {
        setBreadCrumbData(nuevoBreadCrumbData);
    };

    const actualizarBreadCrumbImagen = (imagen) => {
        setBreadCrumbImagen(imagen);
    };

    useEffect(() => {   
          window.scrollTo(0, 0);    
    }, []);
  
    return (
          <>              
              <Header/>
              <BreadCrumbArea nombreseccion={breadCrumb} breadCrumbData={breadCrumbData} imagen={breadCrumbImagen}/>
              <FormularioTagNavegacion actualizarBreadCrumb={actualizarBreadCrumb} actualizarBreadCrumbData={actualizarBreadCrumbData} actualizarBreadCrumbImagen={actualizarBreadCrumbImagen} />
              <FooterArea />
          </>    
    );
}

export default PaginaTagNavegacion;