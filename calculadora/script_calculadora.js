// ===== Calculadora con delegación de eventos =====

const contenedor = document.getElementById("calculadora");
const pantalla = document.getElementById("pantalla");

const OPERADORES = ["+", "-", "*", "/"];

let operacion = "";        // Cadena que se va construyendo
let hayError = false;      // Indica si la pantalla muestra un error
let resultadoMostrado = false; // Indica si la pantalla muestra un resultado

// Actualiza lo que se ve en pantalla
function actualizarPantalla() {
  pantalla.textContent = operacion === "" ? "0" : operacion;
}

// Muestra un mensaje de error y bloquea la operación actual
function mostrarError() {
  operacion = "";
  hayError = true;
  resultadoMostrado = false;
  pantalla.textContent = "Error";
}

// Limpia todo
function limpiar() {
  operacion = "";
  hayError = false;
  resultadoMostrado = false;
  actualizarPantalla();
}

// Agrega un dígito a la operación
function agregarNumero(numero) {
  // Si había un resultado o error, se empieza una operación nueva
  if (hayError || resultadoMostrado) {
    operacion = "";
    hayError = false;
    resultadoMostrado = false;
  }
  operacion += numero;
  actualizarPantalla();
}

// Agrega un operador a la operación
function agregarOperador(operador) {
  if (hayError) return;

  if (operacion === "") {
    // Solo se permite "-" al inicio (número negativo)
    if (operador !== "-") return;
  } else {
    const ultimo = operacion.slice(-1);
    if (OPERADORES.includes(ultimo)) {
      // Evita dos operadores seguidos: reemplaza el anterior
      operacion = operacion.slice(0, -1);
      if (operacion === "" && operador !== "-") return;
    }
  }

  resultadoMostrado = false;
  operacion += operador;
  actualizarPantalla();
}

// Evalúa la operación construida
function calcular() {
  if (hayError || operacion === "") return;

  // Solo se aceptan dígitos y operadores básicos
  if (!/^[0-9+\-*/]+$/.test(operacion)) {
    mostrarError();
    return;
  }

  try {
    // Quita ceros a la izquierda (evita interpretar "010" como octal)
    const limpia = operacion.replace(/\b0+(\d)/g, "$1");
    const resultado = new Function("return " + limpia)();

    // Cubre división por cero, NaN, etc.
    if (!Number.isFinite(resultado)) {
      mostrarError();
      return;
    }

    operacion = String(Math.round(resultado * 1e10) / 1e10);
    resultadoMostrado = true;
    actualizarPantalla();
  } catch (e) {
    // Operación incompleta o inválida (ej: "7+")
    mostrarError();
  }
}

// ÚNICA función de evento para todos los botones
function manejarClick(evento) {
  const boton = evento.target;

  // Ignora clics que no sean sobre un botón (ej: la pantalla)
  if (boton.tagName !== "BUTTON") return;

  const valor = boton.textContent.trim();

  if (valor >= "0" && valor <= "9") {
    agregarNumero(valor);
  } else if (OPERADORES.includes(valor)) {
    agregarOperador(valor);
  } else if (valor === "C") {
    limpiar();
  } else if (valor === "=") {
    calcular();
  }
}

// Un solo addEventListener sobre el contenedor principal
contenedor.addEventListener("click", manejarClick);
