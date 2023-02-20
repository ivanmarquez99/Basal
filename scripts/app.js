var template = document.querySelector("template")
var tabla = document.querySelector("tbody")
var cajetinNombre = document.querySelector("#name")
var cajetinApellido = document.querySelector("#lastNames")
var cajetinGenero = document.querySelector("#gen")
var cajetinEdad = document.querySelector("#age")
var cajetinPeso = document.querySelector("#weight")
var cajetinAltura = document.querySelector("#height")
var cajetinActividad = document.querySelector("#activity")
var form = document.querySelector("form")

var bd = window.localStorage

var usuarios = []

function datosExternos() {
if (bd.getItem("datos")) {
  usuarios = JSON.parse(bd.getItem("datos"))
  usuarios.forEach((u) => {
    console.log(u)
    let nuevaFila = template.content.cloneNode(true)
    nuevaFila.querySelector("td.name").innerText = u.nombre
    nuevaFila.querySelector("td.lastName").innerText = u.apellidos
    nuevaFila.querySelector("span.gen").innerText = u.sexo
    nuevaFila.querySelector("td.age").innerText = u.edad
    nuevaFila.querySelector("td.weight").innerText = u.peso
    nuevaFila.querySelector("td.height").innerText = u.altura
    nuevaFila.querySelector("span.activity").innerText = u.actividad
    var dataGet = getData(u.peso, u.altura, u.edad, u.sexo)
    nuevaFila.querySelector("td.get").innerText = dataGet + " kCal"
    nuevaFila.querySelector("td.ger").innerText = gerData(u.actividad, dataGet, u.sexo, nuevaFila) + " kCal"
    tabla.appendChild(nuevaFila)
  })
}
}

form.addEventListener("submit", (ev) => {
  ev.preventDefault()

  let usuario = crearUsuario()
  let nuevaFila = template.content.cloneNode(true)
  nuevaFila.querySelector("td.name").innerText = usuario.nombre
  nuevaFila.querySelector("td.lastName").innerText = usuario.apellidos
  nuevaFila.querySelector("span.gen").innerText = usuario.sexo
  nuevaFila.querySelector("td.age").innerText = usuario.edad
  nuevaFila.querySelector("td.weight").innerText = usuario.peso
  nuevaFila.querySelector("td.height").innerText = usuario.altura
  nuevaFila.querySelector("span.activity").innerText = usuario.actividad

  var dataGet = getData(usuario.peso, usuario.altura, usuario.edad, usuario.sexo)
  
  nuevaFila.querySelector("td.get").innerText = dataGet;
  nuevaFila.querySelector("td.ger").innerText = gerData(usuario.actividad, dataGet, usuario.sexo)
  tabla.appendChild(nuevaFila)

  usuarios.push(usuario)
  bd.setItem("datos", JSON.stringify(usuarios))

  bootstrap.Modal.getInstance(document.getElementById('staticBackdrop')).hide();
})

function crearUsuario() {
  return {
    "nombre": cajetinNombre.value,
    "apellidos": cajetinApellido.value,
    "sexo": cajetinGenero.value,
    "edad": parseInt(cajetinEdad.value),
    "peso":  parseInt(cajetinPeso.value),
    "altura":  parseInt(cajetinAltura.value),
    "actividad": cajetinActividad.value
  }
}



function getData(peso, altura, edad, sexo) {
  dataGet = 0;
  if (sexo == "hombre") {
    var dataGet = Math.round(66.473 + 13.751 * peso + 5.0033 * altura - 6.755 * edad);
  } else {
    var dataGet = Math.round(66.473 + 13.751 * peso + 5.0033 * altura - 6.755 * edad);
  }
  return dataGet;
}

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

function cargarDatos() {
  const requestURL = 'https://raw.githubusercontent.com/FRomero999/ExamenDIW2022/main/clientes.json';
  fetch(requestURL)
  .then(response => response.text())
  .then(data => {
    console.log(data)
    bd.setItem("datos", (data))
    datosExternos();
    });  
}

datosExternos();