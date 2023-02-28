// Elementos
let txtTotalVenta;
let txtDesprod;   
let txtCodMedida;

let txtCantidad;
let btnCantidadUp;
let btnCantidadDown;

let txtPrecioProd;
let btnAgregarProducto;
let btnCancelarModalProducto;
let txtBusqueda;
let btnBusqueda;
let txtSubTotal;
let btnMostrarLista;
let btnCancelarVenta;
let btnGuardarVenta;
let btnFinalizarVenta;
let btnFiltrarListaProductos;
let btnAtrasClientePedido;

//modal editar ventas
let btnVentasEditar;
let btnVentasEliminar;
let btnVentasEnviar;

// Variables
let _Codprod;
let _Desprod;
let _CodMedida;
let _Costo;
let _Precio;
let _QPrecio;
let _TotalVenta = parseFloat(0); //total de la venta en curso
let _SubTotal = parseFloat(0); // almacena el subtotal
let _SubTotalCosto = parseFloat(0); // almacena el costo unitario * cantidad
let _equivale = 0; //equivalente de la medida


// ******** VENTANA DE LISTA DE PEDIDOS **********************
// carga los datos del modal en la lista de pedidos sin enviar
async function fcnCargarDatosPedido(id,correlativo,nomcliente,totalventa){
  //console.log(id,nomcliente,totalventa)
  document.getElementById('txtNomClientePedido').innerText =nomcliente;
  document.getElementById('txtTotalPedido').innerText = funciones.setMoneda(totalventa,'Q');
  document.getElementById('txtIdPedido').innerHTML = id;

  document.getElementById('btnVentasEditar').addEventListener('click', ()=>{
     VentasEditar(correlativo,nomcliente);
  });
  
  document.getElementById('btnVentasEliminar').addEventListener('click',()=>{
    VentasEliminar(correlativo);
  });
  document.getElementById('btnVentasEnviar').addEventListener('click', ()=>{
    VentasEnviar(correlativo);
  });

};
function VentasEditar(idPedido,nomcliente){
  console.log('editar presionado ' + idPedido);
  funciones.Confirmacion('¿Está seguro que desea Editar este Pedido?')
    .then((value) => {
       
      if (value==true){
        funciones.loadView('./views/viewVentasEditar.html')
            .then(()=>{
              var contenedor = document.getElementById('tblProductosAgregados');
              
              dbSelectTempVentasEditar(contenedor,idPedido);
              GlobalSelectedCorrelativo= idPedido;              
              
              dbTotalTempVentasEditar(document.getElementById('txtTotalVenta'),idPedido);

              document.getElementById('txtNomCliente').innerHTML = nomcliente;
            })
        //funciones.AvisoError('Esta opción aún no está disponible ;(');
        document.getElementById('btnVentasCancelar').click();
      }
    });
};

function VentasEliminar(correlativo){
  console.log('Eliminar id= ' + correlativo);
  funciones.Confirmacion('¿Está seguro que desea ELIMINAR este Pedido?')
  .then((value) => {
       
    if (value==true){
      console.log('correlativo : ' + correlativo);
      dbDeletePedido(correlativo);
      dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
      document.getElementById('btnVentasCancelar').click();
    }
  });
};

function VentasEnviar(idPedido){
  funciones.Confirmacion('¿Está seguro que desea ENVIAR este Pedido?')
  .then((value) => {
       
   if (value==true){

    document.getElementById('btnVentasEnviar').innerHTML =  '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>'
    dbSendPedido(idPedido);
    
    document.getElementById('btnVentasEnviar').innerHTML ='<span class="fal fa-check mr-1"></span> Enviar'            
    document.getElementById('btnVentasCancelar').click();
      
    }
  });
};

//trae la vista de nueva venta
function CrearNuevoPedido(){
// Nuevo Pedido
  funciones.loadView('./views/viewVentasPedido.html')
  .then(()=>{
      
    AsignarElementos();
    ClearCantidad();
    AgregarListeners();
    dbTotalTempVentas(txtTotalVenta);
    
    dbSelectTempVentas(document.getElementById('tblProductosAgregados'));

  })
  .catch(error => 
      funciones.showNotification('bottom','right','No se pudo cargar la vista')
  );
}

