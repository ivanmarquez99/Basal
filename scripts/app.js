var template = document.querySelector("template");
var tabla = document.querySelector("tbody");
var cajetinNombre = document.querySelector("#name");
var cajetinApellido = document.querySelector("#lastNames");
var cajetinGenero = document.querySelector("#gen");
var cajetinEdad = document.querySelector("#age");
var cajetinPeso = document.querySelector("#weight");
var cajetinAltura = document.querySelector("#height");
var cajetinActividad = document.querySelector("#activity");
var form = document.querySelector("form");

var bd = window.localStorage;

// Definimos el array con los datos de usuario
var usuarios = [];


window.addEventListener('load', ()=>{
  
  // Eventos de los botones
  document.querySelector('button#importarDatos').addEventListener('click', importarDatos);

  // Cargamos y mostramos datos
  cargarYmostrarDatos();

});


/**
 * Carga los datos de localStorage, los guarda en el array usuarios, borra todos los datos de la tabla
 * y vuelve a insertar todos los datos de usuarios
 */
function cargarYmostrarDatos() {

  if (bd.getItem("datos")) {

    usuarios = JSON.parse(bd.getItem("datos"));

    // limpiamos el contenido de la tabla
    document.querySelector("tbody").innerHTML = "";
    anadirAtabla(usuarios);

    // Habilitamos los botones de Exportar y Limpiar
    document.querySelector('button#exportarDatos').classList.remove('disabled');
    document.querySelector('button#exportarDatos').setAttribute('aria-disabled', 'false');
    document.querySelector('button#limpiarDatos').classList.remove('disabled');
    document.querySelector('button#limpiarDatos').setAttribute('aria-disabled', 'false');
    
  }
}


/**
 * Añade filas a la tabla según un array de datos pasado
 */
function anadirAtabla(datos) {

  if (datos.length > 0) {
    datos.forEach((u) => {

      console.log(u);

      let nuevaFila = template.content.cloneNode(true);
      nuevaFila.querySelector("td.name").innerText = u.nombre;
      nuevaFila.querySelector("td.lastName").innerText = u.apellidos;
      nuevaFila.querySelector("span.gen").innerText = u.sexo;
      nuevaFila.querySelector("td.age").innerText = u.edad;
      nuevaFila.querySelector("td.weight").innerText = u.peso;
      nuevaFila.querySelector("td.height").innerText = u.altura;
      nuevaFila.querySelector("span.activity").innerText = u.actividad;
      let dataGet = getData(u.peso, u.altura, u.edad, u.sexo);
      nuevaFila.querySelector("td.get").innerText = dataGet + " kCal";
      nuevaFila.querySelector("td.ger").innerText = gerData(u.actividad, dataGet, u.sexo, nuevaFila) + " kCal";

      tabla.appendChild(nuevaFila);
    })
  }

}


/**
 * Devuelve los datos GET según los parámetros de usuarios facilitados
 */
function getData(peso, altura, edad, sexo) {
  dataGet = 0;
  if (sexo == "hombre") {
    var dataGet = Math.round(66.473 + 13.751 * peso + 5.0033 * altura - 6.755 * edad);
  } else {
    var dataGet = Math.round(66.473 + 13.751 * peso + 5.0033 * altura - 6.755 * edad);
  }
  return dataGet;
}

/**
 * Devuelve los datos GER según los parámetros de usuarios facilitados
 */
function gerData(actividad, get, sexo) {
  var dataGer = 0;
  if (sexo == "hombre") {
    switch (actividad) {
      case "sedentaria":
        dataGer = Math.round(get * 1.3);
        break;
      case "ligera":
        dataGer = Math.round(get * 1.6);
        break;
      case "moderada":
        dataGer = Math.round(get * 1.7);
        break;
      case "intensa":
        dataGer = Math.round(get * 2.1);
        break;
    }
  } else {
    switch (actividad) {
      case "sedentaria":
        dataGer = Math.round(get * 1.3);
        break;
      case "ligera":
        dataGer = Math.round(get * 1.6);
        break;
      case "moderada":
        dataGer = Math.round(get * 1.7);
        break;
      case "intensa":
        dataGer = Math.round(get * 2.1);
        break;
    }
  }
  return dataGer;
}


/**
 * Añadimos un evento al enviar el formulario para importar los datos en el array y guardarlos en la bd
 */
document.querySelector('form#CreateForm').addEventListener("submit", (ev) => {
  ev.preventDefault();

  let usuario = {
    "nombre": cajetinNombre.value,
    "apellidos": cajetinApellido.value,
    "sexo": cajetinGenero.value,
    "edad": parseInt(cajetinEdad.value),
    "peso": parseInt(cajetinPeso.value),
    "altura": parseInt(cajetinAltura.value),
    "actividad": cajetinActividad.value
  };

  usuarios.push(usuario);
  bd.setItem("datos", JSON.stringify(usuarios));
  cargarYmostrarDatos();

  bootstrap.Modal.getInstance(document.querySelector('#modal-nuevoCliente')).hide();
})


/**
 * Carga los datos de json de una url
 */
function importarDatos() {
  
  document.querySelector('div#cargando').classList.remove('d-none');
  
  fetch('https://raw.githubusercontent.com/FRomero999/ExamenDIW2022/main/clientes.json')
    .then(response => response.text())
    .then(data => {

      // Parseamos a array los datos recibidos
      datosImportados = JSON.parse(data);

      // Añadimos los datos importados al array usuarios
      if (datosImportados.length > 0) {
        datosImportados.forEach((line) => {
          usuarios.push(line);
        });
      }

      // Parseamos a json todo el array de usuarios y sobreescribimos todos los datos en bd
      bd.setItem("datos", JSON.stringify(usuarios));
      cargarYmostrarDatos();
      
      document.querySelector('div#cargando').classList.add('d-none');
    });
}

/**
 * Evento de formulario que limpia todos los datos tanto de la bd como de pantalla
 */
document.querySelector('form#form-limpiarDatos').addEventListener("submit", (ev) => {
  ev.preventDefault();

  usuarios = [];
  bd.setItem("datos", usuarios);
  
  // limpiamos el contenido de la tabla
  document.querySelector("tbody").innerHTML = "";

  // Deshabilitamos los botones de Exportar y Limpiar datos
  document.querySelector('button#exportarDatos').classList.add('disabled');
  document.querySelector('button#exportarDatos').setAttribute('aria-disabled', 'true');
  document.querySelector('button#limpiarDatos').classList.add('disabled');
  document.querySelector('button#limpiarDatos').setAttribute('aria-disabled', 'true');


  bootstrap.Modal.getInstance(document.querySelector('#modal-limpiarDatos')).hide();
})
