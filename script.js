const checkoutButton = document.getElementById("checkout-button");

// Tu clave pública de Stripe
const stripe = Stripe("pk_test_51Rxki3F4sLnHnW2UxcPbPhzqclb78TBarGXHzHPkIiBm8SyNTAChWZ6Wl5GZqqbXqJQI46P5vzQCOIgNcjS5DdVV00p9Xd9Bnb");

checkoutButton.addEventListener("click", async () => {
  try {
    // Llamamos al backend para crear la sesión
    const response = await fetch("http://localhost:4242/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const session = await response.json();

    // Redirigimos al Checkout de Stripe
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      alert(result.error.message);
    }
  } catch (err) {
    console.error("Error:", err);
  }
});