/** ******** VEMTAMA DE PEDIDO ******** */
// asigna los elementos a las variables
async function AsignarElementos(){
  txtTotalVenta = document.getElementById('txtTotalVenta') //total de la venta actual (label)
  txtBusqueda = document.getElementById('search'); //filtro en listado de productos (input)
  btnBusqueda = document.getElementById('btnBuscar'); // boton buscar
  txtCodMedida = document.getElementById('txtCodMedida'); //label
  txtDesProd = document.getElementById('txtDesProducto'); //label
  txtPrecioProd = document.getElementById('txtPrecioProducto'); //label
  btnAgregarProducto = document.getElementById('btnAgregarProducto'); //boton agregar
  
  txtCantidad = document.getElementById('txtCantidad'); //input
  btnCantidadUp = document.getElementById('btnCantidadUp');
  btnCantidadDown = document.getElementById('btnCantidadDown');

  txtSubTotal = document.getElementById('txtSubTotal'); //label
  btnMostrarLista = document.getElementById('btnMostrarLista'); //botón para ver el listado
  btnCancelarVenta = document.getElementById('btnCancelarVenta'); //botón para eliminar el listado de productos en temp
  btnGuardarVenta = document.getElementById('btnGuardarVenta'); //pasa a otra pantalla para seleccionar cliente
  btnFiltrarListaProductos = document.getElementById('btnPedidoFiltrarProducto'); //boton flotante para filtrar productos
  btnCancelarModalProducto = document.getElementById('btnCancelarModalProducto'); //boton cancelar de modal de agergar productos
  
};
// asigna los listener a los botones
async function AgregarListeners(){
  btnAgregarProducto.addEventListener('click',()=>{AgregarProducto();})
  btnCancelarVenta.addEventListener('click',()=>{fcnCancelarVenta();});
  btnGuardarVenta.addEventListener('click',()=>{AgregarCliente();});
  btnCancelarModalProducto.addEventListener('click',()=>{
    // muestra el botón de búsqueda
    document.getElementById('btnPedidoFiltrarProducto').style = "visibility:visible";
  });
  
  let txtFiltroProducto = document.getElementById('txtFiltroProducto');

  btnFiltrarListaProductos.addEventListener('click',()=>{
 
      $("#ModalListadoProductos").modal('show')
      txtFiltroProducto.focus();
    
  });

  let btnBuscarProductoFiltro = document.getElementById('btnBuscarProductoFiltro');
  btnBuscarProductoFiltro.addEventListener('click',()=>{
    let cmbTipoProd = document.getElementById('cmbTipoProd');
    let cmbTipoPrecio = document.getElementById('cmbTipoPrecio');
    loadPreciosVentas(txtFiltroProducto.value, cmbTipoProd.value,cmbTipoPrecio.value);
  })

}

// lista de precios para agregarlos a la venta
async function loadPreciosVentas(filtro,tipo,tipoprecio){

  let newsArticles = document.getElementById('contenedorVentas');
  newsArticles.innerHTML = GlobalLoader;
  
  const response = await fetch(`${GlobalServerUrl}/api/productos/filtro?token=${GlobalToken}&filtro=${filtro}&tipo=${tipo}&tipoprecio=${tipoprecio}`);
  const json = await response.json();        
  
  newsArticles.innerHTML = '';
                          
  newsArticles.innerHTML =
                  `<table class="table table-responsive table-bordered table-fixed table-hover table-striped" id="tblProductosVentas">
                    <thead class="bg-info text-white">
                      <tr>
                        <td class="col-7-sm col-7-md">Descripción</td>
                        <td class="col-4-sm col-4-md">Precio</td>
                        <td class="col-1-sm col-1-md"></td>
                      </tr>
                    </thead>` + 
  json.recordset.map((article)=>{
      let strClass = '';
    if (article.EMPNIT==GlobalEmpnit){
      if(article.PRECIO.toString()=='0'){strClass='bg-danger text-white'};
      let despr = funciones.quitarCaracteres(article.DESPROD,'"'," pulg",true);     
      return `<tr class="border-info border-bottom ${strClass}">
                <td class="col-7-sm col-7-md">${article.DESPROD} 
                    <br>
                    <small class="text-info"><b>${article.CODPROD}<b></small></td>
                <td class="col-4-sm col-4-md"><b>${String(article.QPRECIO)}</b>
                    <br>
                    <small class="bg-amarillo">${article.CODMEDIDA} - Exist: ${article.EXISTENCIA}</small>
                </td>
                <td class="col-1-sm col-1-md">
                  <button class="btn btn-info btn-circle" 
                  onClick="CargarDatosProductoModal('${article.CODPROD}','${despr}','${article.CODMEDIDA}','${article.COSTO}','${article.PRECIO}','${article.QPRECIO}','${article.EQUIVALE}');">+</button>
                </td>
              </tr>`;
      
    };
  }).join('\n');

}


