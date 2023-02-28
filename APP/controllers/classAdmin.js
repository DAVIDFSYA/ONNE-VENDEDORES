classAdmin={
    rptVentasDiarias: async(idContainer,anio,mes)=>{
                  
        const response = await fetch(`${GlobalServerUrl}/api/admin/ventasdiarias?token=${GlobalToken}&anio=${anio}&mes=${mes}`);
        
        const json = await response.json();
                    
        let tabla = '';
       //newsArticles.innerHTML = 'Cargando lista de clientes...';
        tabla =
                        `<div class="table-responsive">
                        <table class="table table-bordered table-striped" id="tblRptVentasDiarias">
                            <thead>
                              <tr>
                                <th class="">Dia</th> 
                                <th class="">Venta</th>
                                <th class="">Costo</th>
                                <th class="">Utilidad</th>
                                <th class=""></th>
                              </tr>
                            </thead>
                            <tbody>` + 
        json.recordset.map((ventas)=>{
              
              return `<tr>
                        <td class="">${ventas.DIA}</td>
                        <td class="">${ventas.TOTALVENTA}</td>
                        <td class="">${ventas.TOTALCOSTO}</td>
                        <td class="">${ventas.UTILIDAD}</td>
                        <td class=""></td>                        
                      </tr>`;
                    }
                  
        ).join('\n');
      
        
        let tblfooter ='</tbody></table></div>'
        
        document.getElementById(idContainer).innerHTML = tabla + tblfooter
        
    },
    rptCuadresDiarios: async(idContainer)=>{

    },
    rptInventarioCosteado: async(idContainer)=>{

    },
    getQuery: async()=>{
      let qry = document.getElementById('txtQry').value;
      let container = document.getElementById('result');
      var data =JSON.stringify({
          qry:qry
      });
    ////////////////////////////////////////////////////////

      var peticion = new Request('/api/hacker', {
          method: 'POST',
          headers: new Headers({
             'Content-Type': 'application/json'
          }),
          body: data
        });
  
        await fetch(peticion)
        
        .then(async function(res) {
          
          if (res.status==200)
          {
              const json = await res.json();
              let str = '' +
              json.recordset.map((data)=>{
                return data.toString();
              }).join('\n');

              container.innerHTML = str;
          }
        })
        .catch(
            ()=>{
              funciones.AvisoError('No se pudo CARGAR');
            }
        )
    }
    
}
