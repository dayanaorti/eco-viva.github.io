const ecosistema = document.getElementById("ecosistema");
const elementosCreados = document.getElementById("elementosCreados");
const efectos = document.getElementById("efectos");
const capaLluvia = document.getElementById("capaLluvia");
const mensajeCentral = document.getElementById("mensajeCentral");
const mensajeClima = document.getElementById("mensajeClima");
const mensajePanel = document.getElementById("mensajePanel");
const indicadorClima = document.getElementById("indicadorClima");
const destello = document.getElementById("destello");
const botonSonido = document.getElementById("sonidoBtn");
const estadoSonido = document.getElementById("estadoSonido");
const iconoSonido = document.getElementById("iconoSonido");
const botonReiniciar = document.getElementById("reiniciar");

let tipoSeleccionado = "planta";
let climaActual = "dia";
let audioContexto = null;
let sonidoActivado = false;
let temporizadorArcoiris = null;
let temporizadoresGotas = [];
let lluviaActiva = false;

const organismos = {
  planta: ["🌱", "🌿", "🪴", "🌾"],
  flor: ["🌸", "🌼", "🌺", "🌻", "🌷"],
  animal: ["🦋", "🐞", "🐇", "🐸", "🐝", "🐦"],
  magia: ["✨", "💫", "⭐", "🌟", "🔮"]
};

const frasesOrganismos = {
  planta: [
    "🌱 Una pequeña planta puede ser el comienzo de un gran bosque.",
    "🌿 Cada semilla guarda una nueva oportunidad para la vida.",
    "🌱 La naturaleza crece cuando le damos espacio para florecer."
  ],
  flor: [
    "🌸 La diversidad llena de colores nuestro mundo.",
    "🌼 Cada flor aporta belleza y vida al ecosistema.",
    "🌷 Las pequeñas cosas también pueden transformar un paisaje."
  ],
  animal: [
    "🦋 Cada ser vivo cumple una función en la naturaleza.",
    "🐦 Proteger a los animales es cuidar el equilibrio del planeta.",
    "🐞 La vida se hace más hermosa cuando compartimos nuestro espacio."
  ],
  magia: [
    "✨ La imaginación también puede inspirarnos a cuidar la Tierra.",
    "💫 Un pequeño destello puede iluminar un mundo entero.",
    "⭐ La magia de la naturaleza está en su diversidad."
  ]
};

const frasesClima = {
  dia: "☀️ El sol despierta los colores y las aves llenan el aire de vida.",
  noche: "🌙 La noche cubre el paisaje de calma y pequeñas luces mágicas.",
  lluvia: "🌧️ La lluvia refresca la tierra, alimenta las plantas y renueva la vida."
};

const nombresClima = {
  dia: "☀️ Día soleado",
  noche: "🌙 Noche mágica",
  lluvia: "🌧️ Lluvia"
};

const mensajesSeleccion = {
  planta: "🌱 Las plantas ayudan a mantener el equilibrio de la naturaleza. ¡Elige dónde quieres que crezca una!",
  flor: "🌸 Las flores llenan el paisaje de color y ofrecen alimento a muchos seres vivos.",
  animal: "🦋 Cada animal es importante para la biodiversidad. ¡Dale un lugar en tu ecosistema!",
  magia: "✨ La imaginación convierte el paisaje en un espacio lleno de posibilidades."
};

const mensajesClimaPanel = {
  dia: "☀️ El paisaje se llena de luz y energía. Escucha los sonidos del día.",
  noche: "🌙 Observa las estrellas y escucha los sonidos de la noche.",
  lluvia: "🌧️ Las gotas caen sobre la tierra y refrescan el ecosistema."
};

// Sonidos reales alojados en Wikimedia Commons.
// Requieren conexión a internet y que los archivos estén disponibles.
const audiosNaturaleza = {
  dia: new Audio(
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bird%20singing.ogg"
  ),
  noche: new Audio(
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Crickets%20choir.ogg"
  ),
  lluvia: new Audio(
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rain%20%281%29.ogg"
  )
};

Object.values(audiosNaturaleza).forEach((audio) => {
  audio.loop = true;
  audio.preload = "none";
  audio.volume = 0.8;
});

