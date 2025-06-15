const express = require("express"); //Se instaló el módulo "express" en la terminal, "npm i express".
const app = express();
const mysql = require("mysql2"); //Se instaló el módulo "mysql2" en la terminal con "npm i mysql2".
const cors = require("cors") //Uso esto debido a un error del que hablo en el archivo "../LEEME.txt" (¡LEELO!, ES MUY IMPORTATE, PARA ENTENDER LA UNION DEL FRONT CON EL BACK).

app.use(cors()); //LO PRIMERO QUE TIENE QUE HACER ES ESTO
app.use(express.json()); //TAMBIÉN ES NEEDED QUE ESTO SE EJECUTE AL INICIO.



const db = mysql.createConnection({ //Creo la conexión con la DB.
  host: "localhost",
  user:"root",
  password:"4442", //Es la contraseña que le puse a mi MySQL cuando lo instalé.
  database:"empleados_crud"
});

app.post("/create", (req, res) => { //Creo la peticón de guardar, con el método "post". Le digo que la ruta a través de la cual haré el llamado es "/create" (puede haber puesto cualquier nombre/ruta que se me antoje, I mean soy el que define esto). "(req, res)", refers to la solicitud y la respuesta (otra vez, yo defino estos nombres, elegí estos porque son más representativos para lo que sirven; del inglés request and response).
  const nombre = req.body.nombre; //En el cuerpo/body de la petición/req que va a resibir, le digo que capture el que se llame "nombre"
  const edad = req.body.edad;
  const pais = req.body.pais;
  const cargo = req.body.cargo;
  const anios = req.body.anios;

  db.query('INSERT INTO empleados(nombre, edad, pais, cargo, anios) values(?, ?, ?, ?, ?)', [nombre, edad, pais, cargo, anios], (err, result) => {
    if(err) console.log(err);
    else res.send(result);
  }); //Hago la consulta a la DB.
}); 

app.get("/empleados", (req, res) => {

  db.query('SELECT * FROM empleados', (err, result) => {
    if(err) console.log(err);
    else res.send(result);
  });
});

app.put("/update", (req, res) => {
  const id = req.body.id;
  const nombre = req.body.nombre;
  const edad = req.body.edad;
  const pais = req.body.pais;
  const cargo = req.body.cargo;
  const anios = req.body.anios;

  db.query('UPDATE empleados SET nombre=?, edad=?, pais=?, cargo=?, anios=? WHERE id=?', [nombre, edad, pais, cargo, anios, id], (err, result) => {
    if(err) console.log(err);
    else res.send(result);
  });
}); 

app.delete("/delete/:id", (req, res) => { //":id", le estoy indicando que le voy a mandar un parámetro dentro del link, dicho parámetro se llama "id".
  const id = req.params.id; //Básicamente le digo que de los parámetros que lleguen por el link, que tome el que está cumpliendo el rol (o sea, el que está en el lugar que yo definí que lo que aparezca ahí lo llame así) de "id".

  db.query('DELETE FROM empleados WHERE id=?', id, (err, result) => {
    if(err) console.log(err);
    else res.send(result);
  })
})

app.listen(3001, () => {
  console.log("Corriendo en el puerto 3001")
})