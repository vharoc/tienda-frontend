// -------- STRIPE --------
const stripe = Stripe("pk_test_51Rxki3F4sLnHnW2UxcPbPhzqclb78TBarGXHzHPkIiBm8SyNTAChWZ6Wl5GZqqbXqJQI46P5vzQCOIgNcjS5DdVV00p9Xd9Bnb");

// -------- SIDEBAR Y NAVBAR --------
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.querySelector(".menu-button");
const navbar = document.getElementById("navbar");

function toggleSidebar() {
  const isOpen = sidebar.classList.toggle("open");
  overlay.classList.toggle("active");
  if (isOpen) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}
function trackOrder() { alert("Seguimiento de pedido"); toggleSidebar(); }
function contactUs() { alert("Contacto: info@tiendapremium.com"); toggleSidebar(); }
function goHome() { window.scrollTo({ top: 0, behavior: "smooth" }); toggleSidebar(); }

// Navbar y botón menú al hacer scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    navbar.classList.add("visible");
    menuBtn.classList.add("shifted");
  } else {
    navbar.classList.remove("visible");
    menuBtn.classList.remove("shifted");
  }
});

// -------- FORMULARIO DE COMPRA --------
const purchaseFormOverlay = document.getElementById("purchaseFormOverlay");
const checkoutForm = document.getElementById("checkoutForm");

function showPurchaseForm() {
  purchaseFormOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function hidePurchaseForm() {
  purchaseFormOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Cerrar con ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hidePurchaseForm();
});
// Cerrar al hacer clic fuera
purchaseFormOverlay.addEventListener("click", (event) => {
  if (event.target === purchaseFormOverlay) hidePurchaseForm();
});

// -------- ENVIAR FORMULARIO + STRIPE --------
checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

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
    // Llamamos a tu backend para crear la sesión de checkout
    const response = await fetch("https://mi-tienda-backend-5cfq.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos) // mandamos también los datos de envío
    });

    const session = await response.json();

    // Redirigimos a Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      alert(result.error.message);
    }
    
  } catch (err) {
    console.error("Error en la compra:", err);
    alert("Hubo un problema al procesar tu pedido. Intenta de nuevo.");
  }
});