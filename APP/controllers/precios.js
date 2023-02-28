// precios
      async function loadPrecios(){

        let newsArticles = document.getElementById('tblPrecios');
        newsArticles.innerHTML = 'Cargando lista de productos...';
        
        const response = await fetch(`${GlobalServerUrl}/api/productos/all?token=${GlobalToken}`);
        const json = await response.json();
                  
        
        newsArticles.innerHTML = '';
                                
        newsArticles.innerHTML =
        `<table class="table table-responsive table-bordered table-fixed" id="tblProductos">
          <thead class=""><tr class="">
            <td class="col-4-sm col-4-md">Descripción</td>
            <td class="col-4-sm col-4-md">Medida</td> 
            <td class="col-4-sm col-4-md">Precio</td></tr>
        </thead>` + 

        json.recordset.map((article)=>{
          if (article.EMPNIT==GlobalEmpnit){
            if (article.EXISTENCIA<=0){
              return `<tr class="">
                <td class="col-4-sm col-4-md">${article.DESPROD}</td>
                <td class="col-4-sm col-3-md">${article.CODMEDIDA}</td> 
                <td class="col-4-sm col-4-md"><b>${String(article.QPRECIO)}</b></td>
                
                </tr>`;
          }else{
            return `<tr class="bg-orange">
            <td class="col-4-sm col-4-md">${article.DESPROD}</td>
            <td class="col-4-sm col-3-md">${article.CODMEDIDA}</td> 
            <td class="col-4-sm col-4-md"><b>${String(article.QPRECIO)}</b></td>
            
            </tr>`;
          }
          };

        }).join('\n');

        //vacia la tabla para mejorar la velocidad de búsqueda
        funciones.OcultarRows('tblProductos');

        //asigna el listener al botón de búsqueda
        document.getElementById('btnPreciosFiltrar').addEventListener('click',()=>{
          funciones.FiltrarListaProductos('tblProductos');
        });

      }
        
  
