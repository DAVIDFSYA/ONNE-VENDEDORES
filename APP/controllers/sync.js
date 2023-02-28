
async function SyncDocumentos(token,coddoc,correlativo,anio,mes,dia,codcliente,codven,totalventa,totalcosto,obs,st,lat,long){
    var empnit = GlobalEmpnit;
    var fecha = new Date;
    anio = fecha.getFullYear();
    mes = fecha.getMonth()+1; //fecha.getMonth()+1;
    dia = fecha.getDate();

        var data =JSON.stringify({
            token:token,
            empnit:empnit,
            coddoc:coddoc,
            correlativo:correlativo,
            anio:anio,
            mes:mes,
            dia:dia,
            fecha:funciones.getFecha(),
            codven:codven,
            codcliente:codcliente,
            totalventa:totalventa,
            totalcosto:totalcosto,
            obs:obs,
            st:st,
            lat: lat,
            long: long
        });
      
        var peticion = new Request(GlobalServerUrl + '/api/ventas/documentos', {
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
                funciones.Aviso('Pedido enviado exitosamente!!');
               
                classDbOp.UpdatePedidoEnviado(correlativo);
                dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
            }
          })
          .catch(
              ()=>{
                funciones.AvisoError('No se logró conectar con el servidor');
              }
          )
    };


async function SyncDocumentosDet(token,empnit,coddoc,correlativo,anio,mes,dia,codprod,desprod,codmedida,equivale,cantidad,costo,totalcosto,precio,totalprecio){
    var fecha = new Date;
    anio = fecha.getFullYear();
    mes = fecha.getMonth()+1; //fecha.getMonth()+1;
    dia = fecha.getDate();
        console.log('LLamado fetch en docproductos ' + desprod);

            var data =JSON.stringify({
                token:token,
                empnit:empnit,
                coddoc:coddoc,
                correlativo:correlativo,
                anio:anio,
                mes:mes,
                dia:dia,
                codprod:codprod,
                desprod:desprod,
                codmedida:codmedida,
                equivale:equivale,
                cantidad:cantidad,
                costo:costo,
                precio:precio,
                totalcosto:totalcosto,
                totalprecio:totalprecio
            });
          
            var peticion = new Request(GlobalServerUrl + '/api/ventas/docproductos', {
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
                    //funciones.Aviso('Pedido enviado exitosamente!!');
                }
              })
              .catch(
                  ()=>{
                    //funciones.AvisoError('No se logró conectar con el servidor');
                  }
              )
};
      

