async function getVentasDiaVendedor(contenedorName){
try {
  const response = await fetch(`${GlobalServerUrl}/api/ventas/dia`);
    const json = await response.json();
    
    //<h4 class="card-title text-primary">${funciones.setMoneda(field.VENTA,'Q')}</h4>

    let contenedor = document.getElementById(contenedorName);
    contenedor.innerHTML = '';
    let head = '<table class="table">' + 
              '<thead></head><tbody>';
    let foot = '</tbody></table>';
    let rows = json.recordset.map((field)=>{
    //contenedor.innerHTML = json.recordset.map((field)=>{
      if (field.CODVEN==GlobalCodven){
        if(field.EMPNIT==GlobalEmpnit){
      return `<tr>
                <td class="card">Dia: ${field.DIA} Total: ${funciones.setMoneda(field.VENTA,'Q')}</td>
              </tr>`
        };
      };
        }).join('\n');
    
        contenedor.innerHTML = head + rows + foot;
            
    } catch (error) {
      console.log(String(error));
      funciones.showNotification('bottom','right','Inténtalo de nuevo, al parecer no hay datos para cargar');
    } 
};