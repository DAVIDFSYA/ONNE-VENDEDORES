
classDbOp={
    UpdatePedidoEnviado: async (correlativo)=>{
        
        var data = {
            st: 0
        }
        
        DbConnection = new JsStore.Instance(DbName);

        DbConnection.update({
            In: "documentos",
            Set: data,
            Where: {
                correlativo : Number(correlativo)
            }
        }, function (rowsAffected) {
            //alert(rowsAffected + " rows Updated");
            if (rowsAffected > 0) {
                console.log('Pedido marcado como enviado');
            }
        }, function (error) {
                console.log(error.Message)
        })
    },

    SelectPickingVentas: async (contenedor)=>{

        let cont = document.getElementById(contenedor);
        DbConnection = new JsStore.Instance(DbName);
        DbConnection.select({
            From: 'docproductos',
            groupBy: ['desprod','codmedida'],
            aggregate:{
                sum: ['cantidad','subtotal']
            }
            
        // You can specify multiple columns at a time by giving the columns name in an array.
        // GroupBy:['column1','column2']
        }, function (prod) {

            let tblhead = `<table class="table table-responsive">
            <thead><tr>
                <th>Producto</th>
                <th></th>
                <th>Cantidad</th>
                <th>Importe</th>
            </tr></thead><tbody>`
            
            let tblfoot = `</tbody></table>`; 
            
            let strrow = ''; 

            
            prod.forEach(function (doc) {
                
                strrow += `<tr>
                    <td>${doc.desprod}</td>
                    <td>${doc.codmedida}</td>
                    <td>${doc.cantidad}</td>
                    <td>${doc.subtotal}</td>
                <tr>`
                    
            }, function (error) {
                console.log(error);
               
            })

            cont.innerHTML = tblhead + strrow + tblfoot;
            
        });
 
    },

    GetTotalVentas3: async(ContainerName)=>{
        let contenedorT = document.getElementById(ContainerName);
        DbConnection = new JsStore.Instance(DbName);

        DbConnection.select({
            From: "documentos"
            
        }, function (docs) {
            
            let varSubtotal = parseFloat(0);
            let varSubtotalCosto = parseFloat(0);
            
            docs.forEach(function (doc) {
                if (doc.coddoc==GlobalCoddoc){
                    varSubtotal += parseFloat(doc.totalventa);
                    varSubtotalCosto += parseFloat(doc.totalcosto);
                }
               
            }, function (error) {
                console.log(error);
                varSubtotal = 0;
            })
            contenedorT.innerHTML = funciones.setMoneda(varSubtotal,'Q');
            //GlobalTotalVenta = varSubtotal;
            //GlobalTotalCosto = varSubtotalCosto;

        });
    },
    GetTotalVentas: async(ContainerName)=>{
        let contenedorT = document.getElementById(ContainerName);
        DbConnection = new JsStore.Instance(DbName);

        DbConnection.select({
            From: "documentos"
            
        }, function (docs) {
            
            let varSubtotal = parseFloat(0);
            let varSubtotalCosto = parseFloat(0);
            
            docs.forEach(function (doc) {
                if (doc.coddoc==GlobalCoddoc){
                    varSubtotal += parseFloat(doc.totalventa);
                    varSubtotalCosto += parseFloat(doc.totalcosto);
                }
            }, function (error) {
                console.log(error);
                varSubtotal = 0;
            })
            contenedorT.innerHTML = funciones.setMoneda(varSubtotal,'Q');
            //GlobalTotalVenta = varSubtotal;
            //GlobalTotalCosto = varSubtotalCosto;

        });
    },
    GetRecorrido: async()=>{
        let mapainiciado = false;
       DbConnection = new JsStore.Instance(DbName);

        var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
        let map;
        map = L.map('map-container')

        DbConnection.select({
            From: "documentos"
            
        }, function (docs) {
            docs.forEach(function (doc) {
                console.log(doc);

                 if (doc.coddoc==GlobalCoddoc){

                    if(mapainiciado==false){
                        map.setView([doc.lat, doc.long], 15).addLayer(osm);  
                        mapainiciado = true;
                    }

                    L.marker([doc.lat, doc.long])
                        .addTo(map)
                        .bindPopup(doc.nomcliente + ' - ' + funciones.setMoneda(doc.totalventa, 'Q')) 

                    //.openPopup();
                }
               
            }, function (error) {
                console.log(error);
                //varSubtotal = 0;
            })
        })

                               
    }
}