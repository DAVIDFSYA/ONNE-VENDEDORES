const config = require('./config');

const sql = require('mssql');

let execute = {
	Query : (res,sqlqry)=>{	
		
		//console.log('ejecutando consulta... ' + sqlqry);		

		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				if(err){
					res.send(err.message)
				}else{
					res.send(result);
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},
	QueryNoSend : (res,sqlqry)=>{
		
		//console.log('ejecutando consulta... ');	

		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {				
				if(err){
					res.send(err.message)
				}else{
					res.send('Ejecución exitosa');
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},
	command : (rsqlqry)=>{			
		return new Promise((resolve,reject)=>{
			try {
				const pool1 = new sql.ConnectionPool(config, err => {
				  new sql.Request(pool1)
				  .query(sqlqry, (err, result) => {
						sql.close();
						if(err){
							reject(err);		  
						}else{
							resolve(result);
						}					
				  })  
				})
				pool1.on('error', err => {
					sql.close();
					reject(err);
				})
			  } catch (error) {
					sql.close();
					reject(error);
			  }
		})
	},
	start:()=>{
		console.log('intentando iniciar la conexión...')
		//const sql = require('mssql')
		try {
			sql.connect(config).then(()=>{sql.close();})
			console.log('primera conexion exitosa...');
		} catch (error) {
			console.log('primera conexion fallo: ' & error);
		}
	}
}

let executex = {
	Query : (res,sqlqry)=>{	
		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				if(err){
					res.send(err.message)
				}else{
					res.send(result);
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},
	QueryNoSend : (res,sqlqry)=>{
		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {				
				if(err){
					res.send(err.message)
				}else{
					res.send('Ejecución exitosa');
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},
	start:()=>{
		console.log('intentando iniciar la conexión...')
		//const sql = require('mssql')
		try {
			sql.connect(config).then(()=>{sql.close();})
			console.log('primera conexion exitosa...');
		} catch (error) {
			console.log('primera conexion fallo: ' & error);
		}
	}
}

module.exports = execute;

