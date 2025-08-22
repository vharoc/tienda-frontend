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
