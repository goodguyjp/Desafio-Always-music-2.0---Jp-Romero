const {Pool} = require('pg');

const config = {
    user: "postgres",
    password: "admin",
    host: "localhost",
    database: "clase4_always_music",
    port: 5500,
    max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
};
const pool = new Pool(config);
const argumentos = process.argv.slice(2);
const funcion = argumentos[0];

const nuevoEstudiante = async (estudiante) =>{
    const SQLQuery = {
        rowMode: "array",
        text: "INSERT INTO estudiantes(rut, nombre, curso, nivel) values ($1, $2, $3, $4) RETURNING *;",
        values: estudiante.anadir,
    };
    try{
    const res = await pool.query(SQLQuery);
        console.log(res.rows[0]);
        pool.end();
        
    }catch (error){
        console.log(error.code);
        pool.end();
    }
}
const consultaEstudiantes = async () =>{
    const SQLQuery = {
        rowMode: "array",
        text: "SELECT * from estudiantes;",  
        values: [],             
    }
    try {
        const res = await pool.query(SQLQuery);

        console.log("Registro Actual", res.rows);
        pool.end();
    }catch (error) {
        console.log((error.code));
        pool.end();
    }    
};

const editarEstudiantes = async (editar) =>{
    const SQLQuery = {
        rowMode: "array",
        text: "UPDATE estudiantes SET nombre = $2, curso = $3, nivel = $4 WHERE rut = $1 RETURNING *;",
        values: editar.editar,
    };
 const res = await pool.query(SQLQuery);
       
    try {
        console.log(`Estudiante editado con exito`, res.rows);
        pool.end();
        
    }catch (error) {
        console.log((error.code));
        pool.end();
    }    
}

const rutEstudiantes = async (buscarRut) =>{
    console.log(buscarRut.buscarRut);
    const SQLQuery = {
        rowMode: "array",
        text: `SELECT * from estudiantes WHERE rut = $1;`,
        values: buscarRut.buscarRut,
    }
    try {
        const res = await pool.query(SQLQuery);
        console.log(res.rows);
        pool.end();
    }catch (error) {
        console.log((error));
        pool.end();
    }    
}

const eliminarEstudiantes = async (borrar) =>{
    
       try {
           const SQLQuery = {
               rowMode: "array",
               text: "DELETE from estudiantes WHERE rut= $1 RETURNING*;",
               values: borrar.borrar
               
            }
        const res = await pool.query(SQLQuery);
        console.log(`Registro de estudiante ${res.rows[0]} eliminado`);    
                       
    }catch (error) {
        console.log((error.code));
        
    }finally{
        pool.end();
    }    
}
//IIFE
(async() => {   

    if(funcion == 'nuevo'){   
    
    const rut = argumentos[1];
    const nombre = argumentos[2];
    const curso = argumentos[3];
    const nivel = argumentos[4];
    const anadirNuevo = {
        anadir: [rut, nombre, curso, nivel]
    }
    await nuevoEstudiante(anadirNuevo);

}else if(funcion === 'consulta'){
    await consultaEstudiantes();
}else if(funcion === 'editar')
{
    const rut = argumentos[1];
    const nombre = argumentos[2];
    const curso = argumentos[3];
    const nivel = argumentos[4];
    const editarE = {
        editar: [rut, nombre, curso, nivel]
    }
    await editarEstudiantes(editarE);
}else if(funcion === 'rut'){
    const rut = argumentos[1];
    const rutE = {
        buscarRut: [rut]
    }
    await rutEstudiantes(rutE);
}else if(funcion === 'eliminar'){
    
    const rut = argumentos[1];
    const borrarEstudiante = {
        borrar: [rut]
    }
    await eliminarEstudiantes(borrarEstudiante);
}else {
    console.log("Funcion ingresada no disponible");
}
})();

//ejecutarFunciones();  se cambia la ejecucion de la funcion por una IIFE