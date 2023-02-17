var tabla = document.querySelector("table")
var cajetinNombre = document.querySelector("#name")
var cajetinEmail = document.querySelector("#lastNames")
var cajetinRol = document.querySelector("#sex")
var cajetinActividad = document.querySelector("#activity")
var cajetinEdad = document.querySelector("#age")
var cajetinPeso = document.querySelector("#weight")
var cajetinAltura = document.querySelector("#height")
var formulario = document.querySelector("form")

var bd = window.localStorage

var usuarios = []

if( bd.getItem("datos") ){
  usuarios = JSON.parse(bd.getItem("datos"))
  usuarios.forEach( (u)=>{
    let nuevaFila = template.content.cloneNode(true)
    nuevaFila.querySelector("th.nombre").innerText = u.nombre
    nuevaFila.querySelector("td.email").innerText = u.email
    nuevaFila.querySelector("span.rol").innerText = u.rol 
    tabla.appendChild(nuevaFila)      
  })
}

formulario.addEventListener("submit", (ev)=>{
  ev.preventDefault()
  
  let usuario = crearUsuario()
  let nuevaFila = template.content.cloneNode(true)
  nuevaFila.querySelector("th.nombre").innerText = usuario.nombre
  nuevaFila.querySelector("td.email").innerText = usuario.email
  nuevaFila.querySelector("span.rol").innerText = usuario.rol 
  tabla.appendChild(nuevaFila)  
  
  usuarios.push(usuario)
  
  bd.setItem("datos",JSON.stringify(usuarios))
})

function crearUsuario(){
  return {
    "nombre" : cajetinNombre.value,
    "email": cajetinEmail.value,
    "rol": cajetinRol.value
  }
}