// ======================================
// SELECCIÓN DE ELEMENTOS
// ======================================

document.querySelectorAll(".opcion").forEach((boton) => {
  boton.addEventListener("click", () => {
    tipoSeleccionado = boton.dataset.tipo;

    document.querySelectorAll(".opcion").forEach((opcion) => {
      opcion.classList.toggle("seleccionada", opcion === boton);
    });

    // El mensaje inferior cambia al escoger qué crear.
    mensajeClima.textContent = mensajesSeleccion[tipoSeleccionado];
    mensajePanel.textContent = mensajesSeleccion[tipoSeleccionado];
  });
});

// ======================================
// CREAR ORGANISMOS
// ======================================

ecosistema.addEventListener("click", (evento) => {
  if (
    evento.target.closest("button") ||
    evento.target.closest(".arcoiris")
  ) {
    return;
  }

  const rect = ecosistema.getBoundingClientRect();
  const x = ((evento.clientX - rect.left) / rect.width) * 100;
  const y = ((evento.clientY - rect.top) / rect.height) * 100;

  // Se conserva la zona original donde se pueden crear elementos.
  if (y < 25 || y > 88) {
    mensajePanel.textContent =
      "🌿 Prueba a colocar tu elemento sobre las colinas o cerca de los árboles.";
    return;
  }

  crearOrganismo(x, y, tipoSeleccionado);
});

function crearOrganismo(x, y, tipo) {
  const opciones = organismos[tipo];
  const emoji = opciones[Math.floor(Math.random() * opciones.length)];

  const elemento = document.createElement("span");
  elemento.className = `organismo tipo-${tipo}`;
  elemento.textContent = emoji;
  elemento.style.left = `${x}%`;
  elemento.style.top = `${y}%`;

  // Se conserva el tamaño variable del código original.
  const escala = 0.8 + Math.random() * 0.65;
  elemento.style.fontSize = `${30 * escala}px`;

  elementosCreados.appendChild(elemento);

  mensajeCentral.classList.add("oculto");

  const frase = elegirFrase(frasesOrganismos[tipo]);
  mensajeClima.textContent = frase;
  mensajePanel.textContent = frase;

  crearParticulas(x, y, tipo);

  // Los efectos breves de creación se mantienen.
  reproducirSonidoOrganismo(tipo);

  if (tipo === "magia") {
    mostrarDestello();
  }
}

function elegirFrase(frases) {
  return frases[Math.floor(Math.random() * frases.length)];
}

// ======================================
// PARTÍCULAS Y DESTELLOS
// ======================================

function crearParticulas(x, y, tipo) {
  const simbolos = tipo === "magia"
    ? ["✨", "💫", "⭐"]
    : tipo === "flor"
      ? ["🌸", "✨", "🌼"]
      : tipo === "animal"
        ? ["✦", "💚", "✨"]
        : ["🌿", "✦", "💚"];

  for (let i = 0; i < 7; i++) {
    const particula = document.createElement("span");
    particula.className = "particula";
    particula.textContent =
      simbolos[Math.floor(Math.random() * simbolos.length)];

    particula.style.left = `${x + (Math.random() * 12 - 6)}%`;
    particula.style.top = `${y + (Math.random() * 8 - 4)}%`;
    particula.style.animationDelay = `${Math.random() * 0.25}s`;

    efectos.appendChild(particula);
    particula.addEventListener("animationend", () => particula.remove());
  }
}

function mostrarDestello() {
  destello.classList.remove("activo");
  void destello.offsetWidth;
  destello.classList.add("activo");
}

function mostrarDestelloSuave() {
  document.querySelectorAll(".brillo-brisa").forEach((brillo) => {
    brillo.style.color = "#d7d9ff";
  });
}

// ======================================
// CAMBIO DE CLIMA
// ======================================

document.querySelectorAll(".clima-btn").forEach((boton) => {
  boton.addEventListener("click", () => {
    cambiarClima(boton.dataset.clima);
  });
});