//borra la lista temporal del pedido
function fcnCancelarVenta(){
  funciones.Confirmacion('¿Está seguro que desea CANCELAR esta Venta?')
  .then((value) => {
      if (value==true){
          dbDeleteTempProductoAll('SI');
          Navegar.listaventas();
      };
    });
}
// Carga los datos de la Ventana Modal donde seleccionas la cantidad a vender
async function CargarDatosProductoModal(CodProd,DesProd,CodMedida,Costo,Precio,QPrecio,equivale){
  //asigna el valor a las variables cada vez que se abre el modal
  _Codprod = CodProd;
  _Desprod = DesProd;
  _CodMedida = CodMedida;
  _Costo = parseFloat(Costo);
  _Precio = parseFloat(Precio);
  _QPrecio = QPrecio;
  _equivale = equivale;
  
  //carga los datos de la ventana modal
  txtDesProd.innerHTML = DesProd;
  txtCodMedida.innerHTML = CodMedida;
  txtPrecioProd.innerHTML = QPrecio;
  txtCantidad.value = 1;

  _SubTotal = parseFloat(_Precio);
  _SubTotalCosto = parseFloat(_Costo);

  txtSubTotal.innerHTML = funciones.setMoneda(_SubTotal,'Q');
  // oculta el botón de búsqueda
  document.getElementById('btnPedidoFiltrarProducto').style = "visibility:hidden";

  $("#ModalCantidadVenta").modal('show');
};
// Agrega el producto a la tabla temporal de la venta en curso
function AgregarProducto(){
  // inserta los datos en indexdb
  
  dbInsertTempVentas(GlobalCoddoc,0,_Codprod,_Desprod,_CodMedida,parseInt(txtCantidad.value),_Precio,_SubTotal,GlobalEmpnit,_equivale,_Costo,_SubTotalCosto);
  
  // asigna la suma de los productos en temp ventas
  dbTotalTempVentas(txtTotalVenta);
 
  _SubTotal = parseFloat(0);
  _SubTotalCosto = parseFloat(0);
  
  //recarga la lista
  dbSelectTempVentas(document.getElementById('tblProductosAgregados'));

  //vuelve a mostrar el botón de búsqueda
  document.getElementById('btnPedidoFiltrarProducto').style = "visibility:visible";
  
  $("#ModalListadoProductos").modal('hide');
  $("#ModalListadoProductos").modal('show');

};
// hace que cuando des clic a la cantidad te lo deje en blanco
async function ClearCantidad(){

  txtCantidad.addEventListener('click',()=>{txtCantidad.value =''});

  btnCantidadUp.addEventListener('click',()=>{
    let cant = parseInt(txtCantidad.value);
    txtCantidad.value = cant + 1;

    _SubTotal = parseFloat(_Precio) * parseFloat(txtCantidad.value);
    _SubTotalCosto = parseFloat(_Costo) * parseFloat(txtCantidad.value);
    txtSubTotal.innerHTML = funciones.setMoneda(_SubTotal,'Q');
  })

  btnCantidadDown.addEventListener('click',()=>{
    if (parseInt(txtCantidad.value)==1){

    }else{
      let cant = parseInt(txtCantidad.value);
      txtCantidad.value = cant - 1;

      _SubTotal = parseFloat(_Precio) * parseFloat(txtCantidad.value);
      _SubTotalCosto = parseFloat(_Costo) * parseFloat(txtCantidad.value);
      txtSubTotal.innerHTML = funciones.setMoneda(_SubTotal,'Q');
    }
    
  })

  txtCantidad.addEventListener('keyup',()=>{
    _SubTotal = parseFloat(_Precio) * parseFloat(txtCantidad.value);
    _SubTotalCosto = parseFloat(_Costo) * parseFloat(txtCantidad.value);
    txtSubTotal.innerHTML = funciones.setMoneda(_SubTotal,'Q');
  })
};


