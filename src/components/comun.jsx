
  
  /*ok*/
  export const fijarHeader = () =>  {
                
        // window.addEventListener('scroll', function() {
        //     let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
        //     // header fixed animation and control
        //     let headerMenuContent = document.querySelector('.header-menu-content');
        //     let body = document.body;
        //     if (scrollTop > 200) {
        //       headerMenuContent.classList.add('fixed-top');
        //       body.style.marginTop = headerMenuContent.offsetHeight + 'px';
        //     } else {
        //       headerMenuContent.classList.remove('fixed-top');
        //       body.style.marginTop = '0';
        //     }
        // });
  }
  
  /*
    Clic en la lupa de busqueda superior cuando se está en movil
  */
  export const clicBuscarMovil = () =>  {
      let searchFormToggle = document.querySelector('.search-menu-toggle');
      let mobileSearchForm = document.querySelector('.mobile-search-form');
      let bodyOverlay = document.querySelector('.body-overlay');
      
      if(searchFormToggle!=null){
          searchFormToggle.addEventListener('click', function() {
              if(mobileSearchForm!=null){             
                  mobileSearchForm.classList.add('active');
              }
              if(bodyOverlay!=null){
                  bodyOverlay.classList.add('active');
              }
              document.body.style.overflow = 'hidden';
          });
      }
      
      let searchFormClose = document.querySelectorAll('.search-bar-close, .body-overlay');
      if(searchFormClose!=null){
          searchFormClose.forEach(function(element) {
              element.addEventListener('click', function() {
                  if(mobileSearchForm!=null){
                    mobileSearchForm.classList.remove('active');
                  }
                  if(bodyOverlay!=null){
                      bodyOverlay.classList.remove('active');
                  }    
                  document.body.style.overflow = 'inherit';
              });
          });
      }
  }   

  /*
      Abre o cierra la barra de navegacion del curso cuando se esta en play
  */
  export const sideBarAbrirCerrar = () =>  {
      let courseItemLinks = document.querySelectorAll('.curriculum-sidebar-list > .course-item-link');

      courseItemLinks.forEach(function(link) {
          link.addEventListener('click', function() {
              let self = this;
          
              //self.classList.add('active');
          
              let siblings = Array.from(self.parentNode.children).filter(function(element) {
                return element !== self;
              });
          
              siblings.forEach(function(sibling) {
                //sibling.classList.remove('active');
              });
          
              let lectureViewerTextWrap = document.querySelector('.lecture-viewer-text-wrap');
          
              if (self.classList.contains('active-resource')) {
                lectureViewerTextWrap.classList.add('active');
              } else {
                lectureViewerTextWrap.classList.remove('active');
              }
          });
      });
                
      //cerrar side bar
      let sidebarCloseButtons = document.querySelectorAll('.sidebar-close');
      sidebarCloseButtons.forEach(function(button) {
          button.addEventListener('click', function() {
              let elements = document.querySelectorAll('.course-dashboard-sidebar-column, .course-dashboard-column, .sidebar-open');
              elements.forEach(function(element) {
                  element.classList.add('active');
              });
          });
      });

      //abrir side bar
      let sidebarOpenButtons = document.querySelectorAll('.sidebar-open');
      sidebarOpenButtons.forEach(function(button) {
          button.addEventListener('click', function() {
              let elements = document.querySelectorAll('.course-dashboard-sidebar-column, .course-dashboard-column, .sidebar-open');
              elements.forEach(function(element) {
                  element.classList.remove('active');
              });
          });
      });

  }  

  /*
      Abrir y cerrar el menu de categorias del sistema lateral versionmovil
  */

  export const clickMenuCategoriaSistemaMovil = () =>  {
      function openCategoryMenu() {
          var categoryOffCanvasMenu = document.querySelector('.category-off-canvas-menu');
          var bodyOverlay = document.querySelector('.body-overlay');
          document.body.style.overflow = 'hidden';
          categoryOffCanvasMenu.classList.add('active');
          bodyOverlay.classList.add('active');
      }
      
      var catMenuToggle = document.querySelector('.cat-menu-toggle');
      catMenuToggle.addEventListener('click', openCategoryMenu);

      var catMenuClose = document.querySelectorAll('.cat-menu-close, .body-overlay');
      catMenuClose.forEach(function (element) {
          element.addEventListener('click', closeCategoryMenuMovil);
      });
  }

  export const closeCategoryMenuMovil = () =>  {  
      var categoryOffCanvasMenu = document.querySelector('.category-off-canvas-menu');
      var bodyOverlay = document.querySelector('.body-overlay');
      document.body.style.overflow = 'inherit';
      categoryOffCanvasMenu.classList.remove('active');
      bodyOverlay.classList.remove('active');
  }

  /*
      Abre y cierra el menu lateral movil donde se muestran los tags de buscador.
  */
  export const cliclMenuTagsMovil = () =>  {  
      function openMainMenu() {
          var mainOffCanvasMenu = document.querySelector('.main-off-canvas-menu');
          var bodyOverlay = document.querySelector('.body-overlay');
          document.body.style.overflow = 'hidden';
          mainOffCanvasMenu.classList.add('active');
          bodyOverlay.classList.add('active');
      }
      
      var mainMenuToggle = document.querySelector('.main-menu-toggle');
      mainMenuToggle.addEventListener('click', openMainMenu);

      var mainMenuClose = document.querySelectorAll('.main-menu-close, .body-overlay');
      mainMenuClose.forEach(function (element) {
          element.addEventListener('click', closeTagsMenuMovil);
      });
  }
  export const closeTagsMenuMovil = () =>  {
      var mainOffCanvasMenu = document.querySelector('.main-off-canvas-menu');
      var bodyOverlay = document.querySelector('.body-overlay');
      document.body.style.overflow = 'inherit';
      mainOffCanvasMenu.classList.remove('active');
      bodyOverlay.classList.remove('active');
  }


  /*Abre los submenus de los menues moviles, tales como cateogoras sistemas y tags */
  export const setupSubMenu = () =>  {  
   
      // Seleccionar todos los elementos .sub-nav-toggler
      let dropMenuTogglers = document.querySelectorAll('.sub-nav-toggler');

      // Agregar evento click a los elementos .sub-nav-toggler
      dropMenuTogglers.forEach(function(toggler) {
          toggler.addEventListener('click', function(event) {
              event.preventDefault();

              let self = this;
              self.classList.toggle('active');

              let parentParent = self.parentElement.parentElement;
              let siblings = Array.from(parentParent.children);              
              siblings.forEach(function(sibling) {                                      
                  if (sibling !== self.parentElement) {                      
                      let siblingLink = sibling.querySelector('a');
                      let siblingUl = sibling.querySelector('ul');

                      if (siblingLink) {
                          let siblingToggler = siblingLink.querySelector('.sub-nav-toggler');
                          if (siblingToggler) {
                              siblingToggler.classList.remove('active');
                          }                          
                      }
                      if (siblingUl) {
                          let siblingSubMenu = siblingUl.querySelector('.sub-menu');
                          if (siblingSubMenu) {
                              siblingSubMenu.style.display = 'none';
                          }
                      }  
                  }
              });

              let parentSubMenu = self.parentElement.parentElement.querySelector('.sub-menu');
              if (parentSubMenu) {                  
                  parentSubMenu.style.display = (parentSubMenu.style.display === 'none' || parentSubMenu.style.display === '') ? 'block' : 'none';
              }
          });
      });
}

export const clickAbrirBarraSuperiorInformativa = () =>  {    
    let downButton = document.querySelector('.down-button');
    if (!downButton.dataset.clicked) {
        downButton.dataset.clicked = true;        
        downButton.addEventListener('click', function() {            
            this.classList.toggle('active');                    
            let headerTop = document.querySelector('.header-top');
            if (headerTop) {                
                headerTop.style.display = (headerTop.style.display === 'none' || headerTop.style.display === '') ? 'block' : 'none';
            }
        }); 
    }
}
  
