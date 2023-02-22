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

// Para la importación de los datos
var datosAimportar = [];

// bool para definir errores
var hayError = false;

window.addEventListener('load', () => {

  // Eventos de los botones
  document.querySelector('button#importarDatos').addEventListener('click', importarDatos);
  document.querySelector('button#exportarDatos').addEventListener('click', exportarDatos);

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
      nuevaFila.querySelector("td.weight").innerText = u.peso + " Kg";
      nuevaFila.querySelector("td.height").innerText = u.altura + " cm";
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
    "peso": parseFloat(cajetinPeso.value).toFixed(2),
    "altura": parseInt(cajetinAltura.value),
    "actividad": cajetinActividad.value
  };

  usuarios.push(usuario);
  bd.setItem("datos", JSON.stringify(usuarios));
  cargarYmostrarDatos();
  
  document.querySelector('form#CreateForm').reset();
  bootstrap.Modal.getInstance(document.querySelector('#modal-nuevoCliente')).hide();
  
});


/**
 * Carga los datos de json de una url
 */
function importarDatos() {

  // Mostramos el overlay de carga
  document.querySelector('div#cargando').classList.remove('d-none');

  fetch('https://raw.githubusercontent.com/FRomero999/ExamenDIW2022/main/clientes.json')
    .then(response => response.text())
    .then(data => {

      // Parseamos a array los datos recibidos
      let datosImportados = JSON.parse(data);

      // Añadimos los datos importados al array usuarios
      if (datosImportados.length > 0) {
        datosImportados.forEach((line) => {
          usuarios.push(line);
        });
      }

      // Parseamos a json todo el array de usuarios y sobreescribimos todos los datos en bd
      bd.setItem("datos", JSON.stringify(usuarios));
      cargarYmostrarDatos();

      // Cerramos el overlay de carga (con 200ms de retardo para darle mejor apariencia ya que se cierra muy rápido)
      setTimeout(() => { document.querySelector('div#cargando').classList.add('d-none'); }, 200);

    });
}


/**
 * Descarga los datos en formato JSON
 */
function exportarDatos() {

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(usuarios)));
  element.setAttribute('download', 'datos.json');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


/**
 * Gestiona la importación de los datos en formato JSON
 */
const importarInfo = document.querySelector('#importarInfo');
const importarError = document.querySelector('#importarError');
if (window.FileList && window.File && window.FileReader) {

  // Para la subida drop
  const dropArea = document.getElementById('drop-area');

  dropArea.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();

    event.dataTransfer.dropEffect = 'copy';
    document.querySelector('#drop-area').classList.add('alert-success');
    document.querySelector('#drop-area').classList.remove('alert-dark');
  });

  dropArea.addEventListener('dragleave', (event) => {
    event.stopPropagation();
    event.preventDefault();

    document.querySelector('#drop-area').classList.add('alert-dark');
    document.querySelector('#drop-area').classList.remove('alert-success');
  });

  dropArea.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();

    importarInfo.textContent = '';
    importarInfo.classList.add('d-none');
    importarError.textContent = '';
    importarError.classList.add('d-none');
    datosTmp = [];
    datosAimportar = [];

    document.querySelector('#drop-area').classList.add('alert-dark');
    document.querySelector('#drop-area').classList.remove('alert-success');

    let file = event.dataTransfer.files[0];

    if (!file.type.match('application/json')) {
      importarError.textContent = 'El archivo no es correcto.';
      importarError.classList.remove('d-none');
      return;
    }

    reader.readAsText(file);
  });

  // para la subida por input
  document.querySelector('#file-selector').addEventListener('change', event => {

    importarInfo.textContent = '';
    importarInfo.classList.add('d-none');
    importarError.textContent = '';
    importarError.classList.add('d-none');
    datosTmp = [];
    datosAimportar = [];

    let file = event.target.files[0];

    if (!file.type.match('application/json')) {
      importarError.textContent = 'El archivo no es correcto.';
      importarError.classList.remove('d-none');
      return;
    }

    reader.readAsText(file);
  });


  // Evento para cuando se cargue el archivo
  const reader = new FileReader();
  reader.addEventListener('load', event => {

    datosTmp = JSON.parse(event.target.result);
    console.log(datosTmp);

    if (!datosTmp) {
      importarError.textContent = 'El archivo no es correcto.';
      importarError.classList.remove('d-none');
      return;
    }
    if (datosTmp.length < 1) {
      importarError.textContent = 'El archivo está vacío.'
      importarError.classList.remove('d-none');
      return;
    }

    // comprobamos si existen los campos para saber si son correctos los datos a importar
    let campos = ['nombre', 'apellidos', 'sexo', 'edad', 'peso', 'altura', 'actividad'];
    hayError = false;
    let arrayTmp = {};

    // Recorremos los campos y guardamos sólo los válidos (por si el fichero tiene cosas no necesarias)
    datosTmp.forEach((line) => {
      arrayTmp = [];
      campos.forEach((nombreCampo) => {
        //console.log(index + '[' + key + ']' + ': ' + line[key]);
        if (typeof line[nombreCampo] === 'undefined') {
          hayError = true;
          return;
        } else if (line[nombreCampo] === '') {
          hayError = true;
          return;
        } else {
          arrayTmp.push([nombreCampo, line[nombreCampo]]);
        }
      });

      if (hayError) { return; }

      // convertimos arrayTmp en objeto (para json) y lo añadimos a datosAimportar
      datosAimportar.push(Object.fromEntries(arrayTmp));
    });

    if (hayError) {
      importarError.textContent = 'El archivo no parece ser correcto.';
      importarError.classList.remove('d-none');
      return;
    }

    importarError.classList.add('d-none');
    importarError.textContent = '';

    importarInfo.textContent = 'Se van a añadir ' + datosTmp.length + ' registros a los ya existentes.';
    importarInfo.classList.remove('d-none');

  });

} else {
  importarInfo.textContent = 'Su navegador no soporta la importación de archivos.';
}

// evento para limpiar el modal al cerrarlo
document.querySelector('#modal-importarDatos').addEventListener('hidden.bs.modal', event => {
  
  importarInfo.classList.add('d-none');
  importarInfo.textContent = '';
  importarError.classList.add('d-none');
  importarError.textContent = '';

  document.querySelector('#file-selector').value = '';
});

document.querySelector('form#form-importarDatos').addEventListener("submit", (ev) => {
  ev.preventDefault();

  if (hayError) {
    console.log('error');
    return;
  }

  console.log('usuarios:', datosAimportar);
  console.log('stringify u:', JSON.stringify(usuarios));
  console.log('datosAimportar:', datosAimportar);
  console.log('stringify:', JSON.stringify(datosAimportar));


  usuarios = usuarios.concat(datosAimportar);
  bd.setItem("datos", JSON.stringify(usuarios));
  cargarYmostrarDatos();

  bootstrap.Modal.getInstance(document.querySelector('#modal-importarDatos')).hide();
});



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
});
