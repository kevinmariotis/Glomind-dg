
  
  /*ok*/
  export const fijarHeader = () =>  {
                
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
            // header fixed animation and control
            let headerMenuContent = document.querySelector('.header-menu-content');
            let body = document.body;
            if (scrollTop > 200) {
              headerMenuContent.classList.add('fixed-top');
              body.style.marginTop = headerMenuContent.offsetHeight + 'px';
            } else {
              headerMenuContent.classList.remove('fixed-top');
              body.style.marginTop = '0';
            }
        });
  }
  
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
      /*=========== Mobile search form close ============*/
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






  
