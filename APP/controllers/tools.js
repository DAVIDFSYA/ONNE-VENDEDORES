let btnToolsTelefono;
let txtToolsTelefono;

let btnToolsPing;
let txtToolsPing;

async function CargarBotonesTools() {
        
    btnToolsTelefono = document.getElementById('btnToolsTelefono');
    txtToolsTelefono = document.getElementById('txtToolsTelefono');

    btnToolsPing = document.getElementById('btnToolsPing');
    txtToolsPing = document.getElementById('txtToolsPing');

    btnToolsTelefono.addEventListener('click',()=>{
        funciones.CompaniaTelefono(txtToolsTelefono.value,'SI');
    })

    btnToolsPing.addEventListener('click',()=>{
        funciones.PingInternet(txtToolsPing.value);
    })
}