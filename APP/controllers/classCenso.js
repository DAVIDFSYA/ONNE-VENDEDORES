let btnNuevoCenso;
let btnGuardarCenso;
let btnCancelarCenso;
let btnObtenerUbicacion;

//formulario censo nuevo

classCenso={
    CargarFuncionesCenso: async ()=>{
        btnNuevoCenso = document.getElementById('btnNuevoCenso');
        btnGuardarCenso = document.getElementById('btnGuardarCenso');
        btnCancelarCenso= document.getElementById('btnCancelarCenso');
        btnObtenerUbicacion = document.getElementById('btnObtenerUbicacion');
                
        btnObtenerUbicacion.addEventListener('click',()=>{
            let lat,long;
            lat = document.getElementById('txtLatitud');
            long = document.getElementById('txtLongitud');
            console.log('obteniendo gps');
            classCenso.ObtenerUbicacion(lat,long);
        });

        btnNuevoCenso.addEventListener('click', ()=>{
            btnNuevoCenso.style = "visibility:hidden";
            $("#ModalNuevoCliente").modal('show');
            btnObtenerUbicacion.click();

        });

        btnCancelarCenso.addEventListener('click', ()=>{
            btnNuevoCenso.style = "visibility:visible";
        });
        
        btnGuardarCenso.addEventListener('click',()=>{
            funciones.Confirmacion('¿Está seguro que desea registrar este cliente?')
            .then((value) => {
       
                if (value==true){
                    let nit, nombre, direccion, codmuni, telefono, lat, long, obs, negocio,concre;

                    nit = document.getElementById('txtNit').value;
                    nombre = document.getElementById('txtNomcliente').value;
                    direccion = document.getElementById('txtDircliente').value;
                    codmuni = document.getElementById('cmbMunicipio').value;
                    coddepto = document.getElementById('cmbDepartamento').value;
                    telefono = document.getElementById('txtTelefono').value;
                    lat = document.getElementById('txtLatitud').innerText;
                    long = document.getElementById('txtLongitud').innerText;
                    obs = document.getElementById('txtObs').value;
                    negocio = document.getElementById('txtNegocio').value;
                    concre = document.getElementById('cmbConcre').value;
        
                    classCenso.InsertCliente(GlobalEmpnit,GlobalCodven,nit,nombre,direccion,codmuni,coddepto,telefono,lat,long,obs,negocio,concre);
                    classCenso.SelectCensoAll(GlobalEmpnit,GlobalCodven,document.getElementById('tblCenso'));
                    btnCancelarCenso.click();
                }
            })

        })

        funciones.getComboMunicipios('cmbMunicipio');
        funciones.getComboDepartamentos('cmbDepartamento');
        

    },
    
    SelectCensoAll: (empnit,codven,contenedor)=>{
        DbConnection.select({
            From: "censo"
        }, function (censo) {
    
            var HtmlString = "";
            censo.forEach(function (cliente) {
                if (cliente.empnit==empnit){
                    if (cliente.codven==codven){
                        
                        HtmlString += ` <tr Id=${cliente.Id}>
                                <td class=''>
                                    ${cliente.nomcliente}
                                    <br>
                                    <small>${cliente.dircliente}</small>
                                </td>
                                <td class=''>${cliente.telefono}</td> 
                                <td>
                                    <button class="btn btn-round btn-icon btn-success btn-sm" 
                                    onclick="classCenso.sendCliente(${cliente.Id},'${cliente.empnit}',${cliente.codven},
                                        '${cliente.nit}','${cliente.nomcliente}','${cliente.dircliente}',
                                        ${cliente.codmun},${cliente.coddep},'${cliente.telefono}',
                                        '${cliente.latitud}','${cliente.longitud}','${cliente.obs}','${cliente.negocio}','${cliente.concre}');">
                                        E
                                    </button>
                                </td>
                                <td class=''>
                                    <button class='btn btn-round btn-icon btn-danger btn-sm' onclick='classCenso.DeleteCliente("${cliente.Id}");'>x</button>
                                </td>
                            </tr>`;                        
                                
                    }
                }

            }, function (error) {
                console.log(error);
            })
            contenedor.innerHTML = HtmlString;
        });
    },

    ObtenerUbicacion: async(lat,long)=>{
        try {
            navigator.geolocation.getCurrentPosition(function (location) {
                lat.innerText = location.coords.latitude.toString();
                long.innerText = location.coords.longitude.toString();
            })
        } catch (error) {
            funciones.AvisoError(error.toString());
        }
    },

    InsertCliente: async (empnit,codven,nit,nombre,direccion,codmunicipio,coddepartamento,telefono,latitud,longitud,obs,negocio,concre)=>{
            
        var data = {
            empnit:empnit,
            codven:codven,
            negocio:negocio,
            giro: 'GENERAL',
            nit:nit,
            nomcliente:nombre,
            dircliente:direccion,
            codmun:codmunicipio,
            coddep:coddepartamento,
            telefono:telefono,
            concre:concre,
            latitud:latitud,
            longitud:longitud,
            obs:obs,
            token:GlobalToken
        };


        DbConnection = new JsStore.Instance(DbName);
        await DbConnection.insert({Into: "censo",Values: [data]},
                function (rowsAdded) {
                    funciones.Aviso('Cliente registrado exitosamente');
                    classCenso.LimpiarCampos();
                }, 
                function (err) {
                    console.log(err);
                    funciones.AvisoError('No se puedo Guardar este Cliente, error de base de datos');
                })
        
    },

    DeleteCliente: (id)=>{
        funciones.Confirmacion('¿Está seguro que desea ELIMINAR este cliente?')
            .then((value)=>{
                if(value==true){
                    DbConnection.delete({
                        From: 'censo',
                        Where: {
                            Id: Number(id)
                        }
                    }, function (rowsDeleted) {
                        console.log(rowsDeleted + ' rows deleted');
                        if (rowsDeleted > 0) {
                            document.getElementById(id).remove();
                            classCenso.SelectCensoAll(GlobalEmpnit,GlobalCodven,document.getElementById('tblCenso'));
                            funciones.Aviso("Cliente eliminado con éxito");
                        }
                    }, function (error) {
                        alert(error.Message);
                    })
                }
            })
    },
    DeleteClienteSilent: (id)=>{
        
                    DbConnection.delete({
                        From: 'censo',
                        Where: {
                            Id: Number(id)
                        }
                    }, function (rowsDeleted) {
                        console.log(rowsDeleted + ' rows deleted');
                        if (rowsDeleted > 0) {
                            document.getElementById(id).remove();
                            classCenso.SelectCensoAll(GlobalEmpnit,GlobalCodven,document.getElementById('tblCenso'));
                            funciones.Aviso("Cliente eliminado con éxito");
                        }
                    }, function (error) {
                        alert(error.Message);
                    })
                
    },
    GetLatLong: ()=>{

    },
    
    LimpiarCampos: ()=>{
        document.getElementById('txtNit').value = '';
        document.getElementById('txtNomcliente').value= '';
        document.getElementById('txtNegocio').value = '';
        document.getElementById('txtDircliente').value= '';
        document.getElementById('txtTelefono').value= '';
        document.getElementById('txtObs').value= '';
        document.getElementById('txtLatitud').innerText = '0';
        document.getElementById('txtLongitud').innerText= '0';
    },
    sendCliente : (id,empnit,codven,nit,nombre,direccion,codmunicipio,coddepartamento,telefono,latitud,longitud,obs,negocio,concre)=>{
        funciones.Confirmacion('¿Está seguro que desea Enviar este Cliente?')
        .then((value)=>{
            if(value==true){
                let url ='/api/censo/insert';
        
                var data = {
                    empnit:empnit,
                    codven:codven,
                    negocio:negocio,
                    nit:nit,
                    nomcliente:nombre,
                    dircliente:direccion,
                    codmun:codmunicipio,
                    coddep:coddepartamento,
                    telefono:telefono,
                    concre:concre,
                    latitud:latitud,
                    longitud:longitud,
                    obs:obs,
                    fecha:funciones.getFecha(),
                    token:GlobalToken
                };
                
                axios.post(url,data)
                    .then((response) => {
                        console.log(response);
                        let data = response.data;
                        if(data.rowsAffected[0]==1){
                            funciones.Aviso('Cliente enviado exitosamente');
                            classCenso.DeleteClienteSilent(id);
                        }else{
                            funciones.AvisoError('Se envió más de una fila')
                        }
                        
                    }, (error) => {
                        console.log(error)
                        funciones.AvisoError('No se pudo enviar el cliente');
                    });

            }

        })
        
        
    }
}