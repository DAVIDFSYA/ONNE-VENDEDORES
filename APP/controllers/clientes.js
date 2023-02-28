async function cargarListaClientes(){
    let newsArticles = document.getElementById('tblClientes');
    newsArticles.innerHTML = 'Cargando Clientes....';

    const response = await fetch(`${GlobalServerUrl}/api/clientes/all?token=${GlobalToken}`);
    const json = await response.json();
                

    newsArticles.innerHTML = '';
    newsArticles.innerHTML =
                    `<table class="table-responsive" id="tblClientesTablaLista">
                        <thead><tr>
                          <td class="col-4-sm col-4-md">Cliente</td> 
                          <td class="col-4-sm col-4-md">Dirección</td> 
                          <td class="col-4-sm col-4-md">Telefono</td></tr> 
                          <td></td>
                        </thead>` + 
    json.recordset.map((cliente)=>{
       

        if(cliente.EMPNIT==GlobalEmpnit){
            return `<tr>
            <td class="col-4-sm col-4-md">${cliente.NOMCLIENTE}</td>
            <td class="col-4-sm col-4-md">${cliente.DIRCLIENTE},${cliente.DESMUNICIPIO}</td>
            <td class="col-4-sm col-4-md">${cliente.TELEFONOS}</td>
            <td></td> 
            </tr>`;
        }
    }).join('\n');
    
    funciones.OcultarRows('tblClientesTablaLista');

    document.getElementById('btnClientesFiltrar').addEventListener('click',()=>{
        funciones.FiltrarListaProductos('tblClientesTablaLista');
    })
  }

/*
function CrearBusquedaClientes(){
    let txtBusqueda = document.getElementById('search')
    
    txtBusqueda.addEventListener('keyup',()=>{
        funciones.crearBusquedaTabla('tblClientesTablaLista','search')
  })
}; */
