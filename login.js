document.addEventListener("DOMContentLoaded", function() {
  const togglePasswordButton = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("passwordInput");

  // Toggle password visibility
  togglePasswordButton.addEventListener("click", function() {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePasswordButton.textContent = type === "password" ? "👁️" : "🔒";
  });

  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    loginBtn.querySelector(".spinner").style.display = "inline-block";

    // Tama na ang reference sa email at password fields
    const email = loginForm.querySelector("#emailInput").value;
    const password = loginForm.querySelector("#passwordInput").value;

    // Magpadala ng login request sa Cloudflare Worker API endpoint
    const response = await fetch("https://cssncii-api.nextwavehub01.workers.dev/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      // I-redirect ayon sa role (trainer o student)
      if (result.role === 'trainer') {
        window.location.href = "trainer-dashboard.html";  // I-redirect sa Trainer's Dashboard
      } else if (result.role === 'student') {
        window.location.href = "student-dashboard.html";  // I-redirect sa Student's Dashboard
      }
    } else {
      // Sa failed na login, ipakita ang error message
      loginError.textContent = result.error || "May nangyaring error";
      loginError.style.display = "block";
    }

    loginBtn.querySelector(".spinner").style.display = "none";
  });
});
