// Stripe
const stripe = Stripe("pk_test_51Rxki3F4sLnHnW2UxcPbPhzqclb78TBarGXHzHPkIiBm8SyNTAChWZ6Wl5GZqqbXqJQI46P5vzQCOIgNcjS5DdVV00p9Xd9Bnb");

// Botones de compra
const checkoutButtonNav = document.getElementById("checkout-button");
const checkoutButtonHero = document.getElementById("checkout-button-hero");

async function buyProduct() {
  try {
    const response = await fetch("https://mi-tienda-backend-5cfq.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const session = await response.json();
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) alert(result.error.message);
  } catch (err) {
    console.error("Error:", err);
  }
}

// Asignar a ambos botones
checkoutButtonNav.addEventListener("click", buyProduct);
checkoutButtonHero.addEventListener("click", buyProduct);

// Sidebar y navbar
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
function contactUs() { alert("Contacto"); toggleSidebar(); }
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