function cambiarClima(clima) {
  if (!nombresClima[clima]) return;

  const veniaDeLluvia = climaActual === "lluvia";
  const terminaLaLluvia = clima !== "lluvia";

  // Se muestra la renovación antes de actualizar el ambiente.
  if (veniaDeLluvia && terminaLaLluvia) {
    mostrarRenovacionNaturaleza();
  }

  climaActual = clima;

  ecosistema.classList.remove(
    "modo-dia",
    "modo-noche",
    "modo-lluvia"
  );

  ecosistema.classList.add(`modo-${clima}`);

  document.querySelectorAll(".clima-btn").forEach((boton) => {
    boton.classList.toggle("activo", boton.dataset.clima === clima);
  });

  indicadorClima.textContent = nombresClima[clima];
  mensajeClima.textContent = frasesClima[clima];
  mensajePanel.textContent = mensajesClimaPanel[clima];

  controlarLluvia(clima === "lluvia");
  actualizarSonidoAmbiente();

  if (clima === "noche") {
    mostrarDestelloSuave();
  } else {
    document.querySelectorAll(".brillo-brisa").forEach((brillo) => {
      brillo.style.color = "";
    });
  }
}

// ======================================
// EFECTO DE RENOVACIÓN TRAS LA LLUVIA
// ======================================

function mostrarRenovacionNaturaleza() {
  // Evita dejar temporizadores anteriores activos.
  temporizadoresGotas.forEach((temporizador) => clearTimeout(temporizador));
  temporizadoresGotas = [];

  // Las plantas y flores reciben gotas brillantes por unos segundos.
  const plantasFlores = elementosCreados.querySelectorAll(
    ".organismo.tipo-planta, .organismo.tipo-flor"
  );

  plantasFlores.forEach((elemento) => {
    elemento.classList.add("gotas-brillantes");

    const temporizador = setTimeout(() => {
      elemento.classList.remove("gotas-brillantes");
    }, 8000);

    temporizadoresGotas.push(temporizador);
  });

  // Elimina un arcoíris previo, si existe.
  const anterior = ecosistema.querySelector(".arcoiris");
  if (anterior) anterior.remove();

  const arcoiris = document.createElement("div");
  arcoiris.className = "arcoiris";
  ecosistema.appendChild(arcoiris);

  requestAnimationFrame(() => {
    arcoiris.classList.add("aparecer");
  });

  clearTimeout(temporizadorArcoiris);

  temporizadorArcoiris = setTimeout(() => {
    arcoiris.remove();
  }, 7500);

  mensajeClima.textContent =
    "🌈 Después de la lluvia, la naturaleza brilla y renace llena de color.";

  mensajePanel.textContent =
    "💧 Las plantas y las flores brillan mientras aparece el arcoíris.";
}

// ======================================
// LLUVIA ANIMADA ORIGINAL
// ======================================

function controlarLluvia(activar) {
  lluviaActiva = activar;
  capaLluvia.innerHTML = "";

  if (!activar) return;

  for (let i = 0; i < 85; i++) {
    const gota = document.createElement("span");
    gota.className = "gota";
    gota.style.left = `${Math.random() * 100}%`;
    gota.style.animationDuration = `${0.45 + Math.random() * 0.65}s`;
    gota.style.animationDelay = `${Math.random() * 1.5}s`;
    gota.style.opacity = `${0.3 + Math.random() * 0.6}`;
    capaLluvia.appendChild(gota);
  }
}

/* Gotas que producen ondas al tocar el agua */
setInterval(() => {
  if (climaActual !== "lluvia") return;

  const agua = document.querySelector(".agua");
  if (!agua) return;

  const onda = document.createElement("span");
  onda.className = "onda-lluvia";

  onda.style.left = `${5 + Math.random() * 90}%`;
  onda.style.top = `${5 + Math.random() * 80}%`;

  agua.appendChild(onda);

  setTimeout(() => {
    onda.remove();
  }, 1000);
}, 300);

// ======================================
// EFECTOS SONOROS AL CREAR ELEMENTOS
// ======================================

function iniciarAudio() {
  if (!audioContexto) {
    const AudioContexto =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContexto) return false;

    audioContexto = new AudioContexto();
  }

  if (audioContexto.state === "suspended") {
    audioContexto.resume();
  }

  return true;
}