//*********** VENTANA DE SELECCIÓN DE CLIENTE  ****/
//AGREGAR CLIENTE A LA VENTA
async function AgregarCliente(){
  funciones.loadView('./views/viewVentasCliente.html')
          .then(
            ()=>{
                  let txtBusquedaCliente = document.getElementById('txtBusquedaCliente');
                  let btnBuscarCliente= document.getElementById('btnBuscarCliente');
                  btnBuscarCliente.addEventListener('click',()=>{
                    
                    cargarListaClientesPedido(txtBusquedaCliente.value);
                  });
                  txtBusquedaCliente.focus();
            })
};

//guarda la venta - guarda los datos de cliente antes de terminar la venta
async function dbGuardarVenta(codcliente,nomcliente){
  GlobalCodCliente = codcliente;
  GlobalNomCliente = nomcliente;

  document.getElementById('txtNomClienteSelected').innerText = GlobalNomCliente;

  let btnFinalizarPedido = document.getElementById('btnPedidoTerminar');
    btnFinalizarPedido.addEventListener('click',()=>{
      dbFinalizarPedido()
    })
};

async function dbFinalizarPedido(){
  let obs = document.getElementById('txtPedidoObs').value;
  let stReparto = document.getElementById('cmbPedidoTipoEntrega').value;
  let lat = '0';
  let long = '0';
  try {
    navigator.geolocation.getCurrentPosition(function (location) {
        lat = location.coords.latitude.toString();
        long = location.coords.longitude.toString();
    })
  } catch (error) {
    funciones.AvisoError(error.toString());
  }


  dbGetValCorrelativo(1); //carga el correlativo de documentos en la global

  funciones.Confirmacion('¿Está seguro que desea Guardar esta Venta?')
  .then((value) => {
       
    if (value==true){
      dbInsertDocumentos(GlobalCoddoc,GlobalCorrelativo,GlobalCodCliente,GlobalNomCliente,GlobalTotalVenta,GlobalEmpnit,GlobalTotalCosto,obs,stReparto,lat,long);
      dbInsertDocproductos(GlobalCoddoc,GlobalCorrelativo,GlobalEmpnit);

      funciones.loadView('./views/viewVentas.html')
          .then(()=>{
           
                let num = parseInt(GlobalCorrelativo) + parseInt(1);
                dbUpdateCorrelativoDoc(num);

                setTimeout(async() => {
                  
                  await dbSendPedido(parseInt(GlobalCorrelativo));
                  await dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
                  
                }, 2300);

                
          });
        };
    });
}

async function cargarListaClientesPedido(filtro){

  let btnBuscarC = document.getElementById('btnBuscarCliente');
  btnBuscarC.innerHTML = '<i class="fal fa-search fa-spin"></i>';
  btnBuscarC.disabled = true;

  const response = await fetch(`${GlobalServerUrl}/api/clientes/filtro?token=${GlobalToken}&filtro=${filtro}`);
  const json = await response.json();
              
  let newsArticles = document.getElementById('tblClientesPedido');

  newsArticles.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';

  let str = '';

                          
  json.recordset.map(
      (cliente)=>{
        if(cliente.EMPNIT==GlobalEmpnit){
        str = str + `<tr class="border-bottom border-secondary">
                        <td>${cliente.NOMCLIENTE} (Tel.${cliente.TELEFONOS})
                          <br>
                          <small class="text-danger">${cliente.DIRCLIENTE}, ${cliente.EMAIL}</small>
                        </td>
                        <td>
                          <button class="btn btn-round btn-icon btn-primary btn-circle shadow"
                              data-toggle='modal' data-target='#ModalOpcionesObs'
                              onclick="dbGuardarVenta('${cliente.CODCLIENTE}','${cliente.NOMCLIENTE}');">
                              <i class="fal fa-chevron-right"></i>
                          </button>
                        </td> 
                    </tr>`;
        }
      }
  );

  newsArticles.innerHTML = str;

  btnBuscarC.innerHTML = '<i class="fal fa-search"></i>Buscar';
  btnBuscarC.disabled = false;
  
};


//asigna código y nombre cliente según se seleccione en la lista
function GetDataCliente(idCliente,nomCliente){
  GlobalCodCliente = idCliente;
  GlobalNomCliente = nomCliente;
};






