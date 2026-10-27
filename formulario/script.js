// ===== Validación dinámica del formulario de registro =====

// Referencias a los elementos
const formulario = document.getElementById("formRegistro");
const mensajeGeneral = document.getElementById("mensajeGeneral");

const campoNombre = document.getElementById("nombre");
const campoCorreo = document.getElementById("correo");
const campoEdad = document.getElementById("edad");
const campoPassword = document.getElementById("password");
const campoConfirmar = document.getElementById("confirmar");

const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorEdad = document.getElementById("errorEdad");
const errorPassword = document.getElementById("errorPassword");
const errorConfirmar = document.getElementById("errorConfirmar");

// Aplica estilos y mensaje según el resultado de la validación
function mostrarEstado(campo, contenedorMensaje, esValido, mensajeOk, mensajeError) {
  campo.classList.remove("valido", "invalido");
  contenedorMensaje.classList.remove("error", "correcto");

  if (esValido) {
    campo.classList.add("valido");
    contenedorMensaje.classList.add("correcto");
    contenedorMensaje.textContent = mensajeOk;
  } else {
    campo.classList.add("invalido");
    contenedorMensaje.classList.add("error");
    contenedorMensaje.textContent = mensajeError;
  }
}

// --- Una función independiente por cada campo ---

function validarNombre() {
  const valido = campoNombre.value.trim().length >= 3;
  mostrarEstado(campoNombre, errorNombre, valido,
    "Nombre correcto",
    "El nombre debe tener al menos 3 caracteres");
  return valido;
}

function validarCorreo() {
  const correo = campoCorreo.value.trim();
  const valido = correo.includes("@") && correo.includes(".");
  mostrarEstado(campoCorreo, errorCorreo, valido,
    "Correo correcto",
    "El correo debe contener \"@\" y \".\"");
  return valido;
}

function validarEdad() {
  const texto = campoEdad.value.trim();
  const edad = Number(texto);
  const valido = texto !== "" && !isNaN(edad) && edad >= 18;
  mostrarEstado(campoEdad, errorEdad, valido,
    "Edad correcta",
    "La edad debe ser numérica y mayor o igual a 18");
  return valido;
}

function validarPassword() {
  const valido = campoPassword.value.length >= 8;
  mostrarEstado(campoPassword, errorPassword, valido,
    "Contraseña correcta",
    "La contraseña debe tener mínimo 8 caracteres");
  return valido;
}

function validarConfirmar() {
  const valido = campoConfirmar.value !== "" &&
                 campoConfirmar.value === campoPassword.value;
  mostrarEstado(campoConfirmar, errorConfirmar, valido,
    "Las contraseñas coinciden",
    "La confirmación debe coincidir con la contraseña");
  return valido;
}

// --- Eventos "input": validación en tiempo real ---
campoNombre.addEventListener("input", validarNombre);
campoCorreo.addEventListener("input", validarCorreo);
campoEdad.addEventListener("input", validarEdad);
campoPassword.addEventListener("input", function () {
  validarPassword();
  // Si ya se escribió la confirmación, se revalida al cambiar la contraseña
  if (campoConfirmar.value !== "") {
    validarConfirmar();
  }
});
campoConfirmar.addEventListener("input", validarConfirmar);

// --- Evento "submit": control del envío ---
formulario.addEventListener("submit", function (evento) {
  // Se ejecutan todas las validaciones (sin cortocircuito) para mostrar todos los errores
  const resultados = [
    validarNombre(),
    validarCorreo(),
    validarEdad(),
    validarPassword(),
    validarConfirmar()
  ];
  const todoValido = resultados.every(Boolean);

  // Se detiene el envío siempre: si hay errores no se envía,
  // y si todo está bien se muestra el mensaje de éxito.
  evento.preventDefault();

  mensajeGeneral.classList.remove("error", "correcto");

  if (todoValido) {
    mensajeGeneral.classList.add("correcto");
    mensajeGeneral.textContent = "¡Registro exitoso!";
    // Para enviar realmente al servidor, descomentar la siguiente línea:
    // formulario.submit();
  } else {
    mensajeGeneral.classList.add("error");
    mensajeGeneral.textContent = "Error: corrija los campos marcados antes de registrarse";
  }
});
