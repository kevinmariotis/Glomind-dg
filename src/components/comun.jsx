
  
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
      var searchFormToggle = document.querySelector('.search-menu-toggle');
      var mobileSearchForm = document.querySelector('.mobile-search-form');
      var bodyOverlay = document.querySelector('.body-overlay');
      
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
      var searchFormClose = document.querySelectorAll('.search-bar-close, .body-overlay');
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

  
