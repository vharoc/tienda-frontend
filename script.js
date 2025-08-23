// ================================
//  STRIPE CONFIGURACIÓN
// ================================
const stripe = Stripe("pk_test_51Rxki3F4sLnHnW2UxcPbPhzqclb78TBarGXHzHPkIiBm8SyNTAChWZ6Wl5GZqqbXqJQI46P5vzQCOIgNcjS5DdVV00p9Xd9Bnb");


// ================================
//  SIDEBAR Y NAVBAR
// ================================
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.querySelector(".menu-button");
const navbar = document.getElementById("navbar");

/**
 * Abre o cierra el menú lateral (sidebar).
 */
function toggleSidebar() {
  const isOpen = sidebar.classList.toggle("open");
  overlay.classList.toggle("active");

  if (isOpen) {
    // Bloquear scroll cuando sidebar está abierto
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

/**
 * Funciones auxiliares del sidebar.
 */
function trackOrder() {
  alert("Seguimiento de pedido");
  toggleSidebar();
}

function contactUs() {
  alert("Contacto: info@tiendapremium.com");
  toggleSidebar();
}

function goHome() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  toggleSidebar();
}

/**
 * Navbar y botón menú al hacer scroll.
 */
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    navbar.classList.add("visible");
    menuBtn.classList.add("shifted");
  } else {
    navbar.classList.remove("visible");
    menuBtn.classList.remove("shifted");
  }
});


// ================================
//  FORMULARIO DE COMPRA (MODAL)
// ================================
const purchaseFormOverlay = document.getElementById("purchaseFormOverlay");
const checkoutForm = document.getElementById("checkoutForm");

/**
 * Mostrar formulario de compra (modal).
 */
function showPurchaseForm() {
  purchaseFormOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

/**
 * Ocultar formulario de compra (modal).
 */
function hidePurchaseForm() {
  purchaseFormOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Cerrar modal con tecla ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hidePurchaseForm();
});

// Cerrar modal al hacer clic fuera del formulario
purchaseFormOverlay.addEventListener("click", (event) => {
  if (event.target === purchaseFormOverlay) hidePurchaseForm();
});


// ================================
//  ENVÍO DEL FORMULARIO + STRIPE
// ================================
checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Recoger datos del formulario
  const formData = new FormData(checkoutForm);
  const datos = {
    nombre: formData.get("nombre"),
    telefono: formData.get("telefono"),
    direccion: formData.get("direccion"),
    provincia: formData.get("provincia"),
    ciudad: formData.get("ciudad"),
    codigoPostal: formData.get("codigoPostal"),
    cantidad: parseInt(formData.get("cantidad")) || 1
  };

  try {
    // Llamada a tu backend para crear la sesión de checkout
    const response = await fetch("https://mi-tienda-backend-5cfq.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos) // Mandamos también los datos de envío
    });

    const session = await response.json();

    // Redirigir a Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    // Si ocurre un error en Stripe
    if (result.error) {
      alert(result.error.message);
    }

  } catch (err) {
    console.error("Error en la compra:", err);
    alert("Hubo un problema al procesar tu pedido. Intenta de nuevo.");
  }
});

