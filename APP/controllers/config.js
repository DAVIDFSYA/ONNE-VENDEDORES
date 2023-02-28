let btnConfigCorrelativo;
let txtConfigCorrelativo;

let txtConfigServerUrl;
let btnConfigServerUrl;

let btnConfigToken;
let txtConfigToken;

let btnConfigBorrarPedidos;

async function CargarBotonesConfig() {
        
    btnConfigCorrelativo = document.getElementById('btnConfigCorrelativo');
    btnConfigToken = document.getElementById('btnConfigToken');
    txtConfigCorrelativo = document.getElementById('txtConfigCorrelativo');
    txtConfigToken = document.getElementById('txtConfigToken');
    btnConfigBorrarPedidos = document.getElementById('btnConfigBorrarPedidos');
    
    txtConfigServerUrl = document.getElementById('txtConfigServerUrl');
    btnConfigServerUrl = document.getElementById('btnConfigServerUrl');
    
    //ASIGNA EL VALOR DEL CORRELATIVO ACTUAL
    dbGetCorrelativo(1,txtConfigCorrelativo);

    // asigna el valor del token actual
    //dbGetToken(txtConfigToken);
    txtConfigToken.value = GlobalToken;

    btnConfigCorrelativo.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está seguro que desea Actualizar el Correlativo?')
            .then((value) => {
                if (value==true){
                    dbUpdateCorrelativoDoc(txtConfigCorrelativo.value,'SI');
                };
            });
    })

    btnConfigToken.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está seguro que desea Actualizar el Token?')
            .then((value) => {
                if (value==true){
                    dbUpdateToken(txtConfigToken.value);
                };
            });
    })

    btnConfigBorrarPedidos.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está seguro que desea Eliminar Todos los Pedidos?')
            .then((value) => {
                if (value==true){
                    dbEliminarPedidosTodos();
                };
            });
    })

    btnConfigServerUrl.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está seguro que desea Eliminar Todos los Pedidos?')
            .then((value) => {
                if (value==true){
                    GlobalServerUrl = txtConfigServerUrl.value;
                };
            });
    })

    
}