function crearTono(
  frecuencia,
  duracion,
  volumen = 0.8,
  tipo = "sine",
  frecuenciaFinal = null
) {
  if (!sonidoActivado || !audioContexto) return;

  const ahora = audioContexto.currentTime;
  const oscilador = audioContexto.createOscillator();
  const ganancia = audioContexto.createGain();

  oscilador.type = tipo;
  oscilador.frequency.setValueAtTime(frecuencia, ahora);

  if (frecuenciaFinal) {
    oscilador.frequency.exponentialRampToValueAtTime(
      frecuenciaFinal,
      ahora + duracion
    );
  }

  ganancia.gain.setValueAtTime(0.001, ahora);
  ganancia.gain.linearRampToValueAtTime(
    volumen,
    ahora + Math.min(0.03, duracion / 3)
  );
  ganancia.gain.exponentialRampToValueAtTime(
    0.001,
    ahora + duracion
  );

  oscilador.connect(ganancia);
  ganancia.connect(audioContexto.destination);

  oscilador.start(ahora);
  oscilador.stop(ahora + duracion + 0.03);
}

function reproducirSonidoOrganismo(tipo) {
  if (!sonidoActivado || !audioContexto) return;

  switch (tipo) {
    case "planta":
      crearTono(350, 0.18, 0.025, "sine", 600);
      setTimeout(() => crearTono(580, 0.22, 0.02, "sine", 820), 110);
      break;

    case "flor":
      crearTono(660, 0.16, 0.025, "sine", 880);
      setTimeout(() => crearTono(880, 0.28, 0.02, "sine", 1100), 100);
      break;

    case "animal":
      crearTono(520, 0.13, 0.018, "triangle", 760);
      setTimeout(() => crearTono(740, 0.16, 0.018, "triangle", 950), 140);
      break;

    case "magia":
      crearTono(420, 0.3, 0.02, "sine", 700);
      setTimeout(() => crearTono(700, 0.3, 0.018, "sine", 1000), 120);
      setTimeout(() => crearTono(1000, 0.4, 0.015, "sine", 1300), 240);
      break;
  }
}

// ======================================
// SONIDOS NATURALES REALES
// ======================================

function detenerAudiosNaturaleza() {
  Object.values(audiosNaturaleza).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

async function actualizarSonidoAmbiente() {
  detenerAudiosNaturaleza();

  if (!sonidoActivado) return;

  const audio = audiosNaturaleza[climaActual];
  if (!audio) return;

  try {
    await audio.play();
  } catch (error) {
    console.warn(
      "No se pudo reproducir el sonido natural. Comprueba tu conexión.",
      error
    );
  }
}

// Un solo controlador para activar y silenciar.
botonSonido.addEventListener("click", async () => {
  if (!sonidoActivado) {
    if (!iniciarAudio()) {
      mensajePanel.textContent =
        "Tu navegador no permite reproducir los efectos sonoros.";
      return;
    }

    sonidoActivado = true;
    botonSonido.textContent = "Silenciar";
    iconoSonido.textContent = "🔊";

    await actualizarSonidoAmbiente();
  } else {
    sonidoActivado = false;
    detenerAudiosNaturaleza();

    botonSonido.textContent = "Activar";
    iconoSonido.textContent = "🔈";
  }
});

// ======================================
// REINICIAR EL ECOSISTEMA
// ======================================

botonReiniciar.addEventListener("click", () => {
  elementosCreados.innerHTML = "";
  efectos.innerHTML = "";

  clearTimeout(temporizadorArcoiris);
  temporizadoresGotas.forEach((temporizador) => clearTimeout(temporizador));
  temporizadoresGotas = [];

  const arcoiris = ecosistema.querySelector(".arcoiris");
  if (arcoiris) arcoiris.remove();

  tipoSeleccionado = "planta";

  document.querySelectorAll(".opcion").forEach((boton) => {
    boton.classList.toggle(
      "seleccionada",
      boton.dataset.tipo === "planta"
    );
  });

  mensajeCentral.classList.remove("oculto");
  cambiarClima("dia");

  mensajeClima.textContent =
    "🌱 El ecosistema está listo para comenzar de nuevo. ¡Crea vida con tu imaginación!";

  mensajePanel.textContent =
    "🌱 ¡Tu ecosistema está listo para comenzar de nuevo!";
});

// Estado inicial.
cambiarClima("dia");