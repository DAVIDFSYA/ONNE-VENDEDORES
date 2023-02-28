classEnvios={
    CargarDatosRepartidor: async function(){
        document.getElementById('txtNomRepartidor').innerText = GlobalUser
        
        document.getElementById('btnEnviosPendientesOp').addEventListener('click', ()=>{
            classEnvios.CargarEnviosPendientes('tblEnviosPendientes');
        })
        document.getElementById('btnEnviosEntregados').addEventListener('click', ()=>{
            classEnvios.CargarEnviosRealizados('tblEnviosPendientes');
        })
    },

    CargarEnviosPendientes: async function(IdContenedor){

            document.getElementById('txtEncabezado').innerText = 'Envios Pendientes';
            let newsArticles = document.getElementById(IdContenedor);
            newsArticles.innerHTML = 'Cargando lista de Envios...';
            
            const response = await fetch(`${GlobalServerUrl}/api/reparto/enviospendientes?token=${GlobalToken}`);
            const json = await response.json();
           
            newsArticles.innerHTML = '';
                                    
            newsArticles.innerHTML = `` + 
    
            json.recordset.map((article)=>{
              if (article.EMPNIT==GlobalEmpnit){
                if (article.CODREP==GlobalCodrep){
                  return `<tr class="">
                    <td class="col-4-sm col-4-md">${article.NOMCLIENTE}</td>
                    <td class="col-4-sm col-4-md">${article.TELEFONOS}</td> 
                    <td class="col-3-sm col-3-md"><b>${String(article.QPRECIO)}</b></td>
                    <td class="col-1-sm col-1-md">
                        <button class='btn btn-round btn-icon btn-warning btn-sm' 
                            data-toggle='modal' data-target='#ModalOpcionesEnvios' 
                            onClick="classEnvios.CargarDatosEnvio('${article.CODDOC}','${article.CORRELATIVO}','${article.NOMCLIENTE}','${article.DIRCLIENTE}','${article.TELEFONOS}','${article.QPRECIO}');">
                            <i class='now-ui-icons design_bullet-list-67'></i>
                        </button>
                    </td>
                    </tr>`;
                }
              };
    
            }).join('\n');
    },

    CargarDatosEnvio: async function (coddoc,correlativo,nomcliente,dircliente,telcliente,importe,){
        GlobalSelectedCoddoc = coddoc;
        GlobalSelectedCorrelativo = correlativo;
        document.getElementById('txtNomCliente').innerText = nomcliente;
        document.getElementById('txtDirCliente').innerText = dircliente;
        document.getElementById('txtTelCliente').innerText = 'Tels: ' + telcliente;
        document.getElementById('txtImporte').innerText = importe;

        document.getElementById('btnEnviosMarcarEnviado').addEventListener('click',()=>{
            console.log('click en enviar pedido');
            funciones.Confirmacion('¿Está seguro que desea dar por ENTREGADO este Envio?')
                .then((value) => {
                    if (value==true){
                        classEnvios.MarcarEnviado(GlobalToken,GlobalEmpnit,GlobalSelectedCoddoc,GlobalSelectedCorrelativo);
                    }
                })
        });

        document.getElementById('btnEnviosMarcarNoEnviado').addEventListener('click',()=>{
            console.log('click en enviar pedido');
            funciones.Confirmacion('¿Está seguro que desea dar por NO ENTREGADO este Envio?')
                .then((value) => {
                    if (value==true){
                        classEnvios.MarcarNoEnviado(GlobalToken,GlobalEmpnit,GlobalSelectedCoddoc,GlobalSelectedCorrelativo);
                    }
                })

        });
    },

    MarcarEnviado: async function(token,empnit,coddoc,correlativo){
            console.log(token + empnit + coddoc + correlativo);
                var data =JSON.stringify({
                    token:token,
                    empnit:empnit,
                    coddoc:coddoc,
                    correlativo:correlativo
                });
              
                var peticion = new Request(GlobalServerUrl + '/api/reparto/marcarenviado', {
                    method: 'POST',
                    headers: new Headers({
                        // Encabezados
                       'Content-Type': 'application/json'
                    }),
                    body: data
                  });
            
                  await fetch(peticion)
                  
                  .then(function(res) {
                    console.log('Estado: ', res.status);
                    if (res.status==200)
                    {
                        funciones.Aviso('Pedido Marcado exitosamente!!');
                        classEnvios.CargarEnviosPendientes('tblEnviosPendientes');
                        classEnvios.CargarEnviosPendientes('tblEnviosPendientes');
                    }
                  })
                  .catch(
                      ()=>{
                        funciones.AvisoError('No se logró conectar con el servidor');
                      }
                  )
    },

    MarcarNoEnviado: async function(token,empnit,coddoc,correlativo){
        console.log(token + empnit + coddoc + correlativo);         
        var data =JSON.stringify({
            token:token,
            empnit:empnit,
            coddoc:coddoc,
            correlativo:correlativo
        });
      
        var peticion = new Request(GlobalServerUrl + '/api/reparto/marcarnoenviado', {
            method: 'POST',
            headers: new Headers({
                // Encabezados
               'Content-Type': 'application/json'
            }),
            body: data
          });
    
          await fetch(peticion)
          
          .then(function(res) {
            console.log('Estado: ', res.status);
            if (res.status==200)
            {
                funciones.Aviso('Pedido Marcado exitosamente!!');
                classEnvios.CargarEnviosRealizados('tblEnviosPendientes');
                classEnvios.CargarEnviosRealizados('tblEnviosPendientes');
            }
          })
          .catch(
              ()=>{
                funciones.AvisoError('No se logró conectar con el servidor');
              }
          )
},

    CargarEnviosRealizados: async function(IdContenedor){
        document.getElementById('txtEncabezado').innerText = 'Envios Entregados';
        
        let newsArticles = document.getElementById(IdContenedor);
        newsArticles.innerHTML = 'Cargando lista de Envios...';
        
        const response = await fetch(`${GlobalServerUrl}/api/reparto/enviosentregados?token=${GlobalToken}`);
        const json = await response.json();
       
        newsArticles.innerHTML = '';
                                
        newsArticles.innerHTML = `` + 

        json.recordset.map((article)=>{
          if (article.EMPNIT==GlobalEmpnit){
            if (article.CODREP==GlobalCodrep){
              return `<tr class="">
                <td class="col-4-sm col-4-md">${article.NOMCLIENTE}</td>
                <td class="col-4-sm col-4-md">${article.TELEFONOS}</td> 
                <td class="col-3-sm col-3-md"><b>${String(article.QPRECIO)}</b></td>
                <td class="col-1-sm col-1-md">
                    <button class='btn btn-round btn-icon btn-warning btn-sm' 
                        data-toggle='modal' data-target='#ModalOpcionesEnviosEntregados' 
                        onClick="classEnvios.CargarDatosEnvio('${article.CODDOC}','${article.CORRELATIVO}','${article.NOMCLIENTE}','${article.DIRCLIENTE}','${article.TELEFONOS}','${article.QPRECIO}');">
                        <i class='now-ui-icons design_bullet-list-67'></i>
                    </button>
                </td>
                </tr>`;
            }
          };

        }).join('\n');        

    },

}