import { useEffect, useState } from 'react';
import './App.css';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

function App() {

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState("");
  const [id, setId] = useState("");
  const [empleadosList, setEmpleados] = useState([]);
  const [editar, setEditar] = useState(false);

  const handleAgeBlur = () => {
    const value = parseInt(edad);
    if (value < 16 || value > 70) {
      Swal.fire({
        icon: 'error',
        title: 'Valor no válido',
        text: 'Por favor, ingrese una edad entre 16 y 70 años',
      });
      setEdad("");
    } else {
      setEdad(value);
    }
  };

  const handleExperienceBlur = () => {
    const value = parseInt(anios);
    const maxExperience = Math.max(1, edad - 16);
    if (value < 0 || value > maxExperience) {
      Swal.fire({
        icon: 'error',
        title: 'Valor no válido',
        text: `Por favor, ingrese un número positivo menor o igual a ${maxExperience} para la experiencia`,
      });
      setAnios("");
    } else {
      setAnios(value);
    }
  };

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: '<strong>Registro Exitoso!!!</strong>',
        html: `<i>El empleado ${nombre} fue registrado con éxito</i>`,
        icon: 'success',
        timer: 3000
      })
    })
  }

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => setEmpleados(response.data))
  }

  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setPais(val.pais);
    setAnios(val.anios);
    setId(val.id);
  }

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      limpiarCampos();
      getEmpleados();
      Swal.fire({
        title: '<strong>Actualización Exitosa!!!</strong>',
        html: `<i>Los datos de ${nombre} se actualizaron con éxito</i>`,
        icon: 'success',
        timer: 3000
      })
    })
  }

  const limpiarCampos = () => {
    setNombre("");
    setEdad("");
    setCargo("");
    setPais("");
    setAnios("");
    setId("");
    setEditar(false);
  }

  const deleteEmple = (val) => {
    Swal.fire({
      title: '<strong>Confirmar</strong>',
      html: `<i>Realmente desea eliminar a <strong>${val.nombre}</strong>?</i>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          getEmpleados();
          limpiarCampos();
          Swal.fire(
            'Eliminado',
            `${val.nombre} fue eliminado`,
            'success',
          )
        }).catch(function (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se logró eliminar el empleado!',
            footer: JSON.parse(JSON.stringify(error)).message
          })
        })
      }
    })
  }

  useEffect(() => getEmpleados(), []);

  return (
    <div className='container'>
      <div className='card text-center'>
        <div className='card-header'>
          GESTION DE EMPLEADOS
        </div>
        <div className='card-body'>
          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>Nombre:</span>
            <input type='text' value={nombre} onChange={(event) => setNombre(event.target.value)} className='form-control' placeholder='Ingrese un nombre' aria-describedby='basic-addon1' />
          </div>

          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>Edad:</span>
            <input type='number' value={edad} onBlur={handleAgeBlur} onChange={(event) => setEdad(event.target.value)} className='form-control' placeholder='Ingrese una edad' aria-describedby='basic-addon1' />
          </div>

          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>País:</span>
            <input type='text' value={pais} onChange={(event) => setPais(event.target.value)} className='form-control' placeholder='Ingrese un país' aria-describedby='basic-addon1' />
          </div>

          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>Cargo:</span>
            <input type='text' value={cargo} onChange={(event) => setCargo(event.target.value)} className='form-control' placeholder='Ingrese un cargo' aria-describedby='basic-addon1' />
          </div>

          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>Años de experiencia:  </span>
            <input type='number' value={anios} onBlur={handleExperienceBlur} onChange={(event) => setAnios(event.target.value)} className='form-control' placeholder='Ingrese los años' aria-describedby='basic-addon1' />
          </div>
        </div>
        <div className='card-footer text-muted'>
          {editar ? <><button className='btn btn-warning m-2' onClick={update}>Actualizar</button> <button className='btn btn-danger m-2' onClick={limpiarCampos}>Cancelar</button></> : <button className='btn btn-success' onClick={add}>Registrar</button>}
        </div>
      </div>

      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>Nombre</th>
            <th scope='col'>Edad</th>
            <th scope='col'>País</th>
            <th scope='col'>Cargo</th>
            <th scope='col'>Experiencia</th>
            <th scope='col'>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {
            empleadosList.map((val, key) => {
              return <tr key={val.id}>
                <th>{val.id}</th>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.anios}</td>
                <td>
                  <button className='btn btn-info' onClick={() => editarEmpleado(val)}>Editar</button>
                  <button className='btn btn-danger' onClick={() => { deleteEmple(val) }}>Eliminar</button>
                </td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;



// import { useEffect, useState } from 'react';
// import './App.css';
// import Axios from 'axios'; //Para poder usarlo, instalé en el terminal "npm i axios".
// import 'bootstrap/dist/css/bootstrap.min.css'; //Para poder usar esto instalé en la terminal 'bootstrap', ejecutando "npm install react-bootstrap bootstrap".
// import Swal from 'sweetalert2'; //Para usar this, instalé "npm i sweetalert2" en la terminal.

// function App() {

//   const [nombre, setNombre] = useState("");
//   const [edad, setEdad] = useState();
//   const [pais, setPais] = useState("");
//   const [cargo, setCargo] = useState("");
//   const [anios, setAnios] = useState();
//   const [id, setId] = useState();
//   const [empleadosList, setEmpleados] = useState([]);
//   const [editar, setEditar] = useState(false);

//   const add = () => {
//     Axios.post("http://localhost:3001/create", { //El back se definío en ".../server/index.js", so "http://localhost:3001/create" es la ruta del lo que sería el backend. "3001", porque yo definí que el escuchador esté en el puerto "3001"(esto está en el el mismo archivo del que hago mención en este comentario "app.listen(3001..."). "/create", también lo establecí como ruta para el post en el mismo "index.js" al que me estoy refiriendo en este comentario.
//       nombre: nombre, //Lo del lado izquierdo es el campo que estoy definiendo como parte del cuerpo/body de esta petición "post" para enviarla; y lo de la derecha es lo que le asigno para que lleve/guarde (en este caso es la "nombre", que viene de "const [nombre, setNombre] = useState("");").
//       edad: edad,
//       pais: pais,
//       cargo: cargo,
//       anios: anios
//     } //Lo que está entre llaves es el cuerpo de lo que enviará la petión "post", o sea, es el "body" que recibirá "app.post" en el archivo ".../server/index.js"
//   ).then(() => {
//     getEmpleados();
//     limpiarCampos();
//     //alert("Empleado registrado") //Le digo que hacer después de que realice el "post".
//     Swal.fire({
//       title: '<strong>Registro Exitoso!!!</strong>',
//       html: `<i>El empleado ${nombre} fue registrado con éxito</i>`,
//       icon: 'success',
//       timer: 3000
//     })
    
//   })
//   }

//   const getEmpleados = () => {
//     Axios.get("http://localhost:3001/empleados").then((response) => setEmpleados(response.data)) //"response.data", para traer los datos de la respuesta "response". Aclaro que lo que se traiga con el "get" => se lo recibe con el nombre de "response", una vez obtenido el pedido se actualiza "setEmpleados".
//   }

//   const editarEmpleado = (val) => {
//     setEditar(true);

//     setNombre(val.nombre);
//     setEdad(val.edad);
//     setCargo(val.cargo);
//     setPais(val.pais);
//     setAnios(val.anios);
//     setId(val.id);
//   }

//   const update = () => {
//     Axios.put("http://localhost:3001/update", {
//       id: id,
//       nombre: nombre,
//       edad: edad,
//       pais: pais,
//       cargo: cargo,
//       anios: anios
//     } 
//   ).then(() => {
//     limpiarCampos();
//     getEmpleados();
//     Swal.fire({
//       title: '<strong>Actualización Exitosa!!!</strong>',
//       html: `<i>Los datos de ${nombre} se actualizaron con éxito</i>`,
//       icon: 'success',
//       timer: 3000
//     })
//   })
//   }

//   const limpiarCampos = () => {
//     setNombre("");
//     setEdad("");
//     setCargo("");
//     setPais("");
//     setAnios("");
//     setId("");
//     setEditar(false);
//   }

//   const deleteEmple = (val) => {
    
//       Swal.fire({
//         title: '<strong>Confirmar</strong>',
//         html: `<i>Realmente desea eliminar a <strong>${val.nombre}</strong>?</i>`,
//         //buttons: ['NO', 'SI'], //Pongo primero "NO", porque reconoce lo que está en la primera posicón como 'false' y lo que está en la segunda como 'true'. Esto me sirve para el "then" que está acá abajo, más precicamente para el "if", ya que, "if(res)" es como decir 'if(res=true)', recordá que es otro tipo de notación namáss. 
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Si, eliminar!'
//       }). then(result => {
//         if(result.isConfirmed) {
//           Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
//             getEmpleados();
//             limpiarCampos();
//             Swal.fire(
//               'Eliminado',
//               `${val.nombre} fue eliminado`,
//               'success',
//             )}).catch(function(error) { //Uso un "catach" con una función anónima para capturar el error. Por ejemplo puede que el servidor no este disponible o que haya cualquier otro problema que impida acceder a la base de datos y elimanr registros => sirve este mensaje de error. Si querés simular un error, podrías parar el terminal donde estas corriendo "node index.js" así pierda conxión con este frontEnd => cuando quierás eliminar algo te saldrá está alerta/mensaje.
//               Swal.fire({
//                 icon: 'error',
//                 title: 'Oops...',
//                 text:'No se logró eliminar el empleado!',
//                 footer: JSON.parse(JSON.stringify(error)).message  //Le digo que convierta a 'string' el error que capture con el "catch", despés que la vuelva a convertir a 'objeto' con ".parse" para poder sacar unicamente la propiedad "message" .
//               })
//             })
          
//         }
//       })
    
//   }

//   useEffect(() => getEmpleados(), []);

//   return (
//     <div className='container'>
//       <div className='card text-center'>
//         <div className='card-header'>
//           GESTION DE EMPLEADOS
//         </div>
//           <div className='card-body'>
//             <div className='input-group mb3'>
//               <span className='input-group-text' id='basic-addon1'>Nombre:</span>
//               <input type='text' value={nombre} onChange={(event) => setNombre(event.target.value)} className='form-control'  placeholder='Ingrese un nombre' aria-describedby='basic-addon1' />
//             </div>

//             <div className='input-group mb3'>
//               <span className='input-group-text' id='basic-addon1'>Edad:</span>
//               <input type='number' value={edad} onChange={(event) => setEdad(event.target.value)} className='form-control'  placeholder='Ingrese una edad' aria-describedby='basic-addon1' />
//             </div>

//             <div className='input-group mb3'>
//               <span className='input-group-text' id='basic-addon1'>País:</span>
//               <input type='text' value={pais} onChange={(event) => setPais(event.target.value)} className='form-control'  placeholder='Ingrese un país' aria-describedby='basic-addon1' />
//             </div>

//             <div className='input-group mb3'>
//               <span className='input-group-text' id='basic-addon1'>Cargo:</span>
//               <input type='text' value={cargo} onChange={(event) => setCargo(event.target.value)} className='form-control'  placeholder='Ingrese un cargo' aria-describedby='basic-addon1' />
//             </div>

//             <div className='input-group mb3'>
//               <span className='input-group-text' id='basic-addon1'>Años de experiencia:  </span>
//               <input type='number' value={anios} onChange={(event) => setAnios(event.target.value)} className='form-control'  placeholder='Ingrese los años' aria-describedby='basic-addon1' />
//             </div>
//         </div>
//         <div className='card-footer text-muted'>
//           {editar ? <><button className='btn btn-warning m-2' onClick={update}>Actualizar</button> <button className='btn btn-danger m-2' onClick={limpiarCampos}>Cancelar</button></> : <button className='btn btn-success' onClick={add}>Registrar</button>}
          
//         </div>
//       </div>

//       <table className='table table-striped'>
//         <thead>
//           <tr>
//             <th scope='col'>#</th>
//             <th scope='col'>Nombre</th>
//             <th scope='col'>Edad</th>
//             <th scope='col'>País</th>
//             <th scope='col'>Cargo</th>
//             <th scope='col'>Experiencia</th>
//             <th scope='col'>Acciones</th>
//           </tr>
//         </thead>

//         <tbody>
//           {
//             empleadosList.map((val, key) => {
//               return <tr key={val.id}>
//                   <th>{val.id}</th>
//                   <td>{val.nombre}</td>
//                   <td>{val.edad}</td>
//                   <td>{val.pais}</td>
//                   <td>{val.cargo}</td>
//                   <td>{val.anios}</td>
//                   <td>
//                   <button className='btn btn-info' onClick={() => editarEmpleado(val)}>Editar</button>
//                   <button className='btn btn-danger' onClick={() => {deleteEmple(val)}}>Eliminar</button>
//                   </td>
//                 </tr>
//             })
//           }
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default App;
