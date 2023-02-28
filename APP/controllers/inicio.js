// inicializa indexDb
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!window.indexedDB) {
      window.alert("Lo siento pero su Teléfono no soporta el guardado de Datos");
    }

    if (navigator.storage && navigator.storage.persist)
          navigator.storage.persist()
            .then(function(persistent){
            if (persistent){
                console.log("Storage will not be cleared except by explicit user action");
            }else{
              console.log("Storage may be cleared by the UA under storage pressure");
          }});

//INSTALACION APP
let btnInstalarApp = document.getElementById('btnInstalarApp');
btnInstalarApp.hidden = true;

let capturedInstallEvent;
window.addEventListener('beforeinstallprompt',(e)=>{
    e.preventDefault();
    btnInstalarApp.hidden = false;
    capturedInstallEvent = e;
});
btnInstalarApp.addEventListener('click',(e)=>{
    capturedInstallEvent.prompt();
    capturedInstallEvent.userChoice.then((choice)=>{

    })
})
//INSTALACION APP


// Ventas
let btnVentas = document.getElementById('btnVentas');
let btnMapas = document.getElementById('btnMapas');
let btnTools = document.getElementById('btnTools');
let btnConfig = document.getElementById('btnConfig');
let btnCenso = document.getElementById('btnCenso');
let btnReportes = document.getElementById('btnReportes');
let btnSalir = document.getElementById('btnSalir');

let btnVentas2;
let btnPrecios2;
let btnClientes2;


// Ventas
btnVentas.addEventListener('click',()=>{
   
    funciones.loadView('./views/viewVentas.html')
    .then(()=>{
        dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
        //GlobalBool = true;
     
    }); 
})

// Mapas
btnMapas.addEventListener('click',()=>{
   
    funciones.loadView('./views/viewVentasMap.html')
    .then(()=>{
        classDbOp.GetRecorrido();   
     
    });
 
   
});


btnCenso.addEventListener('click',()=>{
    funciones.loadView('./views/viewCenso.html')
        .then(()=>{
            classCenso.CargarFuncionesCenso();
            classCenso.SelectCensoAll(GlobalEmpnit,GlobalCodven,document.getElementById('tblCenso'));
        });    
    
  
});

// Tools
btnTools.addEventListener('click',()=>{
    funciones.loadView('./views/viewTools.html')
            .then(()=>{
                CargarBotonesTools();
                GlobalSelectedForm = 'viewTools';
                GlobalBool = true;
            });
            
   
});

// Configuraciones
btnConfig.addEventListener('click',()=>{
    funciones.loadView('./views/viewConfig.html')
        .then(()=>{
            CargarBotonesConfig();
            GlobalSelectedForm = 'viewConfig';
            GlobalBool = true;
        });
  
});


// Reportes
btnReportes.addEventListener('click',()=>{
    funciones.loadView('./views/viewReports.html')
        .then(()=>{
            
        })
    
   
});



// Asigna valores a la vista de inicio
async function CargarDatosVendedor(usuario){
    var txtNombreUsuario = document.getElementById('txtNombreUsuario');
    txtNombreUsuario.innerHTML = usuario;
};


/* ********************************
// CONTROLA EL MENU PRINCIPAL
******************************** */
async function ControllerMenu(TipoApp){
        
    switch (TipoApp) {
        case 'LOGIN':
            btnVentas.style="visibility:hidden";
            btnTools.style="visibility:hidden";
            btnConfig.style="visibility:hidden";
            btnCenso.style="visibility:hidden";
            btnReportes.style="visibility:hidden";
            btnMapas.style="visibility:hidden";
            btnSalir.style="visibility:hidden";
            break;
    
        case 'SALES':
            btnVentas.style="visibility:visible";
            btnTools.style="visibility:visible";
            btnConfig.style="visibility:visible";
            btnCenso.style="visibility:visible";
            btnReportes.style="visibility:visible";
            btnMapas.style="visibility:visible";
            btnSalir.style="visibility:visible";
            break;
    
        case 'DELIVERY':
            btnVentas.style="visibility:hidden";
            btnTools.style="visibility:hidden";
            btnConfig.style="visibility:hidden";
            btnCenso.style="visibility:hidden";
            btnMapas.style="visibility:hidden";
            btnSalir.style="visibility:visible";
            break;

        case 'ADMIN':
            

        break;

        default:
            break;
    }
    
    }
    
    /* ********************************
    // CONTROLA EL MENU PRINCIPAL
    ******************************** */

function StartRecognition(){
    try {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            //recognition.lang = 'en-US';
            recognition.lang = 'es-ES';

            recognition.continuous = true;
            recognition.start();

            recognition.onresult = function(event) {

                for (var i = event.resultIndex; i < event.results.length; ++i) {

                    if(event.results[i].isFinal){

                        if (event.results[i][0].transcript.trim() == 'ventas') {
                            //remoteControl.play()
                            btnVentas.click();
                        } 
                        if (event.results[i][0].transcript.trim() == 'precios') {
                            //remoteControl.stop()
                            btnPrecios.click();
                        } 
                        if (event.results[i][0].transcript.trim() == 'inicio') {
                            //remoteControl.mute()
                            btnDashboard.click();
                        } 
                        if (event.results[i][0].transcript.trim() == '¿Cuál es mi Usuario?') {
                            //remoteControl.unmute()
                            funciones.hablar('Tu usuario es ' + GlobalUser);
                        } 
                        
                        console.info(`You said : ${event.results[i][0].transcript}`)

                    }
                    
                }
            
            }
    } catch (error) {
        
    }
}



let Navegar = {
    login:()=>{
        funciones.loadView('./views/viewLogin.html','contenedor')
        .then(async ()=>{
            ControllerMenu('LOGIN');                  
            container_empresa = document.getElementById('container_empresa');
            container_empresa.style = "visibility:hidden";
            container_btniniciar = document.getElementById('container_btniniciar');
            container_btniniciar.style = "visibility:hidden";
            //getDataToken();
        })
    },
    listaventas:()=>{
        funciones.loadView('./views/viewVentas.html')
        .then(()=>{
            dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
        }); 
    },
    mapa:()=>{
        funciones.loadView('./views/viewVentasMap.html')
        .then(()=>{
            classDbOp.GetRecorrido();   
        });
    },
    censo:()=>{
        funciones.loadView('./views/viewCenso.html')
        .then(()=>{
            classCenso.CargarFuncionesCenso();
            classCenso.SelectCensoAll(GlobalEmpnit,GlobalCodven,document.getElementById('tblCenso'));
        }); 
    }
}