// Provincias y ciudades de ejemplo
const data = {
    "Álava": ["Alegría-Dulantzi","Amurrio","Añana","Aramaio","Armiñón","Arraia-Maeztu","Arrazua-Ubarrundia","Artziniega","Asparrena","Ayala (Aiara)","Baños de Ebro (Mañueta)","Barrundia","Berantevilla","Bernedo","Campezo (Kanpezu)","Cripán","Elburgo (Burgelu)","Elciego","Elvillar (Bilar)","Harana (Valle de Arana)","Iruña de Oca (Iruña Oka)","Iruraiz-Gauna","Kuartango","Labastida","Lagrán","Laguardia","Lanciego (Lantziego)","Lantarón","Lapuebla de Labarca","Laudio (Llodio)","Legutio","Leza","Moreda de Álava","Navaridas","Okondo","Oyón-Oion","Peñacerrada-Urizaharra","Ribera Alta","Ribera Baja (Erribera Beitia)","Salvatierra (Agurain)","Samaniego","San Millán (Donemiliaga)","Urkabustaiz","Valdegovía","Villabuena de Álava (Eskuernaga)","Vitoria-Gasteiz","Yécora (Iekora)","Zalduondo","Zambrana","Zigoitia","Zuia"],
    "Albacete": ["Abengibre", "Alatoz", "Albacete", "Albatana", "Alborea", "Alcadozo", "Alcalá del Júcar", "Alcaraz", "Almansa", "Alpera", "Ayna", "Balazote", "Balsa de Ves", "Barrax", "Bienservida", "Bogarra", "Bonete", "Carcelén", "Casas de Juan Núñez", "Casas de Lázaro", "Casas de Ves", "Casas-Ibáñez", "Caudete", "Cenizate", "Chinchilla de Monte-Aragón", "Corral-Rubio", "El Bonillo", "Elche de la Sierra", "Férez", "Fuente-Álamo", "Fuentealbilla", "Golosalvo", "Hellín", "Hoya-Gonzalo", "Jorquera", "La Gineta", "La Herrera", "La Rasa", "La Recueja", "La Toba", "Letur", "Liétor", "Madrigueras", "Masegoso", "Minaya", "Molinicos", "Montalvos", "Montealegre del Castillo", "Munera", "Nerpio", "Navas de Jorquera", "Noguera", "Ontur", "Ossa de Montiel", "Paterna del Madera", "Peñas de San Pedro", "Povedilla", "Pozo Cañada", "Pozohondo", "Riópar", "Robledo", "Salobre", "San Pedro", "San Sebastián de los Reyes", "Santa Ana", "Santa Cruz de Moya", "Santa María del Campo", "Santa Olalla", "Serranía de Cuenca", "Siles", "Socovos", "Tarazona de la Mancha", "Tobarra", "Valdeganga", "Villarrobledo", "Villavaliente", "Villanueva de Alcardete", "Villanueva de Andújar", "Villanueva de la Jara", "Villanueva de los Infantes", "Villanueva de los Caballeros", "Villanueva de los Llanos", "Villanueva de los Pinares", "Villanueva del Arzobispo", "Villanueva del Duque", "Villanueva del Río", "Villanueva del Valle", "Villanueva del Yeltes", "Villanueva de la Fuente", "Villanueva de la Vera", "Villanueva de los Remedios", "Villanueva de los Santos", "Villanueva de los Tilos", "Villanueva de los Valles", "Villanueva del Álamo", "Villanueva del Campo", "Villanueva del Duero", "Villanueva del Río y Minas", "Villanueva del Yelmo"],
    "Alicante": ["Alicante", "Elche", "Orihuela", "Benidorm", "Torrevieja"],
    "Almería": ["Almería", "Roquetas de Mar", "El Ejido", "Níjar"],
    "Asturias": ["Oviedo", "Gijón", "Avilés", "Mieres"],
    "Ávila": ["Ávila", "Arévalo", "Arenas de San Pedro"],
    "Badajoz": ["Badajoz", "Mérida", "Don Benito", "Almendralejo"],
    "Barcelona": ["Barcelona", "Hospitalet", "Badalona", "Sabadell", "Terrassa"],
    "Burgos": ["Burgos", "Miranda de Ebro", "Aranda de Duero"],
    "Cáceres": ["Cáceres", "Plasencia", "Navalmoral de la Mata"],
    "Cádiz": ["Cádiz", "Jerez de la Frontera", "Algeciras", "San Fernando", "El Puerto de Santa María"],
    "Cantabria": ["Santander", "Torrelavega", "Castro-Urdiales", "Camargo"],
    "Castellón": ["Castellón de la Plana", "Villarreal", "Burriana", "La Vall d'Uixó"],
    "Ceuta": ["Ceuta"],
    "Ciudad Real": ["Ciudad Real", "Puertollano", "Tomelloso", "Valdepeñas"],
    "Córdoba": ["Córdoba", "Lucena", "Puente Genil", "Montilla"],
    "Cuenca": ["Cuenca", "Tarancón", "San Clemente"],
    "Girona": ["Girona", "Figueres", "Blanes", "Lloret de Mar"],
    "Granada": ["Granada", "Motril", "Almuñécar", "Baza"],
    "Guadalajara": ["Guadalajara", "Azuqueca de Henares", "Alovera"],
    "Gipuzkoa": ["San Sebastián", "Irun", "Eibar", "Rentería"],
    "Huelva": ["Huelva", "Lepe", "Isla Cristina", "Ayamonte"],
    "Huesca": ["Huesca", "Monzón", "Barbastro", "Jaca"],
    "Illes Balears": ["Palma de Mallorca", "Ibiza", "Manacor", "Inca"],
    "Jaén": ["Jaén", "Linares", "Andújar", "Úbeda"],
    "La Coruña": ["A Coruña", "Santiago de Compostela", "Ferrol", "Oleiros"],
    "La Rioja": ["Logroño", "Calahorra", "Haro", "Arnedo"],
    "Las Palmas": ["Las Palmas de Gran Canaria", "Telde", "Santa Lucía de Tirajana", "Arrecife"],
    "León": ["León", "Ponferrada", "San Andrés del Rabanedo", "Astorga"],
    "Lleida": ["Lleida", "Balaguer", "Tàrrega", "La Seu d'Urgell"],
    "Lugo": ["Lugo", "Monforte de Lemos", "Viveiro"],
    "Madrid": ["Madrid", "Alcalá de Henares", "Getafe", "Leganés", "Móstoles"],
    "Málaga": ["Málaga", "Marbella", "Fuengirola", "Torremolinos", "Estepona"],
    "Melilla": ["Melilla"],
    "Murcia": ["Murcia", "Cartagena", "Lorca", "Molina de Segura"],
    "Navarra": ["Pamplona", "Tudela", "Barañáin", "Estella"],
    "Ourense": ["Ourense", "Verín", "O Barco de Valdeorras"],
    "Palencia": ["Palencia", "Aguilar de Campoo", "Guardo"],
    "Pontevedra": ["Vigo", "Pontevedra", "Vilagarcía de Arousa", "Marín"],
    "Salamanca": ["Salamanca", "Béjar", "Ciudad Rodrigo"],
    "Santa Cruz de Tenerife": ["Santa Cruz de Tenerife", "San Cristóbal de La Laguna", "Arona", "La Orotava"],
    "Segovia": ["Segovia", "Cuéllar", "El Espinar"],
    "Sevilla": ["Sevilla", "Dos Hermanas", "Alcalá de Guadaíra", "Utrera"],
    "Soria": ["Soria", "Almazán", "Ólvega"],
    "Tarragona": ["Tarragona", "Reus", "Valls", "Cambrils"],
    "Teruel": ["Teruel", "Alcañiz", "Andorra"],
    "Toledo": ["Toledo", "Talavera de la Reina", "Illescas"],
    "Valencia": ["Valencia", "Gandía", "Torrent", "Paterna", "Sagunto"],
    "Valladolid": ["Valladolid", "Medina del Campo", "Laguna de Duero"],
    "Zamora": ["Zamora", "Benavente", "Toro"],
    "Zaragoza": ["Zaragoza", "Calatayud", "Utebo", "Ejea de los Caballeros"]
};

const provinciaSelect = document.getElementById("provincia");
const ciudadSelect = document.getElementById("ciudad");

// Cargar provincias al iniciar
function cargarProvincias() {
  Object.keys(data).forEach(prov => {
    const option = document.createElement("option");
    option.value = prov;
    option.textContent = prov;
    provinciaSelect.appendChild(option);
  });

}

// Cargar ciudades cuando se elige provincia
provinciaSelect.addEventListener("change", () => {
  const provincia = provinciaSelect.value;
  ciudadSelect.innerHTML = "<option value=''>-- Selecciona una ciudad --</option>";

  if (provincia && data[provincia]) {
    ciudadSelect.disabled = false;
    data[provincia].forEach(ciudad => {
      const option = document.createElement("option");
      option.value = ciudad;
      option.textContent = ciudad;
      ciudadSelect.appendChild(option);
    });
  } else {
    ciudadSelect.disabled = true;
  }
});

// Inicializar
cargarProvincias();